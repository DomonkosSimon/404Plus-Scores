import { Container } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { ScoringPanel } from '../../components/scoring/ScoringPanel';

export function ScoringScreen() {
  const { competitionId } = useParams<{ competitionId: string }>();
  const navigate = useNavigate();

  if (!competitionId) return null;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <ScoringPanel
        competitionId={competitionId}
        onFinished={(id) => navigate(`/competition/${id}/results`, { replace: true })}
      />
    </Container>
  );
}
