import { useState, useEffect } from 'react';
import { marked } from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';

// Custom renderer para blocos de código com highlight
const renderer = new marked.Renderer();
const originalRendererCode = renderer.code;

// Links abrem em nova aba
renderer.link = function(href, title, text) {
  const isExternal = href && !href.startsWith('#') && !href.startsWith('/');
  return `<a href="${href}"${title ? ` title="${title}"` : ''} target="_blank" rel="noopener noreferrer">${text}</a>`;
};

renderer.code = function(code: string, language: string | undefined, isEscaped: boolean) {
  const uniqueId = `code-${Math.random().toString(36).substr(2, 9)}`;
  // Highlight
  let highlighted = code;
  if (language && hljs.getLanguage(language)) {
    highlighted = hljs.highlight(code, { language }).value;
  } else {
    highlighted = hljs.highlightAuto(code).value;
  }
  // Gera HTML do bloco de código
  return `
    <div class="relative code-block-wrapper">
      <div class="absolute right-2 top-2">
        <button 
          onclick="copyCode('${uniqueId}', this)"
          class="copy-button p-1.5 rounded-md bg-gray-700/50 hover:bg-gray-700/80 text-gray-300 hover:text-white transition-colors duration-150"
          title="Copy code"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="copy-icon">
            <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
          </svg>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="check-icon hidden text-green-400">
            <path d="M20 6 9 17l-5-5"></path>
          </svg>
        </button>
      </div>
      ${language ? `<div class="absolute left-2 top-2 text-xs text-gray-400 font-mono">${language}</div>` : ''}
      <div id="${uniqueId}" class="hidden">${code}</div>
      <pre class="hljs"><code>${highlighted}</code></pre>
    </div>
  `;
};

marked.setOptions({
  renderer,
  breaks: true,
  gfm: true
});

// Adiciona script de cópia
const addCopyScript = (copiedText: string) => {
  const oldScript = document.getElementById('copy-code-script');
  if (oldScript) {
    oldScript.remove();
  }
  const script = document.createElement('script');
  script.id = 'copy-code-script';
  script.innerHTML = `
    function copyCode(id, btn) {
      const code = document.getElementById(id).textContent;
      navigator.clipboard.writeText(code).then(function() {
        const button = btn || null;
        const copyIcon = button ? button.querySelector('.copy-icon') : null;
        const checkIcon = button ? button.querySelector('.check-icon') : null;
        if (copyIcon && checkIcon) {
          copyIcon.classList.add('hidden');
          checkIcon.classList.remove('hidden');
        }
        let toast = document.createElement('div');
        toast.textContent = ${JSON.stringify(copiedText)};
        toast.style.position = 'fixed';
        toast.style.background = '#22c55e';
        toast.style.color = '#fff';
        toast.style.fontWeight = 'bold';
        toast.style.letterSpacing = '0.03em';
        toast.style.padding = '8px 20px';
        toast.style.borderRadius = '8px';
        toast.style.fontFamily = 'monospace';
        toast.style.fontSize = '1rem';
        toast.style.zIndex = 9999;
        toast.style.boxShadow = '0 2px 12px 0 rgba(34,197,94,0.15)';
        if (button) {
          const rect = button.getBoundingClientRect();
          toast.style.left = rect.left + rect.width / 2 + 'px';
          toast.style.top = (rect.top + window.scrollY - 36) + 'px';
          toast.style.transform = 'translateX(-50%)';
        } else {
          toast.style.top = '24px';
          toast.style.left = '50%';
          toast.style.transform = 'translateX(-50%)';
        }
        document.body.appendChild(toast);
        setTimeout(function() {
          toast.remove();
        }, 2000);
        if (copyIcon && checkIcon) {
          setTimeout(function() {
            copyIcon.classList.remove('hidden');
            checkIcon.classList.add('hidden');
          }, 2000);
        }
      }).catch(function(err) {
        console.error('Failed to copy text: ', err);
      });
    }
  `;
  document.body.appendChild(script);
};

export const useMarkdownParser = (markdown: string, copiedText: string = 'Copied!') => {
  const [parsedHtml, setParsedHtml] = useState('');

  useEffect(() => {
    addCopyScript(copiedText);
    try {
      const html = marked.parse(markdown) as string;
      setParsedHtml(html);
    } catch (error) {
      console.error('Error parsing markdown:', error);
      setParsedHtml('<p>Error parsing markdown</p>');
    }
  }, [markdown, copiedText]);

  return { parsedHtml };
};