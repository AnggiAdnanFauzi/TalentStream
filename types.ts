export interface Stage {
  id: string;
  name: string;
  color: string; // hex color
}

export enum InterviewType {
    Screen = 'Recruiter Screen',
    Technical = 'Technical Interview',
    Behavioral = 'Behavioral Interview',
    Panel = 'Panel Interview',
}

export enum JobStatus {
    Open = 'Open',
    OnHold = 'On Hold',
    Closed = 'Closed',
}

export enum EmploymentType {
    FullTime = 'Full-time',
    PartTime = 'Part-time',
    Contract = 'Contract',
    Internship = 'Internship',
}

export enum InterviewStatus {
    Scheduled = 'Scheduled',
    Completed = 'Completed',
}

export enum Recommendation {
    StrongHire = 'Strong Hire',
    Hire = 'Hire',
    NoHire = 'No Hire',
}

export enum TaskStatus {
    ToDo = 'To Do',
    Completed = 'Completed',
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'Active' | 'On Hold' | 'Completed';
  ownerId: string; // Interviewer ID
  companyId?: string;
  company_id?: string;
  createdDate: string;
}

export interface Requisition {
    id: string;
    title: string;
    department: string;
    location: string;
    employmentType: EmploymentType;
    headcount: number;
    experienceLevel: string;
    salaryMin: number;
    salaryMax: number;
    deadline: string; // YYYY-MM-DD
    status: 'Pending' | 'Approved' | 'Rejected';
    jobId?: string;
    companyId?: string;
    company_id?: string;
}

export type NewRequisitionData = Omit<Requisition, 'id' | 'status' | 'jobId'>;

export interface Task {
    id: string;
    applicationId: string;
    title: string;
    dueDate: string;
    assigneeId: string; // Interviewer ID
    status: TaskStatus;
}

export interface Candidate {
  id: string;
  name: string;
  avatarUrl: string;
  email: string;
  phone: string;
  experienceYears: number;
  expectedSalary: number;
  portfolioUrl?: string;
  cvUrl?: string;
  // Enhanced fields
  address?: string;
  dateOfBirth?: string;
  major?: string;
  skills?: string; // Comma-separated
  hobbies?: string;
  aspirations?: string; // Cita-cita
  strengths?: string;
  weaknesses?: string;
  linkedinUrl?: string;
  companyId?: string;
  company_id?: string;
}

export type NewCandidateData = Omit<Candidate, 'id' | 'avatarUrl'>;

export interface ScoreCriterion {
  name: string;
  weight: number; // 0-1
  score: number; // 0-100
}

export interface Interviewer {
    id: string;
    name: string;
    role: string;
}

export interface CompetencyFeedback {
    competency: string;
    rating: number; // 1-5
    notes: string;
}

export interface Interview {
    id: string;
    applicationId: string;
    type: InterviewType;
    dateTime: string;
    interviewers: Interviewer[];
    locationOrLink: string;
    notes?: string;
    // Enhanced fields
    status: InterviewStatus;
    scorecard?: CompetencyFeedback[];
    recommendation?: Recommendation;
}

export interface Application {
  id: string;
  candidateId: string;
  jobId: string;
  companyId?: string;
  company_id?: string;
  stageId: string;
  appliedDate: string;
  scorecard: ScoreCriterion[];
  totalScore: number;
  interviews?: Interview[];
  notes?: { author: string; content: string; date: string }[];
  source: string; // For analytics
  knockedOut?: boolean;
  stageHistory?: { stageId: string; date: string; changedBy: string; }[];
}

export interface Job {
  id: string;
  title: string;
  department: string;
  level: string;
  location: string;
  status: JobStatus;
  employmentType: EmploymentType;
  totalApplicants: number;
  daysOpen: number;
  salaryMin: number;
  salaryMax: number;
  deadline?: string; // YYYY-MM-DD
  projectId: string;
  companyId?: string;
  company_id?: string;
  // AI Generated fields
  jobDescription?: string;
  competencies?: string[];
  interviewQuestions?: { type: string; questions: string[] }[];
}

export type NewJobData = {
    title: string;
    department: string;
    location: string;
    level: string;
    employmentType: EmploymentType;
    salaryMin: number;
    salaryMax: number;
    jobDescription: string;
    deadline?: string;
    companyId?: string;
    company_id?: string;
};

export type DateRangeFilter = 'all' | '7d' | '30d';

export interface Filters {
  minExperience: number;
  maxExperience: number;
  minSalary: number;
  maxSalary: number;
  dateRange: DateRangeFilter;
}

export type ActiveTab = 'requisition' | 'sourcing' | 'screening' | 'selection' | 'hire' | 'guides' | 'analytics' | 'settings' | 'billing' | 'affiliate' | 'support' | 'admin_users' | 'admin_analytics';

export interface User {
    id: string;
    email: string;
    name: string;
    companyName?: string;
    company_name?: string;
    phone?: string;
    avatarUrl?: string;
    avatar_url?: string;
    role: 'admin' | 'user' | 'super_admin';
    status?: 'active' | 'archived';
    subscription: SubscriptionPlan;
    referralCode?: string;
    referredBy?: string;
    createdAt?: string;
}

export interface SubscriptionPlan {
    type: 'free' | 'pro' | 'enterprise';
    status: 'active' | 'trial' | 'expired';
    expiryDate: string;
    limitJobs: number;
    limitCandidates: number;
}

export interface Transaction {
    id: string;
    userId: string;
    amount: number;
    plan: string;
    date: string;
    status: 'success' | 'pending' | 'failed';
    invoiceUrl: string;
}

export interface AffiliateStats {
    totalReferrals: number;
    activeReferrals: number;
    totalCommission: number;
    pendingCommission: number;
}

export interface AISourcingResults {
  booleanSearch: string;
  keywords: string[];
  suggestedCandidates: (NewCandidateData & { summary: string })[];
}

export interface FeedbackItem {
    id: string;
    userId?: string;
    userName?: string;
    userEmail?: string;
    toolCategory: string;
    rating: number;
    feedbackType: 'bug' | 'suggestion' | 'praise' | 'other';
    message: string;
    createdAt?: string;
}
