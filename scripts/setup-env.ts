#!/usr/bin/env node

/**
 * Environment Setup Script
 * 
 * This script helps set up the initial environment for the Edrak project
 * by creating a .env file with the required variables.
 */

import { writeFileSync, existsSync } from 'fs';
import { join } from 'path';

function createEnvFile() {
  const envPath = join(__dirname, '..', '.env');
  
  // Check if .env file already exists
  if (existsSync(envPath)) {
    console.log('⚠️  .env file already exists. Skipping creation.');
    console.log('Please verify the contents are correct for your environment.');
    return;
  }
  
  // Create the .env file content
  const envContent = `# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/edrak

# NextAuth.js Configuration
NEXTAUTH_SECRET=your_super_secret_key_here_change_this_in_production
NEXTAUTH_URL=http://localhost:3000

# Paymob Configuration (Sandbox for development)
PAYMOB_API_KEY=your_paymob_api_key_here
PAYMOB_INTEGRATION_ID=your_paymob_integration_id_here
PAYMOB_IFRAME_ID=your_paymob_iframe_id_here
PAYMOB_HMAC=your_paymob_hmac_here

# Bunny CDN Configuration
BUNNY_CDN_API_KEY=your_bunny_cdn_api_key_here
BUNNY_CDN_STORAGE_ZONE=your_bunny_cdn_storage_zone_here
BUNNY_CDN_PULL_ZONE_URL=your_bunny_cdn_pull_zone_url_here

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Development Flags
NODE_ENV=development
`;

  try {
    writeFileSync(envPath, envContent);
    console.log('✅ .env file created successfully!');
    console.log('Please update the values in the .env file with your actual configuration.');
  } catch (error) {
    console.error('❌ Failed to create .env file:', error);
    process.exit(1);
  }
}

function displaySetupInstructions() {
  console.log(`
📝 Environment Setup Instructions:

1. Database Setup:
   - Install PostgreSQL if not already installed
   - Create a database named 'edrak'
   - Update the DATABASE_URL with your actual database credentials

2. Paymob Setup:
   - Create a Paymob account (sandbox for development)
   - Obtain your API keys and integration IDs
   - Update the PAYMOB_* variables with your actual values

3. Bunny CDN Setup:
   - Create a Bunny CDN account
   - Set up a storage zone and pull zone
   - Obtain your API key and zone information
   - Update the BUNNY_CDN_* variables with your actual values

4. Security:
   - Change the NEXTAUTH_SECRET to a strong, random secret
   - In production, use a different secret than in development

5. Initialize the database:
   - Run 'npm run db:init' to set up the database schema

After updating the .env file, you can start the development server with 'npm run dev'
`);
}

// Run the setup
createEnvFile();
displaySetupInstructions();