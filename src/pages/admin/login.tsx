// material-ui
import Box from '@mui/material/Box';

// project-imports
import LoginForm from 'sections/admin/login/LoginForm';

// ==============================|| ADMIN - LOGIN PAGE ||============================== //

export default function AdminLogin() {
  return (
    <Box sx={{ flex: 1, display: 'grid', placeItems: 'center', px: 2.5, py: 6, bgcolor: 'background.soft' }}>
      <Box
        sx={{
          width: '100%',
          maxWidth: 440,
          p: { xs: 3, md: 5 },
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: '24px'
        }}
      >
        <LoginForm />
      </Box>
    </Box>
  );
}
