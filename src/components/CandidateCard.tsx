import { Eye, Download, Mail, Phone, Send, MapPin, Calendar, Building2, GraduationCap, Award, TrendingUp, Star, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { Candidate } from '../types';

interface CandidateCardProps {
  candidate: Candidate;
  onViewDetails: () => void;
  onSendEmail: () => void;
  index: number;
}

export function CandidateCard({ candidate, onViewDetails, onSendEmail, index }: CandidateCardProps) {
  const getMatchCategory = (score: number) => {
    if (score >= 90) return { 
      category: 'excellent', 
      color: 'from-emerald-500 to-green-600', 
      textColor: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
      borderColor: 'border-emerald-200 dark:border-emerald-700/50'
    };
    if (score >= 75) return { 
      category: 'strong', 
      color: 'from-blue-500 to-indigo-600', 
      textColor: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      borderColor: 'border-blue-200 dark:border-blue-700/50'
    };
    if (score >= 50) return { 
      category: 'moderate', 
      color: 'from-amber-500 to-orange-600', 
      textColor: 'text-amber-600 dark:text-amber-400',
      bgColor: 'bg-amber-50 dark:bg-amber-900/20',
      borderColor: 'border-amber-200 dark:border-amber-700/50'
    };
    return { 
      category: 'weak', 
      color: 'from-red-500 to-pink-600', 
      textColor: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      borderColor: 'border-red-200 dark:border-red-700/50'
    };
  };

  const getMatchLabel = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 75) return 'Strong';
    if (score >= 50) return 'Moderate';
    return 'Weak';
  };

  const { category, color, textColor, bgColor, borderColor } = getMatchCategory(candidate.match_score);
  const matchLabel = getMatchLabel(candidate.match_score);

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 group overflow-hidden"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Header with gradient bar */}
      <div className={`h-2 bg-gradient-to-r ${color}`} />
      
      <div className="p-6">
        {/* Candidate Header */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-full flex items-center justify-center">
                <span className="text-lg font-bold text-gray-600 dark:text-gray-300">
                  {candidate.candidate_name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                </span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                  {candidate.candidate_name}
                </h3>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 space-x-2">
                  <span className="font-medium">{candidate.experience_level}</span>
                  <span>•</span>
                  <span>{candidate.experience_years} years</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-2 text-sm">
              {candidate.contact_info.email && (
                <div className="flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">
                  <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="truncate">{candidate.contact_info.email}</span>
                </div>
              )}
              {candidate.contact_info.phone && (
                <div className="flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">
                  <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span>{candidate.contact_info.phone}</span>
                </div>
              )}
            </div>
          </div>

          {/* Score Circle */}
          <div className="text-center ml-4">
            <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${color} flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-all duration-300 relative`}>
              <span>{candidate.match_score}%</span>
              <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div className={`text-xs font-bold mt-2 ${textColor}`}>
              {matchLabel.toUpperCase()}
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="mb-6">
          <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed line-clamp-3">
            {candidate.summary}
          </p>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className={`${bgColor} ${borderColor} rounded-xl p-4 border transition-all duration-200 hover:scale-105`}>
            <div className="flex items-center space-x-2 mb-2">
              <Building2 className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              <div className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Experience
              </div>
            </div>
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              {candidate.experience_years} years
            </div>
          </div>
          
          <div className={`${bgColor} ${borderColor} rounded-xl p-4 border transition-all duration-200 hover:scale-105`}>
            <div className="flex items-center space-x-2 mb-2">
              <GraduationCap className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              <div className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Education
              </div>
            </div>
            <div className="text-sm font-bold text-gray-900 dark:text-white truncate">
              {candidate.education}
            </div>
          </div>
          
          <div className={`${bgColor} ${borderColor} rounded-xl p-4 border transition-all duration-200 hover:scale-105`}>
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              <div className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Hire Probability
              </div>
            </div>
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              {Math.round((candidate.hire_probability || 0) * 100)}%
            </div>
          </div>
          
          <div className={`${bgColor} ${borderColor} rounded-xl p-4 border transition-all duration-200 hover:scale-105`}>
            <div className="flex items-center space-x-2 mb-2">
              <Star className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              <div className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Skill Diversity
              </div>
            </div>
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              {Math.round((candidate.skill_diversity || 0) * 100)}%
            </div>
          </div>
        </div>

        {/* Skills Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center">
              <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
              Matched Skills ({candidate.matched_skills.length})
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {candidate.matched_skills.slice(0, 4).map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-700/50 transition-all duration-300 hover:scale-105"
              >
                {skill}
              </span>
            ))}
            {candidate.matched_skills.length > 4 && (
              <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600">
                +{candidate.matched_skills.length - 4} more
              </span>
            )}
            {candidate.matched_skills.length === 0 && (
              <span className="text-xs text-gray-500 dark:text-gray-400 italic">
                No specific matches found
              </span>
            )}
          </div>

          {/* Missing Skills */}
          {candidate.missing_skills.length > 0 && (
            <>
              <div className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                <AlertCircle className="h-4 w-4 mr-2 text-red-500" />
                Missing Skills ({candidate.missing_skills.length})
              </div>
              <div className="flex flex-wrap gap-2">
                {candidate.missing_skills.slice(0, 3).map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-700/50 transition-all duration-300 hover:scale-105"
                  >
                    {skill}
                  </span>
                ))}
                {candidate.missing_skills.length > 3 && (
                  <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600">
                    +{candidate.missing_skills.length - 3} more
                  </span>
                )}
              </div>
            </>
          )}
        </div>

        {/* AI Recommendation */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 mb-6 border border-blue-200 dark:border-blue-700/50">
          <div className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center mb-2">
            <Award className="h-4 w-4 mr-2 text-blue-500" />
            AI Recommendation
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 leading-relaxed">
            {candidate.recommendation}
          </p>
        </div>

        {/* Salary Range */}
        {candidate.salary_range && candidate.salary_range !== 'Not specified' && (
          <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 mb-6 border border-green-200 dark:border-green-700/50">
            <div className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center">
              <TrendingUp className="h-4 w-4 mr-2 text-green-500" />
              Expected Salary: {candidate.salary_range}
            </div>
          </div>
        )}

        {/* Issues */}
        {candidate.issues_detected.length > 0 && (
          <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 mb-6 border border-red-200 dark:border-red-700/50">
            <div className="text-sm font-bold text-red-700 dark:text-red-400 mb-2 flex items-center">
              <AlertCircle className="h-4 w-4 mr-2" />
              Issues Detected
            </div>
            <ul className="text-sm text-red-600 dark:text-red-400 list-disc list-inside space-y-1">
              {candidate.issues_detected.slice(0, 2).map((issue, index) => (
                <li key={index}>{issue}</li>
              ))}
              {candidate.issues_detected.length > 2 && (
                <li>+{candidate.issues_detected.length - 2} more issues</li>
              )}
            </ul>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-3 pt-2">
          <button
            onClick={onViewDetails}
            className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 group"
          >
            <Eye className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
            <span className="hidden sm:inline">View Analysis</span>
            <span className="sm:hidden">View</span>
          </button>
          
          {candidate.contact_info.email && (
            <button
              onClick={onSendEmail}
              className="flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 group"
              title="Send Interview Email"
            >
              <Send className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
              <span className="hidden sm:inline">Email</span>
            </button>
          )}
          
          <button className="flex items-center justify-center px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 group">
            <Download className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
          </button>
        </div>
      </div>
    </div>
  );
}