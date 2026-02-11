import { useState } from 'react';
import { Upload, Folder, FileIcon, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { users } from '@/data/mockData';
import { formatDistanceToNow } from 'date-fns';

interface UploadedFile {
  id: string;
  name: string;
  type: 'file' | 'folder';
  message: string;
  uploadedBy: typeof users[0];
  uploadedAt: Date;
}

const mockFiles: UploadedFile[] = [
  { id: '1', name: 'public', type: 'folder', message: 'Initial setup', uploadedBy: users[0], uploadedAt: new Date(2025, 0, 8) },
  { id: '2', name: 'src', type: 'folder', message: 'Changes', uploadedBy: users[1], uploadedAt: new Date(2026, 1, 5) },
  { id: '3', name: 'Project_Requirements.pdf', type: 'file', message: 'Added project docs', uploadedBy: users[0], uploadedAt: new Date(2025, 0, 10) },
  { id: '4', name: 'Design_Mockup.png', type: 'file', message: 'Updated design assets', uploadedBy: users[1], uploadedAt: new Date(2025, 0, 12) },
  { id: '5', name: 'Meeting_Notes.docx', type: 'file', message: 'Weekly sync notes', uploadedBy: users[2], uploadedAt: new Date(2026, 1, 1) },
  { id: '6', name: 'README.md', type: 'file', message: 'Initial commit', uploadedBy: users[0], uploadedAt: new Date(2025, 0, 8) },
];

export function FilesSection() {
  const [files, setFiles] = useState<UploadedFile[]>(mockFiles);
  const [isDragging, setIsDragging] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<UploadedFile | null>(null);

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(Array.from(e.dataTransfer.files));
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) handleFiles(Array.from(e.target.files));
  };

  const handleFiles = (newFiles: globalThis.File[]) => {
    const uploaded: UploadedFile[] = newFiles.map((file, i) => ({
      id: `new-${Date.now()}-${i}`,
      name: file.name,
      type: 'file' as const,
      message: 'Uploaded',
      uploadedBy: users[0],
      uploadedAt: new Date(),
    }));
    setFiles((prev) => [...uploaded, ...prev]);
  };

  const confirmDelete = () => {
    if (fileToDelete) {
      setFiles((prev) => prev.filter((f) => f.id !== fileToDelete.id));
      setFileToDelete(null);
    }
  };

  // Sort: folders first, then files
  const sorted = [...files].sort((a, b) => {
    if (a.type === 'folder' && b.type !== 'folder') return -1;
    if (a.type !== 'folder' && b.type === 'folder') return 1;
    return 0;
  });

  return (
    <>
      <div
        className={`space-y-3 ${isDragging ? 'ring-2 ring-primary/50 rounded-lg' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Header row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Avatar className="h-5 w-5">
              <AvatarImage src={users[0].avatar} />
              <AvatarFallback className="text-[10px]">{users[0].name[0]}</AvatarFallback>
            </Avatar>
            <span className="font-medium text-foreground">{users[0].name}</span>
            <span>·</span>
            <span>{files.length} files</span>
          </div>
          <Button variant="outline" size="sm" asChild className="gap-2">
            <label className="cursor-pointer">
              <Upload className="h-3.5 w-3.5" />
              Upload
              <input type="file" multiple className="hidden" onChange={handleFileInput} />
            </label>
          </Button>
        </div>

        {/* File table */}
        <div className="border border-border rounded-lg overflow-hidden">
          {sorted.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No files uploaded yet</p>
          ) : (
            <table className="w-full text-sm">
              <tbody>
                {sorted.map((file, i) => (
                  <tr
                    key={file.id}
                    className={`group hover:bg-accent/50 transition-colors ${i !== sorted.length - 1 ? 'border-b border-border' : ''}`}
                  >
                    <td className="py-2.5 px-4 w-[40%]">
                      <div className="flex items-center gap-2.5">
                        {file.type === 'folder' ? (
                          <Folder className="h-4 w-4 text-primary shrink-0" />
                        ) : (
                          <FileIcon className="h-4 w-4 text-muted-foreground shrink-0" />
                        )}
                        <span className={`truncate ${file.type === 'folder' ? 'font-medium text-foreground' : 'text-foreground'} hover:text-primary hover:underline cursor-pointer`}>
                          {file.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-2.5 px-4 text-muted-foreground hidden md:table-cell">
                      {file.message}
                    </td>
                    <td className="py-2.5 px-4 text-muted-foreground text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <span>{formatDistanceToNow(file.uploadedAt, { addSuffix: true })}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity"
                          onClick={() => setFileToDelete(file)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <AlertDialog open={!!fileToDelete} onOpenChange={(open) => !open && setFileToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete File</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{fileToDelete?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
