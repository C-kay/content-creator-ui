# Content Creator UI

This project is a React + TypeScript application built with Vite. It provides a user interface for generating and managing optimized social media content for multiple platforms.

## Features

- Generate platform-specific content from a single draft.
- Regenerate content for individual platforms.
- Expand and view detailed content for each platform.
- Smooth scrolling for platform cards.

## Preview

Below is a preview of the Content Creator UI:

![Content Creator UI Preview](./assets/content-creator-ui-preview.png)

## Getting Started

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (version 16 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd content-creator-ui
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

### Running the Application

1. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

2. Open your browser and navigate to `http://localhost:5173`.

### Building for Production

To build the application for production:
```bash
npm run build
# or
yarn build
```

The production-ready files will be in the `dist` directory.

### Linting and Formatting

Run the following commands to lint and format the code:
```bash
npm run lint
npm run format
# or
yarn lint
yarn format
```

## API Integration

The application communicates with a backend API to generate content. Ensure the backend is running at `http://localhost:8000` or update the API URL in the code if necessary.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
