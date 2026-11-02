// types
import { GiftFormField, GiftFormValues } from './GiftForm.types';

export const emptyGiftFormValues: GiftFormValues = { name: '', price: '', url: '', image: '', order: '' };

/** ordem em que os campos aparecem na tela: o primeiro com erro recebe o foco */
export const GIFT_FORM_FIELDS: GiftFormField[] = ['name', 'price', 'order', 'url', 'image'];

export const giftFieldId = (field: GiftFormField) => `gift-${field}`;
