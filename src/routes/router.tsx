import { createBrowserRouter } from 'react-router-dom';
import { AppShell } from '../components/common/AppShell';
import { Home } from './Home';
import { SettingsScreen } from './settings/SettingsScreen';
import { ScoringScreen } from './scoring/ScoringScreen';
import { ResultsScreen } from './results/ResultsScreen';

export const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/settings', element: <SettingsScreen /> },
    ],
  },
  { path: '/competition/:competitionId/scoring', element: <ScoringScreen /> },
  { path: '/competition/:competitionId/results', element: <ResultsScreen /> },
]);
