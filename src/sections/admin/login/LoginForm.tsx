import { ChangeEvent, FormEvent, useState } from 'react';

// material-ui
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// third-party
import { useIntl } from 'react-intl';

// project-imports
import FormField from 'components/@extended/FormField';
import SafeFormattedMessage from 'components/@extended/SafeFormattedMessage';
import { getLoginErrorMessageId, useLoginMutation } from 'framework/rest/auth';

type LoginField = 'email' | 'password';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const fieldId = (field: LoginField) => `login-${field}`;

// ==============================|| ADMIN - LOGIN FORM ||============================== //

export default function LoginForm() {
  const intl = useIntl();
  const { mutate: login, isPending, error, reset } = useLoginMutation();
  const [values, setValues] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<Partial<Record<LoginField, string>>>({});

  const handleChange = (field: LoginField) => (event: ChangeEvent<HTMLInputElement>) => {
    setValues((current) => ({ ...current, [field]: event.target.value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    reset();
  };

  const errorText = (field: LoginField) => (errors[field] ? intl.formatMessage({ id: errors[field] }) : undefined);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const email = values.email.trim();
    const found: Partial<Record<LoginField, string>> = {
      email: EMAIL_PATTERN.test(email) ? undefined : 'admin.login.error.email',
      password: values.password ? undefined : 'admin.login.error.password'
    };
    setErrors(found);

    const firstInvalid = (['email', 'password'] as const).find((field) => found[field]);
    if (firstInvalid) {
      document.getElementById(fieldId(firstInvalid))?.focus();
      return;
    }

    login({ email, password: values.password });
  };

  return (
    <Stack component="form" noValidate onSubmit={handleSubmit} sx={{ gap: 3 }}>
      <Stack sx={{ gap: 1 }}>
        <Typography variant="h3" component="h1" sx={{ fontSize: { xs: '2.25rem', md: '2.75rem' }, lineHeight: { xs: 1.1, md: 1.1 } }}>
          <SafeFormattedMessage id="admin.login.title" />
        </Typography>
        <Typography sx={{ color: 'text.secondary' }}>
          <SafeFormattedMessage id="admin.login.subtitle" />
        </Typography>
      </Stack>

      {error && (
        <Alert severity="error" role="alert">
          {intl.formatMessage({ id: getLoginErrorMessageId(error) })}
        </Alert>
      )}

      <FormField
        id={fieldId('email')}
        label={<SafeFormattedMessage id="admin.login.email.label" />}
        errorText={errorText('email')}
        value={values.email}
        onChange={handleChange('email')}
        slotProps={{ input: { type: 'email', inputMode: 'email', autoComplete: 'username', 'aria-required': true } }}
      />
      <FormField
        id={fieldId('password')}
        label={<SafeFormattedMessage id="admin.login.password.label" />}
        errorText={errorText('password')}
        value={values.password}
        onChange={handleChange('password')}
        slotProps={{ input: { type: 'password', autoComplete: 'current-password', 'aria-required': true } }}
      />

      <Button type="submit" variant="contained" loading={isPending}>
        <SafeFormattedMessage id="admin.login.submit" />
      </Button>
    </Stack>
  );
}
