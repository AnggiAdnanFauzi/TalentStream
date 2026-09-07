import { Application, Candidate, Job, Stage } from '../types';

type ApplicationWithDetails = Application & { candidate?: Candidate; job?: Job; stage?: Stage; };

const escapeCSV = (str: string | number | undefined | null): string => {
    if (str === undefined || str === null) return '';
    let result = String(str);
    if (result.includes(',') || result.includes('"') || result.includes('\n')) {
        result = '"' + result.replace(/"/g, '""') + '"';
    }
    return result;
};

export const exportToCSV = (applications: ApplicationWithDetails[], filename: string) => {
    const headers = [
        'Application ID', 'Applied Date', 'Job Title', 'Candidate Name', 'Email', 'Phone', 'Stage', 
        'Total Score', 'Knocked Out', 'Source', 'Experience (Yrs)', 'Expected Salary'
    ];
    
    const rows = applications.map(app => [
        app.id,
        app.appliedDate,
        app.job?.title,
        app.candidate?.name,
        app.candidate?.email,
        app.candidate?.phone,
        app.stage?.name,
        app.totalScore,
        app.knockedOut ? 'Yes' : 'No',
        app.source,
        app.candidate?.experienceYears,
        app.candidate?.expectedSalary
    ].map(escapeCSV));
    
    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};
