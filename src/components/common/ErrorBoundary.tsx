import { Button, Container, Stack, Typography } from '@mui/material';
import { Component, type ErrorInfo, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('Unhandled error in app tree', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Container maxWidth="sm" sx={{ py: 6 }}>
          <Stack spacing={2} sx={{ alignItems: 'flex-start' }}>
            <Typography variant="h5">Something went wrong.</Typography>
            <Typography color="text.secondary">
              Your data is safe on this device. Reloading the app usually fixes this.
            </Typography>
            <Button variant="contained" onClick={() => window.location.assign('/')}>
              Reload
            </Button>
          </Stack>
        </Container>
      );
    }
    return this.props.children;
  }
}
