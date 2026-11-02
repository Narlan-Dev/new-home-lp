import { ChangeEvent, FormEvent, useState } from 'react';

// material-ui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// third-party
import { useIntl } from 'react-intl';

// project-imports
import FormField from 'components/@extended/FormField';
import SafeFormattedMessage from 'components/@extended/SafeFormattedMessage';
import { reserveGift } from 'framework/rest/gifts';
import { emptyReserveGiftValues, firstName, formatWhatsapp, ReserveGiftField, validateReserveGift } from './ReserveGiftForm.schema';
import colors from 'themes/theme/default';

// types
import { Gift, ReserveGiftValues } from 'types/gifts';

// assets
import { CheckIcon } from 'assets/icons';

interface ReserveGiftFormProps {
  gift: Gift;
  onCancel: () => void;
  /** chamado após reservar, com o primeiro nome da pessoa */
  onReserved: (guestName: string) => void;
}

const fieldId = (field: ReserveGiftField) => `reserve-${field}`;

// caixa de seleção do design: 20px, raio 6 e borda de 1px
const checkboxSx = {
  width: 20,
  height: 20,
  borderRadius: '6px',
  border: `1px solid ${colors.inputBorder}`,
  bgcolor: 'common.white',
  flexShrink: 0
};

// ==============================|| GIFTS - RESERVE FORM ||============================== //

export default function ReserveGiftForm({ gift, onCancel, onReserved }: ReserveGiftFormProps) {
  const intl = useIntl();
  const [values, setValues] = useState<ReserveGiftValues>(emptyReserveGiftValues);
  const [errors, setErrors] = useState<Partial<Record<ReserveGiftField, string>>>({});
  const [pending, setPending] = useState(false);
  const [submitFailed, setSubmitFailed] = useState(false);

  const handleChange =
    (field: 'name' | 'email' | 'message' | 'whatsapp') => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = field === 'whatsapp' ? formatWhatsapp(event.target.value) : event.target.value;
      setValues((current) => ({ ...current, [field]: value }));
      if (field !== 'message') setErrors((current) => ({ ...current, [field]: undefined }));
    };

  const errorText = (field: ReserveGiftField) => (errors[field] ? intl.formatMessage({ id: errors[field] }) : undefined);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const found = validateReserveGift(values);
    setErrors(found);
    const firstInvalid = (['name', 'whatsapp', 'email'] as const).find((field) => found[field]);
    if (firstInvalid) {
      document.getElementById(fieldId(firstInvalid))?.focus();
      return;
    }

    setPending(true);
    setSubmitFailed(false);
    try {
      await reserveGift(gift, values);
      onReserved(firstName(values.name));
    } catch {
      setSubmitFailed(true);
      setPending(false);
    }
  };

  return (
    <Stack component="form" noValidate onSubmit={handleSubmit} sx={{ gap: { xs: '20px', md: 3 } }}>
      <FormField
        id={fieldId('name')}
        label={<SafeFormattedMessage id="reserve.field.name.label" />}
        placeholder={intl.formatMessage({ id: 'reserve.field.name.placeholder' })}
        helperText={<SafeFormattedMessage id="reserve.field.name.help" />}
        errorText={errorText('name')}
        value={values.name}
        onChange={handleChange('name')}
        slotProps={{ input: { autoComplete: 'name', 'aria-required': true } }}
      />

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: { xs: '20px', md: 2 } }}>
        <FormField
          id={fieldId('whatsapp')}
          label={<SafeFormattedMessage id="reserve.field.whatsapp.label" />}
          placeholder={intl.formatMessage({ id: 'reserve.field.whatsapp.placeholder' })}
          helperText={<SafeFormattedMessage id="reserve.field.whatsapp.help" />}
          errorText={errorText('whatsapp')}
          value={values.whatsapp}
          onChange={handleChange('whatsapp')}
          slotProps={{ input: { type: 'tel', inputMode: 'tel', autoComplete: 'tel-national', 'aria-required': true } }}
        />
        <FormField
          id={fieldId('email')}
          label={<SafeFormattedMessage id="reserve.field.email.label" />}
          placeholder={intl.formatMessage({ id: 'reserve.field.email.placeholder' })}
          helperText={<SafeFormattedMessage id="reserve.field.email.help" />}
          // no mobile do design o campo de e-mail não tem texto de ajuda (a mensagem de erro continua aparecendo)
          helperTextSx={{ display: { xs: 'none', md: 'block' } }}
          errorText={errorText('email')}
          value={values.email}
          onChange={handleChange('email')}
          slotProps={{ input: { type: 'email', inputMode: 'email', autoComplete: 'email' } }}
        />
      </Box>

      <FormField
        id="reserve-message"
        multiline
        minRows={3}
        label={<SafeFormattedMessage id="reserve.field.message.label" />}
        placeholder={intl.formatMessage({ id: 'reserve.field.message.placeholder' })}
        value={values.message}
        onChange={handleChange('message')}
      />

      <FormControlLabel
        sx={{ alignItems: 'flex-start', m: 0, gap: 1.5 }}
        control={
          <Checkbox
            checked={values.anonymous}
            onChange={(event) => setValues((current) => ({ ...current, anonymous: event.target.checked }))}
            disableRipple
            icon={<Box sx={checkboxSx} />}
            checkedIcon={
              <Box
                sx={{
                  ...checkboxSx,
                  display: 'grid',
                  placeItems: 'center',
                  bgcolor: 'primary.main',
                  borderColor: 'primary.main',
                  color: 'common.white'
                }}
              >
                <CheckIcon size={14} />
              </Box>
            }
            sx={{ p: 0 }}
          />
        }
        label={
          <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.5, fontSize: '0.875rem' }}>
            <SafeFormattedMessage id="reserve.field.anonymous" />
          </Typography>
        }
        slotProps={{ typography: { component: 'div' } }}
      />

      <Stack
        sx={{
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'stretch', md: 'flex-start' },
          gap: { xs: '12px', md: '12px' },
          pt: { xs: 1, md: 0 }
        }}
      >
        <Button type="submit" variant="contained" loading={pending}>
          <SafeFormattedMessage id="reserve.submit" />
        </Button>
        <Button variant="outlined" onClick={onCancel} disabled={pending}>
          <SafeFormattedMessage id="reserve.cancel" />
        </Button>
      </Stack>

      <Typography variant="caption" sx={{ color: 'text.secondary', textAlign: { xs: 'center', md: 'left' } }}>
        <SafeFormattedMessage id="reserve.note" />
      </Typography>

      {submitFailed && (
        <Typography variant="caption" role="alert" sx={{ color: 'error.main', textAlign: { xs: 'center', md: 'left' } }}>
          <SafeFormattedMessage id="reserve.error.generic" />
        </Typography>
      )}
    </Stack>
  );
}
