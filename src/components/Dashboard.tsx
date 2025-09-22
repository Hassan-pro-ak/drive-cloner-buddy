import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Plus, 
  Trash2, 
  ExternalLink, 
  FolderOpen, 
  FileText, 
  Download,
  CheckCircle,
  Clock,
  AlertCircle,
  HardDrive
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface User {
  name: string;
  email: string;
  avatar: string;
  quota: {
    used: number;
    total: number;
  };
}

interface CloneJob {
  id: string;
  sourceUrl: string;
  fileName: string;
  fileType: 'file' | 'folder';
  status: 'queued' | 'downloading' | 'uploading' | 'completed' | 'failed';
  progress: number;
  createdAt: Date;
}

interface DashboardProps {
  user: User;
}

export const Dashboard = ({ user }: DashboardProps) => {
  const [driveUrl, setDriveUrl] = useState("");
  const [cloneJobs, setCloneJobs] = useState<CloneJob[]>([]);
  const [isCloning, setIsCloning] = useState(false);
  const { toast } = useToast();

  const addLink = () => {
    if (!driveUrl.trim()) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid Google Drive URL",
        variant: "destructive",
      });
      return;
    }

    // Validate Google Drive URL
    const driveRegex = /^https:\/\/drive\.google\.com\/(file\/d\/|drive\/folders\/)/;
    if (!driveRegex.test(driveUrl)) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid Google Drive URL",
        variant: "destructive",
      });
      return;
    }

    const newJob: CloneJob = {
      id: Date.now().toString(),
      sourceUrl: driveUrl,
      fileName: extractFileName(driveUrl),
      fileType: driveUrl.includes('/folders/') ? 'folder' : 'file',
      status: 'queued',
      progress: 0,
      createdAt: new Date(),
    };

    setCloneJobs(prev => [...prev, newJob]);
    setDriveUrl("");
    
    toast({
      title: "Link Added",
      description: "Drive link has been added to the clone queue",
    });
  };

  const removeJob = (jobId: string) => {
    setCloneJobs(prev => prev.filter(job => job.id !== jobId));
  };

  const startCloning = async () => {
    if (cloneJobs.length === 0) {
      toast({
        title: "No Links",
        description: "Please add some Drive links to clone",
        variant: "destructive",
      });
      return;
    }

    setIsCloning(true);
    
    // Simulate cloning process
    for (const job of cloneJobs.filter(j => j.status === 'queued')) {
      await simulateCloneProcess(job.id);
    }
    
    setIsCloning(false);
  };

  const simulateCloneProcess = async (jobId: string) => {
    const updateJob = (updates: Partial<CloneJob>) => {
      setCloneJobs(prev => prev.map(job => 
        job.id === jobId ? { ...job, ...updates } : job
      ));
    };

    // Downloading phase
    updateJob({ status: 'downloading', progress: 0 });
    for (let i = 0; i <= 50; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      updateJob({ progress: i });
    }

    // Uploading phase
    updateJob({ status: 'uploading', progress: 50 });
    for (let i = 50; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      updateJob({ progress: i });
    }

    // Completed
    updateJob({ status: 'completed', progress: 100 });
    
    toast({
      title: "Clone Completed",
      description: "File has been successfully cloned to your Drive",
    });
  };

  const extractFileName = (url: string): string => {
    // This is a simplified extraction - in real app, you'd fetch metadata
    if (url.includes('/folders/')) {
      return "Folder";
    }
    return "Document";
  };

  const getStatusIcon = (status: CloneJob['status']) => {
    switch (status) {
      case 'queued':
        return <Clock className="w-4 h-4 text-muted-foreground" />;
      case 'downloading':
      case 'uploading':
        return <Download className="w-4 h-4 text-drive-blue animate-pulse" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-drive-green" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-drive-red" />;
    }
  };

  const getStatusColor = (status: CloneJob['status']) => {
    switch (status) {
      case 'queued':
        return 'secondary';
      case 'downloading':
      case 'uploading':
        return 'default';
      case 'completed':
        return 'default';
      case 'failed':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* User Profile Card */}
      <Card className="shadow-soft">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="text-lg">
                  {user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold text-foreground">{user.name}</h2>
                <p className="text-muted-foreground">{user.email}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Drive Storage</p>
                <p className="text-lg font-semibold text-foreground">
                  {formatBytes(user.quota.used)} / {formatBytes(user.quota.total)}
                </p>
                <Progress 
                  value={(user.quota.used / user.quota.total) * 100} 
                  className="w-32 mt-1"
                />
              </div>
              <HardDrive className="w-8 h-8 text-muted-foreground" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Clone Interface */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>Add Drive Links</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              placeholder="Paste Google Drive link here..."
              value={driveUrl}
              onChange={(e) => setDriveUrl(e.target.value)}
              className="flex-1"
              onKeyPress={(e) => e.key === 'Enter' && addLink()}
            />
            <Button onClick={addLink} variant="google">
              <Plus className="w-4 h-4 mr-2" />
              Add Link
            </Button>
          </div>
          
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              {cloneJobs.length} link{cloneJobs.length !== 1 ? 's' : ''} added
            </p>
            {cloneJobs.length > 0 && (
              <Button 
                onClick={startCloning} 
                variant="clone"
                disabled={isCloning || cloneJobs.every(job => job.status !== 'queued')}
              >
                {isCloning ? 'Cloning...' : 'Clone All'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Clone Jobs List */}
      {cloneJobs.length > 0 && (
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Clone Jobs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {cloneJobs.map((job, index) => (
              <div key={job.id}>
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="flex items-center space-x-2">
                      {job.fileType === 'folder' ? (
                        <FolderOpen className="w-5 h-5 text-drive-yellow" />
                      ) : (
                        <FileText className="w-5 h-5 text-drive-blue" />
                      )}
                      {getStatusIcon(job.status)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <p className="font-medium text-foreground truncate">{job.fileName}</p>
                        <Badge variant={getStatusColor(job.status)}>
                          {job.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{job.sourceUrl}</p>
                      {(job.status === 'downloading' || job.status === 'uploading') && (
                        <Progress value={job.progress} className="w-full mt-2" />
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(job.sourceUrl, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeJob(job.id)}
                      disabled={job.status === 'downloading' || job.status === 'uploading'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                {index < cloneJobs.length - 1 && <Separator className="my-2" />}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};