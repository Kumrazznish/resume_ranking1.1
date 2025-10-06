import { useState } from 'react';
import { X, Mail, Phone, Building, Award, Target, Lightbulb } from 'lucide-react';
import { Candidate } from '../types';

interface CandidateModalProps {
  candidate: Candidate;
  isOpen: boolean;
  onClose: () => void;
}

export function CandidateModal({ candidate, isOpen, onClose }: CandidateModalProps) {
  const [activeTab, setActiveTab] = useState('overview');

  if (!isOpen) return null;

  const getMatchCategory = (score: number) => {
    if (score >= 90) return { category: 'excellent', color: 'text-green-600', bgColor: 'bg-green-50' };
    if (score >= 75) return { category: 'strong', color: 'text-blue-600', bgColor: 'bg-blue-50' };
    if (score >= 50) return { category: 'moderate', color: 'text-yellow-600', bgColor: 'bg-yellow-50' };
    return { category: 'weak', color: 'text-red-600', bgColor: 'bg-red-50' };
  };

  const { color, bgColor } = getMatchCategory(candidate.match_score);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Target },
    { id: 'skills', label: 'Skills Analysis', icon: Award },
    { id: 'experience', label: 'Experience', icon: Building },
    { id: 'insights', label: 'AI Insights', icon: Lightbulb }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" onClick={onClose}>
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-black bg-opacity-75" />
        
        <div
          className="inline-block w-full max-w-6xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-800 shadow-2xl rounded-3xl border border-gray-200 dark:border-gray-700"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex justify-between items-center pb-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-4">
              <div className={`w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg`}>
                {candidate.match_score}%
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {candidate.candidate_name}
                </h2>
                <p className="text-gray-600 dark:text-gray-300">Detailed Candidate Analysis</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 dark:border-gray-700 mt-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-3 text-sm font-medium transition-colors relative ${
                    activeTab === tab.id
                      ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className="mt-6 max-h-96 overflow-y-auto">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Contact & Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 border border-gray-200 dark:border-gray-600">
                    <h3 className="font-semibold text-gray-800 dark:text-white mb-3 flex items-center">
                      <Phone className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                      Contact Information
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                        <span className="text-gray-700 dark:text-gray-300">{candidate.contact_info.email || 'Not provided'}</span>
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                        <span className="text-gray-700 dark:text-gray-300">{candidate.contact_info.phone || 'Not provided'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 border border-gray-200 dark:border-gray-600">
                    <h3 className="font-semibold text-gray-800 dark:text-white mb-3">
                      📊 Scoring Metrics
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-700 dark:text-gray-300">Match Score:</span>
                        <span className="font-bold text-blue-600 dark:text-blue-400">{candidate.match_score}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700 dark:text-gray-300">Hire Probability:</span>
                        <span className="font-bold text-green-600 dark:text-green-400">{Math.round((candidate.hire_probability || 0) * 100)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700 dark:text-gray-300">Skill Diversity:</span>
                        <span className="font-bold text-gray-900 dark:text-white">{Math.round((candidate.skill_diversity || 0) * 100)}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 border border-gray-200 dark:border-gray-600">
                    <h3 className="font-semibold text-gray-800 dark:text-white mb-3">
                      🏢 Professional Profile
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-700 dark:text-gray-300">Experience:</span>
                        <span className="font-bold text-gray-900 dark:text-white">{candidate.experience_years} years</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700 dark:text-gray-300">Education:</span>
                        <span className="font-bold text-gray-900 dark:text-white truncate">{candidate.education}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700 dark:text-gray-300">Company Prestige:</span>
                        <span className="font-bold text-gray-900 dark:text-white">{Math.round((candidate.company_prestige || 0) * 100)}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Summary */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 border-l-4 border-blue-500 dark:border-blue-400">
                  <h3 className="font-semibold text-gray-800 dark:text-white mb-3">
                    📝 Professional Summary
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {candidate.summary}
                  </p>
                </div>

                {/* Notable Companies */}
                {candidate.notable_companies.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-white mb-3">
                      🏆 Notable Companies
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {candidate.notable_companies.map((company) => (
                        <div
                          key={company}
                          className="bg-gradient-to-br from-blue-500 to-purple-600 text-white p-3 rounded-xl text-center font-semibold shadow-lg"
                        >
                          {company}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Certifications */}
                {candidate.certifications.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-white mb-3">
                      🎓 Certifications & Credentials
                    </h3>
                    <div className="space-y-2">
                      {candidate.certifications.map((cert) => (
                        <div
                          key={cert}
                          className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border-l-4 border-green-500 dark:border-green-400 flex items-center"
                        >
                          <Award className="h-5 w-5 text-green-600 dark:text-green-400 mr-3" />
                          <span className="font-medium text-gray-800 dark:text-white">{cert}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Skills Tab */}
            {activeTab === 'skills' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Matched Skills */}
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 border-2 border-green-200 dark:border-green-700/50">
                    <h3 className="font-semibold text-green-800 dark:text-green-300 mb-4 flex items-center">
                      <span className="text-xl mr-2">✅</span>
                      Matched Skills ({candidate.matched_skills.length})
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {candidate.matched_skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-3 py-1 bg-green-200 dark:bg-green-800/50 text-green-800 dark:text-green-200 rounded-full text-sm font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                      {candidate.matched_skills.length === 0 && (
                        <p className="text-green-700 dark:text-green-300 italic">No specific skill matches identified</p>
                      )}
                    </div>
                  </div>

                  {/* Missing Skills */}
                  <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-6 border-2 border-red-200 dark:border-red-700/50">
                    <h3 className="font-semibold text-red-800 dark:text-red-300 mb-4 flex items-center">
                      <span className="text-xl mr-2">❌</span>
                      Missing Skills ({candidate.missing_skills.length})
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {candidate.missing_skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-3 py-1 bg-red-200 dark:bg-red-800/50 text-red-800 dark:text-red-200 rounded-full text-sm font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                      {candidate.missing_skills.length === 0 && (
                        <p className="text-red-700 dark:text-red-300 italic">No critical missing skills identified</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* All Skills */}
                <div className="bg-white dark:bg-gray-700/50 rounded-xl p-6 border border-gray-200 dark:border-gray-600 shadow-sm">
                  <h3 className="font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                    <span className="text-xl mr-2">🛠️</span>
                    Complete Skill Portfolio ({candidate.skills.length})
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {candidate.skills.map((skill) => {
                      const isMatched = candidate.matched_skills.includes(skill);
                      const isMissing = candidate.missing_skills.includes(skill);
                      
                      let bgColor = 'bg-blue-100 dark:bg-blue-800/50 text-blue-800 dark:text-blue-200';
                      if (isMatched) bgColor = 'bg-green-100 dark:bg-green-800/50 text-green-800 dark:text-green-200';
                      else if (isMissing) bgColor = 'bg-red-100 dark:bg-red-800/50 text-red-800 dark:text-red-200';

                      return (
                        <span
                          key={skill}
                          className={`px-3 py-1 rounded-full text-sm font-medium ${bgColor}`}
                        >
                          {skill}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Skill Analysis Insights */}
                <div className="bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800/50 dark:to-blue-900/20 rounded-xl p-6 border border-gray-200 dark:border-gray-600">
                  <h3 className="font-semibold text-gray-800 dark:text-white mb-4">
                    📈 Skill Analysis Insights
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-white dark:bg-gray-700/50 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {Math.round((candidate.matched_skills.length / Math.max(1, candidate.skills.length)) * 100)}%
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">Match Rate</div>
                    </div>
                    <div className="text-center p-4 bg-white dark:bg-gray-700/50 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {Math.round((candidate.skill_diversity || 0) * 100)}%
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">Skill Diversity</div>
                    </div>
                    <div className="text-center p-4 bg-white dark:bg-gray-700/50 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600">
                      <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                        {candidate.missing_skills.length}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">Skills to Develop</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Experience Tab */}
            {activeTab === 'experience' && (
              <div className="space-y-6">
                {/* Experience Overview */}
                <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-xl p-6">
                  <h3 className="font-semibold mb-4 text-lg text-white">
                    📊 Experience Overview
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-xl">
                      <div className="text-2xl font-bold text-white">{candidate.experience_years}</div>
                      <div className="text-sm opacity-90 text-white">Years Experience</div>
                    </div>
                    <div className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-xl">
                      <div className="text-2xl font-bold text-white">{candidate.match_score}%</div>
                      <div className="text-sm opacity-90 text-white">Job Match</div>
                    </div>
                    <div className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-xl">
                      <div className="text-2xl font-bold text-white">{Math.round((candidate.hire_probability || 0) * 100)}%</div>
                      <div className="text-sm opacity-90 text-white">Hire Probability</div>
                    </div>
                    <div className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-xl">
                      <div className="text-2xl font-bold text-white">{Math.round((candidate.company_prestige || 0) * 100)}%</div>
                      <div className="text-sm opacity-90 text-white">Company Prestige</div>
                    </div>
                  </div>
                </div>

                {/* Experience Level Analysis */}
                <div className="bg-white dark:bg-gray-700/50 rounded-xl p-6 border border-gray-200 dark:border-gray-600 shadow-sm">
                  <h3 className="font-semibold text-gray-800 dark:text-white mb-4">
                    🎯 Experience Level Assessment
                  </h3>
                  <div className="flex items-center space-x-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border-l-4 border-blue-500 dark:border-blue-400">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                      {candidate.experience_years}Y
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800 dark:text-white text-lg">
                        {candidate.experience_level}
                      </div>
                      <div className="text-gray-600 dark:text-gray-300">
                        {candidate.experience_years <= 2 
                          ? "Fresh graduate or entry-level professional with minimal industry experience."
                          : candidate.experience_years <= 7
                          ? "Mid-level professional with solid hands-on experience and growing expertise."
                          : "Senior professional with extensive experience and proven track record."
                        }
                      </div>
                    </div>
                  </div>
                </div>

                {/* Company Experience */}
                {candidate.notable_companies.length > 0 && (
                  <div className="bg-white dark:bg-gray-700/50 rounded-xl p-6 border border-gray-200 dark:border-gray-600 shadow-sm">
                    <h3 className="font-semibold text-gray-800 dark:text-white mb-4">
                      🏢 Professional Background
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Experience with industry-leading organizations:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {candidate.notable_companies.map((company, idx) => (
                        <div
                          key={company}
                          className="bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-700/50 dark:to-blue-900/20 p-4 rounded-xl text-center border-2 border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 transition-colors"
                        >
                          <div className="text-2xl mb-2">🏢</div>
                          <div className="font-semibold text-gray-800 dark:text-white">{company}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Notable Company</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* AI Insights Tab */}
            {activeTab === 'insights' && (
              <div className="space-y-6">
                {/* AI Recommendation */}
                <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-xl p-6 shadow-lg">
                  <h3 className="font-semibold mb-4 text-lg flex items-center text-white">
                    <span className="text-2xl mr-2">🤖</span>
                    AI Recommendation
                  </h3>
                  <p className="text-lg leading-relaxed font-medium text-white">
                    {candidate.recommendation}
                  </p>
                </div>

                {/* Assessment Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className={`rounded-xl p-6 ${candidate.is_relevant ? 'bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-700/50' : 'bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-700/50'}`}>
                    <h4 className={`font-semibold mb-2 flex items-center ${candidate.is_relevant ? 'text-green-800 dark:text-green-300' : 'text-red-800 dark:text-red-300'}`}>
                      <span className="text-xl mr-2">{candidate.is_relevant ? '✅' : '❌'}</span>
                      Relevance Assessment
                    </h4>
                    <p className={`font-semibold text-lg ${candidate.is_relevant ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'}`}>
                      {candidate.is_relevant ? 'RELEVANT for this position' : 'NOT RELEVANT for this position'}
                    </p>
                    <p className={`text-sm opacity-80 mt-1 ${candidate.is_relevant ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
                      Based on comprehensive skill and experience analysis
                    </p>
                  </div>

                  <div className={`rounded-xl p-6 bg-gray-50 dark:bg-gray-700/50 border-2 border-gray-200 dark:border-gray-600`}>
                    <h4 className="font-semibold mb-2 flex items-center text-gray-800 dark:text-white">
                      <span className="text-xl mr-2">🎯</span>
                      Match Assessment
                    </h4>
                    <p className={`font-bold text-lg ${color}`}>
                      {candidate.match_score >= 90 ? 'EXCELLENT MATCH' :
                       candidate.match_score >= 75 ? 'STRONG MATCH' :
                       candidate.match_score >= 50 ? 'MODERATE MATCH' : 'WEAK MATCH'}
                    </p>
                    <p className={`text-lg font-semibold mt-1 ${color}`}>
                      {candidate.match_score}% Match Score
                    </p>
                  </div>
                </div>

                {/* Strengths and Weaknesses */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {candidate.strengths.length > 0 && (
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 border-l-4 border-green-500 dark:border-green-400">
                      <h4 className="font-semibold text-green-800 dark:text-green-300 mb-3 flex items-center">
                        <span className="text-xl mr-2">💪</span>
                        Key Strengths
                      </h4>
                      <ul className="space-y-2">
                        {candidate.strengths.map((strength, idx) => (
                          <li key={idx} className="text-green-700 dark:text-green-300 font-medium flex items-start">
                            <span className="mr-2 mt-1 text-green-500 dark:text-green-400">•</span>
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {candidate.weaknesses.length > 0 && (
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-6 border-l-4 border-yellow-500 dark:border-yellow-400">
                      <h4 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-3 flex items-center">
                        <span className="text-xl mr-2">⚠️</span>
                        Areas for Development
                      </h4>
                      <ul className="space-y-2">
                        {candidate.weaknesses.map((weakness, idx) => (
                          <li key={idx} className="text-yellow-700 dark:text-yellow-300 font-medium flex items-start">
                            <span className="mr-2 mt-1 text-yellow-500 dark:text-yellow-400">•</span>
                            {weakness}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Interview Questions */}
                {candidate.interview_questions.length > 0 && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border-l-4 border-blue-500 dark:border-blue-400">
                    <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-4 flex items-center">
                      <span className="text-xl mr-2">❓</span>
                      Suggested Interview Questions
                    </h4>
                    <div className="space-y-3">
                      {candidate.interview_questions.map((question, idx) => (
                        <div key={idx} className="bg-white dark:bg-gray-700/50 p-4 rounded-lg border-l-4 border-blue-300 dark:border-blue-500">
                          <span className="font-semibold text-blue-600 dark:text-blue-400 mr-2">Q{idx + 1}:</span>
                          <span className="text-gray-800 dark:text-white">{question}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Issues */}
                {candidate.issues_detected.length > 0 && (
                  <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-6 border-l-4 border-red-500 dark:border-red-400">
                    <h4 className="font-semibold text-red-800 dark:text-red-300 mb-3 flex items-center">
                      <span className="text-xl mr-2">🚨</span>
                      Issues & Concerns
                    </h4>
                    <ul className="space-y-2">
                      {candidate.issues_detected.map((issue, idx) => (
                        <li key={idx} className="text-red-700 dark:text-red-300 font-medium flex items-start">
                          <span className="mr-2 mt-1 text-red-500 dark:text-red-400">•</span>
                          {issue}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Hiring Recommendation */}
                <div className="bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800/50 dark:to-blue-900/20 rounded-xl p-6 border border-gray-200 dark:border-gray-600">
                  <h4 className="font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                    <span className="text-xl mr-2">📋</span>
                    Comprehensive Hiring Recommendation
                  </h4>
                  <div className="space-y-3">
                    {candidate.match_score >= 90 && (
                      <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-lg border-l-4 border-green-500 dark:border-green-400">
                        <strong className="text-green-800 dark:text-green-300">🟢 STRONGLY RECOMMEND:</strong>
                        <span className="text-green-700 dark:text-green-300"> Exceptional candidate - fast-track to final interview</span>
                      </div>
                    )}
                    {candidate.match_score >= 80 && candidate.match_score < 90 && (
                      <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg border-l-4 border-blue-500 dark:border-blue-400">
                        <strong className="text-blue-800 dark:text-blue-300">🔵 RECOMMEND:</strong>
                        <span className="text-blue-700 dark:text-blue-300"> Strong candidate - schedule interview promptly</span>
                      </div>
                    )}
                    {candidate.match_score >= 65 && candidate.match_score < 80 && (
                      <div className="bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded-lg border-l-4 border-yellow-500 dark:border-yellow-400">
                        <strong className="text-yellow-800 dark:text-yellow-300">🟡 CONSIDER:</strong>
                        <span className="text-yellow-700 dark:text-yellow-300"> Moderate fit - interview if pipeline allows</span>
                      </div>
                    )}
                    {candidate.match_score < 65 && (
                      <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-lg border-l-4 border-red-500 dark:border-red-400">
                        <strong className="text-red-800 dark:text-red-300">🔴 NOT RECOMMENDED:</strong>
                        <span className="text-red-700 dark:text-red-300"> Poor fit for current requirements</span>
                      </div>
                    )}

                    {candidate.experience_years < 2 && (
                      <p className="text-gray-700 dark:text-gray-300">
                        📚 <strong>Mentoring Required:</strong> Plan for additional training and close supervision
                      </p>
                    )}
                    {candidate.experience_years > 10 && (
                      <p className="text-gray-700 dark:text-gray-300">
                        👨‍🏫 <strong>Leadership Potential:</strong> Consider for senior roles or mentoring responsibilities
                      </p>
                    )}
                    {candidate.company_prestige > 0.7 && (
                      <p className="text-gray-700 dark:text-gray-300">
                        🏆 <strong>Premium Background:</strong> Strong company experience adds significant value
                      </p>
                    )}
                    {candidate.certifications.length > 0 && (
                      <p className="text-gray-700 dark:text-gray-300">
                        🎖️ <strong>Certified Professional:</strong> {candidate.certifications.length} relevant certifications demonstrate commitment
                      </p>
                    )}
                    {candidate.hire_probability > 0.8 && (
                      <p className="text-gray-700 dark:text-gray-300">
                        📊 <strong>High Success Probability:</strong> AI analysis indicates excellent hiring potential
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}