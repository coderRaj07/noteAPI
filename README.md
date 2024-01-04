# Note API 📝

This repository contains the source code for a simple Note API that allows users to manage and share notes.

## Technologies Used 🚀

### 1. Express

[Express](https://expressjs.com/) is a fast, unopinionated, minimalist web framework for Node.js. It provides a robust set of features for web and mobile applications, making it an ideal choice for building RESTful APIs.

**Why Express?**
- **Simplicity:** Express is known for its simplicity and ease of use. It allows developers to quickly set up routes, middleware, and handle HTTP requests.
- **Middleware Support:** Express has a rich ecosystem of middleware, making it easy to integrate additional functionality such as authentication, logging, and rate limiting.
- **Community and Documentation:** Being one of the most popular Node.js frameworks, Express has a large and active community. Its extensive documentation and community support make it a reliable choice.

### 2. MongoDB

[MongoDB](https://www.mongodb.com/) is a NoSQL database that provides high performance, high availability, and easy scalability. It stores data in flexible, JSON-like BSON documents, allowing developers to model data in a way that fits their application's needs.

**Why MongoDB?**
- **Schema Flexibility:** MongoDB's document-based model allows for dynamic and flexible schema design. This is particularly useful in scenarios where the data structure is expected to evolve over time.
- **Scalability:** MongoDB is horizontally scalable, enabling easy distribution of data across multiple servers. This makes it suitable for applications with growing data and user loads.
- **Query Language:** MongoDB uses a powerful and expressive query language, making it efficient for retrieving and manipulating data.
- **JSON-Like Documents:** The use of JSON-like BSON documents simplifies the mapping between application objects and database entities.

### 3. Elasticsearch (is in progress)

[Elasticsearch](https://www.elastic.co/elasticsearch/) is a distributed search and analytics engine. It is used for implementing the search functionality in this API.

**Why Elasticsearch?**
- **Full-Text Search:** Elasticsearch excels at full-text search, enabling efficient and accurate retrieval of data based on keywords.
- **Scalability:** Elasticsearch is designed to scale horizontally, making it suitable for handling large volumes of data.
- **Real-Time Analytics:** Elasticsearch provides real-time analytics capabilities, allowing users to quickly analyze and visualize data.

## Project Structure 🏗️

The project follows a modular structure, separating concerns into different folders:

- **controllers:** Handles incoming requests, processes them, and calls functions from the `services` folder.
- **services:** Contains business logic and interacts with the `model` folder to perform CRUD operations.
- **model:** Defines the schema using MongoDB's Mongoose library.
- **routes:** Defines the API routes and connects them to the appropriate controllers.
- **tests:** Includes test scripts for Jest to ensure the correctness of the API.

## Installation 🛠️

1. Clone this repository:

   ```bash
   git clone https://github.com/coderRaj07/noteAPI
   cd noteAPI
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up a MongoDB database and configure the connection string in `config/database.js`.

4. Set up an Elasticsearch cluster and configure the connection in `config/elasticsearch.js`.

5. Start the application:

   ```bash
   nodemon app
   ```

6. The API will be available at `http://localhost:8001`.

## Testing 🧪

Run Jest tests using the following command:

```bash
npx jest tests/test.js
```

## API Endpoints 🚀

### Authentication Endpoints

#### 1. Create a new user account

- **Endpoint:** `POST /api/auth/signup`
- **Request:**
  - Body: `{ "username": "example_user", "password": "example_password" }`
- **Response:**
  - Success: `201 Created`
  - Body: `{ "message": "User created successfully" }`
  - Error: `400 Bad Request`, `409 Conflict`, etc.

#### 2. Log in to an existing user account and receive an access token

- **Endpoint:** `POST /api/auth/login`
- **Request:**
  - Body: `{ "username": "example_user", "password": "example_password" }`
- **Response:**
  - Success: `200 OK`
  - Body: `{ "access_token": "your_access_token" }`
  - Error: `401 Unauthorized`, `404 Not Found`, etc.

### Note Endpoints

#### 3. Get a list of all notes for the authenticated user

- **Endpoint:** `GET /api/notes`
- **Request:**
  - Headers: `{ "Authorization": "Bearer your_access_token" }`
- **Response:**
  - Success: `200 OK`
  - Body: `{ "notes": [ { "id": 1, "title": "Note 1", "content": "Content of Note 1" }, ... ] }`
  - Error: `401 Unauthorized`, `404 Not Found`, etc.

#### 4. Get a note by ID for the authenticated user

- **Endpoint:** `GET /api/notes/:id`
- **Request:**
  - Headers: `{ "Authorization": "Bearer your_access_token" }`
- **Response:**
  - Success: `200 OK`
  - Body: `{ "_id": 1, "title": "Note 1", "content": "Content of Note 1",..... }`
  - Error: `401 Unauthorized`, `404 Not Found`, etc.

#### 5. Create a new note for the authenticated user

- **Endpoint:** `POST /api/notes`
- **Request:**
  - Headers: `{ "Authorization": "Bearer your_access_token" }`
  - Body: `{ "title": "New Note", "content": "Content of the new note" }`
- **Response:**
  - Success: `201 Created`
  - Body: `{ "message": "Note created successfully", "note": { "id": 2, "title": "New Note", "content": "Content of the new note" } }`
  - Error: `401 Unauthorized`, `400 Bad Request`, etc.

#### 6. Update an existing note by ID for the authenticated user

- **Endpoint:** `PUT /api/notes/:id`
- **Request:**
  - Headers: `{ "Authorization": "Bearer your_access_token" }`
  - Body: `{ "title": "Updated Note", "content": "Updated content of the note" }`
- **Response:**
  - Success: `200 OK`
  - Body: `{ "message": "Note updated successfully", "note": { "id": 2, "title": "Updated Note", "content": "Updated content of the note" } }`
  - Error: `401 Unauthorized`, `404 Not Found`, etc.

#### 7. Delete a note by ID for the authenticated user

- **Endpoint:** `DELETE /api/notes/:id`
- **Request:**
  - Headers: `{ "Authorization": "Bearer your_access_token" }`
- **Response:**
  - Success: `204 No Content`
  - Error:

 `401 Unauthorized`, `404 Not Found`, etc.

#### 8. Share a note with another user for the authenticated user

- **Endpoint:** `POST /api/notes/:id/share`
- **Request:**
  - Headers: `{ "Authorization": "Bearer your_access_token" }`
  - Body: `{ "username": "user_to_share_with" }`
- **Response:**
  - Success: `200 OK`
  - Body: `{ "message": "Note shared successfully with user_to_share_with" }`
  - Error: `401 Unauthorized`, `404 Not Found`, etc.

#### 9. Search for notes based on keywords for the authenticated user

- **Endpoint:** `GET /api/search?q=:query`
- **Request:**
  - Headers: `{ "Authorization": "Bearer your_access_token" }`
- **Response:**
  - Success: `200 OK`
  - Body: `{ "results": [ { "id": 1, "title": "Note 1", "content": "Content of Note 1" }, ... ] }`
  - Error: `401 Unauthorized`, `400 Bad Request`, etc.


## Edge Cases Covered 🚧

### 1. Note Deletion

- **Scenario:**
  - When the owner deletes a note, it should be deleted from both the owner's account and any user with whom it was shared.

- **Implementation:**
  - The API ensures that when the owner deletes a note, the deletion is cascaded to all users who had access to that note.

### 2. Note Sharing Restrictions

- **Scenario:**
  - The owner should not be able to share notes with themselves.

- **Implementation:**
  - The API prevents the owner from sharing notes with themselves, ensuring that notes are shared only with other users.

### 3. Note Editing Permissions

- **Scenario:**
  - Only the owner should have the permission to edit their own notes.

- **Implementation:**
  - The API enforces that only the owner of a note can edit its content or details. Other users with whom the note is shared are restricted from editing the note.

These edge cases are implemented to ensure data integrity, prevent unintended actions, and maintain a secure and logical flow of operations within the Note API.


## .env contents 🤫

MONGODB_URI = "your-mongodb-uri"

PASSPORT_SECRET_KEY = 'your-secret-key'

Feel free to customize it further based on your preferences or any additional details you'd like to include!
