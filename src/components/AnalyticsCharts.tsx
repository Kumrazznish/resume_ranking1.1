import { BarChart3, PieChart, TrendingUp, Activity } from 'lucide-react';

interface AnalyticsChartsProps {
  data: any;
}

export function AnalyticsCharts({ data }: AnalyticsChartsProps) {
  if (!data) return null;

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {/* Score Distribution Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-2xl transition-all duration-300">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 rounded-xl flex items-center justify-center mr-4 shadow-lg">
            <BarChart3 className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Score Distribution</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">Candidate performance breakdown</p>
          </div>
        </div>
        
        <div className="space-y-4">
          {data.scoreDistribution.map((item: any, index: number) => {
            const maxCount = Math.max(...data.scoreDistribution.map((d: any) => d.count));
            const percentage = maxCount > 0 ? (item.count / maxCount) * 100 : 0;
            const colors = [
              'from-emerald-500 to-green-600',
              'from-blue-500 to-indigo-600', 
              'from-amber-500 to-orange-600',
              'from-orange-500 to-red-600',
              'from-red-500 to-pink-600',
              'from-gray-500 to-gray-600'
            ];
            
            const bgColors = [
              'bg-emerald-50 dark:bg-emerald-900/20',
              'bg-blue-50 dark:bg-blue-900/20',
              'bg-amber-50 dark:bg-amber-900/20',
              'bg-orange-50 dark:bg-orange-900/20',
              'bg-red-50 dark:bg-red-900/20',
              'bg-gray-50 dark:bg-gray-900/20'
            ];
            
            return (
              <div key={index} className={`${bgColors[index]} rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:scale-[1.02] transition-all duration-200 group`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="text-sm font-bold text-gray-700 dark:text-gray-300">{item.range}</div>
                    <div className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 px-2 py-1 rounded-full">
                      {item.label}
                    </div>
                  </div>
                  <div className="text-sm font-bold text-gray-900 dark:text-white">
                    {item.count} candidate{item.count !== 1 ? 's' : ''}
                  </div>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                  <div 
                    className={`bg-gradient-to-r ${colors[index]} h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden`}
                    style={{ width: `${percentage}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-300" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Experience Breakdown */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-2xl transition-all duration-300">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-teal-600 dark:from-emerald-500 dark:to-teal-500 rounded-xl flex items-center justify-center mr-4 shadow-lg">
            <PieChart className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Experience Levels</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">Candidate experience distribution</p>
          </div>
        </div>
        
        <div className="space-y-4">
          {Object.entries(data.experienceBreakdown).map(([level, count], index) => {
            const total = Object.values(data.experienceBreakdown).reduce((sum: number, val: any) => sum + val, 0);
            const percentage = total > 0 ? ((count as number) / total) * 100 : 0;
            const colors = [
              'from-emerald-500 to-green-600', 
              'from-blue-500 to-indigo-600', 
              'from-purple-500 to-violet-600'
            ];
            
            const bgColors = [
              'bg-emerald-50 dark:bg-emerald-900/20',
              'bg-blue-50 dark:bg-blue-900/20',
              'bg-purple-50 dark:bg-purple-900/20'
            ];
            
            return (
              <div key={level} className={`${bgColors[index]} rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:scale-[1.02] transition-all duration-200 group`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm font-bold text-gray-700 dark:text-gray-300">{level}</div>
                  <div className="text-sm font-bold text-gray-900 dark:text-white">
                    {count} ({Math.round(percentage)}%)
                  </div>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                  <div 
                    className={`bg-gradient-to-r ${colors[index]} h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden`}
                    style={{ width: `${percentage}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-300" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Skills Analysis */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 md:col-span-2 hover:shadow-2xl transition-all duration-300">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-amber-600 to-orange-600 dark:from-amber-500 dark:to-orange-500 rounded-xl flex items-center justify-center mr-4 shadow-lg">
            <TrendingUp className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Top Skills Analysis</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">Most common skills and match rates</p>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          {data.skillsAnalysis.slice(0, 10).map((skill: any, index: number) => (
            <div key={skill.skill} className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-5 border border-gray-200 dark:border-gray-600 hover:scale-105 transition-all duration-200 group">
              <div className="flex justify-between items-center mb-4">
                <span className="font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 text-lg">
                  {skill.skill}
                </span>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 px-3 py-1 rounded-full">
                  {skill.matched}/{skill.total} candidates
                </span>
              </div>
              
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                    <span>Total Candidates</span>
                    <span>{skill.total}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-gray-400 to-gray-600 h-2 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                    <span>Matched</span>
                    <span>{skill.matched} ({skill.matchRate}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-emerald-500 to-green-600 h-2 rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                      style={{ width: `${skill.matchRate}%` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-300" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}