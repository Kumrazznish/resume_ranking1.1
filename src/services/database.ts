import { supabase } from '../lib/supabase';
import { Candidate, JobDescription, AnalysisResult } from '../types';

export class DatabaseService {
  static async createJobDescription(jobDesc: Omit<JobDescription, 'id' | 'created_at' | 'updated_at'>): Promise<JobDescription> {
    const { data, error } = await supabase
      .from('job_descriptions')
      .insert([jobDesc])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getJobDescriptions(): Promise<JobDescription[]> {
    const { data, error } = await supabase
      .from('job_descriptions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async createCandidates(candidates: Omit<Candidate, 'id' | 'created_at' | 'updated_at'>[]): Promise<Candidate[]> {
    const { data, error } = await supabase
      .from('candidates')
      .insert(candidates)
      .select();

    if (error) throw error;
    return data || [];
  }

  static async getCandidates(limit = 100, offset = 0): Promise<Candidate[]> {
    const { data, error } = await supabase
      .from('candidates')
      .select('*')
      .order('match_score', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return data || [];
  }

  static async searchCandidates(query: string, filters: any = {}): Promise<Candidate[]> {
    let queryBuilder = supabase
      .from('candidates')
      .select('*');

    if (query) {
      queryBuilder = queryBuilder.or(`candidate_name.ilike.%${query}%,summary.ilike.%${query}%`);
    }

    if (filters.experience_level) {
      queryBuilder = queryBuilder.eq('experience_level', filters.experience_level);
    }

    if (filters.min_score) {
      queryBuilder = queryBuilder.gte('match_score', filters.min_score);
    }

    if (filters.is_relevant !== undefined) {
      queryBuilder = queryBuilder.eq('is_relevant', filters.is_relevant);
    }

    const { data, error } = await queryBuilder.order('match_score', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async createAnalysisResult(result: Omit<AnalysisResult, 'id' | 'created_at' | 'updated_at'>): Promise<AnalysisResult> {
    const { data, error } = await supabase
      .from('analysis_results')
      .insert([{
        ...result,
        candidate_ids: result.candidates.map(c => c.id)
      }])
      .select()
      .single();

    if (error) throw error;
    return { ...data, candidates: result.candidates };
  }

  static async getAnalysisResults(): Promise<AnalysisResult[]> {
    const { data, error } = await supabase
      .from('analysis_results')
      .select(`
        *,
        job_descriptions (
          title,
          description
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async getCandidateById(id: string): Promise<Candidate | null> {
    const { data, error } = await supabase
      .from('candidates')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return null;
    return data;
  }

  static async updateCandidate(id: string, updates: Partial<Candidate>): Promise<Candidate | null> {
    const { data, error } = await supabase
      .from('candidates')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteCandidate(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('candidates')
      .delete()
      .eq('id', id);

    return !error;
  }

  static async getCandidateStats(): Promise<any> {
    const { data, error } = await supabase
      .from('candidates')
      .select('match_score, is_relevant, experience_years, hire_probability');

    if (error) throw error;

    const totalCandidates = data.length;
    const relevantCandidates = data.filter(c => c.is_relevant).length;
    const averageScore = data.reduce((sum, c) => sum + c.match_score, 0) / totalCandidates;
    const topCandidates = data.filter(c => c.match_score >= 80).length;
    const averageExperience = data.reduce((sum, c) => sum + c.experience_years, 0) / totalCandidates;
    const averageHireProbability = data.reduce((sum, c) => sum + (c.hire_probability || 0), 0) / totalCandidates;

    return {
      totalCandidates,
      relevantCandidates,
      averageScore: Math.round(averageScore),
      topCandidates,
      averageExperience: Math.round(averageExperience),
      averageHireProbability: Math.round(averageHireProbability * 100),
      matchRate: Math.round((relevantCandidates / totalCandidates) * 100)
    };
  }
}