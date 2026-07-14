import { CssBaseline, ThemeProvider } from '@mui/material';
import { RouterProvider } from 'react-router-dom';
import { theme } from './theme/theme';
import { router } from './routes/router';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { UpdatePrompt } from './components/common/UpdatePrompt';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ErrorBoundary>
        <RouterProvider router={router} />
        <UpdatePrompt />
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;
