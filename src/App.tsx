import { Index } from './pages/Index';
import { ErrorBoundary } from './components/ErrorBoundary';
import { SEOHead } from './components/SEOHead';

function App() {
  return (
    <ErrorBoundary>
      <SEOHead />
      <Index />
    </ErrorBoundary>
  );
}

export default App;
