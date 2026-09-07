import React, { useState, useEffect } from 'react';
import { NewCandidateData } from '../types';
import { XMarkIcon } from './icons/Icons';
import AccordionSection from './AccordionSection';

interface AddCandidateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCandidate: (candidateData: NewCandidateData) => void;
  language?: 'en' | 'id';
}

type FormState = {
  [key in keyof Omit<NewCandidateData, 'experienceYears' | 'expectedSalary'>]: string;
} & {
    experienceYears: string;
    expectedSalary: string;
};

const INITIAL_FORM_STATE: FormState = {
  name: '',
  email: '',
  phone: '',
  experienceYears: '',
  expectedSalary: '',
  portfolioUrl: '',
  cvUrl: '',
  address: '',
  dateOfBirth: '',
  major: '',
  skills: '',
  hobbies: '',
  aspirations: '',
  strengths: '',
  weaknesses: '',
  linkedinUrl: '',
};

const AddCandidateModal: React.FC<AddCandidateModalProps> = ({ isOpen, onClose, onAddCandidate, language = 'en' }) => {
  const isId = language === 'id';
  const [formData, setFormData] = useState<FormState>(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [openSections, setOpenSections] = useState({
    personal: true,
    professional: true,
    assessment: true,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({...prev, [section]: !prev[section]}));
  };

  useEffect(() => {
    if (!isOpen) {
      setFormData(INITIAL_FORM_STATE);
      setErrors({});
      setOpenSections({ personal: true, professional: true, assessment: true });
    }
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormState]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<FormState> = {};
    if (!formData.name.trim()) newErrors.name = isId ? 'Nama wajib diisi' : 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = isId ? 'Email wajib diisi' : 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = isId ? 'Format email tidak valid' : 'Email is invalid';
    }
    if (!formData.phone.trim()) newErrors.phone = isId ? 'Nomor telepon wajib diisi' : 'Phone is required';
    if (!formData.experienceYears.trim() || isNaN(Number(formData.experienceYears)) || Number(formData.experienceYears) < 0) {
      newErrors.experienceYears = isId ? 'Harus berupa angka valid' : 'Must be a valid number';
    }
    if (!formData.expectedSalary.trim() || isNaN(Number(formData.expectedSalary)) || Number(formData.expectedSalary) < 0) {
      newErrors.expectedSalary = isId ? 'Harus berupa angka valid' : 'Must be a valid number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onAddCandidate({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        experienceYears: parseInt(formData.experienceYears, 10),
        expectedSalary: parseInt(formData.expectedSalary, 10),
        portfolioUrl: formData.portfolioUrl?.trim() || undefined,
        cvUrl: formData.cvUrl?.trim() || undefined,
        address: formData.address?.trim() || undefined,
        dateOfBirth: formData.dateOfBirth || undefined,
        major: formData.major?.trim() || undefined,
        skills: formData.skills?.trim() || undefined,
        hobbies: formData.hobbies?.trim() || undefined,
        aspirations: formData.aspirations?.trim() || undefined,
        strengths: formData.strengths?.trim() || undefined,
        weaknesses: formData.weaknesses?.trim() || undefined,
        linkedinUrl: formData.linkedinUrl?.trim() || undefined,
      });
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      <div className="relative w-full max-w-3xl transform rounded-lg bg-white dark:bg-slate-800 text-left shadow-xl transition-all m-4">
        <form onSubmit={handleSubmit}>
          <div className="flex items-start justify-between p-5 border-b border-slate-200 dark:border-slate-700 rounded-t">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white" id="modal-title">
              {isId ? 'Tambah Kandidat Baru' : 'Add New Candidate'}
            </h3>
            <button type="button" onClick={onClose} className="p-1 ml-auto bg-transparent rounded-lg text-slate-400 hover:bg-slate-200 hover:text-slate-900 dark:hover:bg-slate-600 dark:hover:text-white">
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
          
          <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
             <AccordionSection title={isId ? 'Informasi Pribadi' : 'Personal Information'} isOpen={openSections.personal} onToggle={() => toggleSection('personal')}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput label={isId ? 'Nama Lengkap' : 'Full Name'} name="name" value={formData.name} onChange={handleChange} error={errors.name} required />
                    <FormInput label={isId ? 'Alamat Email' : 'Email Address'} name="email" type="email" value={formData.email} onChange={handleChange} error={errors.email} required />
                    <FormInput label={isId ? 'Nomor Telepon' : 'Phone Number'} name="phone" type="tel" value={formData.phone} onChange={handleChange} error={errors.phone} required />
                    <FormInput label={isId ? 'Tanggal Lahir' : 'Date of Birth'} name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleChange} />
                    <FormInput label={isId ? 'Alamat Domisili' : 'Address'} name="address" value={formData.address} onChange={handleChange} className="md:col-span-2" />
                    <FormInput label={isId ? 'Jurusan / Pendidikan' : 'Major'} name="major" value={formData.major} onChange={handleChange} />
                    <FormInput label={isId ? 'Hobi / Minat' : 'Hobbies'} name="hobbies" value={formData.hobbies} onChange={handleChange} />
                </div>
             </AccordionSection>
             <AccordionSection title={isId ? 'Profil Profesional' : 'Professional Profile'} isOpen={openSections.professional} onToggle={() => toggleSection('professional')}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput label={isId ? 'Pengalaman Kerja (Tahun)' : 'Years of Experience'} name="experienceYears" type="number" value={formData.experienceYears} onChange={handleChange} error={errors.experienceYears} required />
                    <FormInput label={isId ? 'Ekspektasi Gaji ($)' : 'Expected Salary ($)'} name="expectedSalary" type="number" value={formData.expectedSalary} onChange={handleChange} error={errors.expectedSalary} required />
                    <FormTextarea label={isId ? 'Keahlian (pisahkan dengan koma)' : 'Skills (comma-separated)'} name="skills" value={formData.skills} onChange={handleChange} className="md:col-span-2" />
                    <FormInput label={isId ? 'Tautan Portofolio' : 'Portfolio URL'} name="portfolioUrl" type="url" value={formData.portfolioUrl} onChange={handleChange} error={errors.portfolioUrl} />
                    <FormInput label={isId ? 'Tautan CV / Resume' : 'CV / Resume URL'} name="cvUrl" type="url" value={formData.cvUrl} onChange={handleChange} error={errors.cvUrl} />
                    <FormInput label={isId ? 'Tautan Profil LinkedIn' : 'LinkedIn Profile URL'} name="linkedinUrl" type="url" value={formData.linkedinUrl} onChange={handleChange} className="md:col-span-2"/>
                </div>
             </AccordionSection>
             <AccordionSection title={isId ? 'Penilaian Diri' : 'Self Assessment'} isOpen={openSections.assessment} onToggle={() => toggleSection('assessment')}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormTextarea label={isId ? 'Kelebihan / Kekuatan (Plus)' : 'Strengths (Plus)'} name="strengths" value={formData.strengths} onChange={handleChange} />
                    <FormTextarea label={isId ? 'Kekurangan / Area Evaluasi (Minus)' : 'Weaknesses (Minus)'} name="weaknesses" value={formData.weaknesses} onChange={handleChange} />
                    <FormTextarea label={isId ? 'Aspirasi Karier (Cita-cita)' : 'Aspirations (Cita-cita)'} name="aspirations" value={formData.aspirations} onChange={handleChange} className="md:col-span-2" />
                </div>
             </AccordionSection>
          </div>
          
          <div className="flex items-center justify-end p-5 space-x-2 border-t border-slate-200 dark:border-slate-700 rounded-b">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-600 border border-slate-300 dark:border-slate-500 rounded-md shadow-sm hover:bg-slate-50 dark:hover:bg-slate-500">
              {isId ? 'Batal' : 'Cancel'}
            </button>
            <button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-primary-600 rounded-md shadow-sm hover:bg-primary-700">
              {isId ? 'Simpan Kandidat' : 'Add Candidate'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface FormInputProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  type?: string;
  required?: boolean;
  className?: string;
}

const FormInput: React.FC<FormInputProps> = ({ label, name, value, onChange, error, type = 'text', required = false, className = '' }) => (
  <div className={className}>
    <label htmlFor={name} className="block mb-2 text-sm font-medium text-slate-900 dark:text-white">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      name={name}
      id={name}
      value={value || ''}
      onChange={onChange}
      className={`bg-slate-50 border ${error ? 'border-red-500' : 'border-slate-300'} text-slate-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500`}
    />
    {error && <p className="mt-1 text-xs text-red-600 dark:text-red-500">{error}</p>}
  </div>
);

interface FormTextareaProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  error?: string;
  required?: boolean;
  className?: string;
  rows?: number;
}

const FormTextarea: React.FC<FormTextareaProps> = ({ label, name, value, onChange, error, required = false, className = '', rows = 3 }) => (
  <div className={className}>
    <label htmlFor={name} className="block mb-2 text-sm font-medium text-slate-900 dark:text-white">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <textarea
      name={name}
      id={name}
      value={value || ''}
      onChange={onChange}
      rows={rows}
      className={`bg-slate-50 border ${error ? 'border-red-500' : 'border-slate-300'} text-slate-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500`}
    />
    {error && <p className="mt-1 text-xs text-red-600 dark:text-red-500">{error}</p>}
  </div>
);

export default AddCandidateModal;