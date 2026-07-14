import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { Competitor, RankingEntry } from '../../domain/types';

interface RankingTableProps {
  competition: { competitors: Competitor[]; ranking: RankingEntry[] | null };
}

export function RankingTable({ competition }: RankingTableProps) {
  const { t } = useTranslation();
  const ranking = competition.ranking ?? [];
  const competitorsById = new Map(competition.competitors.map((c) => [c.id, c]));

  return (
    <TableContainer component={Paper} variant="outlined">
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>{t('results.place')}</TableCell>
            <TableCell>{t('results.competitor')}</TableCell>
            <TableCell align="right">{t('results.total')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {ranking.map((entry) => (
            <TableRow key={entry.competitorId}>
              <TableCell>
                <Typography sx={{ fontWeight: entry.place === 1 ? 700 : 400 }}>
                  {entry.place}
                </Typography>
              </TableCell>
              <TableCell>{competitorsById.get(entry.competitorId)?.name}</TableCell>
              <TableCell align="right">{entry.total}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
