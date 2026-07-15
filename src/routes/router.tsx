import { createBrowserRouter } from 'react-router-dom';
import { AppShell } from '../components/common/AppShell';
import { Home } from './Home';
import { SettingsScreen } from './settings/SettingsScreen';

export const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/settings', element: <SettingsScreen /> },
    ],
  },
]);
