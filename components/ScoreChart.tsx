import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { ScoreCriterion } from '../types';

interface ScoreChartProps {
  data: ScoreCriterion[];
  language?: 'en' | 'id';
}

const CRITERIA_MAP_ID: Record<string, string> = {
  'experience match': 'Pengalaman',
  'experience': 'Pengalaman',
  'technical skills': 'Keahlian Teknis',
  'technical': 'Keahlian Teknis',
  'cultural fit': 'Budaya Kerja',
  'cultural': 'Budaya Kerja',
  'problem solving': 'Pemecahan Masalah',
  'leadership': 'Kepemimpinan',
  'communication': 'Komunikasi'
};

const ScoreChart: React.FC<ScoreChartProps> = ({ data, language = 'id' }) => {
  const isId = language === 'id';

  const chartData = data.map(item => {
    const rawLabel = item.name.split('/')[0].trim();
    const key = rawLabel.toLowerCase();
    const subject = isId && CRITERIA_MAP_ID[key] ? CRITERIA_MAP_ID[key] : rawLabel;

    return {
      subject,
      score: item.score,
      fullMark: 100,
    };
  });

  return (
    <ResponsiveContainer width="100%" height={250}>
      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
        <PolarGrid stroke="rgba(100, 116, 139, 0.3)" />
        <PolarAngleAxis 
            dataKey="subject" 
            tick={{ fill: 'rgb(100 116 139)', fontSize: 12 }} 
        />
        <Tooltip 
          contentStyle={{
            backgroundColor: 'rgba(30, 41, 59, 0.8)',
            borderColor: 'rgba(100, 116, 139, 0.5)',
            borderRadius: '0.5rem',
          }}
          labelStyle={{ color: '#fff' }}
          formatter={(value: any) => [value, isId ? 'Skor' : 'Score']}
        />
        <Radar name={isId ? 'Skor' : 'Score'} dataKey="score" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
      </RadarChart>
    </ResponsiveContainer>
  );
};

export default ScoreChart;
