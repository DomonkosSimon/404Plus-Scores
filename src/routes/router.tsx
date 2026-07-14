import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppShell } from '../components/common/AppShell';
import { Home } from './Home';
import { HistoryListScreen } from './history/HistoryListScreen';
import { HistoryDetailScreen } from './history/HistoryDetailScreen';
import { SettingsScreen } from './settings/SettingsScreen';
import { ScoringScreen } from './scoring/ScoringScreen';
import { ResultsScreen } from './results/ResultsScreen';
import { WizardLayout } from './wizard/WizardLayout';
import { StepName } from './wizard/StepName';
import { StepCompetitorCount } from './wizard/StepCompetitorCount';
import { StepCompetitorNames } from './wizard/StepCompetitorNames';
import { StepDisciplineCount } from './wizard/StepDisciplineCount';
import { StepDisciplineNames } from './wizard/StepDisciplineNames';

export const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/history', element: <HistoryListScreen /> },
      { path: '/history/:competitionId', element: <HistoryDetailScreen /> },
      { path: '/settings', element: <SettingsScreen /> },
    ],
  },
  { path: '/competition/:competitionId/scoring', element: <ScoringScreen /> },
  { path: '/competition/:competitionId/results', element: <ResultsScreen /> },
  {
    path: '/new',
    element: <WizardLayout />,
    children: [
      { index: true, element: <Navigate to="name" replace /> },
      { path: 'name', element: <StepName /> },
      { path: 'competitor-count', element: <StepCompetitorCount /> },
      { path: 'competitor-names', element: <StepCompetitorNames /> },
      { path: 'discipline-count', element: <StepDisciplineCount /> },
      { path: 'discipline-names', element: <StepDisciplineNames /> },
    ],
  },
]);
