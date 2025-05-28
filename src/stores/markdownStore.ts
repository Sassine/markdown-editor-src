import { create } from 'zustand';

interface MarkdownState {
  markdown: string;
  setMarkdown: (markdown: string) => void;
}

// Default markdown content
const defaultMarkdown = `# Welcome to MarkDown Editor

## Features

- **Real-time Preview**: See your changes as you type
- **Syntax Highlighting**: Code blocks are highlighted
- **Copy Code**: Easily copy code snippets with one click
- **Local Storage**: Your content is saved automatically
- **Dark Mode**: Toggle between light and dark themes

## Example Code

\`\`\`javascript
function greeting(name) {
  return \`Hello, \${name}!\`;
}

console.log(greeting('World'));
\`\`\`

## Lists

### Unordered
- Item 1
- Item 2
  - Nested Item

### Ordered
1. First item
2. Second item
3. Third item

## Tables

| Syntax | Description |
| ----------- | ----------- |
| Header | Title |
| Paragraph | Text |

## Links and Images

[GitHub](https://github.com)

![Sample Image](https://images.pexels.com/photos/1591056/pexels-photo-1591056.jpeg?auto=compress&cs=tinysrgb&w=600)

## Blockquotes

> The only way to do great work is to love what you do.

## Horizontal Rule

---

## Emphasis

*Italic text* and **bold text**

## Try it yourself!

Start editing this document or create your own.
`;

export const useMarkdownStore = create<MarkdownState>((set) => ({
  markdown: defaultMarkdown,
  setMarkdown: (markdown) => set({ markdown }),
}));