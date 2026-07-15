import { Box, IconButton, Typography } from '@mui/material';
import { Close } from '@mui/icons-material';

interface ModalHeaderProps {
  title: string;
  onClose: () => void;
  closeLabel: string;
}

export function ModalHeader({ title, onClose, closeLabel }: ModalHeaderProps) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
      <Typography variant="h5" noWrap sx={{ minWidth: 0 }}>
        {title}
      </Typography>
      <IconButton aria-label={closeLabel} onClick={onClose} sx={{ flexShrink: 0 }}>
        <Close />
      </IconButton>
    </Box>
  );
}
