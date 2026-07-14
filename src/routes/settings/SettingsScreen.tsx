import {
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSettingsStore } from '../../state/settings/useSettingsStore';
import type { Language, WinDirection } from '../../domain/types';

const LANGUAGES: Language[] = ['sk', 'cs', 'en', 'de'];

export function SettingsScreen() {
  const { t } = useTranslation();
  const winDirection = useSettingsStore((s) => s.winDirection);
  const language = useSettingsStore((s) => s.language);
  const setWinDirection = useSettingsStore((s) => s.setWinDirection);
  const setLanguage = useSettingsStore((s) => s.setLanguage);

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        {t('settings.title')}
      </Typography>
      <Stack spacing={4}>
        <Stack spacing={1}>
          <Typography variant="subtitle1">{t('settings.winDirection.label')}</Typography>
          <ToggleButtonGroup
            exclusive
            value={winDirection}
            onChange={(_, value: WinDirection | null) => {
              if (value) setWinDirection(value);
            }}
          >
            <ToggleButton value="highest" sx={{ flex: 1 }}>
              {t('settings.winDirection.highest')}
            </ToggleButton>
            <ToggleButton value="lowest" sx={{ flex: 1 }}>
              {t('settings.winDirection.lowest')}
            </ToggleButton>
          </ToggleButtonGroup>
          <Typography variant="caption" color="text.secondary">
            {t('settings.winDirection.helper')}
          </Typography>
        </Stack>

        <FormControl fullWidth>
          <InputLabel id="language-label">{t('settings.language.label')}</InputLabel>
          <Select
            labelId="language-label"
            label={t('settings.language.label')}
            value={language}
            onChange={(e) => setLanguage(e.target.value as Language)}
          >
            {LANGUAGES.map((lang) => (
              <MenuItem key={lang} value={lang}>
                {t(`languages.${lang}`)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>
    </Container>
  );
}
