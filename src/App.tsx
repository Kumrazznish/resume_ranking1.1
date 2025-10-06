import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/Header';
import { HomePage } from './pages/HomePage';
import { UploadPage } from './pages/UploadPage';
import { ResultsPage } from './pages/ResultsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { LoadingOverlay } from './components/LoadingOverlay';
import { UploadedFile, Candidate } from './types';
import { GeminiService } from './services/gemini';
import { DatabaseService } from './services/database';

function App() {
  const [jobDescription, setJobDescription] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [loadingState, setLoadingState] = useState({
    title: 'Processing...',
    subtitle: 'Please wait',
    progress: 0
  });

  // Navigation handler
  const navigateToResults = () => {
    setShowResults(true);
  };

  const analyzeResumes = async () => {
    const completedFiles = uploadedFiles.filter(f => f.status === 'completed');
    
    if (!jobDescription.trim()) {
      alert('Please provide a job description before analyzing resumes.');
      return;
    }
    
    if (completedFiles.length === 0) {
      alert('Please upload and process at least one resume before analyzing.');
      return;
    }

    setIsAnalyzing(true);
    setLoadingState({
      title: 'Initializing AI analysis...',
      subtitle: 'Preparing resume data for processing',
      progress: 5
    });

    try {
      // Prepare resume texts with better formatting
      const resumeTexts = completedFiles.map((fileObj, index) => {
        const separator = '='.repeat(100);
        return `RESUME ${index + 1}: ${fileObj.file.name}
${separator}
CANDIDATE PROFILE:
${fileObj.text}
${separator}

`;
      }).join('\n');

      setLoadingState({
        title: 'Connecting to Gemini AI...',
        subtitle: `Processing ${completedFiles.length} resume${completedFiles.length > 1 ? 's' : ''}`,
        progress: 20
      });

      // Call Gemini API with enhanced error handling
      let aiResponse: string;
      try {
        aiResponse = await GeminiService.analyzeResumes(jobDescription, resumeTexts);
      } catch (apiError) {
        console.error('Gemini API Error:', apiError);
        throw new Error(`AI analysis failed: ${apiError instanceof Error ? apiError.message : 'Unknown API error'}`);
      }
      
      setLoadingState({
        title: 'Processing AI results...',
        subtitle: 'Extracting candidate insights and rankings',
        progress: 70
      });

      // Parse AI response with enhanced error handling
      let analysisResults: Candidate[];
      try {
        analysisResults = parseAIResponse(aiResponse, completedFiles);
      } catch (parseError) {
        console.error('Parse Error:', parseError);
        throw new Error(`Failed to process AI results: ${parseError instanceof Error ? parseError.message : 'Unknown parsing error'}`);
      }

      if (analysisResults.length === 0) {
        throw new Error('No valid candidate data was extracted from the AI analysis.');
      }

      setLoadingState({
        title: 'Saving results...',
        subtitle: 'Storing analysis in database',
        progress: 90
      });

      // Save to database (optional, continue even if it fails)
      try {
        await DatabaseService.createCandidates(analysisResults);
      } catch (dbError) {
        console.warn('Database save failed, continuing with local data:', dbError);
      }

      // Update state with results
      setCandidates(analysisResults);
      setShowResults(true);

      setLoadingState({
        title: 'Analysis complete!',
        subtitle: `Successfully analyzed ${analysisResults.length} candidate${analysisResults.length > 1 ? 's' : ''}`,
        progress: 100
      });

      // Show completion state briefly before hiding overlay
      setTimeout(() => {
        setIsAnalyzing(false);
      }, 1500);

    } catch (error) {
      console.error('Analysis error:', error);
      setIsAnalyzing(false);
      
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred during analysis.';
      alert(`Analysis Failed: ${errorMessage}\n\nPlease check your internet connection and try again. If the problem persists, verify that your Gemini API key is configuraed correctly.`);
    }
  };

  const parseAIResponse = (aiResponse: string, uploadedFiles: UploadedFile[]): Candidate[] => {
    try {
      // Clean the response to extract JSON
      let cleanedResponse = aiResponse.trim();
      
      // Remove markdown formatting
      cleanedResponse = cleanedResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      
      // Find JSON array boundaries
      const jsonStart = cleanedResponse.indexOf('[');
      const jsonEnd = cleanedResponse.lastIndexOf(']') + 1;
      
      if (jsonStart === -1 || jsonEnd === 0) {
        throw new Error('No valid JSON array found in AI response');
      }
      
      const jsonString = cleanedResponse.substring(jsonStart, jsonEnd);
      let results: any[];
      
      try {
        results = JSON.parse(jsonString);
      } catch (jsonError) {
        console.error('JSON Parse Error:', jsonError);
        console.error('Problematic JSON:', jsonString.substring(0, 500) + '...');
        throw new Error('Invalid JSON format in AI response');
      }
      
      if (!Array.isArray(results)) {
        throw new Error('AI response is not a valid array format');
      }

      if (results.length === 0) {
        throw new Error('AI analysis returned no candidate data');
      }

      // Validate and sanitize results with enhanced error handling
      const validatedResults: Candidate[] = [];
      
      results.forEach((candidate, index) => {
        try {
          const validatedCandidate: Candidate = {
            id: `candidate_${Date.now()}_${index}_${Math.random().toString(36).substr(2, 9)}`,
            candidate_name: validateString(candidate.candidate_name, `Candidate ${index + 1}`),
            contact_info: validateContactInfo(candidate.contact_info),
            skills: validateStringArray(candidate.skills),
            experience_years: validateNumber(candidate.experience_years, 0, 0, 50),
            education: validateString(candidate.education, 'Not specified'),
            certifications: validateStringArray(candidate.certifications),
            notable_companies: validateStringArray(candidate.notable_companies),
            summary: validateString(candidate.summary, 'No summary available'),
            matched_skills: validateStringArray(candidate.matched_skills),
            missing_skills: validateStringArray(candidate.missing_skills),
            match_score: validateNumber(candidate.match_score, 0, 0, 100),
            recommendation: validateString(candidate.recommendation, 'No recommendation provided'),
            is_relevant: candidate.is_relevant !== false,
            issues_detected: validateStringArray(candidate.issues_detected),
            strengths: validateStringArray(candidate.strengths),
            weaknesses: validateStringArray(candidate.weaknesses),
            interview_questions: validateStringArray(candidate.interview_questions),
            salary_range: validateString(candidate.salary_range, 'Not specified'),
            hire_probability: validateNumber(candidate.hire_probability, 0, 0, 1),
            experience_level: getExperienceLevel(validateNumber(candidate.experience_years, 0, 0, 50)),
            skill_diversity: calculateSkillDiversity(validateStringArray(candidate.skills)),
            company_prestige: assessCompanyPrestige(validateStringArray(candidate.notable_companies))
          };
          
          validatedResults.push(validatedCandidate);
        } catch (candidateError) {
          console.warn(`Error processing candidate ${index + 1}:`, candidateError);
          // Continue with other candidates
        }
      });

      if (validatedResults.length === 0) {
        throw new Error('No valid candidates could be processed from AI response');
      }

      return validatedResults;
      
    } catch (error) {
      console.error('Error parsing AI response:', error);
      console.error('Raw AI Response:', aiResponse.substring(0, 1000) + '...');
      throw new Error(`Failed to parse AI results: ${error instanceof Error ? error.message : 'Unknown parsing error'}`);
    }
  };

  // Helper validation methods
  const validateString = (value: any, defaultValue: string): string => {
    if (typeof value === 'string' && value.trim().length > 0) {
      return value.trim();
    }
    return defaultValue;
  };

  const validateStringArray = (value: any): string[] => {
    if (Array.isArray(value)) {
      return value.filter(item => typeof item === 'string' && item.trim().length > 0);
    }
    return [];
  };

  const validateNumber = (value: any, defaultValue: number, min: number, max: number): number => {
    const num = typeof value === 'number' ? value : parseFloat(value);
    if (isNaN(num)) return defaultValue;
    return Math.max(min, Math.min(max, num));
  };

  const validateContactInfo = (value: any): { email: string; phone: string } => {
    if (typeof value === 'object' && value !== null) {
      return {
        email: validateString(value.email, ''),
        phone: validateString(value.phone, '')
      };
    }
    return { email: '', phone: '' };
  };

  const getExperienceLevel = (years: number): string => {
    if (years <= 2) return 'Entry Level';
    if (years <= 7) return 'Mid Level';
    return 'Senior Level';
  };

  const calculateSkillDiversity = (skills: string[]): number => {
    if (skills.length === 0) return 0;
    
    const categories = new Set();
    const skillCategories = {
      programming: ['javascript', 'python', 'java', 'c#', 'c++', 'go', 'rust', 'php', 'ruby', 'swift', 'kotlin'],
      frontend: ['react', 'angular', 'vue', 'html', 'css', 'sass', 'less', 'bootstrap', 'tailwind'],
      backend: ['node', 'express', 'django', 'spring', 'flask', 'laravel', 'rails', 'asp.net'],
      database: ['sql', 'mongodb', 'postgresql', 'mysql', 'redis', 'elasticsearch', 'cassandra'],
      cloud: ['aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform', 'jenkins'],
      mobile: ['ios', 'android', 'react native', 'flutter', 'xamarin'],
      data: ['machine learning', 'ai', 'data science', 'analytics', 'tableau', 'power bi'],
      tools: ['git', 'jira', 'confluence', 'slack', 'figma', 'photoshop']
    };
    
    skills.forEach(skill => {
      const lowerSkill = skill.toLowerCase();
      Object.entries(skillCategories).forEach(([category, keywords]) => {
        if (keywords.some(keyword => lowerSkill.includes(keyword))) {
          categories.add(category);
        }
      });
    });
    
    return Math.min(1, categories.size / Object.keys(skillCategories).length);
  };

  const assessCompanyPrestige = (companies: string[]): number => {
    if (companies.length === 0) return 0;
    
    const prestigiousCompanies = [
      'google', 'microsoft', 'amazon', 'apple', 'facebook', 'meta',
      'netflix', 'tesla', 'uber', 'airbnb', 'spotify', 'stripe',
      'salesforce', 'oracle', 'ibm', 'intel', 'nvidia', 'adobe',
      'twitter', 'linkedin', 'dropbox', 'slack', 'zoom', 'shopify'
    ];
    
    const prestigeScore = companies.filter(company => 
      prestigiousCompanies.some(prestigious => 
        company.toLowerCase().includes(prestigious)
      )
    ).length;
    
    return Math.min(1, prestigeScore / Math.max(1, companies.length));
  };

  // Calculate statistics
  const stats = {
    totalCandidates: candidates.length,
    relevantCandidates: candidates.filter(c => c.is_relevant).length,
    averageScore: candidates.length > 0 
      ? Math.round(candidates.reduce((sum, c) => sum + c.match_score, 0) / candidates.length)
      : 0,
    topCandidates: candidates.filter(c => c.match_score >= 80).length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-emerald-900 dark:to-teal-900 relative overflow-hidden transition-all duration-500 text-gray-900 dark:text-white">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-emerald-900 dark:to-teal-900 relative overflow-hidden transition-all duration-500">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 dark:bg-emerald-500/20 rounded-full blur-3xl floating-element" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 dark:bg-teal-500/20 rounded-full blur-3xl floating-element" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/5 dark:bg-emerald-500/10 rounded-full blur-3xl floating-element" style={{ animationDelay: '4s' }} />
        </div>

        {/* Main Content */}
        <div className="relative z-10">
          <Header />
          
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route 
              path="/upload" 
              element={
                <UploadPage
                  jobDescription={jobDescription}
                  onJobDescriptionChange={setJobDescription}
                  files={uploadedFiles}
                  onFilesChange={setUploadedFiles}
                  onAnalyze={analyzeResumes}
                  isAnalyzing={isAnalyzing}
                  onNavigateToResults={navigateToResults}
                />
              } 
            />
            <Route 
              path="/results" 
              element={
                showResults ? (
                  <ResultsPage
                    candidates={candidates}
                    stats={stats}
                  />
                ) : (
                  <Navigate to="/upload" replace />
                )
              } 
            />
            <Route 
              path="/analytics" 
              element={
                <AnalyticsPage
                  candidates={candidates}
                  stats={stats}
                />
              } 
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>

        {/* Loading Overlay */}
        <LoadingOverlay
          isVisible={isAnalyzing}
          title={loadingState.title}
          subtitle={loadingState.subtitle}
          progress={loadingState.progress}
        />
      </div>
    </div>
  );
}

export default App;