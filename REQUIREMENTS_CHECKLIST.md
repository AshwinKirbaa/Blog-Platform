# Requirements Checklist - Full-Stack Blog Platform with Comments

## 1. Mandatory Functional Requirements
- [x] User Registration (`POST /api/auth/register`)
- [x] User Login & Authentication (`POST /api/auth/login`)
- [x] Secure Password Hashing (bcrypt, salt rounds = 10, never exposed)
- [x] Get Current User Profile (`GET /api/auth/me`)
- [x] Create Blog Posts (`POST /api/posts`)
- [x] Edit Existing Blog Posts (`PUT /api/posts/:id`, owner only)
- [x] Delete Blog Posts (`DELETE /api/posts/:id`, owner only, cascading comments)
- [x] Display All Blog Posts with Pagination & Search (`GET /api/posts`)
- [x] Individual Blog Post Details (`GET /api/posts/:id`)
- [x] Comment Functionality:
  - [x] Add Comment to Post (`POST /api/posts/:id/comments`)
  - [x] View Comments on Post (`GET /api/posts/:id/comments`)
  - [x] Delete Comment (`DELETE /api/comments/:id`, comment owner only)
- [x] RESTful Backend APIs initial setup with Express & TypeScript
- [x] PostgreSQL Database Integration via Prisma ORM (`blogdb`)

## 2. Security Requirements
- [x] Password hashing with bcrypt (min 10 rounds)
- [x] Plain-text passwords never stored or logged
- [x] Password hashes excluded from API responses (sanitized user objects)
- [x] Input validation and sanitization using Zod
- [x] JWT authentication with authorization headers & expiration
- [x] Authorization guards (post/comment ownership verification)
- [x] CORS properly configured for frontend origin (`http://localhost:5173`)
- [x] Rate limiting on authentication endpoints (`express-rate-limit`)
- [x] Environment variables for secrets and database credentials (`.env` and `.env.example`)

## 3. Frontend Pages & UX Requirements
- [x] React + Vite + TypeScript initialized with Tailwind CSS
- [ ] Minimalist editorial design, clean typography, responsive layout
- [ ] Proper loading, empty, and error states
- [ ] Navigation bar with dynamic auth state (Login/Register vs Dashboard/Logout)
- [ ] Home Page:
  - [ ] Hero / featured post
  - [ ] Search bar & category filters
  - [ ] Latest posts listing with pagination
  - [ ] Footer
- [ ] Register Page: Name, Email, Password, Confirm Password, validation errors
- [ ] Login Page: Email, Password, auth error feedback
- [ ] Blog Details Page:
  - [ ] Title, author info, publication date, read time, full content
  - [ ] Comments section with comment list and add comment form
  - [ ] Delete comment action for comment owner
- [ ] Create Blog Page: Title, category, description, rich markdown/content editor, publish button
- [ ] Edit Blog Page: Pre-filled form with current post data, update button
- [ ] User Dashboard:
  - [ ] User profile information
  - [ ] List of "My Blog Posts"
  - [ ] Edit and Delete controls per post
  - [ ] Create New Post action button

## 4. Database Architecture & Relations
- [x] User model (`id`, `name`, `email`, `password`, `createdAt`, `updatedAt`)
- [x] Post model (`id`, `title`, `description`, `content`, `authorId`, `createdAt`, `updatedAt`)
- [x] Comment model (`id`, `content`, `authorId`, `postId`, `createdAt`, `updatedAt`)
- [x] Foreign keys, cascading deletes (`onDelete: Cascade`), and indexes on foreign keys
- [x] Prisma migration applied (`20261121173551_init`) & Prisma client generated

## 5. Verification & Testing
- [x] PostgreSQL connectivity verified directly via Prisma queries (`backend/src/test-db.ts`)
- [x] Backend TypeScript compilation (`npm run build`) verified
- [x] Backend health endpoint verified (`GET /api/health` -> HTTP 200 OK)
- [x] Frontend TypeScript + Vite build (`npm run build`) verified
- [x] Frontend dev server startup verified
- [x] Backend automated integration tests (20/20 test cases passing against isolated `blogdb_test`)
- [x] Live HTTP API verification (`live-test.ts` against running server and dev `blogdb`)
- [ ] Frontend end-to-end functionality verification
- [ ] Postman-compatible REST collection / automated script tests
- [ ] Responsive design inspection on mobile, tablet, desktop
