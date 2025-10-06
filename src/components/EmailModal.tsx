import { useState } from 'react';
import { X, Mail, Copy, Send, Eye, CheckCircle, AlertCircle } from 'lucide-react';
import { Candidate } from '../types';
import { EmailService, EmailTemplate } from '../services/emailService';

interface EmailModalProps {
  candidate: Candidate;
  isOpen: boolean;
  onClose: () => void;
  jobTitle?: string;
}

export function EmailModal({ candidate, isOpen, onClose, jobTitle }: EmailModalProps) {
  const [emailTemplate, setEmailTemplate] = useState<EmailTemplate | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);

  if (!isOpen) return null;

  const generateEmail = () => {
    setIsLoading(true);
    setTimeout(() => {
      const template = EmailService.generateEmailPreview(candidate, jobTitle);
      setEmailTemplate(template);
      setIsLoading(false);
    }, 1000);
  };

  const handleSendEmail = async () => {
    if (!candidate.contact_info.email) {
      alert('No email address available for this candidate.');
      return;
    }

    const success = await EmailService.sendInterviewEmail(candidate, jobTitle);
    if (success) {
      setSendSuccess(true);
      setTimeout(() => {
        setSendSuccess(false);
        onClose();
      }, 2000);
    }
  };

  const handleCopyEmail = async () => {
    const success = await EmailService.copyEmailToClipboard(candidate, jobTitle);
    if (success) {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const isValidEmail = EmailService.validateEmailAddress(candidate.contact_info.email || '');

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" onClick={onClose}>
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-black/75 backdrop-blur-sm" />
        
        <div
          className="inline-block w-full max-w-4xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-800 shadow-2xl rounded-3xl border border-gray-200 dark:border-gray-700"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex justify-between items-center pb-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 dark:from-emerald-500 dark:to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Mail className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  AI Interview Email Generator
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Generate personalized interview invitation for {candidate.candidate_name}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Candidate Info */}
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-500/10 dark:to-purple-500/10 rounded-2xl border border-blue-200 dark:border-blue-500/30">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                  {candidate.candidate_name}
                </h3>
                <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300 mt-1">
                  <span>Match Score: {candidate.match_score}%</span>
                  <span>•</span>
                  <span>{candidate.experience_years} years experience</span>
                  <span>•</span>
                  <span>{candidate.experience_level}</span>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-sm font-medium ${isValidEmail ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {candidate.contact_info.email ? (
                    <div className="flex items-center">
                      {isValidEmail ? <CheckCircle className="h-4 w-4 mr-1" /> : <AlertCircle className="h-4 w-4 mr-1" />}
                      {EmailService.formatEmailForDisplay(candidate.contact_info.email)}
                    </div>
                  ) : (
                    <div className="flex items-center text-red-600 dark:text-red-400">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      No email available
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Email Generation */}
          {!emailTemplate ? (
            <div className="mt-8 text-center py-12">
              {isLoading ? (
                <div className="space-y-4">
                  <div className="w-16 h-16 border-4 border-blue-200 dark:border-blue-500/30 border-t-blue-600 dark:border-t-emerald-500 rounded-full animate-spin mx-auto" />
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                    Generating AI-Powered Email...
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Analyzing candidate profile and creating personalized interview invitation
                  </p>
                  <div className="flex justify-center space-x-2 mt-4">
                    {[0, 1, 2, 3, 4].map((step) => (
                      <div
                        key={step}
                        className="w-2 h-2 rounded-full bg-blue-500 dark:bg-emerald-500 animate-pulse"
                        style={{ animationDelay: `${step * 0.2}s` }}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 dark:from-emerald-500 dark:to-teal-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                    <Mail className="h-10 w-10 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                      Ready to Generate Interview Email
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                      Our AI will analyze {candidate.candidate_name}'s profile and create a personalized, 
                      professional interview invitation based on their {candidate.match_score}% match score 
                      and {candidate.experience_years} years of experience.
                    </p>
                  </div>
                  <button
                    onClick={generateEmail}
                    disabled={!isValidEmail}
                    className={`px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg ${
                      isValidEmail
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 dark:from-emerald-600 dark:to-teal-600 hover:from-blue-700 hover:to-purple-700 dark:hover:from-emerald-700 dark:hover:to-teal-700 text-white hover:shadow-xl'
                        : 'bg-gray-400 dark:bg-gray-600 text-gray-600 dark:text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {isValidEmail ? '🤖 Generate AI Email' : '❌ Invalid Email Address'}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="mt-6 space-y-6">
              {/* Email Preview Toggle */}
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                  Generated Email Preview
                </h3>
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl transition-colors text-gray-700 dark:text-gray-300"
                >
                  <Eye className="h-4 w-4" />
                  <span>{showPreview ? 'Hide Preview' : 'Show Preview'}</span>
                </button>
              </div>

              {/* Email Subject */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 border border-gray-200 dark:border-gray-600">
                <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Subject:</div>
                <div className="font-semibold text-gray-800 dark:text-white">{emailTemplate.subject}</div>
              </div>

              {/* Email Body Preview */}
              {showPreview && (
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-600 max-h-96 overflow-y-auto custom-scrollbar">
                  <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-4">Email Body:</div>
                  <div className="prose dark:prose-invert max-w-none">
                    <pre className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300 font-sans leading-relaxed">
                      {emailTemplate.body}
                    </pre>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={handleSendEmail}
                  disabled={!isValidEmail || sendSuccess}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                    sendSuccess
                      ? 'bg-green-500 text-white'
                      : isValidEmail
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 dark:from-emerald-600 dark:to-teal-600 hover:from-blue-700 hover:to-purple-700 dark:hover:from-emerald-700 dark:hover:to-teal-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                      : 'bg-gray-400 dark:bg-gray-600 text-gray-600 dark:text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {sendSuccess ? (
                    <>
                      <CheckCircle className="h-5 w-5" />
                      <span>Email Sent!</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      <span>Send Interview Email</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleCopyEmail}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                    copySuccess
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-600 dark:bg-gray-500 hover:bg-gray-700 dark:hover:bg-gray-400 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                  }`}
                >
                  {copySuccess ? (
                    <>
                      <CheckCircle className="h-5 w-5" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-5 w-5" />
                      <span>Copy to Clipboard</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => {
                    setEmailTemplate(null);
                    setShowPreview(false);
                  }}
                  className="flex items-center space-x-2 px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium transition-colors"
                >
                  <Mail className="h-5 w-5" />
                  <span>Generate New Email</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}