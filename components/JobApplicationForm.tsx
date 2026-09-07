import React, { useState } from 'react';
import { Job, NewCandidateData } from '../types';
import { BriefcaseIcon, MapPinIcon, DocumentTextIcon, SparklesIcon } from './icons/Icons';
import { useCVParser } from '../hooks/useCVParser';
import { apiUploadFile } from '../services/api';

interface JobApplicationFormProps {
    job: Job;
    onSubmit: (jobId: string, candidateData: NewCandidateData) => void;
}

type FormState = {
  [key in keyof Omit<NewCandidateData, 'experienceYears' | 'expectedSalary'>]: string;
} & {
    experienceYears: string;
    expectedSalary: string;
};

const INITIAL_FORM_STATE: FormState = {
  name: '', email: '', phone: '', experienceYears: '', expectedSalary: '',
  portfolioUrl: '', cvUrl: '', address: '', dateOfBirth: '', major: '',
  skills: '', hobbies: '', aspirations: '', strengths: '', weaknesses: '', linkedinUrl: '',
};


const JobApplicationForm: React.FC<JobApplicationFormProps> = ({ job, onSubmit }) => {
    const [formData, setFormData] = useState<FormState>(INITIAL_FORM_STATE);
    const [errors, setErrors] = useState<Partial<FormState>>({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [resumeText, setResumeText] = useState('');
    const { isParsing, error: parsingError, parseCVText } = useCVParser();
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setIsUploading(true);
        setUploadError(null);
        try {
            const res = await apiUploadFile(file);
            if (res.success && res.url) {
                setFormData(prev => ({ ...prev, cvUrl: res.url }));
            } else {
                setUploadError(res.message || 'Failed to upload file to Cloudinary');
            }
        } catch (err: any) {
            setUploadError(err.message || 'Upload failed');
        } finally {
            setIsUploading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name as keyof FormState]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };
    
    const handleAutofill = async () => {
        if (!resumeText.trim()) return;

        const parsedData = await parseCVText(resumeText);
        if (parsedData) {
            setFormData(prev => ({
                ...prev,
                name: parsedData.name || prev.name,
                email: parsedData.email || prev.email,
                phone: parsedData.phone || prev.phone,
                experienceYears: parsedData.experienceYears?.toString() || prev.experienceYears,
                linkedinUrl: parsedData.linkedinUrl || prev.linkedinUrl,
                portfolioUrl: parsedData.portfolioUrl || prev.portfolioUrl,
                skills: parsedData.skills || prev.skills,
            }));
        }
    };

    const validate = (): boolean => {
        const newErrors: Partial<FormState> = {};
        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }
        if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
        if (!formData.experienceYears.trim() || isNaN(Number(formData.experienceYears)) || Number(formData.experienceYears) < 0) {
            newErrors.experienceYears = 'Must be a valid number of years';
        }
        if (!formData.expectedSalary.trim() || isNaN(Number(formData.expectedSalary)) || Number(formData.expectedSalary) < 0) {
            newErrors.expectedSalary = 'Must be a valid number';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            const finalData: NewCandidateData = {
                name: formData.name.trim(),
                email: formData.email.trim(),
                phone: formData.phone.trim(),
                experienceYears: parseInt(formData.experienceYears, 10),
                expectedSalary: parseInt(formData.expectedSalary, 10),
                portfolioUrl: formData.portfolioUrl?.trim() || undefined,
                cvUrl: formData.cvUrl?.trim() || undefined,
                linkedinUrl: formData.linkedinUrl?.trim() || undefined,
                skills: formData.skills?.trim() || undefined,
            };
            onSubmit(job.id, finalData);
            setIsSubmitted(true);
        }
    };

    if (isSubmitted) {
        return (
            <div className="bg-slate-100 dark:bg-slate-950 min-h-screen flex items-center justify-center p-4">
                <div className="max-w-xl w-full bg-white dark:bg-slate-800 p-8 sm:p-12 rounded-xl shadow-lg text-center">
                    <h1 className="text-3xl font-bold text-primary-600 dark:text-primary-400">Thank You!</h1>
                    <p className="text-slate-600 dark:text-slate-300 mt-4">Your application for the **{job.title}** position has been received. Our recruitment team will review your profile and get in touch if you are a good fit.</p>
                    <a href={window.location.pathname} className="mt-8 inline-block px-6 py-2.5 text-sm font-semibold text-white bg-primary-600 rounded-md shadow-sm hover:bg-primary-700">Return Home</a>
                </div>
            </div>
        );
    }
    
    return (
        <div className="bg-slate-100 dark:bg-slate-950 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <header className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">{job.title}</h1>
                    <div className="flex items-center justify-center space-x-4 mt-3 text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1.5"><BriefcaseIcon className="w-4 h-4" /> {job.department}</span>
                        <span className="flex items-center gap-1.5"><MapPinIcon className="w-4 h-4" /> {job.location}</span>
                    </div>
                </header>
                
                <div className="bg-white dark:bg-slate-800 p-8 sm:p-10 rounded-xl shadow-lg">
                    <div className="mb-10 p-6 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-200 dark:border-primary-500/30">
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Save Time with AI!</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 mb-3">Paste your resume below and let our AI assistant fill out the form for you.</p>
                        <textarea
                            value={resumeText}
                            onChange={e => setResumeText(e.target.value)}
                            rows={6}
                            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                            placeholder="Paste the full text of your resume here..."
                        />
                        <button
                            type="button"
                            onClick={handleAutofill}
                            disabled={isParsing || !resumeText.trim()}
                            className="mt-3 inline-flex items-center justify-center gap-x-2 px-4 py-2 text-sm font-semibold text-white bg-primary-600 rounded-md shadow-sm hover:bg-primary-700 disabled:bg-slate-400 disabled:cursor-not-allowed"
                        >
                            <SparklesIcon className="w-5 h-5 -ml-1" />
                            {isParsing ? 'Parsing...' : 'Auto-fill Form'}
                        </button>
                        {parsingError && <p className="text-sm text-red-600 dark:text-red-500 mt-2">{parsingError}</p>}
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <Section title="Personal Information">
                            <FormInput label="Full Name" name="name" value={formData.name} onChange={handleChange} error={errors.name} required />
                            <FormInput label="Email Address" name="email" type="email" value={formData.email} onChange={handleChange} error={errors.email} required />
                            <FormInput label="Phone Number" name="phone" type="tel" value={formData.phone} onChange={handleChange} error={errors.phone} required />
                        </Section>
                        
                        <Section title="Professional Profile">
                            <FormInput label="Years of Experience" name="experienceYears" type="number" value={formData.experienceYears} onChange={handleChange} error={errors.experienceYears} required />
                            <FormInput label="Expected Salary ($ per year)" name="expectedSalary" type="number" value={formData.expectedSalary} onChange={handleChange} error={errors.expectedSalary} required />
                            <FormInput label="LinkedIn Profile URL" name="linkedinUrl" type="url" value={formData.linkedinUrl} onChange={handleChange} />
                            <FormInput label="Portfolio URL" name="portfolioUrl" type="url" value={formData.portfolioUrl} onChange={handleChange} />
                            <FormTextarea label="Key Skills (comma-separated)" name="skills" value={formData.skills} onChange={handleChange} />
                             <div className="sm:col-span-2 space-y-2">
                                <FormInput label="CV / Resume URL (Optional)" name="cvUrl" type="url" value={formData.cvUrl} onChange={handleChange} />
                                <div className="flex flex-wrap items-center gap-3">
                                    <label className="cursor-pointer inline-flex items-center px-3 py-1.5 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                        <DocumentTextIcon className="w-4 h-4 mr-1.5 text-primary-500" />
                                        <span>{isUploading ? 'Uploading to Cloudinary...' : 'Upload File to Cloudinary'}</span>
                                        <input type="file" className="hidden" onChange={handleFileUpload} disabled={isUploading} accept=".pdf,.doc,.docx,.txt,.png,.jpg" />
                                    </label>
                                    {formData.cvUrl && <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium truncate max-w-xs">✓ Cloudinary: {formData.cvUrl}</span>}
                                    {uploadError && <span className="text-xs text-red-500">{uploadError}</span>}
                                </div>
                            </div>
                        </Section>
                        
                        <div className="pt-5">
                            <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                                Submit Application
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

// --- Sub-components for JobApplicationForm ---
const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <fieldset className="space-y-6">
        <legend className="text-xl font-semibold text-slate-900 dark:text-white">{title}</legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {children}
        </div>
    </fieldset>
);

interface FormInputProps {
  label: string; name: string; value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string; type?: string; required?: boolean; className?: string;
}

const FormInput: React.FC<FormInputProps> = ({ label, name, error, required, className = '', ...props }) => (
  <div className={className}>
    <label htmlFor={name} className="block text-sm font-medium text-slate-700 dark:text-slate-300">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input id={name} name={name} {...props} className={`mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-900 border ${error ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'} rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500`} />
    {error && <p className="mt-1 text-xs text-red-600 dark:text-red-500">{error}</p>}
  </div>
);

interface FormTextareaProps {
  label: string; name: string; value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const FormTextarea: React.FC<FormTextareaProps> = ({ label, name, ...props }) => (
  <div className="sm:col-span-2">
    <label htmlFor={name} className="block text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>
    <textarea id={name} name={name} {...props} rows={3} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500" />
  </div>
);


export default JobApplicationForm;
