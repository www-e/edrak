# Edrak Project Environment Setup

## Overview

This document outlines the environment setup and configuration requirements for the Edrak educational platform.

## Prerequisites

### System Requirements

- Node.js v16 or higher
- npm, yarn, or pnpm package manager
- PostgreSQL database
- Git for version control

### Accounts and Services

- Paymob account for payment processing
- Bunny CDN account for file storage
- Email service for sending notifications

## Environment Variables

Create a `.env` file in the project root with the following variables:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/edrak

# NextAuth.js
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000

# Paymob
PAYMOB_API_KEY=your_paymob_api_key_here
PAYMOB_INTEGRATION_ID=your_paymob_integration_id_here
PAYMOB_IFRAME_ID=your_paymob_iframe_id_here
PAYMOB_HMAC=your_paymob_hmac_here

# Bunny CDN
BUNNY_CDN_API_KEY=your_bunny_cdn_api_key_here
BUNNY_CDN_STORAGE_ZONE=your_bunny_cdn_storage_zone_here
BUNNY_CDN_PULL_ZONE_URL=your_bunny_cdn_pull_zone_url_here

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Database Setup

### 1. Install PostgreSQL

- Download and install PostgreSQL from https://www.postgresql.org/download/
- Create a new database named `edrak`

### 2. Configure Prisma

- Run `npx prisma generate` to generate the Prisma client
- Run `npx prisma migrate dev` to create the database schema

## Development Setup

### 1. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 2. Run Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

### 3. Access the Application

Open http://localhost:3000 in your browser

## Testing Setup

### 1. Unit Testing

- Jest configuration included in project
- Run tests with `npm run test`

### 2. End-to-End Testing

- Cypress configuration included
- Run E2E tests with `npm run test:e2e`

## Deployment Configuration

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Configure build settings:
   - Build Command: `npm run build`
   - Output Directory: `.next`

### Production Database

- Use a managed PostgreSQL service (e.g., Supabase, AWS RDS)
- Update `DATABASE_URL` with production database connection string

### Production Environment Variables

```env
# Database
DATABASE_URL=your_production_database_url_here

# NextAuth.js
NEXTAUTH_SECRET=your_production_nextauth_secret_here
NEXTAUTH_URL=your_production_url_here

# Paymob
PAYMOB_API_KEY=your_production_paymob_api_key_here
PAYMOB_INTEGRATION_ID=your_production_paymob_integration_id_here
PAYMOB_IFRAME_ID=your_production_paymob_iframe_id_here
PAYMOB_HMAC=your_production_paymob_hmac_here

# Bunny CDN
BUNNY_CDN_API_KEY=your_production_bunny_cdn_api_key_here
BUNNY_CDN_STORAGE_ZONE=your_production_bunny_cdn_storage_zone_here
BUNNY_CDN_PULL_ZONE_URL=your_production_bunny_cdn_pull_zone_url_here

# Application
NEXT_PUBLIC_APP_URL=your_production_url_here
```

## Security Considerations

### 1. Secret Management

- Never commit secrets to version control
- Use environment variables for all sensitive data
- Rotate secrets regularly

### 2. HTTPS

- Enable HTTPS in production
- Use valid SSL certificates

### 3. CORS Configuration

- Configure CORS policies appropriately
- Restrict API access to authorized domains

### 4. Rate Limiting

- Implement rate limiting for API endpoints
- Configure appropriate limits for different operations

## Monitoring and Logging

### 1. Error Tracking

- Integrate with error tracking service (e.g., Sentry)
- Monitor application errors and performance

### 2. Performance Monitoring

- Set up performance monitoring
- Track page load times and API response times

### 3. Logging

- Implement structured logging
- Log important events and errors

## Backup and Recovery

### 1. Database Backups

- Schedule regular database backups
- Test backup restoration procedures

### 2. File Backups

- Ensure Bunny CDN files are backed up
- Implement disaster recovery procedures

## Troubleshooting

### Common Issues

1. **Database Connection Errors**

   - Verify `DATABASE_URL` is correct
   - Ensure PostgreSQL is running
   - Check firewall settings

2. **Authentication Issues**

   - Verify `NEXTAUTH_SECRET` is set
   - Check `NEXTAUTH_URL` configuration
   - Review session configuration

3. **Payment Integration Issues**

   - Verify Paymob API keys
   - Check integration IDs
   - Review callback URLs

4. **File Upload Issues**
   - Verify Bunny CDN API key
   - Check storage zone configuration
   - Review file size limits

### Support Resources

- Prisma documentation: https://www.prisma.io/docs/
- Next.js documentation: https://nextjs.org/docs
- Paymob documentation: https://developers.paymob.com/
- Bunny CDN documentation: https://bunny.net/help/
