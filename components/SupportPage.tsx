import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { QuestionMarkCircleIcon, ChatBubbleLeftRightIcon, BookOpenIcon, ChevronDownIcon, ChevronUpIcon } from './icons/Icons';
import { translations } from '../utils/translations';

interface SupportPageProps {
  language?: 'en' | 'id';
}

const SupportPage: React.FC<SupportPageProps> = ({ language = 'id' }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const t = translations[language]?.support || translations.id.support;

  const faqs = [
    {
      q: t.faq1Q,
      a: t.faq1A,
    },
    {
      q: t.faq2Q,
      a: t.faq2A,
    },
    {
      q: t.faq3Q,
      a: t.faq3A,
    },
    {
      q: t.faq4Q,
      a: t.faq4A,
    },
  ];

  return (
    <div className="space-y-12 pb-20">
      <div className="space-y-4">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">{t.title}</h2>
        <p className="text-slate-500 dark:text-slate-400">{t.subtitle}</p>
      </div>

      {/* Support Channels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <SupportCard 
          icon={<BookOpenIcon className="w-8 h-8 text-blue-600" />}
          title={t.docsTitle}
          description={t.docsDesc}
          actionText={t.docsAction}
        />
        <SupportCard 
          icon={<ChatBubbleLeftRightIcon className="w-8 h-8 text-green-600" />}
          title={t.chatTitle}
          description={t.chatDesc}
          actionText={t.chatAction}
        />
        <SupportCard 
          icon={<QuestionMarkCircleIcon className="w-8 h-8 text-primary-600" />}
          title={t.faqTitle}
          description={t.faqDesc}
          actionText={t.faqAction}
        />
      </div>

      {/* FAQs Section */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm space-y-6">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">{t.faqTitle}</h3>
        <div className="space-y-4 divide-y divide-slate-200 dark:divide-slate-800">
          {faqs.map((faq, index) => (
            <div key={index} className="pt-4 first:pt-0">
              <button
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                className="w-full flex items-center justify-between text-left py-2 font-semibold text-slate-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                <span>{faq.q}</span>
                {openFaq === index ? <ChevronUpIcon className="w-5 h-5 flex-shrink-0 ml-4" /> : <ChevronDownIcon className="w-5 h-5 flex-shrink-0 ml-4" />}
              </button>
              <AnimatePresence>
                {openFaq === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <p className="text-sm text-slate-600 dark:text-slate-400 py-3 leading-relaxed">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const SupportCard: React.FC<{ icon: React.ReactNode; title: string; description: string; actionText: string }> = ({ icon, title, description, actionText }) => (
  <div className="p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-6">
    <div className="space-y-4">
      <div className="w-14 h-14 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center">
        {icon}
      </div>
      <h4 className="text-xl font-bold text-slate-900 dark:text-white">{title}</h4>
      <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{description}</p>
    </div>
    <button className="w-full py-3 bg-slate-100 dark:bg-slate-800 hover:bg-primary-50 dark:hover:bg-primary-950/40 text-slate-700 dark:text-slate-200 hover:text-primary-600 dark:hover:text-primary-400 font-semibold rounded-xl transition-all">
      {actionText}
    </button>
  </div>
);

export default SupportPage;
