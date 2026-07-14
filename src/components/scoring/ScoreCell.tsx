import { TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { ScoreValue } from '../../domain/types';

interface ScoreCellProps {
  value: ScoreValue;
  onChange: (value: ScoreValue) => void;
}

export function ScoreCell({ value, onChange }: ScoreCellProps) {
  const { t } = useTranslation();
  return (
    <TextField
      type="number"
      size="small"
      placeholder={t('scoring.scorePlaceholder')}
      value={value ?? ''}
      onChange={(e) => {
        const raw = e.target.value;
        if (raw.trim() === '') {
          onChange(null);
          return;
        }
        const parsed = Number(raw);
        if (Number.isFinite(parsed)) onChange(parsed);
      }}
      slotProps={{ htmlInput: { style: { textAlign: 'center' }, inputMode: 'decimal' } }}
      sx={{ width: 96 }}
    />
  );
}
