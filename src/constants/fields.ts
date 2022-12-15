import { ISearchItem } from '~/components/UI';
import { getToday } from '~/functions';

type FieldStoreRecordKeys = 'DUE_DATE_RANGE_SEVEN';

export const FieldStore: Record<FieldStoreRecordKeys, ISearchItem[]> = {
  DUE_DATE_RANGE_SEVEN: [
    { type: 'date', id: 'start_date', label: '기간', default: getToday(-7) },
    { type: 'date', id: 'end_date', default: getToday() },
  ],
};
