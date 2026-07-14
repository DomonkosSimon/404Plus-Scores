import { Stack, TextField } from '@mui/material';

interface DynamicNameListProps {
  names: string[];
  labelFor: (index: number) => string;
  placeholder?: string;
  onChange: (index: number, value: string) => void;
}

export function DynamicNameList({ names, labelFor, placeholder, onChange }: DynamicNameListProps) {
  return (
    <Stack spacing={2}>
      {names.map((name, index) => (
        <TextField
          key={index}
          label={labelFor(index)}
          placeholder={placeholder}
          value={name}
          autoFocus={index === 0}
          onChange={(e) => onChange(index, e.target.value)}
        />
      ))}
    </Stack>
  );
}
