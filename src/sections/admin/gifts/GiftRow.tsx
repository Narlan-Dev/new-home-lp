import { Link as RouterLink } from 'react-router';

// material-ui
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// third-party
import { useIntl } from 'react-intl';

// project-imports
import Photo from 'components/@extended/Photo';
import { ROUTES } from 'constants/routes';

// types
import { Gift } from 'types/gifts';

// assets
import { EditIcon, ExternalLinkIcon, TrashIcon } from 'assets/icons';

interface GiftRowProps {
  gift: Gift;
  /** impede novas ações enquanto este presente está sendo excluído */
  disabled?: boolean;
  onDelete: (gift: Gift) => void;
}

/** "https://www.loja.com.br/p/123" -> "loja.com.br" (o link completo continua no href) */
const hostnameOf = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
};

// ==============================|| ADMIN - GIFT ROW ||============================== //

export default function GiftRow({ gift, disabled = false, onDelete }: GiftRowProps) {
  const intl = useIntl();

  return (
    <Box
      component="li"
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: 'auto minmax(0, 1fr)', md: 'auto minmax(0, 1fr) auto' },
        alignItems: 'center',
        gap: { xs: 2, md: 3 },
        p: { xs: 2, md: 2.5 },
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: '16px',
        opacity: disabled ? 0.55 : 1
      }}
    >
      <Photo src={gift.image} alt="" iconSize={28} sx={{ width: 72, height: 72, flexShrink: 0, borderRadius: '12px' }} />

      <Stack sx={{ minWidth: 0, gap: '2px' }}>
        <Typography
          variant="h5"
          component="h2"
          noWrap
          sx={{ fontSize: { xs: '1.375rem', md: '1.5rem' }, lineHeight: { xs: 1.211, md: 1.211 } }}
        >
          {gift.name}
        </Typography>
        <Stack direction="row" sx={{ alignItems: 'center', flexWrap: 'wrap', columnGap: 1.5, rowGap: '2px' }}>
          <Typography sx={{ color: 'primary.main', fontWeight: 500, fontSize: '0.9375rem', lineHeight: 1.302 }}>
            {intl.formatNumber(gift.price, { style: 'currency', currency: 'BRL' })}
          </Typography>
          <Link
            href={gift.url}
            target="_blank"
            rel="noopener noreferrer"
            underline="hover"
            aria-label={intl.formatMessage({ id: 'admin.gifts.link' }, { host: hostnameOf(gift.url) })}
            sx={{ display: 'inline-flex', alignItems: 'center', gap: '4px', minWidth: 0, color: 'text.secondary', fontSize: '0.875rem' }}
          >
            <Box component="span" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {hostnameOf(gift.url)}
            </Box>
            <ExternalLinkIcon size={14} />
          </Link>
        </Stack>
      </Stack>

      <Stack
        direction="row"
        sx={{
          alignItems: 'center',
          justifyContent: { xs: 'space-between', md: 'flex-end' },
          gap: 1.5,
          gridColumn: { xs: '1 / -1', md: 'auto' }
        }}
      >
        <Chip
          size="small"
          variant={gift.reserved ? 'filled' : 'outlined'}
          color={gift.reserved ? 'secondary' : 'default'}
          label={intl.formatMessage({ id: gift.reserved ? 'admin.gifts.status.reserved' : 'admin.gifts.status.available' })}
        />
        <Stack direction="row" sx={{ gap: 0.5 }}>
          <IconButton
            component={RouterLink}
            to={ROUTES.ADMIN.giftEdit(gift.id)}
            disabled={disabled}
            aria-label={intl.formatMessage({ id: 'admin.gifts.edit' }, { name: gift.name })}
            sx={{ color: 'text.primary' }}
          >
            <EditIcon size={20} />
          </IconButton>
          <IconButton
            disabled={disabled}
            onClick={() => onDelete(gift)}
            aria-label={intl.formatMessage({ id: 'admin.gifts.delete' }, { name: gift.name })}
            sx={{ color: 'error.main' }}
          >
            <TrashIcon size={20} />
          </IconButton>
        </Stack>
      </Stack>
    </Box>
  );
}
