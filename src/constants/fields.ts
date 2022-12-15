import { ISearchItem } from '~/components/UI';
import { getToday } from '~/functions';

export const FieldStore: { [key: string]: ISearchItem[] } = {
  DUE_DATE_RANGE_SEVEN: [
    { type: 'date', id: 'start_date', label: '기간', default: getToday(-7) },
    { type: 'date', id: 'end_date', default: getToday() },
  ],
};
