import { Link as RouterLink } from 'react-router';

// material-ui
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project-imports
import SafeFormattedMessage from 'components/@extended/SafeFormattedMessage';
import { ROUTES } from 'constants/routes';

// ==============================|| ERROR 404 ||============================== //

export default function Error404() {
  return (
    <Container component="main" sx={{ py: 10 }}>
      <Stack spacing={2} sx={{ alignItems: 'center', textAlign: 'center' }}>
        <Typography variant="h1">
          <SafeFormattedMessage id="maintenance.404.title" />
        </Typography>
        <Typography color="text.secondary">
          <SafeFormattedMessage id="maintenance.404.description" />
        </Typography>
        <Button component={RouterLink} to={ROUTES.HOME} variant="contained">
          <SafeFormattedMessage id="action.backHome" />
        </Button>
      </Stack>
    </Container>
  );
}
