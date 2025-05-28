import React, { useState, useRef } from 'react';
import { FileDown, FileUp, Trash2, Moon, Sun, FileText } from 'lucide-react';
import { useMarkdownStore } from '../stores/markdownStore';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { createPortal } from 'react-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const Header: React.FC = () => {
  const { markdown, setMarkdown } = useMarkdownStore();
  const { isDarkMode, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation();
  const languages = [
    { code: 'en', label: 'EN' },
    { code: 'pt', label: 'PT' },
    { code: 'es', label: 'ES' },
  ];
  const MySwal = withReactContent(Swal);
  const [showSaveDropdown, setShowSaveDropdown] = useState(false);
  const saveBtnRef = useRef<HTMLButtonElement>(null);

  const handleNewDocument = () => {
    if (markdown) {
      MySwal.fire({
        title: `<div class='text-gray-800 dark:text-gray-100 text-base font-medium text-center'>${t('confirm_clear_message')}</div>`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: t('confirm_clear_yes'),
        cancelButtonText: t('confirm_clear_no'),
        width: 320,
        padding: '1.5rem 1.5rem 1rem 1.5rem',
        customClass: {
          popup: isDarkMode ? 'rounded-lg bg-slate-900 border border-slate-700 text-gray-100' : 'rounded-lg bg-white border border-gray-200 text-gray-900',
          title: 'p-0',
          actions: 'flex justify-center gap-4 mt-4',
          confirmButton: isDarkMode ? 'bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-violet-400' : 'bg-violet-500 hover:bg-violet-600 text-white font-semibold rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-violet-400',
          cancelButton: isDarkMode ? 'bg-slate-700 hover:bg-slate-800 text-gray-100 font-semibold rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400' : 'bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400',
        },
        buttonsStyling: false,
        reverseButtons: true,
        focusConfirm: false,
        html: undefined,
      }).then((result) => {
        if (result.isConfirmed) {
          setMarkdown('');
        }
      });
    } else {
      setMarkdown('');
    }
  };

  const handleSaveMarkdown = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleLoadMarkdown = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setMarkdown(content);
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const handleExportPDF = async () => {
    try {
      const preview = document.querySelector('.markdown-preview');
      if (!preview) throw new Error('Preview não encontrado');
      // Verificar se há GIFs, SVGs ou vídeos
      const gifs = preview.querySelectorAll('img[src$=".gif"]');
      const svgs = preview.querySelectorAll('img[src$=".svg"], svg');
      const videos = preview.querySelectorAll('video');
      if (gifs.length > 0 || svgs.length > 0 || videos.length > 0) {
        let msg = '';
        if (gifs.length > 0) msg += `• ${t('pdf_gif_warning') || 'Imagens GIF animadas serão exportadas apenas como imagem estática (primeiro frame).'}\n`;
        if (svgs.length > 0) msg += `• ${t('pdf_svg_warning') || 'Imagens SVG podem perder qualidade ou não aparecer corretamente no PDF.'}\n`;
        if (videos.length > 0) msg += `• ${t('pdf_video_warning') || 'Vídeos não serão exportados para o PDF.'}\n`;
        const { isConfirmed } = await MySwal.fire({
          title: `<div class="text-gray-800 dark:text-gray-100 text-base font-medium text-center">${t('pdf_export_attention') || 'Atenção ao exportar para PDF'}</div>`,
          html: `<div class='text-left text-sm'>${msg.replace(/\n/g, '<br>')}</div>`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: t('continue_export') || 'Continuar exportação',
          cancelButtonText: t('cancel') || 'Cancelar',
          width: 360,
          customClass: {
            popup: isDarkMode ? 'rounded-lg bg-slate-900 border border-slate-700 text-gray-100' : 'rounded-lg bg-white border border-gray-200 text-gray-900',
            confirmButton: (isDarkMode ? 'bg-violet-600 hover:bg-violet-700 text-white' : 'bg-violet-500 hover:bg-violet-600 text-white') + ' font-semibold rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-violet-400',
            cancelButton: (isDarkMode ? 'bg-slate-700 hover:bg-slate-800 text-gray-100' : 'bg-gray-200 hover:bg-gray-300 text-gray-800') + ' font-semibold rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400',
            actions: 'flex justify-center gap-4 mt-4',
          },
          buttonsStyling: false,
          reverseButtons: true,
          focusConfirm: false,
        });
        if (!isConfirmed) return;
      }
      let originalColor = '';
      if (isDarkMode) {
        originalColor = (preview as HTMLElement).style.color;
        (preview as HTMLElement).style.color = '#111';
        preview.classList.add('force-light-pdf');
      }
      const html2pdfModule = await import('html2pdf.js');
      const html2pdf = html2pdfModule.default || html2pdfModule;
      await html2pdf()
        .set({
          margin: 0.5,
          filename: 'markdown-preview.pdf',
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
        })
        .from(preview)
        .save();
      if (isDarkMode) {
        (preview as HTMLElement).style.color = originalColor;
        preview.classList.remove('force-light-pdf');
      }
    } catch (err) {
      alert('Erro ao exportar para PDF. Tente recarregar a página ou atualizar o navegador.');
      console.error(err);
    }
  };

  return (
    <>
    <header className="bg-white dark:bg-slate-950 shadow-sm border-b border-gray-200 dark:border-slate-800 transition-colors duration-200 relative">
      <div className="max-w-screen-2xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="h-6 w-6 text-violet-500 flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 18V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8 16V8l4 4 4-4v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
          <h1 className="text-xl font-bold">{t('title')}</h1>
        </div>

        <div className="flex space-x-3 items-center">
          <input
            type="file"
            id="load-markdown"
            className="hidden"
            accept=".md, .markdown, .txt"
            onChange={handleLoadMarkdown}
          />
          
          <button
            onClick={handleNewDocument}
            className="p-1.5 rounded-md text-gray-600 hover:text-rose-500 dark:text-gray-400 dark:hover:text-rose-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors duration-150"
            title={t('new_document')}
          >
            <Trash2 size={20} />
          </button>
          
          <label 
            htmlFor="load-markdown"
            className="p-1.5 rounded-md text-gray-600 hover:text-violet-500 dark:text-gray-400 dark:hover:text-violet-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors duration-150 cursor-pointer"
            title={t('load_markdown')}
          >
            <FileUp size={20} />
          </label>
          
          <div className="relative inline-block">
            <button
              ref={saveBtnRef}
              onClick={() => setShowSaveDropdown((v) => !v)}
              className="p-1.5 rounded-md text-gray-600 hover:text-emerald-500 dark:text-gray-400 dark:hover:text-emerald-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors duration-150 relative"
              title={t('save_markdown')}
            >
              <FileDown size={20} />
            </button>
            {showSaveDropdown && (
              <div className={`absolute mt-2 left-0 z-50 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg shadow-lg min-w-[160px]`} style={{ top: '48px' }} onMouseLeave={() => setShowSaveDropdown(false)}>
                <button
                  onClick={() => { setShowSaveDropdown(false); handleSaveMarkdown(); }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-slate-800 rounded-t-lg"
                >
                  {t('save_markdown')}
                </button>
                <button
                  onClick={() => { setShowSaveDropdown(false); handleExportPDF(); }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-slate-800 rounded-b-lg"
                >
                  {t('export_pdf')}
                </button>
              </div>
            )}
          </div>
          
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-md text-gray-600 hover:text-amber-500 dark:text-gray-400 dark:hover:text-amber-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors duration-150"
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <div className="flex space-x-2 ml-4">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => i18n.changeLanguage(lang.code)}
                className={`px-2 py-1 rounded-md font-mono text-xs transition-colors duration-150 cursor-pointer border
                  ${i18n.language.startsWith(lang.code)
                    ? 'text-violet-700 dark:text-violet-300 font-bold bg-violet-100 dark:bg-violet-900/40 border-violet-400 dark:border-violet-700 shadow-sm'
                    : 'text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-slate-800 border-gray-300 dark:border-slate-700 hover:bg-violet-50 dark:hover:bg-slate-700'}
                `}
                style={{ minWidth: 28, minHeight: 28 }}
                title={lang.code.toUpperCase()}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
    </>
  );
};

export default Header