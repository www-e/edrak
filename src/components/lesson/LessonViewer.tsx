"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ArrowLeft, AlertCircle, Eye, Play, File, Video, Download, FileText, Image, MessageCircle, StickyNote, ChevronUp, ChevronDown } from "lucide-react";
import Link from "next/link";
import { VideoPlayerWithNotes } from "@/components/ui/video-player-with-notes";
import { YouTubePlayerWithNotes } from "@/components/ui/youtube-player-with-notes";
import { getFileIcon, formatFileSize } from "@/lib/file-utils";
import { NoteTakingPanel } from "@/components/lesson/NoteTakingPanel";
import { ProfessorMessagingPanel } from "@/components/lesson/ProfessorMessagingPanel";
import { api } from "@/trpc/react";

interface LessonViewerProps {
  courseId: string;
  lessonId: string;
}

interface LessonData {
   id: string;
   title: string;
   content: string;
   duration: number | null;
   order: number;
   isVisible: boolean;
   createdAt: string;
   youtubeUrl?: string | null;  // YouTube video URL for free courses
   attachments: Array<{
     id: string;
     name: string;
     fileName: string;
     mimeType: string;
     fileSize: number;
     bunnyCdnUrl: string;
     createdAt: string;
   }>;
   course: {
     id: string;
     title: string;
     slug: string;
     professor: {
       id: string;
       firstName: string;
       lastName: string;
     }
   };
 }

// Smart content type detection
type AttachmentType = 'VIDEO_PLAYER' | 'PDF_PREVIEW' | 'IMAGE_GALLERY' | 'DOCUMENT_PREVIEW' | 'DOWNLOAD_ONLY';

function getAttachmentType(attachment: LessonData['attachments'][0]): AttachmentType {
  const { mimeType, fileName } = attachment;

  if (mimeType.startsWith('video/')) {
    return 'VIDEO_PLAYER';
  } else if (mimeType.startsWith('image/')) {
    return 'IMAGE_GALLERY';
  } else if (mimeType === 'application/pdf') {
    return 'PDF_PREVIEW';
  } else if (mimeType.includes('document') ||
             fileName.match(/\.(doc|docx|ppt|pptx|txt|md)$/i)) {
    return 'DOCUMENT_PREVIEW';
  } else {
    return 'DOWNLOAD_ONLY';
  }
}

export function LessonViewer({ courseId, lessonId }: LessonViewerProps) {
  const [lesson, setLesson] = useState<LessonData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showNotePanel, setShowNotePanel] = useState(false);
  const [showMessagingPanel, setShowMessagingPanel] = useState(false);

  // Fetch lesson data and progress from API
  useEffect(() => {
    const fetchLessonAndProgress = async () => {
      try {
        setLoading(true);

        // Fetch lesson data
        const lessonResponse = await fetch(`/api/lessons/${lessonId}?courseId=${courseId}`);

        // Handle lesson response
        if (!lessonResponse.ok) {
          if (lessonResponse.status === 403) {
            setError("You must be enrolled in this course to access the lesson content.");
          } else if (lessonResponse.status === 404) {
            setError("Lesson not found or not available.");
          } else {
            setError("Failed to load lesson content.");
          }
          return;
        }

        const lessonData = await lessonResponse.json();
        if (lessonData.success) {
          setLesson(lessonData.lesson);
        } else {
          setError(lessonData.error || "Failed to load lesson.");
          return;
        }
      } catch (err) {
        console.error("Error fetching lesson:", err);
        setError("Network error occurred while loading the lesson.");
      } finally {
        setLoading(false);
      }
    };

    if (courseId && lessonId) {
      fetchLessonAndProgress();
    }
  }, [courseId, lessonId]);

  // Format duration from minutes to HH:MM format
  const formatDuration = (minutes: number | null): string => {
    if (!minutes) return "0:00";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}:${mins.toString().padStart(2, '0')}`;
  };

  // Handle lesson completion - just mark as complete locally
  const handleMarkComplete = () => {
    // Mark lesson as completed (no API call needed as per requirements)
    console.log('Lesson marked as complete');
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="aspect-video bg-gray-200 rounded-lg"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/student/courses" className="hover:text-foreground">
            My Courses
          </Link>
          <span>/</span>
          <Link href={`/student/courses/${courseId}`} className="hover:text-foreground">
            Course
          </Link>
          <span>/</span>
          <span className="text-foreground">Lesson</span>
        </div>

        <Card className="border-destructive">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 text-destructive">
              <AlertCircle className="w-5 h-5" />
              <div>
                <h3 className="font-semibold">Access Denied</h3>
                <p className="text-sm text-muted-foreground">{error}</p>
              </div>
            </div>
            <div className="mt-4">
              <Link href={`/courses/${lesson?.course.slug || courseId}`}>
                <Button variant="outline">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Course
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Lesson not found.</p>
          <Link href={`/student/courses/${courseId}`}>
            <Button variant="outline" className="mt-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Course
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/student/courses" className="hover:text-foreground">
          My Courses
        </Link>
        <span>/</span>
        <Link href={`/student/courses/${courseId}`} className="hover:text-foreground">
          Course Name
        </Link>
        <span>/</span>
        <span className="text-foreground">Lesson {lesson.order}</span>
      </div>

      {/* Lesson Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Badge variant="outline">Lesson {lesson.order}</Badge>
          <Badge variant="secondary">Beginner</Badge>
        </div>
        <h1 className="text-3xl font-bold">{lesson.title}</h1>
        <p className="text-muted-foreground">
          {lesson.content ? lesson.content.substring(0, 200) + '...' : 'No description available'}
        </p>
      </div>

      {/* Smart Video Detection & Display */}
      {(() => {
        // Check for YouTube URL first (zero bandwidth)
        if (lesson.youtubeUrl) {
          return (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-red-100 text-red-800">
                    <Play className="w-3 h-3 mr-1" />
                    YouTube Video
                  </Badge>
                  <Badge variant="outline" className="bg-green-100 text-green-800">
                    Zero Bandwidth Cost
                  </Badge>
                </div>
                <YouTubePlayerWithNotes
                  url={lesson.youtubeUrl}
                  title={lesson.title}
                  onAddNote={() => setShowNotePanel(true)}
                  onSendMessage={() => setShowMessagingPanel(true)}
                />
              </div>
            </div>
          );
        }

        // Fall back to Bunny CDN video attachment
        const mainVideoAttachment = lesson.attachments.find(att => att.mimeType.startsWith('video/'));

        if (mainVideoAttachment) {
          return (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                    <Play className="w-3 h-3 mr-1" />
                    Main Lesson Video
                  </Badge>
                  <Badge variant="outline">
                    {formatFileSize(mainVideoAttachment.fileSize)}
                  </Badge>
                </div>
                <VideoPlayerWithNotes
                  src={mainVideoAttachment.bunnyCdnUrl}
                  title={`${lesson.title} - ${mainVideoAttachment.name}`}
                  onAddNote={() => setShowNotePanel(true)}
                  onSendMessage={() => setShowMessagingPanel(true)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Previous Lesson
                  </Button>
                  <Button variant="outline" size="sm">
                    Next Lesson
                  </Button>
                </div>

                <Button
                  onClick={handleMarkComplete}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mark as Complete
                </Button>
              </div>
            </div>
          );
        }

        // Fallback: Show placeholder if no video found
        return (
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <Play className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-lg font-semibold mb-2">No Video Available</p>
                <p className="text-sm text-muted-foreground">
                  This lesson does not have a video yet. Upload a video file to get started.
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })()}

      {/* Note Taking & Messaging Panel Buttons */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={() => setShowNotePanel(!showNotePanel)}
        >
          {showNotePanel ? <ChevronUp className="w-4 h-4 mr-2" /> : <ChevronDown className="w-4 h-4 mr-2" />}
          <StickyNote className="w-4 h-4 mr-2" />
          Notes ({showNotePanel ? 'Hide' : 'Show'})
        </Button>
        <Button
          variant="outline"
          onClick={() => setShowMessagingPanel(!showMessagingPanel)}
        >
          {showMessagingPanel ? <ChevronUp className="w-4 h-4 mr-2" /> : <ChevronDown className="w-4 h-4 mr-2" />}
          <MessageCircle className="w-4 h-4 mr-2" />
          Message Professor ({showMessagingPanel ? 'Hide' : 'Show'})
        </Button>
      </div>

      {/* Note Taking Panel */}
      {showNotePanel && (
        <NoteTakingPanel
          courseId={courseId}
          lessonId={lessonId}
          className="w-full"
        />
      )}

      {/* Professor Messaging Panel */}
      {showMessagingPanel && lesson.course.professor && (
        <ProfessorMessagingPanel
          courseId={courseId}
          lessonId={lessonId}
          professorId={lesson.course.professor.id}
          className="w-full"
        />
      )}

      {/* Lesson Content */}
      <Card>
        <CardHeader>
          <CardTitle>Lesson Content</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none">
            {lesson.content ? (
              <div dangerouslySetInnerHTML={{ __html: lesson.content.replace(/\n/g, '<br>') }} />
            ) : (
              <p className="text-muted-foreground">No lesson content available.</p>
            )}
          </div>
        </CardContent>
      </Card>

     {/* Smart Attachments Display - Filter out videos since they're shown above */}
     {(() => {
       // Filter out video attachments since they're displayed in the main video section
       const nonVideoAttachments = lesson.attachments.filter(att => !att.mimeType.startsWith('video/'));

       if (nonVideoAttachments.length === 0) {
         return null; // Don't show the section if no non-video attachments
       }

       return (
         <Card>
           <CardHeader>
             <CardTitle className="flex items-center gap-2">
               <File className="w-5 h-5" />
               Lesson Resources
               <Badge variant="outline" className="ml-auto">
                 {nonVideoAttachments.length} file{nonVideoAttachments.length !== 1 ? 's' : ''}
               </Badge>
             </CardTitle>
           </CardHeader>
           <CardContent>
             <div className="space-y-4">
               {nonVideoAttachments.map((attachment) => {
                 const attachmentType = getAttachmentType(attachment);
                 const fileIcon = getFileIcon(attachment.mimeType);
                 const formattedSize = formatFileSize(attachment.fileSize);

                 return (
                   <div key={attachment.id} className="group">
                     {attachmentType === 'PDF_PREVIEW' ? (
                       // PDF attachments - Show preview option
                       <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-red-50/50 transition-colors">
                         <div className="flex items-center gap-3">
                           <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                             <FileText className="w-5 h-5 text-red-600" />
                           </div>
                           <div>
                             <p className="font-medium">{attachment.name}</p>
                             <p className="text-sm text-muted-foreground">
                               📄 PDF Document • {formattedSize}
                             </p>
                           </div>
                         </div>
                         <div className="flex items-center gap-2">
                           <Button
                             variant="ghost"
                             size="sm"
                             onClick={() => window.open(attachment.bunnyCdnUrl, '_blank')}
                           >
                             <Eye className="w-4 h-4 mr-2" />
                             Preview
                           </Button>
                           <Button
                             variant="outline"
                             size="sm"
                             onClick={() => window.open(attachment.bunnyCdnUrl, '_blank')}
                           >
                             <Download className="w-4 h-4 mr-2" />
                             Download
                           </Button>
                         </div>
                       </div>
                     ) : attachmentType === 'IMAGE_GALLERY' ? (
                       // Image attachments - Show thumbnail with preview
                       <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-blue-50/50 transition-colors">
                         <div className="flex items-center gap-3">
                           <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                             <Image className="w-5 h-5 text-blue-600" />
                           </div>
                           <div>
                             <p className="font-medium">{attachment.name}</p>
                             <p className="text-sm text-muted-foreground">
                               🖼️ Image • {formattedSize}
                             </p>
                           </div>
                         </div>
                         <div className="flex items-center gap-2">
                           <Button
                             variant="ghost"
                             size="sm"
                             onClick={() => window.open(attachment.bunnyCdnUrl, '_blank')}
                           >
                             <Eye className="w-4 h-4 mr-2" />
                             View
                           </Button>
                           <Button
                             variant="outline"
                             size="sm"
                             onClick={() => window.open(attachment.bunnyCdnUrl, '_blank')}
                           >
                             <Download className="w-4 h-4 mr-2" />
                             Download
                           </Button>
                         </div>
                       </div>
                     ) : (
                       // Generic files - Show download only
                       <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                         <div className="flex items-center gap-3">
                           <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                             {fileIcon}
                           </div>
                           <div>
                             <p className="font-medium">{attachment.name}</p>
                             <p className="text-sm text-muted-foreground">
                               📎 {attachment.mimeType} • {formattedSize}
                             </p>
                           </div>
                         </div>
                         <Button
                           variant="outline"
                           size="sm"
                           onClick={() => window.open(attachment.bunnyCdnUrl, '_blank')}
                         >
                           <Download className="w-4 h-4 mr-2" />
                           Download
                         </Button>
                       </div>
                     )}
                   </div>
                 );
               })}
             </div>
           </CardContent>
         </Card>
       );
     })()}
    </div>
  );
}