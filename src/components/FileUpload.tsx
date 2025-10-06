import { useRef, useState, DragEvent, ChangeEvent } from 'react';
import { Upload, X, FileText, AlertCircle, CheckCircle, Clock, Loader2 } from 'lucide-react';
import { UploadedFile } from '../types';
import { FileProcessor } from '../services/fileProcessor';

interface FileUploadProps {
  files: UploadedFile[];
  onFilesChange: (files: UploadedFile[]) => void;
}

export function FileUpload({ files, onFilesChange }: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    processFiles(droppedFiles);
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      processFiles(selectedFiles);
    }
    // Reset input value to allow selecting the same file again
    e.target.value = '';
  };

  const processFiles = async (newFiles: File[]) => {
    const updatedFiles = [...files];
    
    for (const file of newFiles) {
      try {
        // Validate file
        const validation = FileProcessor.validateFile(file);
        
        if (!validation.valid) {
          // Create error file object for display
          const errorFileObj: UploadedFile = {
            id: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            file,
            status: 'error',
            text: null,
            error: validation.error || 'Invalid file',
            uploadTime: new Date()
          };
          updatedFiles.push(errorFileObj);
          onFilesChange(updatedFiles);
          continue;
        }

        // Check for duplicates
        const isDuplicate = files.some(f => 
          f.file.name === file.name && 
          f.file.size === file.size && 
          f.status !== 'error'
        );
        
        if (isDuplicate) {
          // Create duplicate error file object
          const duplicateFileObj: UploadedFile = {
            id: `duplicate_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            file,
            status: 'error',
            text: null,
            error: 'File already uploaded',
            uploadTime: new Date()
          };
          updatedFiles.push(duplicateFileObj);
          onFilesChange(updatedFiles);
          continue;
        }

        // Create file object
        const fileObj: UploadedFile = {
          id: `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          file,
          status: 'pending',
          text: null,
          error: null,
          uploadTime: new Date()
        };

        updatedFiles.push(fileObj);
        onFilesChange([...updatedFiles]);

        // Start processing
        setUploadProgress(prev => ({ ...prev, [fileObj.id]: 0 }));
        
        // Simulate progress for better UX
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => {
            const currentProgress = prev[fileObj.id] || 0;
            if (currentProgress < 90) {
              return { ...prev, [fileObj.id]: currentProgress + 10 };
            }
            return prev;
          });
        }, 200);

        try {
          await FileProcessor.processFile(fileObj);
          setUploadProgress(prev => ({ ...prev, [fileObj.id]: 100 }));
          
          // Update the file object in the array
          const fileIndex = updatedFiles.findIndex(f => f.id === fileObj.id);
          if (fileIndex !== -1) {
            updatedFiles[fileIndex] = fileObj;
            onFilesChange([...updatedFiles]);
          }
        } catch (error) {
          console.error('File processing error:', error);
          // File object is already updated with error status by FileProcessor
          const fileIndex = updatedFiles.findIndex(f => f.id === fileObj.id);
          if (fileIndex !== -1) {
            updatedFiles[fileIndex] = fileObj;
            onFilesChange([...updatedFiles]);
          }
        } finally {
          clearInterval(progressInterval);
          setTimeout(() => {
            setUploadProgress(prev => {
              const newProgress = { ...prev };
              delete newProgress[fileObj.id];
              return newProgress;
            });
          }, 2000);
        }
      } catch (error) {
        console.error('Unexpected error processing file:', error);
      }
    }
  };

  const removeFile = (fileId: string) => {
    const updatedFiles = files.filter(f => f.id !== fileId);
    onFilesChange(updatedFiles);
    
    // Clean up progress tracking
    setUploadProgress(prev => {
      const newProgress = { ...prev };
      delete newProgress[fileId];
      return newProgress;
    });
  };

  const getStatusIcon = (file: UploadedFile) => {
    const progress = uploadProgress[file.id];
    
    switch (file.status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'processing':
        return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusText = (file: UploadedFile) => {
    const progress = uploadProgress[file.id];
    
    switch (file.status) {
      case 'completed':
        return 'Ready for analysis';
      case 'error':
        return file.error || 'Processing failed';
      case 'processing':
        return progress !== undefined ? `Processing... ${progress}%` : 'Processing...';
      case 'pending':
        return 'Waiting to process';
      default:
        return 'Unknown status';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-700 bg-green-50 border-green-200';
      case 'error':
        return 'text-red-700 bg-red-50 border-red-200';
      case 'processing':
        return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'pending':
        return 'text-yellow-700 bg-yellow-50 border-yellow-200';
      default:
        return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  const completedFiles = files.filter(f => f.status === 'completed');
  const processingFiles = files.filter(f => f.status === 'processing' || f.status === 'pending');
  const errorFiles = files.filter(f => f.status === 'error');

  return (
    <div className="space-y-8">
      {/* Upload Area with Glass Effect */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative overflow-hidden border-2 border-dashed rounded-3xl p-12 text-center cursor-pointer transition-all duration-500 backdrop-blur-lg shadow-xl hover:shadow-2xl ${
          isDragOver
            ? 'border-blue-500 dark:border-emerald-500 bg-blue-50 dark:bg-emerald-500/10 scale-[1.02]'
            : 'border-gray-300 dark:border-gray-600 bg-white/80 dark:bg-gray-700/80 hover:border-blue-400 dark:hover:border-emerald-400 hover:bg-blue-50 dark:hover:bg-emerald-500/5 hover:scale-[1.01]'
        }`}
      >
        {/* Animated Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 dark:from-emerald-500/5 dark:via-teal-500/5 dark:to-cyan-500/5 animate-pulse" />
        
        {/* Upload Icon with Animation */}
        <div className="relative z-10">
          <div className={`mx-auto mb-6 w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center transition-transform duration-300 ${
            isDragOver ? 'scale-110 rotate-12' : 'hover:scale-105'
          }`}>
            <Upload className="h-10 w-10 text-white" />
          </div>
          
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
              {isDragOver ? 'Drop your resumes here!' : 'Upload Resume Files'}
            </h3>
            
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Drag & drop files here or click to browse
            </p>
            
            <div className="flex flex-wrap justify-center gap-3 text-sm">
              <span className="px-4 py-2 bg-blue-100 dark:bg-blue-500/20 backdrop-blur-sm rounded-full text-blue-800 dark:text-blue-300 font-medium border border-blue-200 dark:border-blue-500/30">
                📄 PDF
              </span>
              <span className="px-4 py-2 bg-green-100 dark:bg-green-500/20 backdrop-blur-sm rounded-full text-green-800 dark:text-green-300 font-medium border border-green-200 dark:border-green-500/30">
                📝 DOC/DOCX
              </span>
              <span className="px-4 py-2 bg-purple-100 dark:bg-purple-500/20 backdrop-blur-sm rounded-full text-purple-800 dark:text-purple-300 font-medium border border-purple-200 dark:border-purple-500/30">
                📃 TXT
              </span>
            </div>
            
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Maximum file size: 10MB • Minimum content: 50 characters
            </p>
          </div>
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.txt"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Upload Statistics */}
      {files.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/90 dark:bg-gray-700/90 backdrop-blur-lg rounded-2xl p-4 text-center border border-gray-200 dark:border-gray-600 shadow-lg">
            <div className="text-2xl font-bold text-gray-800 dark:text-white">{files.length}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Files</div>
          </div>
          <div className="bg-green-50 dark:bg-green-500/10 backdrop-blur-lg rounded-2xl p-4 text-center border border-green-200 dark:border-green-500/30 shadow-lg">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{completedFiles.length}</div>
            <div className="text-sm text-green-700 dark:text-green-300">Ready</div>
          </div>
          <div className="bg-blue-50 dark:bg-blue-500/10 backdrop-blur-lg rounded-2xl p-4 text-center border border-blue-200 dark:border-blue-500/30 shadow-lg">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{processingFiles.length}</div>
            <div className="text-sm text-blue-700 dark:text-blue-300">Processing</div>
          </div>
          <div className="bg-red-50 dark:bg-red-500/10 backdrop-blur-lg rounded-2xl p-4 text-center border border-red-200 dark:border-red-500/30 shadow-lg">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">{errorFiles.length}</div>
            <div className="text-sm text-red-700 dark:text-red-300">Errors</div>
          </div>
        </div>
      )}

      {/* Uploaded Files List */}
      {files.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center">
            📁 Uploaded Files ({files.length})
          </h3>
          
          <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
            {files.map((fileObj, index) => {
              const progress = uploadProgress[fileObj.id];
              
              return (
                <div
                  key={fileObj.id}
                  className="group bg-white/90 dark:bg-gray-700/90 backdrop-blur-lg border border-gray-200 dark:border-gray-600 rounded-2xl p-5 hover:bg-white dark:hover:bg-gray-600 transition-all duration-300 hover:scale-[1.01] hover:shadow-xl"
                  style={{ 
                    animationDelay: `${index * 100}ms`,
                    animation: 'slideIn 0.5s ease-out forwards'
                  }}
                >
                  <div className="flex items-center space-x-4">
                    {/* File Icon */}
                    <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-2xl shadow-lg">
                      {FileProcessor.getFileIcon(fileObj.file.type, fileObj.file.name)}
                    </div>
                    
                    {/* File Info */}
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-gray-800 dark:text-white truncate text-lg">
                        {fileObj.file.name}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                        <div className="flex items-center space-x-4">
                          <span>{FileProcessor.formatFileSize(fileObj.file.size)}</span>
                          <span>•</span>
                          <span>{FileProcessor.getFileTypeLabel(fileObj.file.type, fileObj.file.name)}</span>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-500">
                          Uploaded: {fileObj.uploadTime.toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                    
                    {/* Status */}
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(fileObj)}
                        <div className="text-right">
                          <div className={`text-xs font-bold px-3 py-1 rounded-full border ${getStatusColor(fileObj.status)}`}>
                            {fileObj.status.toUpperCase()}
                          </div>
                          <div className="text-xs text-white/70 mt-1">
                            {getStatusText(fileObj)}
                          </div>
                        </div>
                      </div>
                      
                      {/* Remove Button */}
                      <button
                        onClick={() => removeFile(fileObj.id)}
                        className="p-2 text-gray-400 dark:text-gray-500 hover:text-red-500 hover:bg-red-100 dark:hover:bg-red-500/20 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
                        title="Remove file"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  {progress !== undefined && fileObj.status === 'processing' && (
                    <div className="mt-4">
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300 ease-out"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 mt-1 text-center">
                        Processing... {progress}%
                      </div>
                    </div>
                  )}
                  
                  {/* Error Details */}
                  {fileObj.status === 'error' && fileObj.error && (
                    <div className="mt-3 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                      <div className="text-sm text-red-700 dark:text-red-300 flex items-start">
                        <AlertCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                        <span>{fileObj.error}</span>
                      </div>
                    </div>
                  )}
                  
                  {/* Success Details */}
                  {fileObj.status === 'completed' && fileObj.text && (
                    <div className="mt-3 p-3 bg-green-500/20 border border-green-500/30 rounded-lg">
                      <div className="text-sm text-green-700 dark:text-green-300 flex items-start">
                        <CheckCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="font-medium">Successfully processed</div>
                          <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                            Extracted {fileObj.text.length} characters of text
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Upload Tips */}
      {files.length === 0 && (
        <div className="bg-white/90 dark:bg-gray-700/90 backdrop-blur-lg rounded-2xl p-6 border border-gray-200 dark:border-gray-600 shadow-lg">
          <h4 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center">
            💡 Upload Tips
          </h4>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-300">
            <div className="space-y-2">
              <div className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>Use high-quality PDF files for best text extraction</span>
              </div>
              <div className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>Ensure resumes contain readable text (not just images)</span>
              </div>
              <div className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>Include complete contact information and skills</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-start">
                <span className="text-yellow-400 mr-2">!</span>
                <span>Files under 100 bytes will be rejected</span>
              </div>
              <div className="flex items-start">
                <span className="text-yellow-400 mr-2">!</span>
                <span>Maximum file size is 10MB</span>
              </div>
              <div className="flex items-start">
                <span className="text-yellow-400 mr-2">!</span>
                <span>Duplicate files will be automatically detected</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}