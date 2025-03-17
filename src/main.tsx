import { StrictMode, lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import './index.css';

// Lazy load App component with lower priority
const App = lazy(() => 
  new Promise<{ default: React.ComponentType<any> }>(resolve => {
    // Use lower priority loading for the main bundle
    setTimeout(() => {
      import('./App').then(module => resolve({ default: module.default }));
    }, 100);
  })
);

// Create a simple loading component that matches the site style
const AppLoader = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-900">
    <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
    <h2 className="mt-6 text-xl font-medium text-gray-900 dark:text-white">
      Loading Science Hub
    </h2>
  </div>
);

// Render the application directly without manipulating the DOM manually
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <Suspense fallback={<AppLoader />}>
        <App />
      </Suspense>
    </HelmetProvider>
  </StrictMode>
);
