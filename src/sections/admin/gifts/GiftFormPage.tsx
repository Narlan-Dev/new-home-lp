import { Link as RouterLink, useNavigate, useParams } from 'react-router';

// material-ui
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project-imports
import SafeFormattedMessage from 'components/@extended/SafeFormattedMessage';
import ErrorState from 'components/ErrorState';
import { ROUTES } from 'constants/routes';
import { useCreateGiftMutation, useGift, useGifts, useUpdateGiftMutation } from 'framework/rest/gifts';
import { getApiErrorCode } from 'framework/rest/client/error-utils';
import { nextGiftOrder } from 'utils/gifts';
import { isValidDatabaseKey } from 'utils/isValidDatabaseKey';
import GiftForm from './GiftForm';
import { giftToFormValues, toCreateGift, toUpdateGift } from './GiftForm.schema';

// types
import { GiftFormValues } from './GiftForm.types';

// assets
import { ArrowLeftIcon } from 'assets/icons';

// ==============================|| ADMIN - GIFT FORM PAGE (CREATE / EDIT) ||============================== //

// a mesma tela serve para cadastrar (/admin/gifts/new) e editar (/admin/gifts/:id)
export default function GiftFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = id !== undefined;

  const list = useGifts();
  const current = useGift({ id });
  const createGift = useCreateGiftMutation();
  const updateGift = useUpdateGiftMutation();

  const goToList = () => navigate(ROUTES.ADMIN.GIFTS);

  const handleSubmit = (values: GiftFormValues) => {
    // posição em branco = fim da lista
    const fallbackOrder = nextGiftOrder(list.gifts);

    if (id) updateGift.mutate({ id, ...toUpdateGift(values, fallbackOrder) }, { onSuccess: goToList });
    else createGift.mutate(toCreateGift(values, fallbackOrder), { onSuccess: goToList });
  };

  const notFound = isEdit && (!isValidDatabaseKey(id) || getApiErrorCode(current.error) === 'not-found');
  const loading = list.isLoading || (isEdit && current.isLoading);
  const failure = list.error ?? (isEdit ? current.error : null);

  let content;
  if (notFound) {
    content = <ErrorState message={<SafeFormattedMessage id="admin.gifts.form.notFound" />} />;
  } else if (failure) {
    content = (
      <ErrorState
        message={<SafeFormattedMessage id="admin.gifts.error" />}
        retrying={list.isFetching || current.isFetching}
        onRetry={() => {
          if (list.error) void list.refetch();
          if (isEdit && current.error) void current.refetch();
        }}
      />
    );
  } else if (loading || (isEdit && !current.gift)) {
    content = (
      <Stack sx={{ gap: 3 }} aria-hidden="true">
        {[0, 1, 2].map((row) => (
          <Skeleton key={row} variant="rounded" height={52} />
        ))}
      </Stack>
    );
  } else {
    content = (
      <GiftForm
        // o formulário recomeça do zero quando troca de presente
        key={current.gift?.id ?? 'new'}
        initialValues={current.gift ? giftToFormValues(current.gift) : undefined}
        submitLabelId={isEdit ? 'admin.gifts.form.submit.edit' : 'admin.gifts.form.submit.create'}
        pending={createGift.isPending || updateGift.isPending}
        onSubmit={handleSubmit}
      />
    );
  }

  return (
    <Stack sx={{ gap: 3, maxWidth: 720 }}>
      <Link
        component={RouterLink}
        to={ROUTES.ADMIN.GIFTS}
        underline="none"
        sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, alignSelf: 'flex-start', color: 'text.secondary' }}
      >
        <ArrowLeftIcon size={18} />
        <SafeFormattedMessage id="admin.gifts.form.back" />
      </Link>

      <Typography variant="h3" component="h1" sx={{ fontSize: { xs: '2.25rem', md: '2.75rem' }, lineHeight: { xs: 1.1, md: 1.1 } }}>
        <SafeFormattedMessage id={isEdit ? 'admin.gifts.form.title.edit' : 'admin.gifts.form.title.create'} />
      </Typography>

      <Box sx={{ p: { xs: 3, md: 5 }, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: '24px' }}>
        {content}
      </Box>
    </Stack>
  );
}
