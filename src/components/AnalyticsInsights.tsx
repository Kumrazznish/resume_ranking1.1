import { Brain, TrendingUp, Users, Award, AlertTriangle, CheckCircle, Info, Star, Target, Activity } from 'lucide-react';
import { Candidate } from '../types';

interface AnalyticsInsightsProps {
  data: any;
  candidates: Candidate[];
  stats: any;
}

export function AnalyticsInsights({ data, candidates, stats }: AnalyticsInsightsProps) {
  if (!data) return null;

  const generateInsights = () => {
    const insights = [];
    
    // Quality insights
    if (stats.averageScore >= 80) {
      insights.push({
        type: 'success',
        icon: CheckCircle,
        title: 'High Quality Candidate Pool',
        description: `Your candidate pool shows exceptional quality with an average score of ${stats.averageScore}%. This indicates strong alignment with job requirements.`
      });
    } else if (stats.averageScore < 60) {
      insights.push({
        type: 'warning',
        icon: AlertTriangle,
        title: 'Consider Expanding Search',
        description: `Average score of ${stats.averageScore}% suggests the current candidate pool may not fully meet requirements. Consider broadening search criteria.`
      });
    }

    // Experience insights
    const seniorCount = candidates.filter(c => c.experience_years >= 8).length;
    const seniorPercentage = Math.round((seniorCount / candidates.length) * 100);
    
    if (seniorPercentage > 60) {
      insights.push({
        type: 'info',
        icon: Users,
        title: 'Senior-Heavy Pool',
        description: `${seniorPercentage}% of candidates are senior level. Consider if this aligns with your budget and role requirements.`
      });
    }

    // Skills insights
    const topSkill = data.skillsAnalysis[0];
    if (topSkill && topSkill.matchRate < 50) {
      insights.push({
        type: 'warning',
        icon: TrendingUp,
        title: 'Skill Gap Identified',
        description: `${topSkill.skill} appears in many resumes but has low match rate (${topSkill.matchRate}%). Consider if this skill is critical for the role.`
      });
    }

    // Hiring recommendations
    if (data.hiringRecommendations.immediate > 0) {
      insights.push({
        type: 'success',
        icon: Award,
        title: 'Immediate Hiring Opportunities',
        description: `${data.hiringRecommendations.immediate} candidate${data.hiringRecommendations.immediate > 1 ? 's' : ''} scored 90%+ and should be prioritized for immediate interviews.`
      });
    }

    return insights;
  };

  const insights = generateInsights();

  return (
    <div className="space-y-8">
      {/* AI Insights */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 dark:from-purple-500 dark:to-indigo-500 rounded-xl flex items-center justify-center mr-4 shadow-lg">
            <Brain className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">AI-Generated Insights</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">Intelligent analysis of your candidate pool</p>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          {insights.map((insight, index) => {
            const Icon = insight.icon;
            const colorClasses = {
              success: 'border-emerald-200 dark:border-emerald-700/50 bg-emerald-50 dark:bg-emerald-900/20',
              warning: 'border-amber-200 dark:border-amber-700/50 bg-amber-50 dark:bg-amber-900/20',
              info: 'border-blue-200 dark:border-blue-700/50 bg-blue-50 dark:bg-blue-900/20'
            };
            
            const iconColors = {
              success: 'text-emerald-600 dark:text-emerald-400',
              warning: 'text-amber-600 dark:text-amber-400',
              info: 'text-blue-600 dark:text-blue-400'
            };
            
            return (
              <div key={index} className={`p-5 rounded-2xl border ${colorClasses[insight.type as keyof typeof colorClasses]} hover:scale-[1.02] transition-all duration-200`}>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <Icon className={`h-6 w-6 ${iconColors[insight.type as keyof typeof iconColors]}`} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white mb-2 text-lg">{insight.title}</h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{insight.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Hiring Recommendations */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-amber-600 to-orange-600 dark:from-amber-500 dark:to-orange-500 rounded-xl flex items-center justify-center mr-4 shadow-lg">
            <Award className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Hiring Recommendations</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">Actionable hiring insights based on AI analysis</p>
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-emerald-50 to-green-100 dark:from-emerald-900/20 dark:to-green-800/20 rounded-2xl p-6 border border-emerald-200 dark:border-emerald-700/50 text-center hover:scale-105 transition-all duration-200">
            <div className="w-16 h-16 bg-emerald-600 dark:bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <CheckCircle className="h-8 w-8 text-white" />
            </div>
            <div className="text-3xl font-bold text-emerald-900 dark:text-emerald-100 mb-2">
              {data.hiringRecommendations.immediate}
            </div>
            <div className="text-emerald-700 dark:text-emerald-300 font-semibold mb-2">Immediate Hire</div>
            <div className="text-sm text-emerald-600 dark:text-emerald-400">90%+ match score</div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-800/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-700/50 text-center hover:scale-105 transition-all duration-200">
            <div className="w-16 h-16 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Star className="h-8 w-8 text-white" />
            </div>
            <div className="text-3xl font-bold text-blue-900 dark:text-blue-100 mb-2">
              {data.hiringRecommendations.shortlist}
            </div>
            <div className="text-blue-700 dark:text-blue-300 font-semibold mb-2">Shortlist</div>
            <div className="text-sm text-blue-600 dark:text-blue-400">80-89% match score</div>
          </div>
          
          <div className="bg-gradient-to-br from-amber-50 to-yellow-100 dark:from-amber-900/20 dark:to-yellow-800/20 rounded-2xl p-6 border border-amber-200 dark:border-amber-700/50 text-center hover:scale-105 transition-all duration-200">
            <div className="w-16 h-16 bg-amber-600 dark:bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Target className="h-8 w-8 text-white" />
            </div>
            <div className="text-3xl font-bold text-amber-900 dark:text-amber-100 mb-2">
              {data.hiringRecommendations.consider}
            </div>
            <div className="text-amber-700 dark:text-amber-300 font-semibold mb-2">Consider</div>
            <div className="text-sm text-amber-600 dark:text-amber-400">70-79% match score</div>
          </div>
        </div>

        {data.hiringRecommendations.topCandidate && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-700/50">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                <Award className="h-6 w-6 text-white" />
              </div>
              <h4 className="font-bold text-gray-900 dark:text-white text-lg">🏆 Top Recommended Candidate</h4>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <div className="font-bold text-gray-900 dark:text-white text-xl">
                  {data.hiringRecommendations.topCandidate.candidate_name}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  {data.hiringRecommendations.topCandidate.experience_years} years experience • {data.hiringRecommendations.topCandidate.experience_level}
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {data.hiringRecommendations.topCandidate.match_score}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Match Score</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Market Analysis */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 dark:from-green-500 dark:to-emerald-500 rounded-xl flex items-center justify-center mr-4 shadow-lg">
            <TrendingUp className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Market Competitiveness</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">Comprehensive market analysis of your candidate pool</p>
          </div>
        </div>
        
        <div className="grid md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-800/20 rounded-2xl p-6 border border-green-200 dark:border-green-700/50 text-center hover:scale-105 transition-all duration-200">
            <div className="text-3xl font-bold text-green-900 dark:text-green-100 mb-2">
              {data.competitiveAnalysis.hireProbability}%
            </div>
            <div className="text-sm text-green-600 dark:text-green-300 font-medium mb-3">Avg Hire Probability</div>
            <div className="w-full bg-green-200 dark:bg-green-800/50 rounded-full h-2">
              <div 
                className="h-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${data.competitiveAnalysis.hireProbability}%` }}
              />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-800/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-700/50 text-center hover:scale-105 transition-all duration-200">
            <div className="text-3xl font-bold text-blue-900 dark:text-blue-100 mb-2">
              {data.competitiveAnalysis.skillDiversity}%
            </div>
            <div className="text-sm text-blue-600 dark:text-blue-300 font-medium mb-3">Skill Diversity</div>
            <div className="w-full bg-blue-200 dark:bg-blue-800/50 rounded-full h-2">
              <div 
                className="h-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${data.competitiveAnalysis.skillDiversity}%` }}
              />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-violet-100 dark:from-purple-900/20 dark:to-violet-800/20 rounded-2xl p-6 border border-purple-200 dark:border-purple-700/50 text-center hover:scale-105 transition-all duration-200">
            <div className="text-3xl font-bold text-purple-900 dark:text-purple-100 mb-2">
              {data.competitiveAnalysis.companyPrestige}%
            </div>
            <div className="text-sm text-purple-600 dark:text-purple-300 font-medium mb-3">Company Prestige</div>
            <div className="w-full bg-purple-200 dark:bg-purple-800/50 rounded-full h-2">
              <div 
                className="h-2 bg-gradient-to-r from-purple-500 to-violet-600 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${data.competitiveAnalysis.companyPrestige}%` }}
              />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-900/20 dark:to-orange-800/20 rounded-2xl p-6 border border-amber-200 dark:border-amber-700/50 text-center hover:scale-105 transition-all duration-200">
            <div className="text-3xl font-bold text-amber-900 dark:text-amber-100 mb-2">
              {data.competitiveAnalysis.marketCompetitiveness}%
            </div>
            <div className="text-sm text-amber-600 dark:text-amber-300 font-medium mb-3">Overall Market Fit</div>
            <div className="w-full bg-amber-200 dark:bg-amber-800/50 rounded-full h-2">
              <div 
                className="h-2 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${data.competitiveAnalysis.marketCompetitiveness}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}