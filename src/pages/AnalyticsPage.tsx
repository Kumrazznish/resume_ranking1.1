import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, Award, Target, Brain, PieChart, Activity, Star, CheckCircle, AlertTriangle, Zap } from 'lucide-react';
import { Candidate } from '../types';
import { AnalyticsCharts } from '../components/AnalyticsCharts';
import { AnalyticsInsights } from '../components/AnalyticsInsights';

interface AnalyticsPageProps {
  candidates: Candidate[];
  stats: {
    totalCandidates: number;
    relevantCandidates: number;
    averageScore: number;
    topCandidates: number;
  };
}

export function AnalyticsPage({ candidates, stats }: AnalyticsPageProps) {
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    generateAnalytics();
  }, [candidates]);

  const generateAnalytics = () => {
    setIsLoading(true);
    
    // Simulate processing time for better UX
    setTimeout(() => {
      const analytics = {
        scoreDistribution: generateScoreDistribution(),
        experienceBreakdown: generateExperienceBreakdown(),
        skillsAnalysis: generateSkillsAnalysis(),
        hiringRecommendations: generateHiringRecommendations(),
        trendsData: generateTrendsData(),
        competitiveAnalysis: generateCompetitiveAnalysis()
      };
      
      setAnalyticsData(analytics);
      setIsLoading(false);
    }, 1500);
  };

  const generateScoreDistribution = () => {
    const ranges = [
      { range: '90-100%', count: 0, label: 'Excellent' },
      { range: '80-89%', count: 0, label: 'Strong' },
      { range: '70-79%', count: 0, label: 'Good' },
      { range: '60-69%', count: 0, label: 'Moderate' },
      { range: '50-59%', count: 0, label: 'Weak' },
      { range: '0-49%', count: 0, label: 'Poor' }
    ];

    candidates.forEach(candidate => {
      const score = candidate.match_score;
      if (score >= 90) ranges[0].count++;
      else if (score >= 80) ranges[1].count++;
      else if (score >= 70) ranges[2].count++;
      else if (score >= 60) ranges[3].count++;
      else if (score >= 50) ranges[4].count++;
      else ranges[5].count++;
    });

    return ranges;
  };

  const generateExperienceBreakdown = () => {
    const breakdown = {
      'Entry Level (0-2 years)': 0,
      'Mid Level (3-7 years)': 0,
      'Senior Level (8+ years)': 0
    };

    candidates.forEach(candidate => {
      const years = candidate.experience_years;
      if (years <= 2) breakdown['Entry Level (0-2 years)']++;
      else if (years <= 7) breakdown['Mid Level (3-7 years)']++;
      else breakdown['Senior Level (8+ years)']++;
    });

    return breakdown;
  };

  const generateSkillsAnalysis = () => {
    const skillCounts: { [key: string]: number } = {};
    const matchedSkillCounts: { [key: string]: number } = {};

    candidates.forEach(candidate => {
      candidate.skills.forEach(skill => {
        skillCounts[skill] = (skillCounts[skill] || 0) + 1;
      });
      
      candidate.matched_skills.forEach(skill => {
        matchedSkillCounts[skill] = (matchedSkillCounts[skill] || 0) + 1;
      });
    });

    const topSkills = Object.entries(skillCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([skill, count]) => ({
        skill,
        total: count,
        matched: matchedSkillCounts[skill] || 0,
        matchRate: matchedSkillCounts[skill] ? Math.round((matchedSkillCounts[skill] / count) * 100) : 0
      }));

    return topSkills;
  };

  const generateHiringRecommendations = () => {
    const excellent = candidates.filter(c => c.match_score >= 90);
    const strong = candidates.filter(c => c.match_score >= 80 && c.match_score < 90);
    const good = candidates.filter(c => c.match_score >= 70 && c.match_score < 80);

    return {
      immediate: excellent.length,
      shortlist: strong.length,
      consider: good.length,
      topCandidate: excellent.length > 0 ? excellent[0] : (strong.length > 0 ? strong[0] : null)
    };
  };

  const generateTrendsData = () => {
    // Simulate trend data
    return {
      averageScoreByExperience: [
        { experience: '0-2 years', score: 65 },
        { experience: '3-5 years', score: 75 },
        { experience: '6-10 years', score: 82 },
        { experience: '10+ years', score: 78 }
      ],
      skillDemand: [
        { skill: 'JavaScript', demand: 85 },
        { skill: 'React', demand: 78 },
        { skill: 'Python', demand: 72 },
        { skill: 'Node.js', demand: 68 },
        { skill: 'AWS', demand: 65 }
      ]
    };
  };

  const generateCompetitiveAnalysis = () => {
    const avgHireProbability = candidates.reduce((sum, c) => sum + (c.hire_probability || 0), 0) / candidates.length;
    const avgSkillDiversity = candidates.reduce((sum, c) => sum + (c.skill_diversity || 0), 0) / candidates.length;
    const avgCompanyPrestige = candidates.reduce((sum, c) => sum + (c.company_prestige || 0), 0) / candidates.length;

    return {
      hireProbability: Math.round(avgHireProbability * 100),
      skillDiversity: Math.round(avgSkillDiversity * 100),
      companyPrestige: Math.round(avgCompanyPrestige * 100),
      marketCompetitiveness: Math.round((avgHireProbability + avgSkillDiversity + avgCompanyPrestige) * 33.33)
    };
  };

  if (candidates.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 p-20 text-center">
            <div className="w-32 h-32 mx-auto mb-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
              <BarChart3 className="h-16 w-16 text-gray-400 dark:text-gray-500" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Analytics Dashboard</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              No candidate data available for analysis. Please upload and analyze resumes first.
            </p>
            <a
              href="/upload"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Zap className="h-5 w-5" />
              <span>Start Analysis</span>
            </a>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Professional Header */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 p-8 mb-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-600 to-indigo-600 dark:from-purple-500 dark:to-indigo-500 rounded-2xl shadow-lg mb-6">
              <BarChart3 className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Analytics Dashboard
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Deep insights and trends from your candidate analysis data
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 p-20 text-center">
            <div className="w-16 h-16 border-4 border-gray-200 dark:border-gray-600 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Generating Analytics</h2>
            <p className="text-gray-600 dark:text-gray-300">Processing candidate data and generating insights...</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-700/50">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-600 dark:bg-blue-500 rounded-xl flex items-center justify-center shadow-md">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">{stats.totalCandidates}</div>
                    <div className="text-sm text-blue-600 dark:text-blue-300 font-medium">Total Analyzed</div>
                  </div>
                </div>
                <div className="flex items-center text-sm text-blue-700 dark:text-blue-300">
                  <Activity className="h-4 w-4 mr-2" />
                  <span>Comprehensive evaluation</span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 rounded-2xl p-6 border border-emerald-200 dark:border-emerald-700/50">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-emerald-600 dark:bg-emerald-500 rounded-xl flex items-center justify-center shadow-md">
                    <Target className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-emerald-900 dark:text-emerald-100">{stats.averageScore}%</div>
                    <div className="text-sm text-emerald-600 dark:text-emerald-300 font-medium">Average Score</div>
                  </div>
                </div>
                <div className="w-full bg-emerald-200 dark:bg-emerald-800/50 rounded-full h-2">
                  <div 
                    className="bg-emerald-600 dark:bg-emerald-400 h-2 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${stats.averageScore}%` }}
                  />
                </div>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 rounded-2xl p-6 border border-amber-200 dark:border-amber-700/50">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-amber-600 dark:bg-amber-500 rounded-xl flex items-center justify-center shadow-md">
                    <Award className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-amber-900 dark:text-amber-100">{stats.topCandidates}</div>
                    <div className="text-sm text-amber-600 dark:text-amber-300 font-medium">Top Matches</div>
                  </div>
                </div>
                <div className="flex items-center text-sm text-amber-700 dark:text-amber-300">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  <span>80%+ match score</span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-2xl p-6 border border-purple-200 dark:border-purple-700/50">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-purple-600 dark:bg-purple-500 rounded-xl flex items-center justify-center shadow-md">
                    <Brain className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-purple-900 dark:text-purple-100">{analyticsData.competitiveAnalysis.marketCompetitiveness}%</div>
                    <div className="text-sm text-purple-600 dark:text-purple-300 font-medium">Market Fit</div>
                  </div>
                </div>
                <div className="flex items-center text-sm text-purple-700 dark:text-purple-300">
                  <Star className="h-4 w-4 mr-2" />
                  <span>Overall competitiveness</span>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <AnalyticsCharts data={analyticsData} />

            {/* Insights Section */}
            <AnalyticsInsights 
              data={analyticsData} 
              candidates={candidates}
              stats={stats}
            />
          </div>
        )}
      </div>
    </main>
  );
}