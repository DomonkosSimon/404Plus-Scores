import { DragIndicator } from '@mui/icons-material';
import { Box, IconButton, Stack, Typography } from '@mui/material';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Competitor, Discipline, ScoreValue } from '../../domain/types';
import { ScoreCell } from './ScoreCell';

interface SortableCompetitorRowProps {
  competitor: Competitor;
  disciplines: Discipline[];
  scoresByDiscipline: Record<string, ScoreValue>;
  onScoreChange: (disciplineId: string, value: ScoreValue) => void;
}

export function SortableCompetitorRow({
  competitor,
  disciplines,
  scoresByDiscipline,
  onScoreChange,
}: SortableCompetitorRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: competitor.id,
  });

  return (
    <Stack
      ref={setNodeRef}
      direction="row"
      spacing={1.5}
      sx={{
        alignItems: 'center',
        py: 1,
        px: 1,
        borderRadius: 2,
        bgcolor: isDragging ? 'action.hover' : 'background.paper',
        transform: CSS.Transform.toString(transform),
        transition,
      }}
    >
      <IconButton size="small" {...attributes} {...listeners} aria-label="drag to reorder">
        <DragIndicator />
      </IconButton>
      <Typography sx={{ minWidth: 140, flexShrink: 0 }} noWrap>
        {competitor.name}
      </Typography>
      <Box sx={{ display: 'flex', gap: 1.5, overflowX: 'auto' }}>
        {disciplines.map((discipline) => (
          <ScoreCell
            key={discipline.id}
            value={scoresByDiscipline[discipline.id] ?? null}
            onChange={(value) => onScoreChange(discipline.id, value)}
          />
        ))}
      </Box>
    </Stack>
  );
}
