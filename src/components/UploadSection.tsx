import { Zap, AlertTriangle, CheckCircle, Mail } from 'lucide-react';
import { JobDescriptionInput } from './JobDescriptionInput';
import { FileUpload } from './FileUpload';
import { UploadedFile } from '../types';

interface UploadSectionProps {
  jobDescription: string;
  onJobDescriptionChange: (value: string) => void;
  files: UploadedFile[];
  onFilesChange: (files: UploadedFile[]) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
}

export function UploadSection({
  jobDescription,
  onJobDescriptionChange,
  files,
  onFilesChange,
  onAnalyze,
  isAnalyzing
}: UploadSectionProps) {
  const completedFiles = files.filter(f => f.status === 'completed');
  const processingFiles = files.filter(f => f.status === 'processing' || f.status === 'pending');
  const errorFiles = files.filter(f => f.status === 'error');
  
  const hasJobDescription = jobDescription.trim().length > 0;
  const hasCompletedFiles = completedFiles.length > 0;
  const canAnalyze = hasJobDescription && hasCompletedFiles && !isAnalyzing && processingFiles.length === 0;

  const getAnalyzeButtonText = () => {
    if (isAnalyzing) return 'Analyzing with AI...';
    if (processingFiles.length > 0) return `Processing ${processingFiles.length} file${processingFiles.length > 1 ? 's' : ''}...`;
    if (!hasJobDescription && !hasCompletedFiles) return 'Add Job Description & Upload Resumes';
    if (!hasJobDescription) return 'Add Job Description to Continue';
    if (!hasCompletedFiles) return 'Upload Resumes to Continue';
    return `Analyze ${completedFiles.length} Resume${completedFiles.length > 1 ? 's' : ''} with AI`;
  };

  const getStatusMessage = () => {
    if (!hasJobDescription && !hasCompletedFiles) {
      return {
        type: 'warning',
        message: 'Please provide a job description and upload resume files to begin analysis'
      };
    }
    if (!hasJobDescription) {
      return {
        type: 'warning',
        message: 'Job description is required for AI analysis'
      };
    }
    if (!hasCompletedFiles) {
      return {
        type: 'warning',
        message: 'Please upload and process at least one resume file'
      };
    }
    if (processingFiles.length > 0) {
      return {
        type: 'info',
        message: `Processing ${processingFiles.length} file${processingFiles.length > 1 ? 's' : ''}... Please wait for completion`
      };
    }
    if (errorFiles.length > 0) {
      return {
        type: 'warning',
        message: `${errorFiles.length} file${errorFiles.length > 1 ? 's' : ''} failed to process. Fix errors or remove failed files`
      };
    }
    return {
      type: 'success',
      message: `Ready to analyze ${completedFiles.length} resume${completedFiles.length > 1 ? 's' : ''} against job requirements`
    };
  };

  const statusMessage = getStatusMessage();

  return (
    <section id="upload" className="relative animate-scale-in">
      {/* Glass Card Container */}
      <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-gray-200/50 dark:border-gray-700/50 relative overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 dark:from-emerald-500/5 dark:via-transparent dark:to-teal-500/5" />
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 dark:from-emerald-500 dark:via-teal-500 dark:to-cyan-500" />
        
        <div className="relative z-10">
          {/* Header */}
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
              🤖 AI-Powered Resume Analysis
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Let our advanced AI analyze and rank candidates with precision
            </p>
          </div>

          <div className="space-y-10">
            {/* Job Description Section */}
            <div className="bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-600/50 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 dark:from-emerald-500 dark:to-teal-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                  <span className="text-white text-xl">📝</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">Job Description</h3>
              </div>
              <JobDescriptionInput
                value={jobDescription}
                onChange={onJobDescriptionChange}
              />
            </div>

            {/* File Upload Section */}
            <div className="bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-600/50 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 dark:from-teal-500 dark:to-emerald-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                  <span className="text-white text-xl">📁</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">Resume Upload</h3>
              </div>
              <FileUpload
                files={files}
                onFilesChange={onFilesChange}
              />
            </div>

            {/* Analysis Status and Button */}
            <div className="space-y-6">
              {/* Status Message */}
              <div className={`p-6 rounded-2xl border backdrop-blur-sm shadow-lg ${
                statusMessage.type === 'success' 
                  ? 'bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-500/30 text-green-800 dark:text-green-200'
                  : statusMessage.type === 'warning'
                  ? 'bg-yellow-50 dark:bg-yellow-500/10 border-yellow-200 dark:border-yellow-500/30 text-yellow-800 dark:text-yellow-200'
                  : 'bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/30 text-blue-800 dark:text-blue-200'
              }`}>
                <div className="flex items-center space-x-4">
                  {statusMessage.type === 'success' && <CheckCircle className="h-5 w-5 text-green-400" />}
                  {statusMessage.type === 'warning' && <AlertTriangle className="h-5 w-5 text-yellow-400" />}
                  {statusMessage.type === 'info' && <Zap className="h-5 w-5 text-blue-400" />}
                  <span className="font-semibold text-lg">{statusMessage.message}</span>
                </div>
              </div>

              {/* Analysis Button */}
              <div className="flex flex-col items-center space-y-4">
                <button
                  onClick={onAnalyze}
                  disabled={!canAnalyze}
                  className={`group relative overflow-hidden px-12 py-6 text-xl font-bold rounded-2xl transition-all duration-500 transform shadow-2xl ${
                    canAnalyze
                      ? 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-emerald-600 dark:via-teal-600 dark:to-cyan-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 dark:hover:from-emerald-700 dark:hover:via-teal-700 dark:hover:to-cyan-700 text-white hover:shadow-3xl hover:scale-105 hover:-translate-y-1 pulse-glow'
                      : 'bg-gray-400 dark:bg-gray-600 text-gray-600 dark:text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {/* Button Background Animation */}
                  {canAnalyze && (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 dark:from-emerald-400 dark:via-teal-400 dark:to-cyan-400 opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
                  )}
                  
                  {/* Button Content */}
                  <div className="relative flex items-center space-x-4">
                    {isAnalyzing ? (
                      <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Zap className={`h-8 w-8 ${canAnalyze ? 'text-white' : 'text-gray-500'}`} />
                    )}
                    <span>{getAnalyzeButtonText()}</span>
                  </div>
                  
                  {/* Shimmer Effect */}
                  {canAnalyze && !isAnalyzing && (
                    <div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-shimmer" />
                  )}
                </button>

                {/* Analysis Info */}
                {canAnalyze && (
                  <div className="text-center space-y-2">
                    <p className="text-green-300 font-medium flex items-center justify-center space-x-2">
                      <CheckCircle className="h-5 w-5" />
                      <span>Ready for AI Analysis</span>
                    </p>
                    <div className="text-sm text-white/70 space-y-1">
                      <p>✨ Using Gemini Flash 2.0 for intelligent candidate matching</p>
                      <p>⚡ Analysis typically takes 30-60 seconds</p>
                      <p>🎯 Results include detailed scoring and recommendations</p>
                      <p className="flex items-center justify-center space-x-1">
                        <Mail className="h-4 w-4" />
                        <span>📧 AI-powered interview emails for top candidates</span>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}