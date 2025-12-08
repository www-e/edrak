import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  MessageCircle, 
  Send,
  User,
  Reply,
  ChevronDown,
  ChevronUp,
  Mail,
  Check,
  Clock
} from "lucide-react";
import { api } from "@/trpc/react";
import { useToast } from "@/hooks/use-toast";

interface ProfessorMessagingPanelProps {
  courseId: string;
  lessonId: string;
  professorId: string;
  className?: string;
}

interface Message {
  id: string;
  title: string;
  content: string;
  status: string;
  createdAt: Date;
  repliedAt?: Date | null;
  reply?: string | null;
  sender: {
    firstName: string;
    lastName: string;
    role: string;
  };
  recipient: {
    firstName: string;
    lastName: string;
    role: string;
  };
  lesson?: {
    title: string;
  } | null;
}

export function ProfessorMessagingPanel({ 
  courseId, 
  lessonId, 
  professorId,
  className = "" 
}: ProfessorMessagingPanelProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessageTitle, setNewMessageTitle] = useState("");
  const [newMessageContent, setNewMessageContent] = useState("");
  const [isSending, setIsSending] = useState(false);
  
  const { toast } = useToast();
  
  // TRPC queries and mutations
  const { data: messagesData, refetch, isLoading } = api.student.messages.getByCourse.useQuery(
    { courseId },
    { enabled: !!courseId }
  );
  
  const createMessage = api.student.messages.create.useMutation();

  // Update local messages when data changes
  useEffect(() => {
    if (messagesData) {
      setMessages(messagesData.map(msg => ({
        ...msg,
        createdAt: new Date(msg.createdAt),
        repliedAt: msg.repliedAt ? new Date(msg.repliedAt) : undefined,
      })));
    }
  }, [messagesData]);

  const handleSendMessage = async () => {
    if (!newMessageTitle.trim() || !newMessageContent.trim()) {
      toast({
        title: "Message fields are required",
        description: "Please enter both a title and content for your message",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);
    
    try {
      await createMessage.mutateAsync({
        courseId,
        recipientId: professorId,
        lessonId,
        title: newMessageTitle,
        content: newMessageContent,
      });
      
      setNewMessageTitle("");
      setNewMessageContent("");
      await refetch();
      
      toast({
        title: "Message sent successfully",
        description: "Your message has been sent to the professor",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to send your message. Please try again.";
      toast({
        title: "Error sending message",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Card className={className}>
      <CardHeader 
        className="cursor-pointer p-4 bg-muted/30 hover:bg-muted/50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-base flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              Message Professor
            </CardTitle>
            <Badge variant="secondary">{messages.filter(m => m.sender.role === 'STUDENT').length} sent</Badge>
          </div>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </CardHeader>
      
      {isOpen && (
        <CardContent className="p-4 space-y-4">
          {/* Compose new message section */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Send New Message</h3>
            
            <div className="space-y-2">
              <div>
                <label className="text-xs text-muted-foreground">Subject</label>
                <input
                  type="text"
                  placeholder="Message subject..."
                  value={newMessageTitle}
                  onChange={(e) => setNewMessageTitle(e.target.value)}
                  className="w-full p-2 border rounded-md text-sm"
                  disabled={isSending}
                />
              </div>
              
              <div>
                <label className="text-xs text-muted-foreground">Message</label>
                <Textarea
                  placeholder="Write your message to the professor..."
                  value={newMessageContent}
                  onChange={(e) => setNewMessageContent(e.target.value)}
                  className="resize-none min-h-[100px]"
                  disabled={isSending}
                />
              </div>
              
              <div className="flex justify-end">
                <Button 
                  onClick={handleSendMessage}
                  disabled={isSending || !newMessageTitle.trim() || !newMessageContent.trim()}
                >
                  {isSending ? (
                    <>
                      <Send className="w-4 h-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Messages list */}
          <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
            {isLoading ? (
              <div className="text-center py-4 text-sm text-muted-foreground">
                Loading messages...
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center py-4 text-sm text-muted-foreground">
                No messages yet. Send your first message to the professor.
              </div>
            ) : (
              messages
                .filter(msg => msg.sender.role === 'STUDENT' || msg.recipient.role === 'STUDENT')
                .map((message) => (
                  <div 
                    key={message.id} 
                    className={`border rounded-lg p-3 ${
                      message.sender.role === 'STUDENT' 
                        ? 'bg-blue-50 border-blue-200' 
                        : 'bg-green-50 border-green-200'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-full ${
                        message.sender.role === 'STUDENT' 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-green-500 text-white'
                      }`}>
                        {message.sender.role === 'STUDENT' ? (
                          <User className="w-4 h-4" />
                        ) : (
                          <User className="w-4 h-4" />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-sm">
                            {message.sender.role === 'STUDENT' 
                              ? 'You' 
                              : `${message.recipient.firstName} ${message.recipient.lastName}`}
                          </h4>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            <span>
                              {message.createdAt.toLocaleDateString()}{' '}
                              {message.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                        
                        <div className="text-xs text-muted-foreground mb-1">
                          {message.lesson && (
                            <span>Lesson: {message.lesson.title}</span>
                          )}
                        </div>
                        
                        <h5 className="font-medium text-sm mb-1">{message.title}</h5>
                        <p className="text-sm mb-2">{message.content}</p>
                        
                        {message.status !== 'PENDING' && (
                          <div className="flex items-center gap-1 text-xs">
                            <span className={`inline-flex items-center ${
                              message.status === 'REPLIED' 
                                ? 'text-green-600' 
                                : message.status === 'READ' 
                                  ? 'text-blue-600' 
                                  : 'text-gray-600'
                            }`}>
                              {message.status === 'REPLIED' && (
                                <>
                                  <Reply className="w-3 h-3 mr-1" />
                                  Replied
                                </>
                              )}
                              {message.status === 'READ' && (
                                <>
                                  <Check className="w-3 h-3 mr-1" />
                                  Read
                                </>
                              )}
                              {message.status === 'PENDING' && (
                                <>
                                  <Mail className="w-3 h-3 mr-1" />
                                  Sent
                                </>
                              )}
                            </span>
                            {message.repliedAt && (
                              <>
                                <span>•</span>
                                <span>
                                  {new Date(message.repliedAt).toLocaleDateString()}{' '}
                                  {new Date(message.repliedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </>
                            )}
                          </div>
                        )}
                        
                        {message.reply && (
                          <div className="mt-3 p-3 bg-white border rounded-md text-sm">
                            <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                              <Reply className="w-3 h-3" />
                              Professor&lsquo;s Reply:
                            </div>
                            <p>{message.reply}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
}