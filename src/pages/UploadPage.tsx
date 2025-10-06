import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadSection } from '../components/UploadSection';
import { UploadedFile } from '../types';

interface UploadPageProps {
  jobDescription: string;
  onJobDescriptionChange: (value: string) => void;
  files: UploadedFile[];
  onFilesChange: (files: UploadedFile[]) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
  onNavigateToResults: () => void;
}

export function UploadPage({
  jobDescription,
  onJobDescriptionChange,
  files,
  onFilesChange,
  onAnalyze,
  isAnalyzing,
  onNavigateToResults
}: UploadPageProps) {

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
          🚀 Upload & Analyze
        </h1>
        <p className="text-xl text-white/90 drop-shadow max-w-3xl mx-auto leading-relaxed">
          Upload job descriptions and resumes for intelligent AI-powered candidate matching
        </p>
      </div>

      <div className="space-y-12">
        {/* Upload Section */}
        <UploadSection
          jobDescription={jobDescription}
          onJobDescriptionChange={onJobDescriptionChange}
          files={files}
          onFilesChange={onFilesChange}
          onAnalyze={onAnalyze}
          isAnalyzing={isAnalyzing}
        />
      </div>
    </main>
  );
}