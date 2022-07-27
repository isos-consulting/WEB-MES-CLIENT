import { IGridComboInfo } from '~/components/UI';

interface ComboStoreProps {
  [combo: string]: IGridComboInfo;
}

const ComboStore: ComboStoreProps = {
  formType: {
    columnNames: [
      {
        codeColName: { original: 'formType', popup: 'formType' },
        textColName: { original: 'formType', popup: 'formType' },
      },
    ],
    itemList: [
      { code: 'text', text: 'text' },
      { code: 'number', text: 'number' },
      { code: 'popup', text: 'popup' },
    ],
  },
};

export default ComboStore;
