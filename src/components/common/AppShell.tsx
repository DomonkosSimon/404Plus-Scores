import { AppBar, BottomNavigation, BottomNavigationAction, Box, Toolbar, Typography } from '@mui/material';
import { Home as HomeIcon, Settings } from '@mui/icons-material';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { OfflineBanner } from './OfflineBanner';
import { glassBorder, glassSurface } from '../../theme/glass';

const NAV_ROUTES = ['/', '/settings'];

export function AppShell() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const activeIndex = Math.max(
    NAV_ROUTES.findIndex((route) => route === location.pathname),
    0,
  );

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="fixed" color="default" enableColorOnDark sx={{ zIndex: 1100 }}>
        <Toolbar>
          <Typography variant="h6">{t('app.title')}</Typography>
        </Toolbar>
      </AppBar>
      {/* Spacer matching the fixed AppBar's height */}
      <Toolbar />

      <OfflineBanner />

      <Box sx={{ pb: 'calc(env(safe-area-inset-bottom, 0px) + 104px)' }}>
        <Outlet />
      </Box>

      <Box
        sx={{
          position: 'fixed',
          left: 16,
          right: 16,
          bottom: 'calc(env(safe-area-inset-bottom, 0px) + 16px)',
          maxWidth: 420,
          mx: 'auto',
          borderRadius: 999,
          overflow: 'hidden',
          border: glassBorder,
          boxShadow: '0 8px 32px rgba(0,0,0,0.16), 0 1px 3px rgba(0,0,0,0.08)',
          zIndex: 1100,
          ...glassSurface,
        }}
      >
        <BottomNavigation
          value={activeIndex}
          onChange={(_, newIndex: number) => navigate(NAV_ROUTES[newIndex])}
          showLabels
          sx={{ bgcolor: 'transparent' }}
        >
          <BottomNavigationAction label={t('nav.home')} icon={<HomeIcon />} />
          <BottomNavigationAction label={t('nav.settings')} icon={<Settings />} />
        </BottomNavigation>
      </Box>
    </Box>
  );
}
