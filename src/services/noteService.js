// src/services/noteService.js
const Note = require('../models/Note');
const User = require('../models/User');
const mongoose = require('mongoose');
async function createNote(title, content, ownerId) {
  try {
    const userExists = await User.exists({ _id: ownerId });
    if (!userExists) {
      return res.status(404).json({ message: 'User not found' });
    }
    const newNote = new Note({
      title,
      content,
      owner: ownerId,
    });
    const savedNote = await newNote.save();
    await User.findByIdAndUpdate(ownerId, { $push: { notes: savedNote._id } });

    return savedNote;
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message || 'Bad Request' });
  }
}


async function updateNote(noteId, title, content, ownerId) {
  try {

    if (!mongoose.Types.ObjectId.isValid(noteId)) {
      throw new Error('Invalid note ID');
    }
    const existingNote = await Note.findById(noteId);
    if (!existingNote) {
      throw new Error('Note not found');
    }

    if (existingNote.owner.toString() !== ownerId.toString()) {
      throw new Error('You are not authorized to update this note');
    }

    const updatedNote = await Note.findOneAndUpdate(
      { _id: noteId, owner: ownerId },
      { title, content },
      { new: true }
    );

    if (!updatedNote) {
      throw new Error('Note not found');
    }

    return updatedNote;
  } catch (error) {
    throw error;
  }
}


async function getNotes(userId) {
  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid userId');
    }
    const userExists = await User.exists({ _id: userId });
    if (!userExists) {
      throw new Error('User not found');
    }
    const userNotes = await Note.find({ owner: userId });
    return userNotes;
  } catch (error) {
    throw error;
  }
}


async function deleteNote(noteId, ownerId) {
  try {
    if (!mongoose.Types.ObjectId.isValid(noteId) || !mongoose.Types.ObjectId.isValid(ownerId)) {
      throw new Error('Invalid noteId or ownerId');
    }
    const noteOwner = await Note.findOne({ _id: noteId, owner: ownerId });
    if (!noteOwner) {
      throw new Error('Note not found or user does not own the note');
    }
    const deletedNote = await Note.findOneAndDelete({ _id: noteId, owner: ownerId });

    if (!deletedNote) {
      throw new Error('Note not found');
    }

    await User.updateMany({ notes: noteId }, { $pull: { notes: noteId } });
  } catch (error) {
    throw error;
  }
}



async function shareNote(noteId, username, ownerId) {
  try {
    const noteToShare = await Note.findOne({ _id: noteId, owner: ownerId });

    if (!noteToShare) {
      throw new Error('Note not found');
    }

    const userToShareWith = await User.findOne({ username });

    if (!userToShareWith) {
      throw new Error('User not found');
    }

    if (userToShareWith._id.equals(ownerId)) {
      throw new Error('Cannot share a note with yourself');
    }

    if (!noteToShare.sharedWith.includes(userToShareWith._id)) {
      noteToShare.sharedWith.push(userToShareWith._id);
      await noteToShare.save();

      await User.findByIdAndUpdate(userToShareWith._id, { $push: { notes: noteToShare._id } });
    }
  } catch (error) {
    throw error;
  }
}



async function searchNotes(query, ownerId) {
  try {
    const elasticSearchResult = await performElasticSearch(query, ownerId);
    return elasticSearchResult;
  } catch (elasticSearchError) {
    console.error('Elasticsearch search error:', elasticSearchError.message);
    const mongoSearchResult = await performMongoDBSearch(query, ownerId);
    return mongoSearchResult;
  }
}

async function performElasticSearch(query, ownerId) {
  const result = await esClient.search({
    index: 'notes',
    body: {
      query: {
        bool: {
          must: [
            { match: { content: query } },
            {
              bool: {
                should: [
                  { terms: { sharedWith: [ownerId] } },
                  { term: { userId: ownerId } },
                ],
              },
            },
          ],
        },
      },
    },
  });

  return result.hits.hits.map(hit => hit._source);
}

async function performMongoDBSearch(query, ownerId) {
  const userNotes = await Note.find({
    $and: [
      {
        $or: [
          { content: { $regex: new RegExp(query, 'i') } },
          { title: { $regex: new RegExp(query, 'i') } },
        ],
      },
      {
        $or: [
          { sharedWith: ownerId },
          { owner: ownerId },
        ],
      },
    ],
  });

  return userNotes;
}


async function getNoteById(noteId, userId) {
  try {

    //
    const note = await Note.findOne({ _id: noteId });
    console.log("noteId ", noteId);
    console.log("userId ", userId);
    console.log("owner ", note.owner)
    console.log("Shared With", note.sharedWith)

    if (note.owner.toString() !== userId.toString() && !note.sharedWith.includes(userId.toString())) {
      throw new Error('You are not authorized to see the notes');
    }

    if (!note) {
      throw new Error('Note not found');
    }
    return note;
  } catch (error) {
    throw new Error(error);
  }
}

module.exports = { createNote, updateNote, deleteNote, shareNote, searchNotes, getNoteById, getNotes };
