import { useState } from 'react';
import { Link as RouterLink } from 'react-router';

// material-ui
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// third-party
import { useIntl } from 'react-intl';

// project-imports
import SafeFormattedMessage from 'components/@extended/SafeFormattedMessage';
import ErrorState from 'components/ErrorState';
import { useConfirm } from 'components/modal/useConfirm';
import { ROUTES } from 'constants/routes';
import { useDeleteGiftMutation, useGifts } from 'framework/rest/gifts';
import GiftRow from './GiftRow';

// types
import { Gift } from 'types/gifts';

// assets
import { PlusIcon, SearchIcon } from 'assets/icons';

// ==============================|| ADMIN - GIFT LIST ||============================== //

export default function GiftList() {
  const intl = useIntl();
  const confirm = useConfirm();
  const [search, setSearch] = useState('');
  const { gifts, isLoading, error, isFetching, refetch } = useGifts({ search });
  const deleteGift = useDeleteGiftMutation();

  const deletingId = deleteGift.isPending ? deleteGift.variables.id : undefined;
  const hasSearch = search.trim() !== '';

  const handleDelete = async (gift: Gift) => {
    const confirmed = await confirm({
      title: intl.formatMessage({ id: 'admin.gifts.delete.title' }),
      message: intl.formatMessage({ id: 'admin.gifts.delete.message' }, { name: gift.name }),
      confirmText: intl.formatMessage({ id: 'action.delete' }),
      confirmColor: 'error'
    });

    if (confirmed) deleteGift.mutate({ id: gift.id });
  };

  const addButton = (
    <Button component={RouterLink} to={ROUTES.ADMIN.GIFT_NEW} variant="contained" startIcon={<PlusIcon size={18} />}>
      <SafeFormattedMessage id="admin.gifts.new" />
    </Button>
  );

  let content;
  if (isLoading) {
    content = (
      <Stack aria-hidden="true" sx={{ gap: 1.5 }}>
        {[0, 1, 2].map((row) => (
          <Skeleton key={row} variant="rounded" height={114} sx={{ borderRadius: '16px' }} />
        ))}
      </Stack>
    );
  } else if (error) {
    content = <ErrorState message={<SafeFormattedMessage id="admin.gifts.error" />} retrying={isFetching} onRetry={() => void refetch()} />;
  } else if (gifts.length === 0) {
    content = (
      <Stack
        sx={{
          alignItems: 'center',
          gap: 1.5,
          px: 3,
          py: 8,
          textAlign: 'center',
          bgcolor: 'background.paper',
          border: '1px dashed',
          borderColor: 'divider',
          borderRadius: '16px'
        }}
      >
        <Typography variant="h4" component="p" sx={{ fontSize: { xs: '1.75rem', md: '1.75rem' } }}>
          <SafeFormattedMessage id={hasSearch ? 'admin.gifts.empty.search.title' : 'admin.gifts.empty.title'} />
        </Typography>
        <Typography sx={{ color: 'text.secondary', maxWidth: 420 }}>
          {hasSearch ? (
            <SafeFormattedMessage id="admin.gifts.empty.search.description" values={{ search: search.trim() }} />
          ) : (
            <SafeFormattedMessage id="admin.gifts.empty.description" />
          )}
        </Typography>
        {!hasSearch && <Stack sx={{ pt: 1.5 }}>{addButton}</Stack>}
      </Stack>
    );
  } else {
    content = (
      <Stack component="ul" sx={{ gap: 1.5, m: 0, p: 0, listStyle: 'none' }}>
        {gifts.map((gift) => (
          <GiftRow key={gift.id} gift={gift} disabled={deletingId === gift.id} onDelete={handleDelete} />
        ))}
      </Stack>
    );
  }

  return (
    <Stack sx={{ gap: 3 }}>
      <Stack
        sx={{
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'stretch', sm: 'center' },
          justifyContent: 'space-between',
          gap: 2
        }}
      >
        <Stack sx={{ gap: '4px' }}>
          <Typography variant="h3" component="h1" sx={{ fontSize: { xs: '2.25rem', md: '2.75rem' }, lineHeight: { xs: 1.1, md: 1.1 } }}>
            <SafeFormattedMessage id="admin.gifts.title" />
          </Typography>
          {!isLoading && !error && (
            <Typography sx={{ color: 'text.secondary' }} aria-live="polite">
              <SafeFormattedMessage id="admin.gifts.count" values={{ count: gifts.length }} />
            </Typography>
          )}
        </Stack>
        {addButton}
      </Stack>

      <OutlinedInput
        fullWidth
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder={intl.formatMessage({ id: 'admin.gifts.search.placeholder' })}
        startAdornment={
          <InputAdornment position="start" sx={{ color: 'text.secondary' }}>
            <SearchIcon size={18} />
          </InputAdornment>
        }
        slotProps={{ input: { 'aria-label': intl.formatMessage({ id: 'admin.gifts.search.label' }), autoComplete: 'off' } }}
        sx={{ maxWidth: { sm: 400 }, bgcolor: 'background.paper' }}
      />

      {content}
    </Stack>
  );
}
