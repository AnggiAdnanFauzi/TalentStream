// Helper utilities for bilingual translation of Demo/Mock Data & Dynamic Attributes
export interface BilingualText {
  id: string;
  en: string;
}

export const PROJECT_DICTIONARY: Record<string, { name: BilingualText; description: BilingualText }> = {
  proj01: {
    name: {
      id: 'Ekspansi Tim Rekayasa Q3',
      en: 'Q3 Engineering Expansion'
    },
    description: {
      id: 'Perekrutan insinyur senior untuk membangun arsitektur layanan mikro (microservices) baru.',
      en: 'Hiring push for senior engineers to build out new microservices architecture.'
    }
  },
  'Q3 Engineering Expansion': {
    name: {
      id: 'Ekspansi Tim Rekayasa Q3',
      en: 'Q3 Engineering Expansion'
    },
    description: {
      id: 'Perekrutan insinyur senior untuk membangun arsitektur layanan mikro (microservices) baru.',
      en: 'Hiring push for senior engineers to build out new microservices architecture.'
    }
  },
  proj02: {
    name: {
      id: 'Pertumbuhan Tim Produk Inti',
      en: 'Core Product Team Growth'
    },
    description: {
      id: 'Memperluas tim produk dan desain inti guna mempercepat peluncuran fitur unggulan.',
      en: 'Expanding the core product and design teams to accelerate feature development.'
    }
  },
  'Core Product Team Growth': {
    name: {
      id: 'Pertumbuhan Tim Produk Inti',
      en: 'Core Product Team Growth'
    },
    description: {
      id: 'Memperluas tim produk dan desain inti guna mempercepat peluncuran fitur unggulan.',
      en: 'Expanding the core product and design teams to accelerate feature development.'
    }
  },
  proj03: {
    name: {
      id: 'Ekspansi Pasar Baru (Surabaya)',
      en: 'New Market Entry (Surabaya)'
    },
    description: {
      id: 'Membangun tim fondasi awal untuk pembukaan kantor cabang dan operasional di Surabaya.',
      en: 'Building a foundational team for our new office and operations in Surabaya.'
    }
  },
  'New Market Entry (Surabaya)': {
    name: {
      id: 'Ekspansi Pasar Baru (Surabaya)',
      en: 'New Market Entry (Surabaya)'
    },
    description: {
      id: 'Membangun tim fondasi awal untuk pembukaan kantor cabang dan operasional di Surabaya.',
      en: 'Building a foundational team for our new office and operations in Surabaya.'
    }
  }
};

export const REQ_TITLE_DICTIONARY: Record<string, BilingualText> = {
  'Senior Backend Engineer': { id: 'Senior Backend Engineer', en: 'Senior Backend Engineer' },
  'UI/UX Designer': { id: 'Desainer UI/UX', en: 'UI/UX Designer' },
  'Product Manager': { id: 'Manajer Produk', en: 'Product Manager' },
  'Sales Development Representative': { id: 'Sales Development Representative', en: 'Sales Development Representative' },
  'Data Analyst Intern': { id: 'Magang Analis Data', en: 'Data Analyst Intern' },
  'DevOps Engineer': { id: 'DevOps Engineer', en: 'DevOps Engineer' },
};

export const JOB_TITLE_DICTIONARY: Record<string, BilingualText> = {
  'Full-Stack Developer': { id: 'Full-Stack Developer', en: 'Full-Stack Developer' },
  'Customer Service Specialist': { id: 'Spesialis Layanan Pelanggan', en: 'Customer Service Specialist' },
  'Digital Marketing Admin': { id: 'Admin Pemasaran Digital', en: 'Digital Marketing Admin' },
  'Senior Backend Engineer': { id: 'Senior Backend Engineer', en: 'Senior Backend Engineer' },
  'UI/UX Designer': { id: 'Desainer UI/UX', en: 'UI/UX Designer' },
  'Product Manager': { id: 'Manajer Produk', en: 'Product Manager' },
  'Sales Development Representative': { id: 'Sales Development Representative', en: 'Sales Development Representative' },
  'Data Analyst Intern': { id: 'Magang Analis Data', en: 'Data Analyst Intern' },
  'DevOps Engineer': { id: 'DevOps Engineer', en: 'DevOps Engineer' },
};

export const JOB_DESCRIPTION_DICTIONARY: Record<string, BilingualText> = {
  fsd01: {
    id: 'Kami mencari Pengembang Full-Stack berpengalaman untuk membangun dan mengelola infrastruktur web kami. Anda akan bertanggung jawab untuk pengembangan front-end dan back-end, desain antarmuka pengguna, pengembangan server dan basis data, serta integrasi platform seluler.',
    en: 'We are looking for a seasoned Full-Stack Developer to build out and manage our web infrastructure. You will be responsible for both front-end and back-end development, including the design of user interactions on websites, developing servers, and databases for website functionality, and coding for mobile platforms.'
  },
  css01: {
    id: 'Kami mencari Spesialis Layanan Pelanggan yang ramah dan efisien untuk bergabung dengan tim kami. Anda akan menjadi kontak utama pelanggan, menangani pertanyaan mereka, menyelesaikan masalah, dan memberikan pengalaman layanan yang unggul melalui obrolan, email, dan telepon.',
    en: 'We are seeking a friendly and efficient Customer Service Specialist to join our team. You will be the first point of contact for our customers, addressing their inquiries, resolving issues, and providing an exceptional service experience via chat, email, and phone.'
  },
  dma01: {
    id: 'Kami mencari Admin Pemasaran Digital yang teliti untuk mendukung kampanye pemasaran kami. Anda akan bertanggung jawab mengelola jadwal media sosial, menyusun laporan performa kampanye, dan memastikan data CRM kami terkelola dengan baik.',
    en: "We're looking for a detail-oriented Digital Marketing Admin to support our marketing campaigns. You will be responsible for managing social media schedules, preparing campaign performance reports, and ensuring our CRM data is clean and up-to-date."
  }
};

export const DEPARTMENT_DICTIONARY: Record<string, BilingualText> = {
  'Technology': { id: 'Teknologi', en: 'Technology' },
  'Design': { id: 'Desain', en: 'Design' },
  'Product': { id: 'Produk', en: 'Product' },
  'Sales': { id: 'Penjualan', en: 'Sales' },
  'Analytics': { id: 'Analitik', en: 'Analytics' },
  'Customer Service': { id: 'Layanan Pelanggan', en: 'Customer Service' },
  'Digital Marketing': { id: 'Pemasaran Digital', en: 'Digital Marketing' },
};

export const LEVEL_DICTIONARY: Record<string, BilingualText> = {
  'Senior': { id: 'Senior', en: 'Senior' },
  'Mid-level': { id: 'Tingkat Menengah', en: 'Mid-level' },
  'Entry-level': { id: 'Tingkat Pemula', en: 'Entry-level' },
  'Junior': { id: 'Junior', en: 'Junior' },
  'Lead': { id: 'Pemimpin Tim', en: 'Lead' },
  'Intern': { id: 'Magang', en: 'Intern' },
  'Internship': { id: 'Magang', en: 'Internship' },
  'Manager': { id: 'Manajer', en: 'Manager' },
};

export const SOURCE_DICTIONARY: Record<string, BilingualText> = {
  'LinkedIn': { id: 'LinkedIn', en: 'LinkedIn' },
  'Career Page': { id: 'Halaman Karir', en: 'Career Page' },
  'Manual Entry': { id: 'Entri Manual', en: 'Manual Entry' },
  'Referral': { id: 'Rujukan (Referral)', en: 'Referral' },
  'Agency': { id: 'Agensi', en: 'Agency' },
  'Job Board': { id: 'Portal Lowongan', en: 'Job Board' },
  'Internal Transfer': { id: 'Mutasi Internal', en: 'Internal Transfer' },
};

export const getProjectTranslation = (id: string, name: string, description: string, language: 'en' | 'id') => {
  const isId = language === 'id';
  const entry = PROJECT_DICTIONARY[id] || PROJECT_DICTIONARY[name];
  if (!entry) {
    return { name, description };
  }
  return {
    name: isId ? entry.name.id : entry.name.en,
    description: isId ? entry.description.id : entry.description.en,
  };
};

export const getRequisitionTitle = (title: string, language: 'en' | 'id') => {
  const isId = language === 'id';
  const entry = REQ_TITLE_DICTIONARY[title] || JOB_TITLE_DICTIONARY[title];
  if (!entry) return title;
  return isId ? entry.id : entry.en;
};

export const getJobTitle = (title: string, language: 'en' | 'id') => {
  const isId = language === 'id';
  const entry = JOB_TITLE_DICTIONARY[title] || REQ_TITLE_DICTIONARY[title];
  if (!entry) return title;
  return isId ? entry.id : entry.en;
};

export const getJobDescription = (id: string, description: string, language: 'en' | 'id') => {
  const isId = language === 'id';
  const entry = JOB_DESCRIPTION_DICTIONARY[id];
  if (!entry) return description;
  return isId ? entry.id : entry.en;
};

export const getDepartmentLabel = (dept: string, language: 'en' | 'id') => {
  const isId = language === 'id';
  const entry = DEPARTMENT_DICTIONARY[dept];
  if (!entry) return dept;
  return isId ? entry.id : entry.en;
};

export const getLevelLabel = (level: string, language: 'en' | 'id') => {
  const isId = language === 'id';
  const entry = LEVEL_DICTIONARY[level];
  if (!entry) return level;
  return isId ? entry.id : entry.en;
};

export const getLocationLabel = (loc: string, language: 'en' | 'id') => {
  const isId = language === 'id';
  if (!loc) return loc;
  if (isId) {
    return loc.replace('(Hybrid)', '(Hibrida)').replace(/^Remote$/, 'Jarak Jauh (Remote)');
  }
  return loc.replace('(Hibrida)', '(Hybrid)').replace(/^Jarak Jauh \(Remote\)$/, 'Remote');
};

export const getSourceLabel = (src: string, language: 'en' | 'id') => {
  const isId = language === 'id';
  const entry = SOURCE_DICTIONARY[src];
  if (!entry) return src;
  return isId ? entry.id : entry.en;
};
