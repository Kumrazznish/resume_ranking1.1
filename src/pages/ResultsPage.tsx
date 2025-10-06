import { useState, useEffect } from 'react';
import { Search, Filter, Download, Share2, Eye, Mail, Phone, Award, Target, Users, TrendingUp, BarChart3, CheckCircle, AlertTriangle, Clock, Star, Calendar, Briefcase, GraduationCap, Send, Copy, ExternalLink, FileText, Zap, Brain, Heart, Shield, Lightbulb, Rocket, Globe, Code, Database, Server, Smartphone, Monitor, Wifi, Lock, Key, Settings, PenTool as Tool, Wrench, Hammer, HardDrive as Screwdriver, Drill, Save as Saw, Sliders as Pliers, Scissors, Ruler, Compass, Calculator, Microscope, Telescope, Camera, Video, Music, Headphones, Speaker, Microscope as Microphone, Radio, Tv, Gamepad2, Crown, Trophy, Medal, Ribbon, Flag, Bell, AlarmPlus as Alarm, Watch, Hourglass, Watch as Stopwatch, Timer, Sun, Moon, Cloud, CloudRain, CloudSnow, CloudLightning, Umbrella, Thermometer, Wind, Tornado, Scan as Volcano, Mountain, Trees as Tree, Flower, Leaf, Scaling as Seedling, Contact as Cactus, ArrowUpRight, ArrowDownRight, TrendingDown, Activity, PieChart, BarChart2, LineChart } from 'lucide-react';
import { Candidate } from '../types';
import { CandidateCard } from '../components/CandidateCard';
import { CandidateModal } from '../components/CandidateModal';
import { EmailModal } from '../components/EmailModal';
import { ExportService } from '../services/exportService';

interface ResultsPageProps {
  candidates: Candidate[];
  stats: {
    totalCandidates: number;
    relevantCandidates: number;
    averageScore: number;
    topCandidates: number;
  };
}

export function ResultsPage({ candidates, stats }: ResultsPageProps) {
  const [filters, setFilters] = useState({
    sort: 'score-desc',
    relevance: 'all',
    search: '',
    experience: 'all'
  });
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [emailCandidate, setEmailCandidate] = useState<Candidate | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filter and sort candidates
  const filteredCandidates = candidates
    .filter(candidate => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch = 
          candidate.candidate_name.toLowerCase().includes(searchLower) ||
          candidate.skills.some(skill => skill.toLowerCase().includes(searchLower)) ||
          candidate.summary.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Relevance filter
      if (filters.relevance !== 'all') {
        switch (filters.relevance) {
          case 'relevant':
            if (!candidate.is_relevant) return false;
            break;
          case 'excellent':
            if (candidate.match_score < 90) return false;
            break;
          case 'strong':
            if (candidate.match_score < 75 || candidate.match_score >= 90) return false;
            break;
          case 'moderate':
            if (candidate.match_score < 50 || candidate.match_score >= 75) return false;
            break;
        }
      }

      // Experience filter
      if (filters.experience !== 'all') {
        switch (filters.experience) {
          case 'entry':
            if (candidate.experience_years > 2) return false;
            break;
          case 'mid':
            if (candidate.experience_years < 3 || candidate.experience_years > 7) return false;
            break;
          case 'senior':
            if (candidate.experience_years < 8) return false;
            break;
        }
      }

      return true;
    })
    .sort((a, b) => {
      switch (filters.sort) {
        case 'score-desc':
          return b.match_score - a.match_score;
        case 'score-asc':
          return a.match_score - b.match_score;
        case 'name-asc':
          return a.candidate_name.localeCompare(b.candidate_name);
        case 'experience-desc':
          return b.experience_years - a.experience_years;
        default:
          return 0;
      }
    });

  const handleExport = async (format: string) => {
    setIsExporting(true);
    try {
      await ExportService.exportCandidates(filteredCandidates, format, stats);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  // Calculate additional stats
  const matchRatePercentage = stats.totalCandidates > 0 ? Math.round((stats.relevantCandidates / stats.totalCandidates) * 100) : 0;
  const topPerformersPercentage = stats.totalCandidates > 0 ? Math.round((stats.topCandidates / stats.totalCandidates) * 100) : 0;

  if (candidates.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center py-20">
            <div className="w-32 h-32 mx-auto mb-8 bg-white dark:bg-gray-800 rounded-3xl shadow-lg flex items-center justify-center">
              <BarChart3 className="h-16 w-16 text-gray-400 dark:text-gray-500" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">No Analysis Results</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              No candidate analysis results found. Please upload and analyze resumes first to view comprehensive insights and rankings.
            </p>
            <a
              href="/upload"
              className="inline-flex items-center space-x-3 px-8 py-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
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
        {/* Professional Header Section */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 p-8 mb-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 rounded-2xl shadow-lg mb-6">
              <Target className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Candidate Analysis Results
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              AI-powered candidate analysis and ranking results with comprehensive insights
            </p>
          </div>

          {/* Enhanced Statistics Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Candidates */}
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
                <span>Comprehensive evaluation completed</span>
              </div>
            </div>

            {/* Average Score */}
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

            {/* Top Candidates */}
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
                <span>{topPerformersPercentage}% of total candidates</span>
              </div>
            </div>

            {/* Relevant Candidates */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-2xl p-6 border border-purple-200 dark:border-purple-700/50">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-600 dark:bg-purple-500 rounded-xl flex items-center justify-center shadow-md">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-purple-900 dark:text-purple-100">{stats.relevantCandidates}</div>
                  <div className="text-sm text-purple-600 dark:text-purple-300 font-medium">Relevant</div>
                </div>
              </div>
              <div className="flex items-center text-sm text-purple-700 dark:text-purple-300">
                <PieChart className="h-4 w-4 mr-2" />
                <span>{matchRatePercentage}% match rate</span>
              </div>
            </div>
          </div>
        </div>

        {/* Professional Filters & Controls */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
            {/* Filter Controls */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-1 lg:mr-8">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Sort by</label>
                <select
                  value={filters.sort}
                  onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent text-gray-900 dark:text-white transition-all duration-200 font-medium"
                >
                  <option value="score-desc">Score (High to Low)</option>
                  <option value="score-asc">Score (Low to High)</option>
                  <option value="name-asc">Name (A-Z)</option>
                  <option value="experience-desc">Experience</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Relevance</label>
                <select
                  value={filters.relevance}
                  onChange={(e) => setFilters({ ...filters, relevance: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent text-gray-900 dark:text-white transition-all duration-200 font-medium"
                >
                  <option value="all">All Candidates</option>
                  <option value="relevant">Relevant Only</option>
                  <option value="excellent">Excellent Match (90%+)</option>
                  <option value="strong">Strong Match (75-89%)</option>
                  <option value="moderate">Moderate Match (50-74%)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Experience Level</label>
                <select
                  value={filters.experience}
                  onChange={(e) => setFilters({ ...filters, experience: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent text-gray-900 dark:text-white transition-all duration-200 font-medium"
                >
                  <option value="all">All Experience Levels</option>
                  <option value="entry">Entry Level (0-2 years)</option>
                  <option value="mid">Mid Level (3-7 years)</option>
                  <option value="senior">Senior Level (8+ years)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    placeholder="Search candidates..."
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200 font-medium"
                  />
                </div>
              </div>
            </div>

            {/* View Controls & Export */}
            <div className="flex items-center space-x-4">
              {/* View Mode Toggle */}
              <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-3 rounded-lg transition-all duration-200 ${
                    viewMode === 'grid'
                      ? 'bg-white dark:bg-gray-600 shadow-sm text-blue-600 dark:text-blue-400'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  <BarChart3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-3 rounded-lg transition-all duration-200 ${
                    viewMode === 'list'
                      ? 'bg-white dark:bg-gray-600 shadow-sm text-blue-600 dark:text-blue-400'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  <FileText className="h-4 w-4" />
                </button>
              </div>

              {/* Export Dropdown */}
              <div className="relative group">
                <button className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl font-medium">
                  <Download className="h-4 w-4" />
                  <span>Export Data</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                  <div className="py-2">
                    <button
                      onClick={() => handleExport('pdf')}
                      disabled={isExporting}
                      className="w-full text-left px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 font-medium"
                    >
                      Export as PDF
                    </button>
                    <button
                      onClick={() => handleExport('csv')}
                      disabled={isExporting}
                      className="w-full text-left px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 font-medium text-sm"
                    >
                      Export Excel Files (Interview Schedule + Candidate Data)
                    </button>
                    <button
                      onClick={() => handleExport('json')}
                      disabled={isExporting}
                      className="w-full text-left px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 font-medium"
                    >
                      Export as JSON
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Showing {filteredCandidates.length} of {candidates.length} candidates
              </h2>
              <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
                {filters.search && (
                  <span className="flex items-center bg-blue-100 dark:bg-blue-900/30 px-3 py-1 rounded-full">
                    <Search className="h-4 w-4 mr-1" />
                    Search: "{filters.search}"
                  </span>
                )}
                {filters.relevance !== 'all' && (
                  <span className="flex items-center bg-green-100 dark:bg-green-900/30 px-3 py-1 rounded-full">
                    <Filter className="h-4 w-4 mr-1" />
                    Relevance: {filters.relevance}
                  </span>
                )}
                {filters.experience !== 'all' && (
                  <span className="flex items-center bg-purple-100 dark:bg-purple-900/30 px-3 py-1 rounded-full">
                    <Briefcase className="h-4 w-4 mr-1" />
                    Experience: {filters.experience}
                  </span>
                )}
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">Last updated</div>
              <div className="text-sm font-semibold text-gray-900 dark:text-white">
                {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>

        {/* Candidates Grid/List */}
        {filteredCandidates.length > 0 ? (
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8"
            : "space-y-4 mb-8"
          }>
            {filteredCandidates.map((candidate, index) => (
              <CandidateCard
                key={candidate.id}
                candidate={candidate}
                onViewDetails={() => setSelectedCandidate(candidate)}
                onSendEmail={() => setEmailCandidate(candidate)}
                index={index}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 p-16 text-center">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
              <Search className="h-12 w-12 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              No candidates match your filters
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md mx-auto">
              Try adjusting your search criteria or filters to find more candidates that match your requirements.
            </p>
            <button
              onClick={() => setFilters({ sort: 'score-desc', relevance: 'all', search: '', experience: 'all' })}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
            >
              <Filter className="h-4 w-4" />
              <span>Clear All Filters</span>
            </button>
          </div>
        )}

        {/* Action Footer */}
        {filteredCandidates.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-600 dark:bg-green-500 rounded-xl flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="font-bold text-gray-900 dark:text-white text-lg">Analysis Complete</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    {filteredCandidates.length} candidate{filteredCandidates.length > 1 ? 's' : ''} ready for review
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <button className="flex items-center space-x-2 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 font-medium">
                  <Share2 className="h-4 w-4" />
                  <span>Share Results</span>
                </button>
                <button className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 dark:hover:from-indigo-600 dark:hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl font-medium">
                  <BarChart3 className="h-4 w-4" />
                  <span>View Analytics</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Candidate Modal */}
        {selectedCandidate && (
          <CandidateModal
            candidate={selectedCandidate}
            isOpen={!!selectedCandidate}
            onClose={() => setSelectedCandidate(null)}
          />
        )}

        {/* Email Modal */}
        {emailCandidate && (
          <EmailModal
            candidate={emailCandidate}
            isOpen={!!emailCandidate}
            onClose={() => setEmailCandidate(null)}
            jobTitle="Software Developer"
          />
        )}
      </div>
    </main>
  );
}