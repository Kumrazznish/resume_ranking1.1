import { useState, useEffect } from 'react';
import { Sparkles, FileText, Clock } from 'lucide-react';
import { DatabaseService } from '../services/database';
import { JobDescription } from '../types';

interface JobDescriptionInputProps {
  value: string;
  onChange: (value: string) => void;
  onJobDescriptionSelect?: (jobDesc: JobDescription) => void;
}

export function JobDescriptionInput({ 
  value, 
  onChange, 
  onJobDescriptionSelect 
}: JobDescriptionInputProps) {
  const [savedJobDescriptions, setSavedJobDescriptions] = useState<JobDescription[]>([]);
  const [showSaved, setShowSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadSavedJobDescriptions();
  }, []);

  const loadSavedJobDescriptions = async () => {
    try {
      setIsLoading(true);
      const jobDescs = await DatabaseService.getJobDescriptions();
      setSavedJobDescriptions(jobDescs.slice(0, 10)); // Show recent 10
    } catch (error) {
      console.error('Failed to load job descriptions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadSampleJobDescription = () => {
    const sampleJobDescription = `Position: Senior Full Stack Developer

Company: TechCorp Solutions
Location: San Francisco, CA (Remote/Hybrid Available)
Employment Type: Full-time
Salary Range: $120,000 - $180,000

ABOUT THE ROLE:
We are seeking a highly skilled Senior Full Stack Developer to join our dynamic engineering team. You will be responsible for designing, developing, and maintaining scalable web applications that serve millions of users worldwide. This role offers the opportunity to work with cutting-edge technologies and make a significant impact on our product development.

KEY RESPONSIBILITIES:
• Design and develop robust, scalable web applications using modern frameworks and technologies
• Collaborate with cross-functional teams including product managers, designers, and other engineers
• Write clean, maintainable, and well-documented code following best practices
• Optimize applications for maximum speed, scalability, and security
• Mentor junior developers and participate in code reviews
• Stay current with emerging technologies and industry trends
• Participate in architectural decisions and technical planning
• Troubleshoot and debug complex technical issues
• Contribute to DevOps practices and CI/CD pipeline improvements

REQUIRED TECHNICAL SKILLS:
• 5+ years of professional experience in full-stack web development
• Expert-level proficiency in JavaScript and TypeScript
• Strong experience with React.js, Next.js, or similar modern frontend frameworks
• Solid backend development experience with Node.js, Express.js, or similar
• Proficiency in database technologies (PostgreSQL, MongoDB, Redis)
• Experience with cloud platforms (AWS, Azure, or Google Cloud Platform)
• Knowledge of containerization technologies (Docker, Kubernetes)
• Familiarity with version control systems (Git) and collaborative development workflows
• Understanding of RESTful APIs and GraphQL
• Experience with testing frameworks (Jest, Cypress, or similar)
• Knowledge of CI/CD pipelines and DevOps practices

PREFERRED QUALIFICATIONS:
• Bachelor's degree in Computer Science, Engineering, or related field
• Experience with microservices architecture and distributed systems
• Knowledge of serverless technologies and functions
• Familiarity with monitoring and logging tools (DataDog, New Relic, ELK Stack)
• Experience with Agile/Scrum development methodologies
• Previous experience in a leadership or mentoring role
• Contributions to open-source projects
• Experience with mobile development (React Native, Flutter) is a plus

SOFT SKILLS & ATTRIBUTES:
• Excellent problem-solving and analytical thinking abilities
• Strong communication skills and ability to work in collaborative environments
• Self-motivated with ability to work independently and manage multiple priorities
• Passion for learning new technologies and continuous improvement
• Attention to detail and commitment to delivering high-quality work
• Experience working in fast-paced, startup-like environments

WHAT WE OFFER:
• Competitive salary and equity package
• Comprehensive health, dental, and vision insurance
• Flexible work arrangements (remote/hybrid options)
• Professional development budget and conference attendance
• State-of-the-art equipment and technology
• Collaborative and inclusive work environment
• Opportunities for career growth and advancement

COMPANY CULTURE:
We value innovation, collaboration, and continuous learning. Our team is passionate about building products that make a difference, and we believe in maintaining a healthy work-life balance while delivering exceptional results.

APPLICATION PROCESS:
Please submit your resume along with a cover letter highlighting your relevant experience and why you're interested in this role. Include links to your portfolio, GitHub profile, or any relevant projects that demonstrate your skills.`;

    onChange(sampleJobDescription);
  };

  const wordCount = value.trim().split(/\s+/).filter(word => word.length > 0).length;
  const charCount = value.length;
  const estimatedReadTime = Math.ceil(wordCount / 200); // Average reading speed

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <FileText className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Job Description</h3>
            <p className="text-sm text-white/70">Provide detailed job requirements for accurate AI matching</p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={loadSampleJobDescription}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 text-sm font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Sparkles className="h-4 w-4" />
            <span>Load Sample</span>
          </button>
          
          {savedJobDescriptions.length > 0 && (
            <button
              type="button"
              onClick={() => setShowSaved(!showSaved)}
              className="flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-xl hover:bg-white/20 transition-all duration-200 text-sm font-medium border border-white/20"
            >
              <Clock className="h-4 w-4" />
              <span>{showSaved ? 'Hide' : 'Recent'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Saved Job Descriptions */}
      {showSaved && (
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 max-h-64 overflow-y-auto custom-scrollbar">
          <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            Recent Job Descriptions
          </h4>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span className="ml-3 text-white/70">Loading...</span>
            </div>
          ) : savedJobDescriptions.length > 0 ? (
            <div className="space-y-3">
              {savedJobDescriptions.map((jobDesc) => (
                <button
                  key={jobDesc.id}
                  onClick={() => {
                    onChange(jobDesc.description);
                    onJobDescriptionSelect?.(jobDesc);
                    setShowSaved(false);
                  }}
                  className="w-full text-left p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:border-white/30 hover:bg-white/10 transition-all duration-200 group"
                >
                  <div className="font-semibold text-white group-hover:text-blue-300 transition-colors">
                    {jobDesc.title}
                  </div>
                  <div className="text-sm text-white/70 mt-1 line-clamp-2">
                    {jobDesc.description.substring(0, 150)}...
                  </div>
                  <div className="flex items-center justify-between mt-3 text-xs text-white/50">
                    <span>{new Date(jobDesc.created_at).toLocaleDateString()}</span>
                    <span>{jobDesc.experience_level} • {jobDesc.salary_range}</span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-white/60">
              <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No saved job descriptions found</p>
            </div>
          )}
        </div>
      )}

      {/* Text Area */}
      <div className="relative">
        <textarea
          id="jobDescription"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste the complete job description here...

Include:
• Job title and company information
• Key responsibilities and duties
• Required technical skills and experience
• Preferred qualifications
• Education requirements
• Salary range and benefits
• Company culture and values

The more detailed your job description, the more accurate the AI analysis will be."
          className="w-full h-64 px-6 py-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-2 border-gray-200 dark:border-gray-600 rounded-2xl resize-vertical transition-all duration-300 focus:border-blue-500 dark:focus:border-emerald-500 focus:ring-4 focus:ring-blue-500/20 dark:focus:ring-emerald-500/20 focus:outline-none text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-base leading-relaxed shadow-lg"
          required
        />
        
        {/* Character/Word Count */}
        <div className="absolute bottom-4 right-6 flex items-center space-x-4 text-xs text-gray-600 dark:text-gray-400 bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm px-3 py-1 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm">
          <span>{wordCount} words</span>
          <span>•</span>
          <span>{charCount} characters</span>
          {wordCount > 0 && (
            <>
              <span>•</span>
              <span>~{estimatedReadTime} min read</span>
            </>
          )}
        </div>
      </div>
      
      {/* Tips */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-500/10 dark:to-purple-500/10 backdrop-blur-sm rounded-2xl p-6 border border-blue-200 dark:border-gray-600 shadow-lg">
        <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
          💡 Tips for Better AI Analysis
        </h4>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-300">
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <span className="text-green-400 mt-0.5">✓</span>
              <span>Include specific technical skills and technologies required</span>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-green-400 mt-0.5">✓</span>
              <span>Specify years of experience and seniority level needed</span>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-green-400 mt-0.5">✓</span>
              <span>Mention education requirements and preferred certifications</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <span className="text-blue-400 mt-0.5">💡</span>
              <span>Add company culture and soft skills for better matching</span>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-blue-400 mt-0.5">💡</span>
              <span>Include salary range and benefits information</span>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-blue-400 mt-0.5">💡</span>
              <span>Describe key responsibilities and project types</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}