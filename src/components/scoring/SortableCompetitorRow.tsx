import { DragIndicator } from '@mui/icons-material';
import { Box, IconButton, Stack, Typography } from '@mui/material';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Competitor, Discipline, ScoreValue } from '../../domain/types';
import {
  STICKY_COLUMN_RADIUS_PX,
  STICKY_LEFT_INSET,
  STICKY_NAME_COLUMN_WIDTH,
} from './gridLayout';
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
        // No vertical padding here — it lives on each flex child instead
        // (see below), so the sticky column's own box spans the row's
        // full height and its rounded corner isn't left with a square
        // strip above/below where the row's own padding used to be.
        pr: 1,
        // Rounded on all four corners, same as the sticky name column
        // (not just the right side): at rest, this row sits directly
        // behind the sticky column at the exact same position, and since
        // both share the same background color, the row's own corner
        // shape is what actually shows against the page behind it — a
        // square corner here would show through the sticky column's
        // rounded notch regardless of the sticky's own radius.
        // Corner-specific radius props (unlike the borderRadius shorthand)
        // aren't multiplied by theme.shape.borderRadius, so the value is
        // spelled out here to match — see gridLayout.ts.
        borderRadius: STICKY_COLUMN_RADIUS_PX,
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
          borderRadius: `${STICKY_COLUMN_RADIUS_PX} 0 0 ${STICKY_COLUMN_RADIUS_PX}`,
          width: STICKY_NAME_COLUMN_WIDTH,
          flexShrink: 0,
          py: 1,
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
      <Box sx={{ display: 'flex', gap: 1.5, py: 1 }}>
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
