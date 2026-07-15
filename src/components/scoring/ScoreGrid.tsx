import { Box, Stack, Typography } from '@mui/material';
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import type { Competition, ScoreValue } from '../../domain/types';
import { STICKY_NAME_COLUMN_WIDTH } from './gridLayout';
import { SortableCompetitorRow } from './SortableCompetitorRow';

interface ScoreGridProps {
  competition: Competition;
  onScoreChange: (competitorId: string, disciplineId: string, value: ScoreValue) => void;
  onReorder: (newOrderIds: string[]) => void;
  reorderEnabled: boolean;
}

export function ScoreGrid({
  competition,
  onScoreChange,
  onReorder,
  reorderEnabled,
}: ScoreGridProps) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));
  const competitors = [...competition.competitors].sort((a, b) => a.order - b.order);
  const disciplines = [...competition.disciplines].sort((a, b) => a.order - b.order);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = competitors.findIndex((c) => c.id === active.id);
    const newIndex = competitors.findIndex((c) => c.id === over.id);
    const reordered = arrayMove(competitors, oldIndex, newIndex);
    onReorder(reordered.map((c) => c.id));
  }

  function scoresFor(competitorId: string): Record<string, ScoreValue> {
    const result: Record<string, ScoreValue> = {};
    for (const entry of competition.scores) {
      if (entry.competitorId === competitorId) result[entry.disciplineId] = entry.value;
    }
    return result;
  }

  return (
    <Box sx={{ overflowX: 'auto' }}>
      <Stack
        direction="row"
        spacing={1.5}
        sx={{ alignItems: 'center', px: 1, pb: 1, width: 'fit-content' }}
      >
        <Box
          sx={{
            width: STICKY_NAME_COLUMN_WIDTH,
            flexShrink: 0,
            position: 'sticky',
            left: 8,
            zIndex: 1,
            bgcolor: 'background.default',
          }}
        />
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          {disciplines.map((discipline) => (
            <Typography
              key={discipline.id}
              variant="caption"
              color="text.secondary"
              sx={{ width: 96, textAlign: 'center' }}
              noWrap
            >
              {discipline.name}
            </Typography>
          ))}
        </Box>
      </Stack>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={competitors.map((c) => c.id)}
          strategy={verticalListSortingStrategy}
        >
          <Stack spacing={0.5}>
            {competitors.map((competitor) => (
              <SortableCompetitorRow
                key={competitor.id}
                competitor={competitor}
                disciplines={disciplines}
                scoresByDiscipline={scoresFor(competitor.id)}
                onScoreChange={(disciplineId, value) =>
                  onScoreChange(competitor.id, disciplineId, value)
                }
                reorderEnabled={reorderEnabled}
              />
            ))}
          </Stack>
        </SortableContext>
      </DndContext>
    </Box>
  );
}
