import { AppBar, BottomNavigation, BottomNavigationAction, Box, Toolbar, Typography } from '@mui/material';
import { History, Home as HomeIcon, Settings } from '@mui/icons-material';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { OfflineBanner } from './OfflineBanner';

const NAV_ROUTES = ['/', '/history', '/settings'];

export function AppShell() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const activeIndex = Math.max(
    NAV_ROUTES.findIndex((route) => route === location.pathname),
    0,
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static" color="default" enableColorOnDark>
        <Toolbar>
          <Typography variant="h6">{t('app.title')}</Typography>
        </Toolbar>
      </AppBar>
      <OfflineBanner />
      <Box sx={{ flex: 1 }}>
        <Outlet />
      </Box>
      <BottomNavigation
        value={activeIndex}
        onChange={(_, newIndex: number) => navigate(NAV_ROUTES[newIndex])}
        showLabels
        sx={{ borderTop: '1px solid', borderColor: 'divider' }}
      >
        <BottomNavigationAction label={t('nav.home')} icon={<HomeIcon />} />
        <BottomNavigationAction label={t('nav.history')} icon={<History />} />
        <BottomNavigationAction label={t('nav.settings')} icon={<Settings />} />
      </BottomNavigation>
    </Box>
  );
}
