import React, { useState, useEffect } from 'react';
import { NewJobData, EmploymentType } from '../types';
import { XMarkIcon } from './icons/Icons';

interface AddJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddJob: (data: NewJobData) => void;
  initialData?: Partial<NewJobData>;
  language?: 'en' | 'id';
}

const AddJobModal: React.FC<AddJobModalProps> = ({ isOpen, onClose, onAddJob, initialData, language = 'en' }) => {
  const isId = language === 'id';
  const [formData, setFormData] = useState<Omit<NewJobData, 'salaryMin' | 'salaryMax'> & { salaryMin: string; salaryMax: string; }>({
    title: '',
    department: '',
    location: '',
    level: 'Mid-level',
    employmentType: EmploymentType.FullTime,
    salaryMin: '',
    salaryMax: '',
    deadline: '',
    jobDescription: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      setFormData({
        title: initialData?.title || '',
        department: initialData?.department || '',
        location: initialData?.location || '',
        level: initialData?.level || 'Mid-level',
        employmentType: initialData?.employmentType || EmploymentType.FullTime,
        salaryMin: initialData?.salaryMin?.toString() || '',
        salaryMax: initialData?.salaryMax?.toString() || '',
        deadline: initialData?.deadline || '',
        jobDescription: initialData?.jobDescription || '',
      });
      setErrors({});
    }
  }, [isOpen, initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = isId ? 'Judul lowongan wajib diisi' : 'Job title is required';
    if (!formData.department.trim()) newErrors.department = isId ? 'Departemen wajib diisi' : 'Department is required';
    if (!formData.location.trim()) newErrors.location = isId ? 'Lokasi wajib diisi' : 'Location is required';
    if (!formData.jobDescription.trim()) newErrors.jobDescription = isId ? 'Deskripsi pekerjaan wajib diisi' : 'Job description is required';
    
    const salaryMin = Number(formData.salaryMin);
    const salaryMax = Number(formData.salaryMax);
    if (isNaN(salaryMin) || salaryMin <= 0) newErrors.salaryMin = isId ? 'Harus angka positif valid' : 'Must be a valid positive number';
    if (isNaN(salaryMax) || salaryMax <= 0) newErrors.salaryMax = isId ? 'Harus angka positif valid' : 'Must be a valid positive number';
    if (salaryMin > 0 && salaryMax > 0 && salaryMin > salaryMax) newErrors.salaryMax = isId ? 'Gaji maks tidak boleh kurang dari min' : 'Max salary cannot be less than min';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onAddJob({
        ...formData,
        salaryMin: Number(formData.salaryMin),
        salaryMax: Number(formData.salaryMax),
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-2xl transform rounded-lg bg-white dark:bg-slate-800 text-left shadow-xl transition-all m-4">
        <form onSubmit={handleSubmit}>
          <div className="flex items-start justify-between p-5 border-b border-slate-200 dark:border-slate-700 rounded-t">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white" id="modal-title">
              {initialData 
                ? (isId ? 'Buat Lowongan dari Rekuisisi' : 'Create Job from Requisition')
                : (isId ? 'Tambah Lowongan Pekerjaan Baru' : 'Add New Job Posting')}
            </h3>
            <button type="button" onClick={onClose} className="p-1 ml-auto bg-transparent rounded-lg text-slate-400 hover:bg-slate-200 hover:text-slate-900 dark:hover:bg-slate-600 dark:hover:text-white">
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
          
          <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput label={isId ? 'Judul Posisi' : 'Job Title'} name="title" value={formData.title} onChange={handleChange} error={errors.title} required className="md:col-span-2" />
                <FormInput label={isId ? 'Departemen' : 'Department'} name="department" value={formData.department} onChange={handleChange} error={errors.department} required />
                <FormInput label={isId ? 'Lokasi' : 'Location'} name="location" value={formData.location} onChange={handleChange} error={errors.location} required />
                <FormSelect label={isId ? 'Tipe Pekerjaan' : 'Employment Type'} name="employmentType" value={formData.employmentType} onChange={handleChange}>
                    {Object.values(EmploymentType).map(type => {
                      const label = isId 
                        ? (type === EmploymentType.FullTime ? 'Penuh Waktu (Full-time)' : type === EmploymentType.PartTime ? 'Paruh Waktu (Part-time)' : type === EmploymentType.Contract ? 'Kontrak (Contract)' : 'Magang (Internship)')
                        : type;
                      return <option key={type} value={type}>{label}</option>;
                    })}
                </FormSelect>
                <FormSelect label={isId ? 'Tingkat Pengalaman' : 'Experience Level'} name="level" value={formData.level} onChange={handleChange}>
                    <option value="Entry-level">{isId ? 'Tingkat Pemula (Entry-level)' : 'Entry-level'}</option>
                    <option value="Junior">Junior</option>
                    <option value="Mid-level">{isId ? 'Tingkat Menengah (Mid-level)' : 'Mid-level'}</option>
                    <option value="Senior">Senior</option>
                    <option value="Lead">{isId ? 'Pemimpin Tim (Lead)' : 'Lead'}</option>
                    <option value="Manager">{isId ? 'Manajer (Manager)' : 'Manager'}</option>
                </FormSelect>
                <FormInput label={isId ? 'Gaji Min ($)' : 'Min Salary ($)'} name="salaryMin" type="number" value={formData.salaryMin} onChange={handleChange} error={errors.salaryMin} required />
                <FormInput label={isId ? 'Gaji Maks ($)' : 'Max Salary ($)'} name="salaryMax" type="number" value={formData.salaryMax} onChange={handleChange} error={errors.salaryMax} required />
                <FormInput label={isId ? 'Tenggat Waktu Pendaftaran' : 'Application Deadline'} name="deadline" type="date" value={formData.deadline} onChange={handleChange} error={errors.deadline} className="md:col-span-2" />
                <div className="md:col-span-2">
                    <label htmlFor="jobDescription" className="block mb-2 text-sm font-medium text-slate-900 dark:text-white">
                      {isId ? 'Deskripsi Pekerjaan' : 'Job Description'} <span className="text-red-500">*</span>
                    </label>
                    <textarea id="jobDescription" name="jobDescription" value={formData.jobDescription} onChange={handleChange} rows={6} className={`bg-slate-50 border ${errors.jobDescription ? 'border-red-500' : 'border-slate-300'} text-slate-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400 dark:text-white`} />
                    {errors.jobDescription && <p className="mt-1 text-xs text-red-600 dark:text-red-500">{errors.jobDescription}</p>}
                </div>
             </div>
          </div>
          
          <div className="flex items-center justify-end p-5 space-x-2 border-t border-slate-200 dark:border-slate-700 rounded-b">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-600 border border-slate-300 dark:border-slate-500 rounded-md shadow-sm hover:bg-slate-50 dark:hover:bg-slate-500">
              {isId ? 'Batal' : 'Cancel'}
            </button>
            <button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-primary-600 rounded-md shadow-sm hover:bg-primary-700">
              {isId ? 'Simpan Lowongan' : 'Save Job Posting'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- Sub-components for Form ---
const FormInput: React.FC<{ label: string; name: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; error?: string; type?: string; required?: boolean; className?: string; }> = ({ label, name, value, onChange, error, type = 'text', required = false, className = '' }) => (
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

const FormSelect: React.FC<{ label: string; name: string; value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; children: React.ReactNode; className?: string; }> = ({ label, name, value, onChange, children, className = '' }) => (
  <div className={className}>
    <label htmlFor={name} className="block mb-2 text-sm font-medium text-slate-900 dark:text-white">{label}</label>
    <select
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
    >
      {children}
    </select>
  </div>
);

export default AddJobModal;