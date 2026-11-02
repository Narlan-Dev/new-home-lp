import { ChangeEvent, FormEvent, useState } from 'react';
import { Link as RouterLink } from 'react-router';

// material-ui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// third-party
import { useIntl } from 'react-intl';

// project-imports
import FormField from 'components/@extended/FormField';
import Photo from 'components/@extended/Photo';
import SafeFormattedMessage from 'components/@extended/SafeFormattedMessage';
import { GIFT_LIMITS } from 'constants/gifts';
import { ROUTES } from 'constants/routes';
import { emptyGiftFormValues, GIFT_FORM_FIELDS, giftFieldId } from './GiftForm.constants';
import { isHttpUrl, validateGiftForm } from './GiftForm.schema';

// types
import { GiftFormErrors, GiftFormField, GiftFormValues } from './GiftForm.types';

interface GiftFormProps {
  initialValues?: GiftFormValues;
  /** id da mensagem do botão de envio */
  submitLabelId: string;
  pending: boolean;
  onSubmit: (values: GiftFormValues) => void;
}

// ==============================|| ADMIN - GIFT FORM ||============================== //

export default function GiftForm({ initialValues = emptyGiftFormValues, submitLabelId, pending, onSubmit }: GiftFormProps) {
  const intl = useIntl();
  const [values, setValues] = useState<GiftFormValues>(initialValues);
  const [errors, setErrors] = useState<GiftFormErrors>({});
  const [failedImage, setFailedImage] = useState('');

  const handleChange = (field: GiftFormField) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValues((current) => ({ ...current, [field]: event.target.value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const errorText = (field: GiftFormField) => (errors[field] ? intl.formatMessage({ id: errors[field] }) : undefined);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const found = validateGiftForm(values);
    setErrors(found);
    const firstInvalid = GIFT_FORM_FIELDS.find((field) => found[field]);
    if (firstInvalid) {
      document.getElementById(giftFieldId(firstInvalid))?.focus();
      return;
    }

    onSubmit(values);
  };

  const image = values.image.trim();
  const previewUrl = isHttpUrl(image) ? image : undefined;

  return (
    <Stack component="form" noValidate onSubmit={handleSubmit} sx={{ gap: 3 }}>
      <FormField
        id={giftFieldId('name')}
        label={<SafeFormattedMessage id="admin.gifts.form.name.label" />}
        placeholder={intl.formatMessage({ id: 'admin.gifts.form.name.placeholder' })}
        errorText={errorText('name')}
        value={values.name}
        onChange={handleChange('name')}
        slotProps={{ input: { maxLength: GIFT_LIMITS.nameMax, autoComplete: 'off', 'aria-required': true } }}
      />

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
        <FormField
          id={giftFieldId('price')}
          label={<SafeFormattedMessage id="admin.gifts.form.price.label" />}
          placeholder={intl.formatMessage({ id: 'admin.gifts.form.price.placeholder' })}
          errorText={errorText('price')}
          value={values.price}
          onChange={handleChange('price')}
          slotProps={{ input: { inputMode: 'decimal', autoComplete: 'off', 'aria-required': true } }}
        />
        <FormField
          id={giftFieldId('order')}
          label={<SafeFormattedMessage id="admin.gifts.form.order.label" />}
          helperText={<SafeFormattedMessage id="admin.gifts.form.order.help" />}
          errorText={errorText('order')}
          value={values.order}
          onChange={handleChange('order')}
          slotProps={{ input: { inputMode: 'decimal', autoComplete: 'off' } }}
        />
      </Box>

      <FormField
        id={giftFieldId('url')}
        label={<SafeFormattedMessage id="admin.gifts.form.url.label" />}
        placeholder={intl.formatMessage({ id: 'admin.gifts.form.url.placeholder' })}
        errorText={errorText('url')}
        value={values.url}
        onChange={handleChange('url')}
        slotProps={{ input: { type: 'url', inputMode: 'url', autoComplete: 'off', 'aria-required': true } }}
      />

      <FormField
        id={giftFieldId('image')}
        label={<SafeFormattedMessage id="admin.gifts.form.image.label" />}
        placeholder={intl.formatMessage({ id: 'admin.gifts.form.url.placeholder' })}
        helperText={<SafeFormattedMessage id="admin.gifts.form.image.help" />}
        errorText={errorText('image')}
        value={values.image}
        onChange={handleChange('image')}
        slotProps={{ input: { type: 'url', inputMode: 'url', autoComplete: 'off' } }}
      />

      {previewUrl && (
        <Stack sx={{ gap: 1 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            <SafeFormattedMessage id="admin.gifts.form.image.preview" />
          </Typography>
          <Photo
            src={previewUrl}
            alt=""
            onLoadError={() => setFailedImage(previewUrl)}
            sx={{ width: 160, height: 160, borderRadius: '16px' }}
          />
          {failedImage === previewUrl && (
            <Typography variant="caption" role="alert" sx={{ color: 'error.main' }}>
              <SafeFormattedMessage id="admin.gifts.form.image.previewError" />
            </Typography>
          )}
        </Stack>
      )}

      <Stack sx={{ flexDirection: { xs: 'column', sm: 'row' }, gap: '12px', pt: 1 }}>
        <Button type="submit" variant="contained" loading={pending}>
          <SafeFormattedMessage id={submitLabelId} />
        </Button>
        <Button component={RouterLink} to={ROUTES.ADMIN.GIFTS} variant="outlined" disabled={pending}>
          <SafeFormattedMessage id="action.cancel" />
        </Button>
      </Stack>
    </Stack>
  );
}
