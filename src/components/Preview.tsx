import React from 'react';
import { useMarkdownParser } from '../hooks/useMarkdownParser';
import { Eye } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface PreviewProps {
  markdown: string;
}

const Preview: React.FC<PreviewProps> = ({ markdown }) => {
  const { t } = useTranslation();
  const { parsedHtml } = useMarkdownParser(markdown, t('copied'));

  return (
    <div className="h-full w-full flex flex-col bg-white dark:bg-slate-900 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700 overflow-hidden">
      <div className="p-3 border-b border-gray-200 dark:border-slate-800 flex items-center bg-gray-50 dark:bg-slate-900/50 backdrop-blur supports-[backdrop-filter]:bg-gray-50/80 dark:supports-[backdrop-filter]:bg-slate-900/80">
        <Eye size={18} className="mr-2 text-emerald-500" />
        <h2 className="text-lg font-medium">{t('preview')}</h2>
      </div>
      <div 
        className="flex-1 p-4 overflow-auto w-full markdown-preview"
        dangerouslySetInnerHTML={{ __html: parsedHtml }}
      />
    </div>
  );
};

export default Preview;