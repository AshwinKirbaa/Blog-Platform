# PostgreSQL Database Setup & Migration Guide

This guide documents the database architecture, schema migrations, and setup instructions for the **Chronicle Blog Platform**.

---

## 1. Prerequisites

- **PostgreSQL**: Version 14 or higher (verified on PostgreSQL 18.6).
- **Node.js**: v20+ (verified on v24.21.0).
- **Prisma CLI**: Included in `backend/devDependencies`.

---

## 2. Database Creation

Open your terminal or `psql` command line tool:

```bash
# Connect to PostgreSQL
psql -U postgres -h localhost -p 5432

# Create development database
CREATE DATABASE blogdb;

# (Optional) Create test database for automated integration tests
CREATE DATABASE blogdb_test;
```

---

## 3. Environment Configuration

In `backend/.env`, set your connection string:

```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/blogdb?schema=public"
```

*For production (e.g. Neon, Supabase, AWS RDS), append `?sslmode=require`:*
```bash
DATABASE_URL="postgresql://user:password@ep-host.neon.tech/blogdb?sslmode=require"
```

---

## 4. Prisma Schema Overview

The relational schema is defined in `backend/prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id        String    @id @default(uuid())
  name      String
  email     String    @unique
  password  String
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  posts     Post[]
  comments  Comment[]

  @@index([email])
}

model Post {
  id          String    @id @default(uuid())
  title       String
  description String
  content     String    @db.Text
  authorId    String
  author      User      @relation(fields: [authorId], references: [id], onDelete: Cascade)
  comments    Comment[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  @@index([authorId])
  @@index([createdAt])
}

model Comment {
  id        String   @id @default(uuid())
  content   String   @db.Text
  authorId  String
  postId    String
  author    User     @relation(fields: [authorId], references: [id], onDelete: Cascade)
  post      Post     @relation(fields: [postId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([postId])
  @@index([authorId])
}
```

### Relational & Cascading Rules
- **Foreign Keys**: `Post.authorId -> User.id`, `Comment.authorId -> User.id`, `Comment.postId -> Post.id`.
- **Cascade On Delete**: Deleting a `User` cascades and deletes all their posts and comments. Deleting a `Post` cascades and deletes all associated comments.
- **Indexes**: Added on `User(email)`, `Post(authorId)`, `Post(createdAt)`, and `Comment(postId, authorId)` for high-performance indexing and pagination.

---

## 5. Applying Migrations & Generating Client

Run the following commands from the `backend/` directory:

```bash
# 1. Apply existing migrations to your database
npx prisma migrate dev

# 2. Generate Prisma Client bindings
npx prisma generate
```

To verify database schema without migrations (e.g. in CI or Production):
```bash
npx prisma migrate deploy
```

---

## 6. Verifying Database Connectivity

A direct connectivity script is included in `backend/src/test-db.ts`:

```bash
cd backend
npx tsx src/test-db.ts
```

Expected output:
```
Connecting to PostgreSQL database via Prisma...
Database connection confirmed successfully!
{ usersCount: 2, postsCount: 2, commentsCount: 0 }
```

---

## 7. Database Reset (Development Warning)

> [!CAUTION]
> The following command permanently deletes all tables, schemas, and data in the configured database before reapplying migrations. Never run this against production databases.

```bash
cd backend
npx prisma migrate reset
```
