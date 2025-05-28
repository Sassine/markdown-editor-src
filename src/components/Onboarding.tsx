import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Pencil, Eye, Settings, Keyboard, Coffee, BookOpen } from 'lucide-react';

const Onboarding: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { t, i18n } = useTranslation();
  const [step, setStep] = useState(0);

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
    if (hasSeenOnboarding) {
      onClose();
    }
  }, [onClose]);

  const steps = [
    {
      title: t('onboarding_welcome_title'),
      content: t('onboarding_welcome_content'),
      highlight: '.editor',
      icon: <BookOpen size={32} className="text-violet-500" />,
    },
    {
      title: t('onboarding_editor_title'),
      content: t('onboarding_editor_content'),
      highlight: '.editor',
      icon: <Pencil size={32} className="text-violet-500" />,
    },
    {
      title: t('onboarding_preview_title'),
      content: t('onboarding_preview_content'),
      highlight: '.preview',
      icon: <Eye size={32} className="text-emerald-500" />,
    },
    {
      title: t('onboarding_toolbar_title'),
      content: t('onboarding_toolbar_content'),
      highlight: '.toolbar',
      icon: <Settings size={32} className="text-blue-500" />,
    },
    {
      title: t('onboarding_shortcuts_title'),
      content: t('onboarding_shortcuts_content'),
      highlight: '.shortcuts',
      icon: <Keyboard size={32} className="text-yellow-500" />,
    },
    {
      title: t('onboarding_finish_title'),
      content: t('onboarding_finish_content') + ' ' + t('onboarding_coffee'),
      highlight: '',
      icon: <Coffee size={32} className="text-brown-500" />,
    },
  ];

  const nextStep = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      localStorage.setItem('hasSeenOnboarding', 'true');
      onClose();
    }
  };

  const prevStep = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  useEffect(() => {
    if (steps[step].highlight) {
      const highlightElement = document.querySelector(steps[step].highlight);
      if (highlightElement) {
        highlightElement.classList.add('highlight');
      }
      return () => {
        if (highlightElement) {
          highlightElement.classList.remove('highlight');
        }
      };
    }
  }, [step, steps]);

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white dark:bg-slate-900 rounded-lg p-4 shadow-xl border border-gray-200 dark:border-slate-700 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <div>{steps[step].icon}</div>
          <div className="flex space-x-2">
            <button onClick={() => changeLanguage('en')} className="px-2 py-1 rounded bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-100 text-xs">EN</button>
            <button onClick={() => changeLanguage('pt')} className="px-2 py-1 rounded bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-100 text-xs">PT</button>
            <button onClick={() => changeLanguage('es')} className="px-2 py-1 rounded bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-100 text-xs">ES</button>
          </div>
        </div>
        <h2 className="text-lg font-bold mb-2">{steps[step].title}</h2>
        <p className="mb-4">{steps[step].content}</p>
        <div className="flex justify-between">
          <button onClick={prevStep} disabled={step === 0} className="px-3 py-1 rounded bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-100 text-xs">{t('previous')}</button>
          <button onClick={nextStep} className="px-3 py-1 rounded bg-violet-500 text-white text-xs">{t('next')}</button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding; 