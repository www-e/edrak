# Milestone 5: Bunny CDN Integration

## Overview

Implement file upload and management using Bunny CDN for storing lesson attachments.

## Tasks

### 1. Bunny CDN Configuration

- [ ] Set up Bunny CDN account and obtain API keys
- [ ] Configure environment variables for Bunny CDN integration
- [ ] Create Bunny CDN service class for API interactions
- [ ] Set up storage zone and pull zone

### 2. File Upload Implementation

- [ ] Create server action for file upload
- [ ] Implement file validation (MIME type, size)
- [ ] Upload files to Bunny CDN storage
- [ ] Store file metadata in database
- [ ] Generate signed URLs for private files

### 3. File Management

- [ ] Implement file listing by lesson
- [ ] Create file download functionality
- [ ] Implement file deletion from CDN and database
- [ ] Add file metadata retrieval

### 4. Security Measures

- [ ] Validate file types and sizes
- [ ] Implement rate limiting for uploads
- [ ] Add authentication for file access
- [ ] Implement secure file URLs

### 5. Performance Optimization

- [ ] Implement resumable uploads for large files
- [ ] Add progress tracking for uploads
- [ ] Optimize CDN delivery settings
- [ ] Implement caching strategies

## Server Actions

- uploadAttachment - Upload file to Bunny CDN
- deleteAttachment - Remove file from Bunny CDN
- getAttachmentUrl - Get signed URL for file access

## Acceptance Criteria

- [ ] Files can be uploaded to Bunny CDN
- [ ] File metadata is stored in database
- [ ] Files can be downloaded by authorized users
- [ ] Security measures are implemented
- [ ] Error handling for upload failures
