const request = require('supertest');
const { app } = require('../app');
const mongoose = require('mongoose');
const User = require('../src/models/User');

let authToken;
let noteId;

beforeAll(async () => {
    // Create a new user for testing
    await request(app)
        .post('/api/auth/signup')
        .send({ username: 'testuser', password: 'testpassword' });

    // Log in and get the authentication token
    const loginRes = await request(app)
        .post('/api/auth/login')
        .send({ username: 'testuser', password: 'testpassword' });
        
    authToken = loginRes.body.accessToken;
});

describe('End-to-End Tests', () => {
    it('should create a new note', async () => {
        const res = await request(app)
            .post('/api/notes')
            .set('Authorization', `Bearer ${authToken}`)
            .send({ title: 'Test Note', content: 'This is a test note' });

        expect(res.status).toBe(201);
        expect(res.body.title).toEqual('Test Note');
        expect(res.body.content).toEqual('This is a test note');
        noteId = res.body._id;
    });

    it('should get all notes for the authenticated user', async () => {
        const res = await request(app)
            .get('/api/notes')
            .set('Authorization', `Bearer ${authToken}`);

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
    });

    it('should get a specific note by ID', async () => {
        const res = await request(app)
            .get(`/api/notes/${noteId}`)
            .set('Authorization', `Bearer ${authToken}`);

        expect(res.status).toBe(200);
        expect(res.body.title).toEqual('Test Note');
        expect(res.body.content).toEqual('This is a test note');
    });

    it('should update a note', async () => {
        const res = await request(app)
            .put(`/api/notes/${noteId}`)
            .set('Authorization', `Bearer ${authToken}`)
            .send({ title: 'Updated Note', content: 'This note has been updated' });

        expect(res.status).toBe(200);
        expect(res.body.title).toEqual('Updated Note');
        expect(res.body.content).toEqual('This note has been updated');
    });

    it('should share a note with another user', async () => {
        // Create another user for sharing
        await request(app)
            .post('/api/auth/signup')
            .send({ username: 'testuser2', password: 'testpassword' });

        // Log in with the second user
        const loginRes = await request(app)
            .post('/api/auth/login')
            .send({ username: 'testuser2', password: 'testpassword' });

        const secondUserAuthToken = loginRes.body.accessToken;

        // Share the note with the second user
        const shareRes = await request(app)
            .post(`/api/notes/${noteId}/share`)
            .set('Authorization', `Bearer ${secondUserAuthToken}`)
            .send({ username: 'testuser2' });

        // Since new user doesnot have any note to share    
        expect(shareRes.status).toBe(404);
        expect(shareRes.body.message).toEqual('Note not found');
    });

    it('should search for notes based on keywords', async () => {
        const res = await request(app)
            .get('/api/search')
            .set('Authorization', `Bearer ${authToken}`)
            .query({ q: 'test' });

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
    });

    it('should delete a note and remove its ID from every user who had it earlier', async () => {
        // Delete the note
        const deleteRes = await request(app)
            .delete(`/api/notes/${noteId}`)
            .set('Authorization', `Bearer ${authToken}`);

        expect(deleteRes.status).toBe(200);
        expect(deleteRes.body.message).toEqual('Note deleted successfully');

        // Check if the note ID is removed from all users
        const usersWithNote = await User.find({ notes: noteId });
        expect(usersWithNote.length).toBe(0);
    });
});

afterAll(() => {
    // Close the MongoDB connection after all tests
    mongoose.connection.close();
});
