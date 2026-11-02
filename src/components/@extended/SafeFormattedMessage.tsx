import { ComponentProps } from 'react';

// third-party
import { FormattedMessage } from 'react-intl';

type Props = ComponentProps<typeof FormattedMessage>;

// ==============================|| COMPONENT: SAFE FORMATTED MESSAGE ||============================== //

// quando a chave não existe no arquivo de locale, exibe o próprio id em vez de uma mensagem vazia
export default function SafeFormattedMessage({ id, defaultMessage, ...rest }: Props) {
  return <FormattedMessage id={id} defaultMessage={defaultMessage ?? id} {...rest} />;
}
