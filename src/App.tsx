import { Index } from './pages/Index';
import { ErrorBoundary } from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <Index />
    </ErrorBoundary>
  );
}

export default App;
