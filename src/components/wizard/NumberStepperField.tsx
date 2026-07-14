import { Add, Remove } from '@mui/icons-material';
import { IconButton, Stack, TextField } from '@mui/material';

interface NumberStepperFieldProps {
  value: number | null;
  min: number;
  max: number;
  label: string;
  onChange: (value: number) => void;
}

export function NumberStepperField({ value, min, max, label, onChange }: NumberStepperFieldProps) {
  const current = value ?? min;

  return (
    <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
      <IconButton
        aria-label="decrement"
        onClick={() => onChange(Math.max(min, current - 1))}
        disabled={current <= min}
      >
        <Remove />
      </IconButton>
      <TextField
        type="number"
        label={label}
        value={current}
        onChange={(e) => {
          const parsed = Number(e.target.value);
          if (Number.isFinite(parsed)) {
            onChange(Math.min(max, Math.max(min, Math.round(parsed))));
          }
        }}
        slotProps={{ htmlInput: { min, max, style: { textAlign: 'center' } } }}
        sx={{ maxWidth: 160 }}
      />
      <IconButton
        aria-label="increment"
        onClick={() => onChange(Math.min(max, current + 1))}
        disabled={current >= max}
      >
        <Add />
      </IconButton>
    </Stack>
  );
}
