# Shortok

Shortok is a Photo Sharing Social Media App. This repository contains the source code and Playwright end-to-end tests for the application.

## Project Structure

```
.eslintrc.cjs/.json     # ESLint configuration
components.json         # UI components config
index.html              # Main HTML entry point
package.json            # Project dependencies and scripts
playwright.config.ts    # Playwright test configuration
postcss.config.js       # PostCSS configuration
tailwind.config.js      # Tailwind CSS configuration
tsconfig.json           # TypeScript configuration
vercel.json             # Vercel deployment config
vite.config.ts          # Vite build configuration

.auth/                  # Authentication test data
page-objects/           # Playwright Page Object Models
playwright-report/      # Playwright test reports
public/                 # Static assets
src/                    # Application source code
test-data/              # Test data files
test-results/           # Test output
tests/                  # Playwright test suites
```

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- npm

### Installation

```sh
npm install
```

### Running the App

```sh
npm run dev
```

The app will be available at [http://localhost:5173](http://localhost:5173) by default.

### Running Tests

To run Playwright tests:

```sh
npx playwright test
```

Test results and reports will be generated in the `playwright-report/` and `test-results/` directories.

## Folder Overview

- [`src/`](src/) - Main application source code
- [`page-objects/`](page-objects/) - Playwright Page Object Models (e.g., [`page-objects/createPostPage.ts`](page-objects/createPostPage.ts), [`page-objects/logInPage.ts`](page-objects/logInPage.ts))
- [`tests/`](tests/) - Playwright test suites
- [`public/`](public/) - Static assets
