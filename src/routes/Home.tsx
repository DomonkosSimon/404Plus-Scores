import { useEffect, useState } from 'react';
import { AddCircle, PlayArrow } from '@mui/icons-material';
import { Button, Card, CardActionArea, Container, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { listInProgress } from '../storage/competitionsRepo';
import type { Competition } from '../domain/types';

export function Home() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [inProgress, setInProgress] = useState<Competition[]>([]);

  useEffect(() => {
    void listInProgress().then(setInProgress);
  }, []);

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Stack spacing={3}>
        <Button
          variant="contained"
          size="large"
          startIcon={<AddCircle />}
          onClick={() => navigate('/new/name')}
        >
          {t('home.newCompetition')}
        </Button>

        {inProgress.length > 0 && (
          <Stack spacing={1.5}>
            {inProgress.map((competition) => (
              <Card key={competition.id} variant="outlined">
                <CardActionArea
                  sx={{ p: 2 }}
                  onClick={() => navigate(`/competition/${competition.id}/scoring`)}
                >
                  <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                    <PlayArrow color="primary" />
                    <Stack>
                      <Typography variant="subtitle1">{competition.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {t('home.resumeSubtitle')}
                      </Typography>
                    </Stack>
                  </Stack>
                </CardActionArea>
              </Card>
            ))}
          </Stack>
        )}
      </Stack>
    </Container>
  );
}
