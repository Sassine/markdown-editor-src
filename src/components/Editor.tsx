import React, { useRef, useEffect, useState } from 'react';
import { Pencil } from 'lucide-react';
import EditorToolbar from './EditorToolbar';
import { useTranslation } from 'react-i18next';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useTheme } from '../contexts/ThemeContext';
import { createPortal } from 'react-dom';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
}

const Editor: React.FC<EditorProps> = ({ value, onChange }) => {
  const { t } = useTranslation();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const MySwal = withReactContent(Swal);
  const { isDarkMode } = useTheme();
  const [showFindReplace, setShowFindReplace] = useState(false);
  const [findValue, setFindValue] = useState('');
  const [replaceValue, setReplaceValue] = useState('');
  const [findIndex, setFindIndex] = useState(0);
  const [findMatches, setFindMatches] = useState<number[]>([]);
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [showTablePicker, setShowTablePicker] = useState(false);
  const [tableRows, setTableRows] = useState(3);
  const [tableCols, setTableCols] = useState(3);
  const [showLicensePicker, setShowLicensePicker] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiList = ['😀','😂','😍','👍','🔥','🎉','🥳','😎','🤔','🙌','🚀','💡','✅','❌','❤️','👏','��','😢','😡','🤩'];

  useEffect(() => {
    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key === 'Tab' && textareaRef.current === document.activeElement) {
        e.preventDefault();
        if (!textareaRef.current) return;
        const start = textareaRef.current.selectionStart;
        const end = textareaRef.current.selectionEnd;
        const newValue = value.substring(0, start) + '  ' + value.substring(end);
        onChange(newValue);
        setTimeout(() => {
          if (textareaRef.current) {
            textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2;
          }
        }, 0);
      }
    };
    const handleFindShortcut = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'f') {
        e.preventDefault();
        setShowFindReplace(true);
        setTimeout(() => {
          const input = document.getElementById('find-input');
          if (input) (input as HTMLInputElement).focus();
        }, 0);
      }
    };
    // Atalhos de Markdown
    const handleMarkdownShortcuts = (e: KeyboardEvent) => {
      if (!textareaRef.current || document.activeElement !== textareaRef.current) return;
      // Ctrl+Z e Ctrl+Y: não impedir comportamento padrão
      if ((e.ctrlKey || e.metaKey) && (e.key.toLowerCase() === 'z' || e.key.toLowerCase() === 'y')) {
        return;
      }
      // Negrito: Ctrl+B
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        handleFormat('bold');
      }
      // Itálico: Ctrl+I
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'i') {
        e.preventDefault();
        handleFormat('italic');
      }
      // Código inline: Ctrl+E
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'e') {
        e.preventDefault();
        handleFormat('code');
      }
      // Bloco de código: Ctrl+Shift+C
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'c') {
        e.preventDefault();
        handleFormat('codeblock');
      }
      // Link: Ctrl+K
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        handleFormat('link');
      }
      // Imagem: Ctrl+Shift+I
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'i') {
        e.preventDefault();
        handleFormat('image');
      }
      // Licença: Ctrl+Shift+L
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'l') {
        e.preventDefault();
        handleFormat('license');
      }
      // Tabela: Ctrl+Shift+T
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 't') {
        e.preventDefault();
        handleFormat('table');
      }
      // Linha horizontal: Ctrl+Shift+H
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'h') {
        e.preventDefault();
        handleFormat('hr');
      }
    };
    document.addEventListener('keydown', handleTabKey);
    document.addEventListener('keydown', handleFindShortcut);
    document.addEventListener('keydown', handleMarkdownShortcuts);
    return () => {
      document.removeEventListener('keydown', handleTabKey);
      document.removeEventListener('keydown', handleFindShortcut);
      document.removeEventListener('keydown', handleMarkdownShortcuts);
    };
  }, [value, onChange]);

  const handleFormat = async (format: string) => {
    if (!textareaRef.current) return;

    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const selectedText = value.substring(start, end);
    let newText = '';

    if (format === 'emoji') {
      setShowEmojiPicker(true);
      return;
    }
    if (format === 'image') {
      const { value: formValues } = await MySwal.fire({
        title: t('insert_image'),
        html:
          `<input id="swal-image-alt" class="swal2-input" placeholder="${t('image_alt_placeholder')}" value="${selectedText}" autofocus>` +
          `<input id="swal-image-url" class="swal2-input" placeholder="${t('image_url_placeholder')}">`,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: t('insert'),
        cancelButtonText: t('cancel'),
        width: 320,
        customClass: {
          popup: isDarkMode ? 'rounded-lg bg-slate-900 border border-slate-700 text-gray-100' : 'rounded-lg bg-white border border-gray-200 text-gray-900',
          confirmButton: isDarkMode ? 'bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-violet-400' : 'bg-violet-500 hover:bg-violet-600 text-white font-semibold rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-violet-400',
          cancelButton: isDarkMode ? 'bg-slate-700 hover:bg-slate-800 text-gray-100 font-semibold rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400' : 'bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400',
        },
        preConfirm: () => {
          const alt = (document.getElementById('swal-image-alt') as HTMLInputElement).value;
          const url = (document.getElementById('swal-image-url') as HTMLInputElement).value;
          if (!url) {
            Swal.showValidationMessage(t('image_url_required'));
            return;
          }
          return { alt, url };
        }
      });
      if (formValues) {
        newText = `![${formValues.alt || ''}](${formValues.url})`;
      } else {
        return;
      }
    } else if (format === 'link') {
      const { value: formValues } = await MySwal.fire({
        title: t('insert_link'),
        html:
          `<input id="swal-link-text" class="swal2-input" placeholder="${t('link_text_placeholder')}" value="${selectedText}" autofocus>` +
          `<input id="swal-link-url" class="swal2-input" placeholder="${t('link_url_placeholder')}">`,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: t('insert'),
        cancelButtonText: t('cancel'),
        width: 320,
        customClass: {
          popup: isDarkMode ? 'rounded-lg bg-slate-900 border border-slate-700 text-gray-100' : 'rounded-lg bg-white border border-gray-200 text-gray-900',
          confirmButton: isDarkMode ? 'bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-violet-400' : 'bg-violet-500 hover:bg-violet-600 text-white font-semibold rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-violet-400',
          cancelButton: isDarkMode ? 'bg-slate-700 hover:bg-slate-800 text-gray-100 font-semibold rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400' : 'bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400',
        },
        preConfirm: () => {
          const text = (document.getElementById('swal-link-text') as HTMLInputElement).value;
          const url = (document.getElementById('swal-link-url') as HTMLInputElement).value;
          if (!url) {
            Swal.showValidationMessage(t('link_url_required'));
            return;
          }
          return { text, url };
        }
      });
      if (formValues) {
        newText = `[${formValues.text || ''}](${formValues.url})`;
      } else {
        return;
      }
    } else if (format === 'codeblock') {
      const languages = [
        '', 'javascript', 'typescript', 'python', 'java', 'c', 'cpp', 'csharp', 'go', 'ruby', 'php', 'bash', 'json', 'html', 'css', 'markdown', 'shell', 'sql', 'yaml'
      ];
      const { value: formValues } = await MySwal.fire({
        title: t('insert_codeblock'),
        html:
          `<select id=\"swal-codeblock-lang\" class=\"swal2-input\" style=\"width:90%;margin:0.25rem auto;border-radius:0.5rem;\">` +
            languages.map(lang => `<option value=\"${lang}\">${lang ? lang : t('codeblock_lang_placeholder')}</option>`).join('') +
          `</select>` +
          `<textarea id=\"swal-codeblock-text\" class=\"swal2-textarea\" placeholder=\"${t('codeblock_text_placeholder')}\" style=\"min-height:80px;max-width:90%;width:90%;margin:0.25rem auto;border-radius:0.5rem;\">${selectedText}</textarea>`,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: t('insert'),
        cancelButtonText: t('cancel'),
        width: 320,
        customClass: {
          popup: isDarkMode ? 'rounded-lg bg-slate-900 border border-slate-700 text-gray-100' : 'rounded-lg bg-white border border-gray-200 text-gray-900',
          confirmButton: isDarkMode ? 'bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-violet-400' : 'bg-violet-500 hover:bg-violet-600 text-white font-semibold rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-violet-400',
          cancelButton: isDarkMode ? 'bg-slate-700 hover:bg-slate-800 text-gray-100 font-semibold rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400' : 'bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400',
        },
        preConfirm: () => {
          const lang = (document.getElementById('swal-codeblock-lang') as HTMLSelectElement).value;
          const code = (document.getElementById('swal-codeblock-text') as HTMLTextAreaElement).value;
          if (!code) {
            Swal.showValidationMessage(t('codeblock_text_required'));
            return;
          }
          return { lang, code };
        }
      });
      if (formValues) {
        if (formValues.lang) {
          newText = `\`\`\`${formValues.lang}\n${formValues.code}\n\`\`\``;
        } else {
          newText = `\`\`\`\n${formValues.code}\n\`\`\``;
        }
      } else {
        return;
      }
    } else if (format === 'table') {
      setShowTablePicker(true);
      return;
    } else if (format === 'license') {
      setShowLicensePicker(true);
      return;
    } else {
      let insertText = '';
      switch (format) {
        case 'bold': {
          const before = value.substring(0, start);
          const after = value.substring(end);
          const selected = value.substring(start, end);
          if (selected.startsWith('**') && selected.endsWith('**') && selected.length > 3) {
            insertText = selected.slice(2, -2);
            break;
          }
          const hasBoldBefore = before.endsWith('**');
          const hasBoldAfter = after.startsWith('**');
          if (hasBoldBefore && hasBoldAfter) {
            const newStart = start - 2;
            const newEnd = end + 2;
            textareaRef.current.setSelectionRange(newStart, newEnd);
            textareaRef.current.setRangeText(selected, newStart, newEnd, 'end');
            onChange(textareaRef.current.value);
            setTimeout(() => {
              if (textareaRef.current) {
                textareaRef.current.focus();
                textareaRef.current.selectionStart = textareaRef.current.selectionEnd;
              }
            }, 0);
            return;
          } else {
            insertText = `**${selected}**`;
          }
          break;
        }
        case 'italic': {
          const before = value.substring(0, start);
          const after = value.substring(end);
          const selected = value.substring(start, end);
          if (selected.startsWith('*') && selected.endsWith('*') && selected.length > 2) {
            insertText = selected.slice(1, -1);
            break;
          }
          const hasItalicBefore = before.endsWith('*');
          const hasItalicAfter = after.startsWith('*');
          if (hasItalicBefore && hasItalicAfter) {
            const newStart = start - 1;
            const newEnd = end + 1;
            textareaRef.current.setSelectionRange(newStart, newEnd);
            textareaRef.current.setRangeText(selected, newStart, newEnd, 'end');
            onChange(textareaRef.current.value);
            setTimeout(() => {
              if (textareaRef.current) {
                textareaRef.current.focus();
                textareaRef.current.selectionStart = textareaRef.current.selectionEnd;
              }
            }, 0);
            return;
          } else {
            insertText = `*${selected}*`;
          }
          break;
        }
        case 'code': {
          const before = value.substring(0, start);
          const after = value.substring(end);
          const selected = value.substring(start, end);
          if (selected.startsWith('`') && selected.endsWith('`') && selected.length > 2) {
            insertText = selected.slice(1, -1);
            break;
          }
          const hasCodeBefore = before.endsWith('`');
          const hasCodeAfter = after.startsWith('`');
          if (hasCodeBefore && hasCodeAfter) {
            const newStart = start - 1;
            const newEnd = end + 1;
            textareaRef.current.setSelectionRange(newStart, newEnd);
            textareaRef.current.setRangeText(selected, newStart, newEnd, 'end');
            onChange(textareaRef.current.value);
            setTimeout(() => {
              if (textareaRef.current) {
                textareaRef.current.focus();
                textareaRef.current.selectionStart = textareaRef.current.selectionEnd;
              }
            }, 0);
            return;
          } else {
            insertText = `\`${selected}\``;
          }
          break;
        }
        case 'h1':
          insertText = `# ${selectedText}`;
          break;
        case 'h2':
          insertText = `## ${selectedText}`;
          break;
        case 'h3':
          insertText = `### ${selectedText}`;
          break;
        case 'quote':
          insertText = `> ${selectedText}`;
          break;
        case 'ul':
          insertText = `- ${selectedText}`;
          break;
        case 'ol':
          insertText = `1. ${selectedText}`;
          break;
        case 'hr':
          insertText = `\n---\n`;
          break;
        default:
          return;
      }
      if (!textareaRef.current) return;
      textareaRef.current.setRangeText(insertText, start, end, 'end');
      onChange(textareaRef.current.value);
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd;
        }
      }, 0);
      return;
    }

    const updatedValue = value.substring(0, start) + newText + value.substring(end);
    onChange(updatedValue);

    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.selectionStart = start + newText.length;
        textareaRef.current.selectionEnd = start + newText.length;
      }
    }, 0);
  };

  // Funções de busca e substituição
  const handleFind = (find: string) => {
    if (!find) {
      setFindMatches([]);
      setFindIndex(0);
      return;
    }
    const matches: number[] = [];
    const searchValue = caseSensitive ? value : value.toLowerCase();
    const findTerm = caseSensitive ? find : find.toLowerCase();
    let idx = searchValue.indexOf(findTerm);
    while (idx !== -1) {
      matches.push(idx);
      idx = searchValue.indexOf(findTerm, idx + findTerm.length);
    }
    setFindMatches(matches);
    setFindIndex(matches.length > 0 ? 0 : -1);
  };
  const handleFindNext = () => {
    if (findMatches.length === 0) return;
    const next = (findIndex + 1) % findMatches.length;
    setFindIndex(next);
    if (textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.selectionStart = findMatches[next];
      textareaRef.current.selectionEnd = findMatches[next] + findValue.length;
    }
  };
  const handleFindPrev = () => {
    if (findMatches.length === 0) return;
    const prev = (findIndex - 1 + findMatches.length) % findMatches.length;
    setFindIndex(prev);
    if (textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.selectionStart = findMatches[prev];
      textareaRef.current.selectionEnd = findMatches[prev] + findValue.length;
    }
  };
  const handleReplace = () => {
    if (findMatches.length === 0 || findIndex === -1) return;
    const start = findMatches[findIndex];
    const end = start + findValue.length;
    const updated = value.substring(0, start) + replaceValue + value.substring(end);
    onChange(updated);
    setTimeout(() => handleFind(replaceValue || findValue), 0);
  };
  const handleReplaceAll = () => {
    if (!findValue) return;
    const updated = value.split(findValue).join(replaceValue);
    onChange(updated);
    setTimeout(() => handleFind(replaceValue || findValue), 0);
  };
  const handleCloseFind = () => {
    setShowFindReplace(false);
    setFindValue('');
    setReplaceValue('');
    setFindMatches([]);
    setFindIndex(0);
  };

  // Função para inserir tabela markdown
  const insertTable = (rows: number, cols: number) => {
    if (!textareaRef.current) return;
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    // Cabeçalho
    let header = '|';
    let separator = '|';
    for (let c = 0; c < cols; c++) {
      header += ` ${t('table_column')} ${c + 1} |`;
      separator += ' --- |';
    }
    let body = '';
    for (let r = 0; r < rows; r++) {
      let row = '|';
      for (let c = 0; c < cols; c++) {
        row += '     |';
      }
      body += row + '\n';
    }
    const tableMarkdown = `${header}\n${separator}\n${body}`;
    const updatedValue = value.substring(0, start) + tableMarkdown + value.substring(end);
    onChange(updatedValue);
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.selectionStart = start + tableMarkdown.length;
        textareaRef.current.selectionEnd = start + tableMarkdown.length;
      }
    }, 0);
    setShowTablePicker(false);
  };

  // Função para inserir licença no markdown
  const insertLicense = (license: string) => {
    if (!textareaRef.current) return;
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    let licenseText = '';
    switch (license) {
      case 'mit':
        licenseText = '[MIT License](https://opensource.org/licenses/MIT)';
        break;
      case 'gpl':
        licenseText = '[GPLv3 License](https://www.gnu.org/licenses/gpl-3.0.html)';
        break;
      case 'apache':
        licenseText = '[Apache 2.0 License](https://www.apache.org/licenses/LICENSE-2.0)';
        break;
      case 'cc':
        licenseText = '[Creative Commons BY 4.0](https://creativecommons.org/licenses/by/4.0/)';
        break;
      default:
        return;
    }
    const updatedValue = value.substring(0, start) + licenseText + value.substring(end);
    onChange(updatedValue);
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.selectionStart = start + licenseText.length;
        textareaRef.current.selectionEnd = start + licenseText.length;
      }
    }, 0);
    setShowLicensePicker(false);
  };

  // Função para inserir emoji
  const insertEmoji = (emoji: any) => {
    if (!textareaRef.current) return;
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    textareaRef.current.setRangeText(emoji.native, start, end, 'end');
    onChange(textareaRef.current.value);
    setShowEmojiPicker(false);
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.selectionStart = textareaRef.current.selectionEnd;
      }
    }, 0);
  };

  return (
    <div className="h-full w-full flex flex-col bg-white dark:bg-slate-900 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700">
      <div className="p-3 border-b border-gray-200 dark:border-slate-800 flex items-center bg-gray-50 dark:bg-slate-900/50 backdrop-blur supports-[backdrop-filter]:bg-gray-50/80 dark:supports-[backdrop-filter]:bg-slate-900/80">
        <Pencil size={18} className="mr-2 text-violet-500" />
        <h2 className="text-lg font-medium">{t('editor')}</h2>
      </div>
      <EditorToolbar onFormat={handleFormat} />
      <div className="flex-1 flex flex-col w-full h-full overflow-auto rounded-lg">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-full p-4 font-mono text-sm resize-none outline-none bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 transition-all duration-200 focus:ring-2 focus:ring-violet-500/20 rounded-lg border border-gray-200 dark:border-slate-700"
          placeholder={t('editor_placeholder')}
          spellCheck="false"
          style={{ height: '100%', width: '100%' }}
        />
      </div>
      {/* Modal de busca e substituição */}
      {showFindReplace && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/30 find-replace-modal`} onClick={handleCloseFind}> 
          <div className={`rounded-lg p-4 shadow-xl border w-full max-w-xs ${isDarkMode ? 'bg-slate-900 border-slate-700 text-gray-100' : 'bg-white border-gray-200 text-gray-900'}`} onClick={e => e.stopPropagation()}> 
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <input
                  id="find-input"
                  className="flex-1 p-1 rounded border outline-none text-xs bg-inherit h-8"
                  placeholder="Buscar..."
                  value={findValue}
                  onChange={e => { setFindValue(e.target.value); handleFind(e.target.value); }}
                />
                <button onClick={handleCloseFind} className="px-1 py-1 rounded text-gray-700 dark:text-gray-100 text-xs h-8 bg-transparent hover:bg-gray-200 dark:hover:bg-slate-700">✕</button>
              </div>
              <input
                className="p-1 rounded border outline-none text-xs bg-inherit mb-2 h-8"
                placeholder="Substituir por..."
                value={replaceValue}
                onChange={e => setReplaceValue(e.target.value)}
              />
              <div className="w-full inline-flex items-center text-xs select-none mb-2">
                <input id="case-sensitive-checkbox" type="checkbox" checked={caseSensitive} onChange={e => { setCaseSensitive(e.target.checked); handleFind(findValue); }}
                  className="w-4 h-4 accent-violet-600 focus:ring-violet-500 border-violet-400 m-0 p-0"
                  style={{minWidth: '16px'}}
                />
                <label htmlFor="case-sensitive-checkbox" className="inline-block align-middle whitespace-nowrap cursor-pointer ml-0">Diferenciar maiúsculas/minúsculas</label>
              </div>
              <div className="flex gap-2 mb-1">
                <button onClick={handleFindPrev} className="flex-1 px-1 py-1 rounded bg-gray-100 dark:bg-slate-800 text-xs h-8 inline-flex items-center justify-center gap-1">
                  <svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' fill='none' viewBox='0 0 24 24'><path stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' d='M12 5v14m0 0-7-7m7 7 7-7'/></svg>
                  Anterior
                </button>
                <button onClick={handleFindNext} className="flex-1 px-1 py-1 rounded bg-gray-100 dark:bg-slate-800 text-xs h-8 inline-flex items-center justify-center gap-1">
                  Próximo
                  <svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' fill='none' viewBox='0 0 24 24'><path stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' d='M12 19V5m0 14-7-7m7 7 7-7'/></svg>
                </button>
              </div>
              <div className="flex gap-2 mb-1">
                <button onClick={handleReplace} className="flex-1 px-1 py-1 rounded bg-violet-500 text-white text-xs h-8">Substituir</button>
                <button onClick={handleReplaceAll} className="flex-1 px-1 py-1 rounded bg-violet-700 text-white text-xs h-8">Substituir todos</button>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{findMatches.length > 0 ? `${findIndex + 1} de ${findMatches.length}` : 'Nenhuma ocorrência'}</div>
            </div>
          </div>
        </div>
      )}
      {/* Modal/Popover de seleção de tabela */}
      {showTablePicker && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" onClick={() => setShowTablePicker(false)}>
          <div className="bg-white dark:bg-slate-900 rounded-lg p-4 shadow-xl border border-gray-200 dark:border-slate-700" onClick={e => e.stopPropagation()}>
            <div className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-100">{t('table_picker_title')}</div>
            <div className="flex flex-col gap-1">
              {[...Array(6)].map((_, r) => (
                <div key={r} className="flex gap-1">
                  {[...Array(6)].map((_, c) => (
                    <div
                      key={c}
                      className={`w-6 h-6 border rounded cursor-pointer flex items-center justify-center text-xs select-none transition-colors duration-100 ${r < tableRows && c < tableCols ? 'bg-violet-500 text-white' : 'bg-gray-100 dark:bg-slate-800 text-gray-400'}`}
                      onMouseEnter={() => { setTableRows(r + 1); setTableCols(c + 1); }}
                      onClick={() => insertTable(r + 1, c + 1)}
                    >
                      {r < tableRows && c < tableCols ? '' : ''}
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">{t('table_picker_count', { rows: tableRows, cols: tableCols })}</div>
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">{tableRows} x {tableCols}</div>
            <div className="flex justify-center mt-3">
              <button onClick={() => setShowTablePicker(false)} className="px-3 py-1 rounded bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-100 text-xs">{t('cancel')}</button>
            </div>
          </div>
        </div>,
        document.body
      )}
      {/* Modal de seleção de licença */}
      {showLicensePicker && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" onClick={() => setShowLicensePicker(false)}>
          <div className="bg-white dark:bg-slate-900 rounded-lg p-4 shadow-xl border border-gray-300 dark:border-slate-700 min-w-[220px]" onClick={e => e.stopPropagation()}>
            <div className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-100">{t('license')}</div>
            <div className="flex flex-col gap-2">
              <button onClick={() => insertLicense('mit')} className="px-3 py-2 rounded border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-100 hover:bg-violet-100 dark:hover:bg-violet-800 transition-colors">MIT</button>
              <button onClick={() => insertLicense('gpl')} className="px-3 py-2 rounded border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-100 hover:bg-violet-100 dark:hover:bg-violet-800 transition-colors">GPLv3</button>
              <button onClick={() => insertLicense('apache')} className="px-3 py-2 rounded border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-100 hover:bg-violet-100 dark:hover:bg-violet-800 transition-colors">Apache 2.0</button>
              <button onClick={() => insertLicense('cc')} className="px-3 py-2 rounded border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-100 hover:bg-violet-100 dark:hover:bg-violet-800 transition-colors">Creative Commons</button>
            </div>
            <div className="flex justify-center mt-3">
              <button onClick={() => setShowLicensePicker(false)} className="px-3 py-1 rounded border border-gray-200 dark:border-slate-700 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-100 text-xs hover:bg-gray-200 dark:hover:bg-slate-800 transition-colors">{t('cancel')}</button>
            </div>
          </div>
        </div>,
        document.body
      )}
      {/* Emoji Picker Popover */}
      {showEmojiPicker && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" onClick={() => setShowEmojiPicker(false)}>
          <div className="bg-white dark:bg-slate-900 rounded-lg p-4 shadow-xl border border-gray-200 dark:border-slate-700 min-w-[320px]" onClick={e => e.stopPropagation()}>
            <Picker
              data={data}
              onEmojiSelect={insertEmoji}
              theme={isDarkMode ? 'dark' : 'light'}
              previewPosition="none"
              skinTonePosition="search"
              locale={t('lang') || 'pt'}
            />
            <div className="flex justify-center mt-3">
              <button onClick={() => setShowEmojiPicker(false)} className="px-3 py-1 rounded bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-100 text-xs">Fechar</button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default Editor;