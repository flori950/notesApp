# 📝 Notes App

A beautiful, fast notes application with session-based storage, dark mode, and customizable themes. Built with React, TypeScript, and Vite.

## ✨ Features

### 📚 Notes Management
- **Create, Edit, Delete**: Full CRUD operations for notes
- **Real-time Search**: Filter notes by title or content
- **Autosave**: Changes are automatically saved to session storage
- **Session Persistence**: Notes persist during your browser session

### 🎨 Theming & Customization
- **Dark Mode Toggle**: Switch between light and dark themes
- **4 Accent Colors**: Choose from Blue, Purple, Emerald, or Orange
- **Density Controls**: Compact or Comfortable spacing
- **Ambient Header**: Beautiful gradient effect that adapts to your accent color

### 🚀 User Experience
- **Toast Notifications**: Feedback for user actions
- **Responsive Design**: Works great on desktop and mobile
- **Accessibility**: Full keyboard navigation and screen reader support
- **Fast Performance**: Built with Vite for lightning-fast development and builds

## 🛠️ Tech Stack

- **React 18** with TypeScript
- **Vite** for build tooling
- **Session Storage** for data persistence
- **CSS Custom Properties** for theming
- **Modern ES2022** features

## 📋 Requirements

- **Node.js 20.19.0+** or **22.12.0+**
- **npm 9+**

## 🚀 Getting Started

### Installation

1. **Clone or download** this project
2. **Install dependencies**:
   ```bash
   npm install
   ```

### Development

1. **Start the development server**:
   ```bash
   npm run dev
   ```
2. **Open your browser** and navigate to `http://localhost:5173`

### Production Build

1. **Build for production**:
   ```bash
   npm run build
   ```
2. **Preview the production build**:
   ```bash
   npm run preview
   ```

## 💾 Data Storage

- **Session Storage**: Notes are stored in your browser's session storage
- **Automatic Persistence**: Changes are saved immediately
- **Session Scope**: Data persists until you close your browser tab/window
- **No Server Required**: Everything runs locally in your browser

## 🎯 Usage Guide

### Creating Notes
1. Click the **"New"** button in the sidebar
2. Start typing your note title and content
3. Changes are saved automatically

### Organizing Notes
- **Search**: Use the search bar to find notes quickly
- **Recent First**: Notes are automatically sorted by last modified date

### Customizing Appearance
- **Dark Mode**: Click the moon/sun icon to toggle
- **Accent Colors**: Click the colored dots to change the accent color
- **Density**: Choose between compact and comfortable spacing

### Keyboard Shortcuts
- **Tab**: Navigate between elements
- **Enter**: Activate buttons and controls

## 🏗️ Project Structure

```
src/
├── components/
│   ├── ThemeControl.tsx      # Theme customization controls
│   └── notes/
│       └── NotesApp.tsx      # Main notes application
├── hooks/
│   └── use-session-storage.ts  # Session storage custom hook
├── pages/
│   └── Index.tsx             # Main page layout
├── index.css                 # Design system and global styles
└── App.tsx                   # Root application component
```

## 🎨 Design System

### Color Themes
- **Light/Dark Mode**: Automatic adaptation of all colors
- **Accent Colors**: Blue (default), Purple, Emerald, Orange
- **Semantic Colors**: Text, background, and border colors that adapt to themes

### Typography
- **Font Stack**: Inter, system fonts
- **Responsive Sizing**: Scales appropriately across devices
- **Line Height**: Optimized for readability

### Spacing & Layout
- **Design Tokens**: Consistent spacing using CSS custom properties
- **Density Options**: Compact (75%) or Comfortable (100%) scaling
- **Responsive**: Mobile-first design approach

## 🔧 Customization

### Adding New Accent Colors
1. Add color definition to `:root` in `src/index.css`
2. Add theme variant with `[data-accent="newcolor"]`
3. Update `AccentColor` type and options in `ThemeControl.tsx`

### Modifying Storage
- Replace `useSessionStorage` with `localStorage` for persistent storage
- Implement server-side storage by modifying the hooks
- Add export/import functionality

## 📄 License

This project is licensed under the MIT License.

---

**Happy Note-Taking!** 📝✨
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
