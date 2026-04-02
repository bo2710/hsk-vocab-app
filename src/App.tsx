import { RouterProvider } from 'react-router-dom';
import { router } from './app/router';
import { ThemeProvider } from './app/providers/ThemeProvider';
import { AuthProvider } from './app/providers/AuthProvider';
import { SyncProvider } from './app/providers/SyncProvider';
import { PwaReloadPrompt } from './components/ui/PwaReloadPrompt';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SyncProvider>
          <RouterProvider router={router} />
          <PwaReloadPrompt />
        </SyncProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;