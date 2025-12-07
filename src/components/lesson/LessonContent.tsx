import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface LessonContentProps {
  content?: string;
}

export function LessonContent({ content }: LessonContentProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Lesson Content</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="prose max-w-none">
          {content ? (
            <div dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br>') }} />
          ) : (
            <p className="text-muted-foreground">No lesson content available.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}