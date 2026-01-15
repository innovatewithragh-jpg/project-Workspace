import { useState } from 'react';
import { Upload, File, FileText, Image, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { users } from '@/data/mockData';
import { format } from 'date-fns';

interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedBy: typeof users[0];
  uploadedAt: Date;
}

const mockFiles: UploadedFile[] = [
  {
    id: '1',
    name: 'Project_Requirements.pdf',
    type: 'pdf',
    size: '2.4 MB',
    uploadedBy: users[0],
    uploadedAt: new Date(2025, 0, 10),
  },
  {
    id: '2',
    name: 'Design_Mockup.png',
    type: 'image',
    size: '1.8 MB',
    uploadedBy: users[1],
    uploadedAt: new Date(2025, 0, 12),
  },
  {
    id: '3',
    name: 'Meeting_Notes.docx',
    type: 'doc',
    size: '156 KB',
    uploadedBy: users[2],
    uploadedAt: new Date(2025, 0, 14),
  },
];

const getFileIcon = (type: string) => {
  switch (type) {
    case 'image':
      return <Image className="h-8 w-8 text-primary" />;
    case 'pdf':
      return <FileText className="h-8 w-8 text-destructive" />;
    default:
      return <File className="h-8 w-8 text-muted-foreground" />;
  }
};

export function FilesSection() {
  const [files, setFiles] = useState<UploadedFile[]>(mockFiles);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      handleFiles(selectedFiles);
    }
  };

  const handleFiles = (newFiles: globalThis.File[]) => {
    const uploadedFiles: UploadedFile[] = newFiles.map((file, index) => ({
      id: `new-${Date.now()}-${index}`,
      name: file.name,
      type: file.type.includes('image') ? 'image' : file.type.includes('pdf') ? 'pdf' : 'doc',
      size: formatFileSize(file.size),
      uploadedBy: users[0], // Current user
      uploadedAt: new Date(),
    }));
    setFiles((prev) => [...uploadedFiles, ...prev]);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleDelete = (id: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card
        className={`border-2 border-dashed transition-colors ${
          isDragging ? 'border-primary bg-primary/5' : 'border-border'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <CardContent className="flex flex-col items-center justify-center py-10">
          <Upload className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-lg font-medium mb-2">Drag & drop files here</p>
          <p className="text-sm text-muted-foreground mb-4">or click to browse</p>
          <Button variant="outline" asChild>
            <label className="cursor-pointer">
              Browse Files
              <input
                type="file"
                multiple
                className="hidden"
                onChange={handleFileInput}
              />
            </label>
          </Button>
        </CardContent>
      </Card>

      {/* Files List */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Uploaded Files</h3>
        {files.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No files uploaded yet</p>
        ) : (
          <div className="space-y-3">
            {files.map((file) => (
              <Card key={file.id} className="hover:bg-accent/50 transition-colors">
                <CardContent className="flex items-center gap-4 p-4">
                  {getFileIcon(file.type)}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{file.name}</p>
                    <p className="text-sm text-muted-foreground">{file.size}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={file.uploadedBy.avatar} />
                        <AvatarFallback className="text-xs">
                          {file.uploadedBy.name.split(' ').map((n) => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span className="hidden sm:inline">{file.uploadedBy.name}</span>
                      <span className="hidden md:inline">• {format(file.uploadedAt, 'MMM d, yyyy')}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-destructive"
                      onClick={() => handleDelete(file.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
