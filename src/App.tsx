import React, { useState } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import MarkdownEditor from './components/MarkdownEditor';
import Header from './components/Header';
import './i18n';
import { useTranslation } from 'react-i18next';
import Onboarding from './components/Onboarding';

function App() {
  const { t } = useTranslation();
  const [license, setLicense] = useState('');
  const [showOnboarding, setShowOnboarding] = useState(!localStorage.getItem('hasSeenOnboarding'));

  const licenses = [
    { value: '', label: t('no_license') },
    { value: 'mit', label: 'MIT', url: 'https://opensource.org/licenses/MIT' },
    { value: 'gpl', label: 'GPLv3', url: 'https://www.gnu.org/licenses/gpl-3.0.html' },
    { value: 'apache', label: 'Apache 2.0', url: 'https://www.apache.org/licenses/LICENSE-2.0' },
    { value: 'cc', label: 'Creative Commons', url: 'https://creativecommons.org/licenses/by/4.0/' },
  ];

  const handleCloseOnboarding = () => {
    console.log('Onboarding closed');
    setShowOnboarding(false);
  };

  return (
    <ThemeProvider>
      <div className="h-full flex flex-col bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-gray-100 transition-colors duration-200">
        {showOnboarding && <Onboarding onClose={handleCloseOnboarding} />}
        <Header />
        <main className="flex-1 flex flex-col overflow-hidden h-full">
          <MarkdownEditor />
        </main>
        <footer className="w-full py-2 flex flex-col items-center text-xs text-gray-500 dark:text-gray-400 bg-transparent select-none font-mono gap-1">
          <div className="flex justify-center items-center">
            {t('developed_by') + ' '}
            <a href="https://sassine.dev" target="_blank" rel="noopener noreferrer" className="underline hover:text-violet-600 dark:hover:text-violet-400 transition-colors ml-1 font-mono">sassine.dev</a>
            <span className="mx-2">·</span>
            <a
              href="https://donate.stripe.com/4gM3cx9lcbCy360cMH8so00"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 font-semibold hover:bg-violet-200 dark:hover:bg-violet-800 transition-colors ml-1 text-xs font-mono shadow-sm border border-violet-200 dark:border-violet-800"
              title={t('donate_coffee')}
            >
              <span role="img" aria-label="Café">☕</span> {t('donate_coffee')}
            </a>
          </div>
        </footer>
      </div>
    </ThemeProvider>
  );
}

export default App;