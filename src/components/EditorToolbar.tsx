import React from 'react';
import {
  Bold,
  Italic,
  Code,
  Link,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  FileCode,
  Image,
  Table,
  Minus,
  BadgeCheck,
  Smile
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface EditorToolbarProps {
  onFormat: (format: string) => void;
}

const EditorToolbar: React.FC<EditorToolbarProps> = ({ onFormat }) => {
  const { t } = useTranslation();

  return (
    <div className="border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 p-1.5 flex flex-wrap gap-1">
      <button
        onClick={() => onFormat('bold')}
        className="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-100 transition-all duration-200 hover:scale-105 active:scale-95"
        title={t('bold')}
      >
        <Bold size={16} />
      </button>
      <button
        onClick={() => onFormat('italic')}
        className="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-100 transition-all duration-200 hover:scale-105 active:scale-95"
        title={t('italic')}
      >
        <Italic size={16} />
      </button>
      <button
        onClick={() => onFormat('code')}
        className="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-100 transition-all duration-200 hover:scale-105 active:scale-95"
        title={t('code')}
      >
        <Code size={16} />
      </button>
      <button
        onClick={() => onFormat('link')}
        className="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-100 transition-all duration-200 hover:scale-105 active:scale-95"
        title={t('link')}
      >
        <Link size={16} />
      </button>
      <div className="w-px h-6 my-auto mx-1 bg-gray-300 dark:bg-slate-700 rounded-full" />
      <button
        onClick={() => onFormat('h1')}
        className="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-100 transition-all duration-200 hover:scale-105 active:scale-95"
        title={t('h1')}
      >
        <Heading1 size={16} />
      </button>
      <button
        onClick={() => onFormat('h2')}
        className="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-100 transition-all duration-200 hover:scale-105 active:scale-95"
        title={t('h2')}
      >
        <Heading2 size={16} />
      </button>
      <button
        onClick={() => onFormat('h3')}
        className="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-100 transition-all duration-200 hover:scale-105 active:scale-95"
        title={t('h3')}
      >
        <Heading3 size={16} />
      </button>
      <div className="w-px h-6 my-auto mx-1 bg-gray-300 dark:bg-slate-700 rounded-full" />
      <button
        onClick={() => onFormat('quote')}
        className="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-100 transition-all duration-200 hover:scale-105 active:scale-95"
        title={t('quote')}
      >
        <Quote size={16} />
      </button>
      <button
        onClick={() => onFormat('ul')}
        className="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-100 transition-all duration-200 hover:scale-105 active:scale-95"
        title={t('ul')}
      >
        <List size={16} />
      </button>
      <button
        onClick={() => onFormat('ol')}
        className="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-100 transition-all duration-200 hover:scale-105 active:scale-95"
        title={t('ol')}
      >
        <ListOrdered size={16} />
      </button>
      <button
        onClick={() => onFormat('codeblock')}
        className="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-100 transition-all duration-200 hover:scale-105 active:scale-95"
        title={t('codeblock')}
      >
        <FileCode size={16} />
      </button>
      <button
        onClick={() => onFormat('image')}
        className="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-100 transition-all duration-200 hover:scale-105 active:scale-95"
        title={t('image')}
      >
        <Image size={16} />
      </button>
      <button
        onClick={() => onFormat('table')}
        className="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-100 transition-all duration-200 hover:scale-105 active:scale-95"
        title={t('table')}
      >
        <Table size={16} />
      </button>
      <button
        onClick={() => onFormat('hr')}
        className="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-100 transition-all duration-200 hover:scale-105 active:scale-95"
        title={t('hr')}
      >
        <Minus size={16} />
      </button>
      <button
        onClick={() => onFormat('license')}
        className="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-100 transition-all duration-200 hover:scale-105 active:scale-95"
        title={t('license')}
      >
        <BadgeCheck size={16} />
      </button>
      <button
        onClick={() => onFormat('emoji')}
        className="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-100 transition-all duration-200 hover:scale-105 active:scale-95"
        title={t('emoji') || 'Emoji'}
      >
        <Smile size={16} />
      </button>
    </div>
  );
};

export default EditorToolbar;