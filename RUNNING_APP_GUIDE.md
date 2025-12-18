# Running the Edraak App - Setup Guide

This guide provides the essential commands to get the Edraak application running from scratch.

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database (connection URL needed in environment variables)
- A `.env.local` file with all required environment variables (use `.env.example` as template)

## Setup Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Prisma Client (after installing dependencies)
```bash
npx prisma generate
```

### 3. Initialize Database (first time only)
```bash
npm run db:init
```

### 4. Run Prisma Migrate (to sync schema with database)
```bash
npx prisma migrate dev
```

### 5. Seed Database (optional, for initial data)
```bash
npx prisma db seed
```

### 6. Run the Development Server
```bash
npm run dev
```

## Troubleshooting

If you encounter Prisma errors:
- Make sure you have set up your database connection in `.env.local`
- Ensure the PostgreSQL service is running
- Run `npx prisma generate` to rebuild the Prisma client
- Use `npx prisma migrate dev` to sync your schema

## Environment Variables

Before running the app, make sure to copy `.env.example` to `.env.local` and fill in all required variables:
```bash
cp .env.example .env.local
```

You'll need to provide values for:
- `DATABASE_URL` - Your PostgreSQL connection string
- `NEXTAUTH_SECRET` - Secret for NextAuth (generate with `openssl rand -base64 32`)
- All PayMob variables for payment processing
- Bunny.net variables for file storage