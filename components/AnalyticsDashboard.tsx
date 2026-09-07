import React, { useMemo } from 'react';
import { Job, Application, Candidate, Stage } from '../types';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell, FunnelChart, Funnel, LabelList } from 'recharts';
import { LightBulbIcon } from './icons/Icons';

interface AnalyticsDashboardProps {
  jobs: Job[];
  applications: (Application & { candidate?: Candidate })[];
  stages: Stage[];
  language?: 'en' | 'id';
}

const KpiCard: React.FC<{ title: string, value: string | number, description: string }> = ({ title, value, description }) => (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-sm">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
        <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{value}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">{description}</p>
    </div>
);

const ChartContainer: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">{title}</h3>
        <div style={{ width: '100%', height: 300 }}>
            {children}
        </div>
    </div>
);

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ jobs, applications, stages, language = 'id' }) => {
    const isId = language === 'id';

    const metrics = useMemo(() => {
        if (applications.length === 0) {
            return {
                totalApplicants: 0,
                averageScore: 0,
                totalHired: 0,
                acceptanceRate: 0,
                funnelData: [],
                sourceData: [],
                fairnessData: [],
            };
        }

        const totalApplicants = applications.length;
        const hiredStageId = stages.find(s => s.name.toLowerCase() === 'hired')?.id;
        const offerStageId = stages.find(s => s.name.toLowerCase() === 'offer')?.id;

        const totalHired = hiredStageId ? applications.filter(app => app.stageId === hiredStageId).length : 0;
        const totalOffered = applications.filter(app => app.stageId === offerStageId || app.stageId === hiredStageId).length;
        
        const acceptanceRate = totalOffered > 0 ? (totalHired / totalOffered) * 100 : 0;
        const averageScore = applications.reduce((sum, app) => sum + (app.totalScore || 0), 0) / totalApplicants;

        // Funnel Data
        const stageOrder = stages.map(s => s.id);
        const stageCounts = applications.reduce((acc, app) => {
            const stageIndex = stageOrder.indexOf(app.stageId);
            if (stageIndex > -1) {
                for (let i = 0; i <= stageIndex; i++) {
                    const stageId = stageOrder[i];
                    acc[stageId] = (acc[stageId] || 0) + 1;
                }
            }
            return acc;
        }, {} as Record<string, number>);

        const funnelData = stages.map(stage => ({
           name: stage.name,
           value: stageCounts[stage.id] || 0,
           fill: stage.color
        })).filter(d => d.value > 0);

        // Source Data
        const sourceCounts = applications.reduce((acc, app) => {
            const source = app.source || (isId ? 'Tidak Diketahui' : 'Unknown');
            acc[source] = (acc[source] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
        const sourceData = Object.entries(sourceCounts).map(([name, value]) => ({ name, value }));

        // Fairness Data
        const sourceScores = applications.reduce((acc, app) => {
            const source = app.source || (isId ? 'Tidak Diketahui' : 'Unknown');
            if (!acc[source]) {
                acc[source] = { totalScore: 0, count: 0 };
            }
            acc[source].totalScore += (app.totalScore || 0);
            acc[source].count++;
            return acc;
        }, {} as Record<string, { totalScore: number; count: number }>);
        
        const scoreKey = isId ? 'Rata-rata Skor' : 'Average Score';
        const fairnessData = (Object.entries(sourceScores) as [string, { totalScore: number; count: number }][]).map(([name, data]) => ({
            name,
            [scoreKey]: parseFloat((data.totalScore / data.count).toFixed(1)),
        }));

        return {
            totalApplicants,
            averageScore: Math.round(averageScore),
            totalHired,
            acceptanceRate: `${acceptanceRate.toFixed(1)}%`,
            funnelData,
            sourceData,
            fairnessData,
            scoreKey,
        };

    }, [applications, stages, isId]);

    const PIE_COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <KpiCard 
           title={isId ? "Total Pelamar" : "Total Applicants"} 
           value={metrics.totalApplicants} 
           description={isId ? "Semua kandidat di seluruh lowongan aktif." : "All candidates across all jobs."} 
         />
         <KpiCard 
           title={isId ? "Rata-rata Skor" : "Average Score"} 
           value={metrics.averageScore} 
           description={isId ? "Rata-rata penilaian kartu penilaian (scorecard)." : "Average scorecard rating."} 
         />
         <KpiCard 
           title={isId ? "Total Diterima" : "Total Hired"} 
           value={metrics.totalHired} 
           description={isId ? "Kandidat yang telah mencapai tahap Diterima." : "Candidates moved to the Hired stage."} 
         />
         <KpiCard 
           title={isId ? "Tingkat Penerimaan" : "Acceptance Rate"} 
           value={metrics.acceptanceRate} 
           description={isId ? "Kandidat diterima vs. tawaran yang diberikan." : "Hired candidates vs. offers made."} 
         />
      </div>
      
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <ChartContainer title={isId ? "Corong Kandidat (Funnel)" : "Candidate Funnel"}>
            <ResponsiveContainer>
                <FunnelChart>
                    <Tooltip />
                    <Funnel dataKey="value" data={metrics.funnelData} isAnimationActive>
                         <LabelList position="right" fill="#fff" stroke="none" dataKey="name" />
                    </Funnel>
                </FunnelChart>
            </ResponsiveContainer>
        </ChartContainer>
        <ChartContainer title={isId ? "Sumber Asal Pelamar" : "Source of Hire"}>
            <ResponsiveContainer>
                 <PieChart>
                    <Pie data={metrics.sourceData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                        {metrics.sourceData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </ChartContainer>
      </div>

      <ChartContainer title={isId ? "Uji Keadilan: Rata-rata Skor Berdasarkan Sumber" : "Fairness Check: Average Score by Source"}>
        <ResponsiveContainer>
            <BarChart data={metrics.fairnessData} layout="vertical" margin={{ top: 5, right: 30, left: 50, bottom: 5 }}>
                <XAxis type="number" domain={[0, 100]} />
                <YAxis type="category" dataKey="name" width={100} />
                <Tooltip />
                <Legend />
                <Bar dataKey={metrics.scoreKey || 'Average Score'} fill="#3b82f6" />
            </BarChart>
        </ResponsiveContainer>
      </ChartContainer>

      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-sm">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-primary-100 dark:bg-primary-900/50 rounded-full">
            <LightBulbIcon className="h-6 w-6 text-primary-600 dark:text-primary-300" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            {isId ? "Wawasan Strategis MSDM: Filosofi di Balik TalentStream" : "Strategic HRM Insight: The Philosophy Driving TalentStream"}
          </h3>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
          {isId 
            ? "Manajemen Sumber Daya Manusia modern adalah mitra strategis, bukan sekadar fungsi administratif. Akuisisi talenta yang efektif bertumpu pada tiga pilar terintegrasi:"
            : "Modern Human Resource Management is a strategic partner, not just an administrative function. Effective talent acquisition rests on three integrated pillars:"}
        </p>
        <ul className="space-y-3 text-sm">
          <li className="flex items-start space-x-3">
            <div className="flex-shrink-0 font-bold text-primary-500 mt-0.5">1.</div>
            <div>
              <span className="font-semibold text-slate-700 dark:text-slate-200">
                {isId ? "Perekrutan Strategis:" : "Strategic Staffing:"}
              </span>
              <span className="text-slate-600 dark:text-slate-400">
                {isId 
                  ? " Secara proaktif merencanakan dan merekrut individu kompeten yang selaras dengan tujuan jangka panjang organisasi."
                  : " Proactively planning and recruiting competent individuals who align with organizational goals."}
              </span>
            </div>
          </li>
          <li className="flex items-start space-x-3">
            <div className="flex-shrink-0 font-bold text-primary-500 mt-0.5">2.</div>
            <div>
              <span className="font-semibold text-slate-700 dark:text-slate-200">
                {isId ? "Kesempatan Kerja Setara (EEO):" : "Equal Opportunity (EEO):"}
              </span>
              <span className="text-slate-600 dark:text-slate-400">
                {isId 
                  ? " Memastikan semua proses perekrutan berjalan adil, objektif, dan bebas dari bias diskriminatif sesuai standar etika serta hukum."
                  : " Ensuring all hiring processes are fair, objective, and free from discrimination, adhering to legal and ethical standards."}
              </span>
            </div>
          </li>
          <li className="flex items-start space-x-3">
            <div className="flex-shrink-0 font-bold text-primary-500 mt-0.5">3.</div>
            <div>
              <span className="font-semibold text-slate-700 dark:text-slate-200">
                {isId ? "Hubungan Karyawan Positif:" : "Positive Employee Relations:"}
              </span>
              <span className="text-slate-600 dark:text-slate-400">
                {isId 
                  ? " Membangun kepercayaan dan loyalitas sejak kontak pertama melalui komunikasi yang transparan dan bersahabat."
                  : " Building trust and loyalty from the very first interaction through transparent communication."}
              </span>
            </div>
          </li>
        </ul>
        <p className="mt-4 text-sm text-center font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700/50 p-3 rounded-xl">
          {isId 
            ? "TalentStream dirancang untuk mewujudkan prinsip-prinsip ini, membantu perusahaan Anda membangun tenaga kerja yang produktif, berdaya saing tinggi, dan berkelanjutan."
            : "TalentStream is designed to embody these principles, helping you build a productive, just, and sustainable workforce."}
        </p>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;