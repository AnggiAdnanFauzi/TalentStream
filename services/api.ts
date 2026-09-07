import { User, Job, Candidate, Application, Requisition, Project, Interview, Task, NewJobData, NewCandidateData } from '../types';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

function getHeaders(): HeadersInit {
  const token = localStorage.getItem('ts_token');
  return {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
}

async function safeFetch<T>(endpoint: string, options?: RequestInit): Promise<T | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s timeout

    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      signal: controller.signal,
      headers: {
        ...getHeaders(),
        ...(options?.headers || {})
      }
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      console.warn(`API request to ${endpoint} returned ${res.status}`);
      return null;
    }

    const data = await res.json();
    return data.data ?? data;
  } catch (err) {
    console.warn(`API fetch error on ${endpoint}:`, err);
    return null;
  }
}

// 1. Auth API
export async function apiLogin(email: string, password: string): Promise<{ success: boolean; token?: string; user?: User; message?: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (data.success && data.token) {
      localStorage.setItem('ts_token', data.token);
    }
    return data;
  } catch (err) {
    return { success: false, message: 'Network error connecting to backend' };
  }
}

export async function apiRegister(name: string, email: string, password: string, phone?: string, companyName?: string): Promise<{ success: boolean; token?: string; user?: User; message?: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, phone, company_name: companyName })
    });
    const data = await res.json();
    if (data.success && data.token) {
      localStorage.setItem('ts_token', data.token);
    }
    return data;
  } catch (err) {
    return { success: false, message: 'Network error connecting to backend' };
  }
}

// 2. Jobs API (supports multi-tenant scoping)
export async function apiGetCurrentUser(): Promise<{ success: boolean; user?: User; message?: string }> {
  try {
    const res = await safeFetch<User>('/user');
    if (res) {
      return { success: true, user: res };
    }
    return { success: false, message: 'Failed to fetch user' };
  } catch (err: any) {
    return { success: false, message: err?.message || 'Failed to fetch user' };
  }
}

export async function apiGetJobs(companyId?: string): Promise<Job[] | null> {
  const query = companyId ? `?company_id=${encodeURIComponent(companyId)}` : '';
  const data = await safeFetch<any[]>(`/jobs${query}`);
  if (!data) return null;
  return data.map(j => ({
    ...j,
    projectId: j.project_id || j.projectId,
    project_id: j.project_id || j.projectId,
    companyId: j.company_id || j.companyId,
    company_id: j.company_id || j.companyId,
    totalApplicants: j.total_applicants ?? j.totalApplicants ?? 0,
    salaryMin: j.salary_min ?? j.salaryMin,
    salaryMax: j.salary_max ?? j.salaryMax,
    daysOpen: j.days_open ?? j.daysOpen ?? 0,
    employmentType: j.employment_type || j.employmentType,
    jobDescription: j.job_description || j.jobDescription,
    interviewQuestions: j.interview_questions || j.interviewQuestions
  }));
}

export async function apiGetJob(id: string): Promise<Job | null> {
  return safeFetch<Job>(`/jobs/${id}`);
}

export async function apiCreateJob(jobData: NewJobData, projectId: string, requisitionId?: string): Promise<Job | null> {
  return safeFetch<Job>('/jobs', {
    method: 'POST',
    body: JSON.stringify({ 
      ...jobData, 
      project_id: projectId, 
      requisition_id: requisitionId,
      company_id: (jobData as any).companyId || (jobData as any).company_id
    })
  });
}

export async function apiUpdateJob(id: string, updates: Partial<Job>): Promise<Job | null> {
  return safeFetch<Job>(`/jobs/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates)
  });
}

// 3. Candidates API
export async function apiGetCandidates(companyId?: string): Promise<Candidate[] | null> {
  const query = companyId ? `?company_id=${encodeURIComponent(companyId)}` : '';
  const data = await safeFetch<any[]>(`/candidates${query}`);
  if (!data) return null;
  return data.map(c => ({
    ...c,
    avatarUrl: c.avatar_url || c.avatarUrl,
    experienceYears: c.experience_years ?? c.experienceYears,
    expectedSalary: c.expected_salary ?? c.expectedSalary,
    portfolioUrl: c.portfolio_url || c.portfolioUrl,
    cvUrl: c.cv_url || c.cvUrl,
    dateOfBirth: c.date_of_birth || c.dateOfBirth,
    linkedinUrl: c.linkedin_url || c.linkedinUrl
  }));
}

// 4. Applications API (supports multi-tenant scoping)
export async function apiGetApplications(companyId?: string): Promise<Application[] | null> {
  const query = companyId ? `?company_id=${encodeURIComponent(companyId)}` : '';
  const data = await safeFetch<any[]>(`/applications${query}`);
  if (!data) return null;
  return data.map(a => ({
    ...a,
    candidateId: a.candidate_id || a.candidateId,
    candidate_id: a.candidate_id || a.candidateId,
    jobId: a.job_id || a.jobId,
    job_id: a.job_id || a.jobId,
    companyId: a.company_id || a.companyId,
    company_id: a.company_id || a.companyId,
    appliedDate: a.applied_date || a.appliedDate,
    stageId: a.stage_id || a.stageId,
    stage_id: a.stage_id || a.stageId,
    totalScore: a.total_score ?? a.totalScore,
    knockedOut: a.knocked_out ?? a.knockedOut
  }));
}

export async function apiSubmitApplication(jobId: string, candidateData: NewCandidateData, source: string = 'Career Site'): Promise<Application | null> {
  return safeFetch<Application>('/applications', {
    method: 'POST',
    body: JSON.stringify({
      job_id: jobId,
      source,
      name: candidateData.name,
      email: candidateData.email,
      phone: candidateData.phone,
      experience_years: candidateData.experienceYears,
      expected_salary: candidateData.expectedSalary,
      portfolio_url: candidateData.portfolioUrl,
      cv_url: candidateData.cvUrl,
      address: candidateData.address,
      date_of_birth: candidateData.dateOfBirth,
      major: candidateData.major,
      skills: candidateData.skills,
      hobbies: candidateData.hobbies,
      aspirations: candidateData.aspirations,
      strengths: candidateData.strengths,
      weaknesses: candidateData.weaknesses,
      linkedin_url: candidateData.linkedinUrl
    })
  });
}

export async function apiUpdateApplication(id: string, updates: Partial<Application>): Promise<Application | null> {
  return safeFetch<Application>(`/applications/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates)
  });
}


export async function apiDeleteApplication(id: string): Promise<boolean> {
  const res = await safeFetch<{ success: boolean; message?: string }>(`/applications/${id}`, {
    method: 'DELETE'
  });
  return !!res?.success;
}

// 5. Requisitions API
export async function apiGetRequisitions(companyId?: string): Promise<Requisition[] | null> {
  const query = companyId ? `?company_id=${encodeURIComponent(companyId)}` : '';
  const data = await safeFetch<any[]>(`/requisitions${query}`);
  if (!data) return null;
  return data.map(r => ({
    ...r,
    employmentType: r.employment_type || r.employmentType,
    experienceLevel: r.experience_level || r.experienceLevel,
    salaryMin: r.salary_min ?? r.salaryMin,
    salaryMax: r.salary_max ?? r.salaryMax,
    jobId: r.job_id || r.jobId,
    job_id: r.job_id || r.jobId,
    companyId: r.company_id || r.companyId,
    company_id: r.company_id || r.companyId
  }));
}

export async function apiUpdateRequisition(id: string, updates: Partial<Requisition>): Promise<Requisition | null> {
  return safeFetch<Requisition>(`/requisitions/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates)
  });
}

// 6. Projects API
export async function apiGetProjects(companyId?: string): Promise<Project[] | null> {
  const query = companyId ? `?company_id=${encodeURIComponent(companyId)}` : '';
  const data = await safeFetch<any[]>(`/projects${query}`);
  if (!data) return null;
  return data.map(p => ({
    ...p,
    ownerId: p.owner_id || p.ownerId || 'int01',
    companyId: p.company_id || p.companyId,
    company_id: p.company_id || p.companyId,
    createdDate: p.created_date || p.createdDate || p.created_at || new Date().toISOString()
  }));
}

// 7. Interviews API
export async function apiGetInterviews(companyId?: string): Promise<Interview[] | null> {
  const query = companyId ? `?company_id=${encodeURIComponent(companyId)}` : '';
  return safeFetch<Interview[]>(`/interviews${query}`);
}

export async function apiCreateInterview(data: Omit<Interview, 'id' | 'status'>): Promise<Interview | null> {
  return safeFetch<Interview>('/interviews', {
    method: 'POST',
    body: JSON.stringify({
      application_id: data.applicationId,
      type: data.type,
      date_time: data.dateTime,
      location_or_link: data.locationOrLink,
      interviewers: data.interviewers,
      notes: data.notes
    })
  });
}

// 8. Tasks API
export async function apiGetTasks(companyId?: string): Promise<Task[] | null> {
  const query = companyId ? `?company_id=${encodeURIComponent(companyId)}` : '';
  return safeFetch<Task[]>(`/tasks${query}`);
}

// 9. Cloudinary Upload API
export async function apiUploadFile(file: File): Promise<{ success: boolean; url?: string; message?: string }> {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
      },
      body: formData
    });

    const data = await res.json();
    return data;
  } catch (err: any) {
    return { success: false, message: err.message || 'Upload failed' };
  }
}

// 10. Profile Update API
export async function apiUpdateProfile(payload: {
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
  avatar_url?: string;
  company_name?: string;
  password?: string;
}): Promise<{ success: boolean; user?: User; message?: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/profile`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...getHeaders()
      },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    return data;
  } catch (err: any) {
    return { success: false, message: err?.message || 'Failed to update profile' };
  }
}

// 11. Super Admin APIs
export async function apiGetAdminUsers(): Promise<User[] | null> {
  return safeFetch<User[]>('/admin/users');
}

export async function apiUpdateAdminUser(id: string, updates: Partial<User>): Promise<User | null> {
  return safeFetch<User>(`/admin/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates)
  });
}

// Soft Delete (Archive)
export async function apiDeleteAdminUser(id: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        ...getHeaders()
      }
    });
    return res.ok;
  } catch {
    return false;
  }
}

// Restore archived user
export async function apiRestoreAdminUser(id: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/users/${id}/restore`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        ...getHeaders()
      }
    });
    return res.ok;
  } catch {
    return false;
  }
}

// 12. Feedback API
export async function apiSubmitFeedback(payload: {
  tool_category: string;
  rating: number;
  feedback_type: string;
  message: string;
  user_id?: string;
  user_name?: string;
  user_email?: string;
}): Promise<{ success: boolean; message?: string; data?: any }> {
  try {
    const res = await fetch(`${API_BASE_URL}/feedbacks`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...getHeaders()
      },
      body: JSON.stringify(payload)
    });
    return await res.json();
  } catch (err: any) {
    return { success: false, message: err?.message || 'Failed to submit feedback' };
  }
}

export async function apiGetFeedbacks(): Promise<any[] | null> {
  return safeFetch<any[]>('/feedbacks');
}

// 13. Midtrans Payment & Billing APIs
export async function apiCreateSnapToken(plan: 'pro' | 'enterprise', period: 'monthly' | 'yearly' = 'monthly'): Promise<{
  success: boolean;
  order_id: string;
  snap_token: string;
  redirect_url: string;
  amount: number;
  plan: string;
  client_key: string;
} | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/payment/snap-token`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...getHeaders()
      },
      body: JSON.stringify({ plan, period })
    });
    const data = await res.json();
    return data.success ? data : null;
  } catch (err) {
    console.warn('Failed to create Snap token:', err);
    return null;
  }
}

export async function apiGetBillingTransactions(): Promise<any[] | null> {
  return safeFetch<any[]>('/payment/transactions');
}

export async function apiSimulatePaymentSuccess(orderId: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/payment/simulate-success`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...getHeaders()
      },
      body: JSON.stringify({ order_id: orderId })
    });
    const data = await res.json();
    return data.success;
  } catch {
    return false;
  }
}

