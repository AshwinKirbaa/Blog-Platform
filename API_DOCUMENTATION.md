# Chronicle Blog Platform - REST API Documentation

**Base URL**: `http://localhost:5000/api` (Development) | `https://your-domain.com/api` (Production)  
**Authentication Scheme**: Bearer Token via HTTP Header `Authorization: Bearer <JWT>`  
**Content-Type**: `application/json`

---

## 1. Authentication Endpoints

### 1.1 Register User
- **Method & Route**: `POST /auth/register`
- **Rate Limit**: 100 requests per 15 minutes
- **Auth Required**: None
- **Request Body**:
```json
{
  "name": "Ada Lovelace",
  "email": "ada@example.com",
  "password": "Password123"
}
```
- **Validation**:
  - `name`: 2 to 60 characters
  - `email`: Valid email format, lowercase, unique
  - `password`: Minimum 8 characters, at least 1 uppercase letter, 1 lowercase letter, and 1 digit
- **Response (201 Created)**:
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "e4f5g6-uuid",
      "name": "Ada Lovelace",
      "email": "ada@example.com",
      "createdAt": "2026-11-22T08:00:00.000Z",
      "updatedAt": "2026-11-22T08:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```
- **Error Responses**:
  - `400 Bad Request`: Validation failure (e.g. weak password, missing fields)
  - `409 Conflict`: Email already in use

---

### 1.2 Login User
- **Method & Route**: `POST /auth/login`
- **Rate Limit**: 100 requests per 15 minutes
- **Auth Required**: None
- **Request Body**:
```json
{
  "email": "ada@example.com",
  "password": "Password123"
}
```
- **Response (200 OK)**:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "e4f5g6-uuid",
      "name": "Ada Lovelace",
      "email": "ada@example.com",
      "createdAt": "2026-11-22T08:00:00.000Z",
      "updatedAt": "2026-11-22T08:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```
- **Error Responses**:
  - `401 Unauthorized`: Invalid email or password

---

### 1.3 Get Current User Profile
- **Method & Route**: `GET /auth/me`
- **Auth Required**: Yes (`Bearer <token>`)
- **Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "id": "e4f5g6-uuid",
    "name": "Ada Lovelace",
    "email": "ada@example.com",
    "createdAt": "2026-11-22T08:00:00.000Z",
    "updatedAt": "2026-11-22T08:00:00.000Z",
    "_count": {
      "posts": 5,
      "comments": 12
    }
  }
}
```
- **Error Responses**:
  - `401 Unauthorized`: Token missing, expired, or invalid

---

## 2. Blog Posts Endpoints

### 2.1 Get All Posts
- **Method & Route**: `GET /posts`
- **Auth Required**: None
- **Query Parameters**:
  - `page` (optional, default: `1`): Page number
  - `limit` (optional, default: `10`, max: `50`): Items per page
  - `search` (optional): Case-insensitive keyword filter against title and description
  - `authorId` (optional): Filter stories by specific author UUID
- **Response (200 OK)**:
```json
{
  "success": true,
  "data": [
    {
      "id": "post-uuid",
      "title": "Architecting Scalable Microservices",
      "description": "An exploration of event sourcing and clean API design.",
      "content": "Distributed systems require explicit failure modeling...",
      "authorId": "user-uuid",
      "createdAt": "2026-11-22T08:00:00.000Z",
      "updatedAt": "2026-11-22T08:00:00.000Z",
      "author": {
        "id": "user-uuid",
        "name": "Ada Lovelace",
        "email": "ada@example.com"
      },
      "_count": {
        "comments": 3
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1,
    "hasNextPage": false,
    "hasPrevPage": false
  }
}
```

---

### 2.2 Get Post by ID
- **Method & Route**: `GET /posts/:id`
- **Auth Required**: None
- **Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "id": "post-uuid",
    "title": "Architecting Scalable Microservices",
    "description": "An exploration of event sourcing and clean API design.",
    "content": "Distributed systems require explicit failure modeling...",
    "authorId": "user-uuid",
    "createdAt": "2026-11-22T08:00:00.000Z",
    "updatedAt": "2026-11-22T08:00:00.000Z",
    "author": {
      "id": "user-uuid",
      "name": "Ada Lovelace",
      "email": "ada@example.com"
    },
    "comments": [
      {
        "id": "comment-uuid",
        "content": "Insightful breakdown of consistency boundaries!",
        "authorId": "commenter-uuid",
        "postId": "post-uuid",
        "createdAt": "2026-11-22T08:30:00.000Z",
        "updatedAt": "2026-11-22T08:30:00.000Z",
        "author": {
          "id": "commenter-uuid",
          "name": "Charles Babbage",
          "email": "charles@example.com"
        }
      }
    ]
  }
}
```
- **Error Responses**:
  - `404 Not Found`: Post ID does not exist

---

### 2.3 Create Post
- **Method & Route**: `POST /posts`
- **Auth Required**: Yes (`Bearer <token>`)
- **Request Body**:
```json
{
  "title": "Architecting Scalable Microservices",
  "description": "An exploration of event sourcing and clean API design.",
  "content": "Distributed systems require explicit failure modeling..."
}
```
- **Validation**:
  - `title`: 3 to 200 characters
  - `description`: 5 to 500 characters
  - `content`: Minimum 10 characters
- **Response (201 Created)**: Returns created post object with author details.

---

### 2.4 Update Post
- **Method & Route**: `PUT /posts/:id`
- **Auth Required**: Yes (Must be post author)
- **Request Body** (at least one field required):
```json
{
  "title": "Architecting Scalable Microservices (Revised Edition)",
  "description": "Updated summary with new benchmarks."
}
```
- **Response (200 OK)**: Returns updated post object.
- **Error Responses**:
  - `403 Forbidden`: User is not the author of this post
  - `404 Not Found`: Post does not exist

---

### 2.5 Delete Post
- **Method & Route**: `DELETE /posts/:id`
- **Auth Required**: Yes (Must be post author)
- **Response (200 OK)**:
```json
{
  "success": true,
  "message": "Blog post deleted successfully"
}
```
- **Error Responses**:
  - `403 Forbidden`: User is not the author of this post
  - `404 Not Found`: Post does not exist

---

## 3. Comments Endpoints

### 3.1 Get Comments for Post
- **Method & Route**: `GET /posts/:id/comments`
- **Auth Required**: None
- **Response (200 OK)**: Returns array of comments sorted newest first with author info.

---

### 3.2 Add Comment
- **Method & Route**: `POST /posts/:id/comments`
- **Auth Required**: Yes (`Bearer <token>`)
- **Request Body**:
```json
{
  "content": "Insightful breakdown of consistency boundaries!"
}
```
- **Validation**:
  - `content`: 1 to 1000 characters
- **Response (201 Created)**: Returns created comment object with author details.

---

### 3.3 Delete Comment
- **Method & Route**: `DELETE /comments/:id`
- **Auth Required**: Yes (Must be comment author)
- **Response (200 OK)**:
```json
{
  "success": true,
  "message": "Comment deleted successfully"
}
```
- **Error Responses**:
  - `403 Forbidden`: User is not the author of this comment
  - `404 Not Found`: Comment does not exist
