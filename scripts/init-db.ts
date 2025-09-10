#!/usr/bin/env node

/**
 * Database Initialization Script
 * 
 * This script initializes the database with the schema defined in prisma/schema.prisma
 * and runs the initial migration.
 */

import { execSync } from 'child_process';
import { existsSync } from 'fs';
import path from 'path';

function runCommand(command: string, errorMessage: string) {
  try {
    console.log(`Running: ${command}`);
    execSync(command, { stdio: 'inherit' });
  } catch (error) {
    console.error(errorMessage);
    process.exit(1);
  }
}

async function initDatabase() {
  console.log('Initializing Edrak Database...');
  
  // Check if .env file exists
  const envPath = path.join(__dirname, '..', '.env');
  if (!existsSync(envPath)) {
    console.warn('Warning: .env file not found. Please create one with your database configuration.');
    console.warn('Example: DATABASE_URL=postgresql://user:password@localhost:5432/edrak');
  }
  
  // Generate Prisma client
  runCommand(
    'npx prisma generate',
    'Failed to generate Prisma client. Please check your Prisma schema.'
  );
  
  // Run database migrations
  runCommand(
    'npx prisma migrate dev --name init',
    'Failed to run database migrations. Please check your database connection and schema.'
  );
  
  console.log('Database initialization completed successfully!');
  console.log('You can now start the development server with: npm run dev');
}

// Run the initialization
initDatabase().catch((error) => {
  console.error('Database initialization failed:', error);
  process.exit(1);
});