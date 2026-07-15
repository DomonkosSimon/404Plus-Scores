import { DragIndicator } from '@mui/icons-material';
import { Box, IconButton, Stack, Typography } from '@mui/material';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Competitor, Discipline, ScoreValue } from '../../domain/types';
import { STICKY_LEFT_INSET, STICKY_NAME_COLUMN_WIDTH } from './gridLayout';
import { ScoreCell } from './ScoreCell';

interface SortableCompetitorRowProps {
  competitor: Competitor;
  disciplines: Discipline[];
  scoresByDiscipline: Record<string, ScoreValue>;
  onScoreChange: (disciplineId: string, value: ScoreValue) => void;
  reorderEnabled: boolean;
}

export function SortableCompetitorRow({
  competitor,
  disciplines,
  scoresByDiscipline,
  onScoreChange,
  reorderEnabled,
}: SortableCompetitorRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: competitor.id,
    disabled: !reorderEnabled,
  });

  const rowBgcolor = isDragging ? 'action.hover' : 'background.paper';

  return (
    <Stack
      ref={setNodeRef}
      direction="row"
      spacing={1.5}
      sx={{
        alignItems: 'stretch',
        width: 'fit-content',
        py: 1,
        pr: 1,
        borderTopRightRadius: 2,
        borderBottomRightRadius: 2,
        bgcolor: rowBgcolor,
        transform: CSS.Transform.toString(transform),
        transition,
      }}
    >
      <Stack
        direction="row"
        spacing={1.5}
        sx={{
          alignItems: 'center',
          position: 'sticky',
          left: 0,
          zIndex: 1,
          bgcolor: rowBgcolor,
          borderRight: '1px solid',
          borderColor: 'divider',
          width: STICKY_NAME_COLUMN_WIDTH,
          flexShrink: 0,
          pl: STICKY_LEFT_INSET,
        }}
      >
        <IconButton
          size="small"
          disabled={!reorderEnabled}
          {...attributes}
          {...listeners}
          aria-label="drag to reorder"
        >
          <DragIndicator />
        </IconButton>
        <Typography sx={{ flex: 1, minWidth: 0 }} noWrap>
          {competitor.name}
        </Typography>
      </Stack>
      <Box sx={{ display: 'flex', gap: 1.5 }}>
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
