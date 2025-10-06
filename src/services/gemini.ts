const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-002:generateContent';

export class GeminiService {
  static async analyzeResumes(jobDescription: string, resumeTexts: string): Promise<string> {
    if (!GEMINI_API_KEY) {
      throw new Error('Gemini API key is not configured');
    }

    const prompt = this.createAnalysisPrompt(jobDescription, resumeTexts);

    try {
      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.3,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 8192,
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API Error: ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      
      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        throw new Error('Invalid response format from AI service');
      }

      return data.candidates[0].content.parts[0].text;
      
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw new Error(`AI Analysis failed: ${error}`);
    }
  }

  private static createAnalysisPrompt(jobDescription: string, resumeTexts: string): string {
    return `# AI Resume Evaluation System - Enhanced Analysis

## Context & Objective
You are an advanced AI recruiter specializing in comprehensive candidate assessment. Your role is to evaluate multiple resumes against a specific job description using sophisticated matching algorithms and provide detailed, actionable insights.

## Input Data

### Job Requirements:
${jobDescription}

### Candidate Resumes:
${resumeTexts}

## Evaluation Framework

### 1. Technical Skills Assessment (40% weight)
- Match technical skills mentioned in job description
- Evaluate skill depth based on context and experience
- Consider related/transferable skills
- Weight recent vs. older technologies appropriately

### 2. Experience Evaluation (30% weight)
- Years of relevant experience
- Quality of companies/projects
- Leadership and responsibility progression
- Industry relevance

### 3. Cultural & Soft Skills Fit (20% weight)
- Communication skills (inferred from resume quality)
- Leadership indicators
- Collaboration and teamwork evidence
- Problem-solving approach

### 4. Education & Certifications (10% weight)
- Relevant degrees and educational background
- Professional certifications
- Continuous learning indicators

## Scoring Algorithm

### Match Score Calculation (0-100):
- 90-100: Exceptional candidate, rare find
- 80-89: Strong match, definitely interview
- 70-79: Good candidate, likely interview
- 60-69: Moderate fit, consider if needed
- 50-59: Weak match, backup option
- 0-49: Poor fit, likely reject

## Required Output Schema

Return ONLY a valid JSON array with this exact structure:

[
  {
    "candidate_name": "Full Name",
    "contact_info": {
      "email": "email@domain.com",
      "phone": "+1-xxx-xxx-xxxx"
    },
    "skills": ["skill1", "skill2", "skill3"],
    "experience_years": 5,
    "education": "Degree and Field",
    "certifications": ["cert1", "cert2"],
    "notable_companies": ["Company1", "Company2"],
    "summary": "2-3 sentence professional summary",
    "matched_skills": ["matched_skill1", "matched_skill2"],
    "missing_skills": ["missing_skill1", "missing_skill2"],
    "match_score": 85,
    "recommendation": "Detailed recommendation with specific reasoning",
    "is_relevant": true,
    "issues_detected": ["issue1", "issue2"],
    "strengths": ["strength1", "strength2"],
    "weaknesses": ["weakness1", "weakness2"],
    "interview_questions": ["question1", "question2"],
    "salary_range": "Expected salary range based on experience",
    "hire_probability": 0.85
  }
]

## Quality Assurance Rules

1. **Accuracy**: Only extract information explicitly present in resumes
2. **Consistency**: Apply same evaluation criteria to all candidates
3. **Objectivity**: Base scores on factual evidence, not assumptions
4. **Completeness**: Fill all required fields, use "Not specified" if unavailable
5. **Relevance**: Focus on job-related qualifications and experience

Begin comprehensive evaluation now. Provide thorough, professional assessment for each candidate.`;
  }
}