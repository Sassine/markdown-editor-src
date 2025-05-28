import React, { useState, useEffect } from 'react';
import Split from 'react-split';
import { useMarkdownStore } from '../stores/markdownStore';
import Editor from './Editor';
import Preview from './Preview';
import { MoveHorizontal, Maximize2, Minimize2 } from 'lucide-react';

const MarkdownEditor: React.FC = () => {
  const { markdown, setMarkdown } = useMarkdownStore();
  const [isFullScreenEditor, setIsFullScreenEditor] = useState(false);
  const [isFullScreenPreview, setIsFullScreenPreview] = useState(false);
  const [sizes, setSizes] = useState([50, 50]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const savedMarkdown = localStorage.getItem('markdown');
    if (savedMarkdown) {
      setMarkdown(savedMarkdown);
    }
  }, [setMarkdown]);

  useEffect(() => {
    localStorage.setItem('markdown', markdown);
  }, [markdown]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleChange = (value: string) => {
    setMarkdown(value);
  };

  const toggleFullScreenEditor = () => {
    setIsFullScreenEditor(!isFullScreenEditor);
    setIsFullScreenPreview(false);
    setSizes(isFullScreenEditor ? [50, 50] : [100, 0]);
  };

  const toggleFullScreenPreview = () => {
    setIsFullScreenPreview(!isFullScreenPreview);
    setIsFullScreenEditor(false);
    setSizes(isFullScreenPreview ? [50, 50] : [0, 100]);
  };

  if (isMobile) {
    return (
      <div className="flex flex-col h-full p-4">
        <div className="flex justify-center p-2 bg-gray-100 dark:bg-slate-900 rounded-lg mb-4">
          <button
            onClick={() => setSizes([100, 0])}
            className={`px-4 py-2 mx-1 rounded-md transition-all duration-200 ${
              sizes[0] > 50 
                ? 'bg-violet-500 text-white shadow-lg shadow-violet-500/25' 
                : 'bg-gray-200 dark:bg-slate-800 hover:bg-gray-300 dark:hover:bg-slate-700'
            }`}
          >
            Editor
          </button>
          <button
            onClick={() => setSizes([0, 100])}
            className={`px-4 py-2 mx-1 rounded-md transition-all duration-200 ${
              sizes[1] > 50 
                ? 'bg-violet-500 text-white shadow-lg shadow-violet-500/25' 
                : 'bg-gray-200 dark:bg-slate-800 hover:bg-gray-300 dark:hover:bg-slate-700'
            }`}
          >
            Preview
          </button>
        </div>
        <div className="flex-1 overflow-hidden rounded-lg">
          {sizes[0] > 50 ? (
            <Editor value={markdown} onChange={handleChange} />
          ) : (
            <Preview markdown={markdown} />
          )}
        </div>
      </div>
    );
  }

  // Renderização condicional para Full Screen
  if (isFullScreenEditor) {
    return (
      <div className="relative h-full w-full flex flex-col p-4">
        <div className="absolute top-4 right-4 z-10 flex space-x-2">
          <button
            onClick={toggleFullScreenEditor}
            className="p-2 bg-white dark:bg-slate-900 rounded-md hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-300 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95"
            title="Exit Full Screen"
          >
            <Minimize2 size={16} />
          </button>
        </div>
        <Editor value={markdown} onChange={handleChange} />
      </div>
    );
  }
  if (isFullScreenPreview) {
    return (
      <div className="relative h-full w-full flex flex-col p-4">
        <div className="absolute top-4 right-4 z-10 flex space-x-2">
          <button
            onClick={toggleFullScreenPreview}
            className="p-2 bg-white dark:bg-slate-900 rounded-md hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-300 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95"
            title="Exit Full Screen"
          >
            <Minimize2 size={16} />
          </button>
        </div>
        <Preview markdown={markdown} />
      </div>
    );
  }

  // Split normal
  return (
    <Split
      sizes={sizes}
      minSize={0}
      expandToMin={false}
      gutterSize={8}
      gutterAlign="center"
      snapOffset={30}
      dragInterval={1}
      direction="horizontal"
      cursor="col-resize"
      className="flex h-full w-full p-4 gap-4"
      onDragEnd={(sizes) => setSizes(sizes)}
    >
      <div className="relative h-full w-full flex flex-col">
        <div className="absolute top-4 right-4 z-10 flex space-x-2">
          {!isFullScreenPreview && (
            <>
              <button
                onClick={toggleFullScreenEditor}
                className="p-2 bg-white dark:bg-slate-900 rounded-md hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-300 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95"
                title="Full Screen Editor"
              >
                <Maximize2 size={16} />
              </button>
              <button
                onClick={() => setSizes([50, 50])}
                className="p-2 bg-white dark:bg-slate-900 rounded-md hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-300 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95"
                title="Reset Split"
              >
                <MoveHorizontal size={16} />
              </button>
            </>
          )}
        </div>
        <Editor value={markdown} onChange={handleChange} />
      </div>
      <div className="relative h-full w-full flex flex-col">
        <div className="absolute top-4 right-4 z-10 flex space-x-2">
          {!isFullScreenEditor && (
            <>
              <button
                onClick={toggleFullScreenPreview}
                className="p-2 bg-white dark:bg-slate-900 rounded-md hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-300 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95"
                title="Full Screen Preview"
              >
                <Maximize2 size={16} />
              </button>
              <button
                onClick={() => setSizes([50, 50])}
                className="p-2 bg-white dark:bg-slate-900 rounded-md hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-300 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95"
                title="Reset Split"
              >
                <MoveHorizontal size={16} />
              </button>
            </>
          )}
        </div>
        <Preview markdown={markdown} />
      </div>
    </Split>
  );
};

export default MarkdownEditor;