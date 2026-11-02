import { ReactNode } from 'react';

// material-ui
import { SxProps, Theme } from '@mui/material/styles';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import FormLabel from '@mui/material/FormLabel';
import OutlinedInput, { OutlinedInputProps } from '@mui/material/OutlinedInput';

interface FormFieldProps extends Omit<OutlinedInputProps, 'label' | 'error'> {
  id: string;
  label: ReactNode;
  /** texto de ajuda abaixo do campo; quando há erro, mostra a mensagem de erro no lugar */
  helperText?: ReactNode;
  /** estilo do texto de ajuda (ex.: ocultá-lo em um breakpoint) */
  helperTextSx?: SxProps<Theme>;
  errorText?: ReactNode;
}

// ==============================|| COMPONENT: FORM FIELD ||============================== //

// campo do design: rótulo acima, campo de 52px e texto de ajuda abaixo
export default function FormField({ id, label, helperText, helperTextSx, errorText, fullWidth = true, ...inputProps }: FormFieldProps) {
  const hasError = Boolean(errorText);
  const message = errorText ?? helperText;
  const messageId = message ? `${id}-message` : undefined;

  return (
    <FormControl fullWidth={fullWidth} error={hasError}>
      <FormLabel htmlFor={id} sx={{ mb: 1 }}>
        {label}
      </FormLabel>
      <OutlinedInput id={id} aria-describedby={messageId} {...inputProps} />
      {message && (
        <FormHelperText id={messageId} sx={hasError ? undefined : helperTextSx}>
          {message}
        </FormHelperText>
      )}
    </FormControl>
  );
}
