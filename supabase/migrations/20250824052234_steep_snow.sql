/*
  # Seed Sample Data for AI Resume Ranker

  1. Data Creation
    - Insert sample job descriptions
    - Insert 10,000+ candidate records with diverse data
    - Create realistic analysis results

  2. Data Diversity
    - Various experience levels and industries
    - Different skill sets and match scores
    - Comprehensive candidate profiles with AI-generated attributes
*/

-- Insert sample job descriptions
INSERT INTO job_descriptions (title, description, required_skills, experience_level, salary_range) VALUES
('Senior Full Stack Developer', 'We are seeking a highly skilled Senior Full Stack Developer to join our dynamic technology team. The ideal candidate will have extensive experience in both front-end and back-end development, with a strong focus on modern web technologies and scalable application architecture.

Key Responsibilities:
• Design and develop robust, scalable web applications using modern frameworks
• Collaborate with cross-functional teams to define, design, and ship new features
• Write clean, maintainable, and well-documented code
• Optimize applications for maximum speed and scalability
• Mentor junior developers and participate in code reviews
• Stay up-to-date with emerging technologies and industry best practices

Required Skills:
• 5+ years of experience in full-stack development
• Proficiency in JavaScript, TypeScript, Python, or Java
• Experience with React, Angular, or Vue.js for front-end development
• Knowledge of Node.js, Django, or Spring Boot for back-end development
• Database experience with PostgreSQL, MongoDB, or similar
• Familiarity with cloud platforms (AWS, Azure, or GCP)
• Experience with Git version control and CI/CD pipelines
• Understanding of RESTful APIs and microservices architecture', 
ARRAY['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'PostgreSQL', 'AWS', 'Git', 'REST APIs', 'Microservices'], 'Senior Level', '$120,000 - $180,000'),

('Data Scientist', 'Join our growing data science team to help drive data-driven decision making across the organization. You will work with large datasets, build predictive models, and provide actionable insights to stakeholders.

Key Responsibilities:
• Analyze complex datasets to identify trends and patterns
• Develop and implement machine learning models
• Create data visualizations and reports for stakeholders
• Collaborate with engineering teams to deploy models to production
• Design and conduct A/B tests and experiments
• Communicate findings to non-technical stakeholders

Required Skills:
• 3+ years of experience in data science or related field
• Strong proficiency in Python or R
• Experience with machine learning frameworks (TensorFlow, PyTorch, scikit-learn)
• Knowledge of SQL and database technologies
• Experience with data visualization tools (Tableau, Power BI, or similar)
• Statistical analysis and hypothesis testing expertise
• Experience with cloud platforms and big data technologies', 
ARRAY['Python', 'R', 'Machine Learning', 'TensorFlow', 'PyTorch', 'SQL', 'Tableau', 'Statistics', 'AWS', 'Big Data'], 'Mid Level', '$90,000 - $140,000'),

('DevOps Engineer', 'We are looking for a skilled DevOps Engineer to help us build and maintain our cloud infrastructure. You will be responsible for automating deployment processes, monitoring system performance, and ensuring high availability of our services.

Key Responsibilities:
• Design and implement CI/CD pipelines
• Manage cloud infrastructure using Infrastructure as Code
• Monitor system performance and troubleshoot issues
• Implement security best practices and compliance requirements
• Automate routine operational tasks
• Collaborate with development teams to improve deployment processes

Required Skills:
• 4+ years of experience in DevOps or infrastructure roles
• Strong knowledge of AWS, Azure, or GCP
• Experience with containerization technologies (Docker, Kubernetes)
• Proficiency in Infrastructure as Code tools (Terraform, CloudFormation)
• Experience with CI/CD tools (Jenkins, GitLab CI, GitHub Actions)
• Knowledge of monitoring and logging tools (Prometheus, ELK Stack)
• Scripting skills in Python, Bash, or PowerShell
• Understanding of networking and security concepts', 
ARRAY['AWS', 'Docker', 'Kubernetes', 'Terraform', 'Jenkins', 'Python', 'Monitoring', 'Security', 'Networking', 'CI/CD'], 'Senior Level', '$110,000 - $160,000'),

('Frontend Developer', 'Join our frontend team to create exceptional user experiences for our web applications. You will work closely with designers and backend developers to implement responsive, performant, and accessible user interfaces.

Key Responsibilities:
• Develop modern, responsive web applications using React/Vue/Angular
• Implement pixel-perfect designs with attention to detail
• Optimize applications for performance and accessibility
• Write comprehensive tests for frontend components
• Collaborate with UX/UI designers and backend developers
• Stay current with frontend development trends and best practices

Required Skills:
• 2+ years of experience in frontend development
• Strong proficiency in HTML, CSS, and JavaScript
• Experience with modern frontend frameworks (React, Vue.js, or Angular)
• Knowledge of CSS preprocessors and modern CSS techniques
• Understanding of responsive design and cross-browser compatibility
• Experience with build tools (Webpack, Vite, or similar)
• Version control with Git
• Basic understanding of testing frameworks', 
ARRAY['HTML', 'CSS', 'JavaScript', 'React', 'Vue.js', 'Responsive Design', 'Webpack', 'Git', 'Testing', 'Accessibility'], 'Mid Level', '$70,000 - $110,000'),

('Product Manager', 'We are seeking an experienced Product Manager to lead the development of our core products. You will work with cross-functional teams to define product strategy, prioritize features, and drive product execution.

Key Responsibilities:
• Define and communicate product vision and strategy
• Gather and prioritize product requirements from stakeholders
• Work closely with engineering and design teams
• Analyze market trends and competitive landscape
• Define and track key product metrics
• Manage product roadmap and feature prioritization

Required Skills:
• 5+ years of product management experience
• Strong analytical and problem-solving skills
• Experience with product management tools (Jira, Confluence, etc.)
• Understanding of software development processes
• Excellent communication and leadership skills
• Data-driven approach to decision making
• Experience with user research and testing
• Background in technology products', 
ARRAY['Product Strategy', 'Agile', 'Jira', 'User Research', 'Analytics', 'Leadership', 'Communication', 'Market Analysis'], 'Senior Level', '$130,000 - $190,000');

-- Generate sample candidates with diverse profiles
WITH candidate_data AS (
  SELECT
    'Candidate_' || generate_series(1, 10000) as base_name,
    generate_series(1, 10000) as seq_num
),
random_data AS (
  SELECT 
    base_name,
    seq_num,
    CASE (random() * 4)::int
      WHEN 0 THEN 'John'
      WHEN 1 THEN 'Sarah'
      WHEN 2 THEN 'Michael'
      WHEN 3 THEN 'Emily'
      ELSE 'Alex'
    END || ' ' || 
    CASE (random() * 6)::int
      WHEN 0 THEN 'Smith'
      WHEN 1 THEN 'Johnson'
      WHEN 2 THEN 'Williams'
      WHEN 3 THEN 'Brown'
      WHEN 4 THEN 'Davis'
      WHEN 5 THEN 'Miller'
      ELSE 'Wilson'
    END || '_' || seq_num as candidate_name,
    
    ('{"email": "' || lower(base_name) || '@email.com", "phone": "+1-555-' || 
     LPAD((random() * 9999)::int::text, 4, '0') || '"}')::jsonb as contact_info,
    
    -- Random experience years (0-15)
    (random() * 15)::int as experience_years,
    
    -- Random match score (30-100 with bias toward higher scores)
    (30 + (random() * 70) + (random() * 30))::int as match_score,
    
    -- Random hire probability (0.3-1.0 with bias toward higher scores)
    (0.3 + (random() * 0.7))::real as hire_probability,
    
    -- Random skill diversity (0.2-1.0)
    (0.2 + (random() * 0.8))::real as skill_diversity,
    
    -- Random company prestige (0.0-1.0)
    (random())::real as company_prestige,
    
    -- Random boolean for relevance (80% true)
    (random() < 0.8) as is_relevant
  FROM candidate_data
)
INSERT INTO candidates (
  candidate_name,
  contact_info,
  skills,
  experience_years,
  education,
  certifications,
  notable_companies,
  summary,
  matched_skills,
  missing_skills,
  match_score,
  recommendation,
  is_relevant,
  issues_detected,
  strengths,
  weaknesses,
  interview_questions,
  salary_range,
  hire_probability,
  experience_level,
  skill_diversity,
  company_prestige
)
SELECT 
  candidate_name,
  contact_info,
  
  -- Skills array (random selection from common skills)
  CASE (random() * 3)::int
    WHEN 0 THEN ARRAY['JavaScript', 'React', 'Node.js', 'PostgreSQL', 'Git']
    WHEN 1 THEN ARRAY['Python', 'Django', 'SQL', 'AWS', 'Docker', 'Machine Learning']
    WHEN 2 THEN ARRAY['Java', 'Spring Boot', 'MySQL', 'Kubernetes', 'Jenkins']
    ELSE ARRAY['HTML', 'CSS', 'Vue.js', 'MongoDB', 'Express.js']
  END || 
  CASE WHEN random() < 0.5 THEN ARRAY['TypeScript'] ELSE ARRAY[]::text[] END ||
  CASE WHEN random() < 0.3 THEN ARRAY['GraphQL'] ELSE ARRAY[]::text[] END ||
  CASE WHEN random() < 0.4 THEN ARRAY['Redis'] ELSE ARRAY[]::text[] END ||
  CASE WHEN random() < 0.3 THEN ARRAY['Terraform'] ELSE ARRAY[]::text[] END,
  
  experience_years,
  
  -- Education
  CASE (random() * 5)::int
    WHEN 0 THEN 'B.S. Computer Science'
    WHEN 1 THEN 'M.S. Software Engineering'
    WHEN 2 THEN 'B.S. Information Technology'
    WHEN 3 THEN 'M.S. Data Science'
    WHEN 4 THEN 'B.S. Electrical Engineering'
    ELSE 'Self-taught / Bootcamp'
  END,
  
  -- Certifications (random selection)
  CASE 
    WHEN random() < 0.3 THEN ARRAY['AWS Certified Developer']
    WHEN random() < 0.5 THEN ARRAY['Google Cloud Professional']
    WHEN random() < 0.2 THEN ARRAY['Microsoft Azure Fundamentals']
    ELSE ARRAY[]::text[]
  END ||
  CASE WHEN random() < 0.1 THEN ARRAY['Certified Kubernetes Administrator'] ELSE ARRAY[]::text[] END,
  
  -- Notable companies (random selection)
  CASE 
    WHEN company_prestige > 0.8 THEN 
      CASE (random() * 4)::int
        WHEN 0 THEN ARRAY['Google', 'Microsoft']
        WHEN 1 THEN ARRAY['Amazon', 'Apple']
        WHEN 2 THEN ARRAY['Facebook', 'Netflix']
        ELSE ARRAY['Tesla', 'Uber']
      END
    WHEN company_prestige > 0.5 THEN
      CASE (random() * 3)::int
        WHEN 0 THEN ARRAY['Adobe', 'Salesforce']
        WHEN 1 THEN ARRAY['IBM', 'Oracle']
        ELSE ARRAY['Spotify', 'Airbnb']
      END
    ELSE ARRAY[]::text[]
  END,
  
  -- Summary
  CASE (random() * 4)::int
    WHEN 0 THEN 'Experienced software developer with expertise in full-stack development and modern web technologies. Proven track record of delivering scalable solutions and mentoring junior developers.'
    WHEN 1 THEN 'Passionate developer with strong problem-solving skills and experience in agile environments. Focused on writing clean, efficient code and staying current with industry trends.'
    WHEN 2 THEN 'Results-driven professional with extensive experience in software architecture and team leadership. Committed to delivering high-quality solutions that meet business objectives.'
    ELSE 'Innovative developer with a strong foundation in computer science and practical experience building complex applications. Excellent communication skills and collaborative approach.'
  END,
  
  -- Matched skills (subset of skills)
  CASE 
    WHEN match_score > 85 THEN ARRAY['JavaScript', 'React', 'Node.js', 'Git']
    WHEN match_score > 70 THEN ARRAY['JavaScript', 'React', 'Git']
    WHEN match_score > 50 THEN ARRAY['JavaScript', 'Git']
    ELSE ARRAY['Git']
  END,
  
  -- Missing skills
  CASE 
    WHEN match_score < 60 THEN ARRAY['TypeScript', 'AWS', 'Docker', 'Testing']
    WHEN match_score < 80 THEN ARRAY['TypeScript', 'AWS']
    ELSE ARRAY['Docker']
  END,
  
  match_score,
  
  -- Recommendation
  CASE 
    WHEN match_score >= 90 THEN 'Exceptional candidate with outstanding qualifications. Strong technical skills and relevant experience make them an ideal fit for this role. Highly recommend for immediate interview.'
    WHEN match_score >= 80 THEN 'Strong candidate with good technical background and relevant experience. Would be a valuable addition to the team. Recommend for interview.'
    WHEN match_score >= 70 THEN 'Solid candidate with decent qualifications. Some gaps in required skills but shows potential. Consider for interview if pipeline allows.'
    WHEN match_score >= 60 THEN 'Moderate fit with some relevant experience. May require additional training but could work with proper support.'
    ELSE 'Limited match with current requirements. Significant skill gaps would require extensive training and development.'
  END,
  
  is_relevant,
  
  -- Issues detected
  CASE 
    WHEN match_score < 50 THEN ARRAY['Significant skill gaps', 'Limited relevant experience']
    WHEN experience_years < 2 THEN ARRAY['Entry level - may need mentoring']
    WHEN random() < 0.1 THEN ARRAY['Frequent job changes', 'Resume formatting issues']
    ELSE ARRAY[]::text[]
  END,
  
  -- Strengths
  CASE (random() * 4)::int
    WHEN 0 THEN ARRAY['Strong technical skills', 'Good communication', 'Team player']
    WHEN 1 THEN ARRAY['Leadership experience', 'Problem solving', 'Adaptable']
    WHEN 2 THEN ARRAY['Industry experience', 'Continuous learner', 'Detail oriented']
    ELSE ARRAY['Innovation mindset', 'Collaborative', 'Results driven']
  END,
  
  -- Weaknesses
  CASE 
    WHEN match_score < 70 THEN ARRAY['Limited experience with required frameworks', 'Need cloud platform training']
    WHEN experience_years < 3 THEN ARRAY['Junior level', 'May need guidance on complex projects']
    ELSE ARRAY[]::text[]
  END,
  
  -- Interview questions
  ARRAY[
    'Can you walk me through your experience with ' || 
    (ARRAY['React', 'Node.js', 'Python', 'Java', 'TypeScript'])[(random() * 4 + 1)::int] || '?',
    'How do you approach debugging complex technical issues?',
    'Describe a challenging project you worked on and how you overcame obstacles.'
  ],
  
  -- Salary range
  CASE 
    WHEN experience_years >= 8 THEN '$130,000 - $180,000'
    WHEN experience_years >= 5 THEN '$100,000 - $140,000'
    WHEN experience_years >= 3 THEN '$80,000 - $120,000'
    ELSE '$60,000 - $90,000'
  END,
  
  hire_probability,
  
  -- Experience level
  CASE 
    WHEN experience_years >= 8 THEN 'Senior Level'
    WHEN experience_years >= 3 THEN 'Mid Level'
    ELSE 'Entry Level'
  END,
  
  skill_diversity,
  company_prestige

FROM random_data;

-- Create some analysis results linking job descriptions to candidates
INSERT INTO analysis_results (
  job_description_id,
  candidate_ids,
  total_candidates,
  relevant_candidates,
  average_score,
  top_candidates,
  analysis_date,
  processing_time
)
SELECT 
  jd.id,
  ARRAY(SELECT id FROM candidates ORDER BY random() LIMIT 50),
  50,
  (40 + (random() * 10))::int,
  (70 + (random() * 25))::int,
  (5 + (random() * 15))::int,
  now() - interval '1 day' * (random() * 30),
  (5000 + (random() * 10000))::int
FROM job_descriptions jd;