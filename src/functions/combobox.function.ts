import { IComboBoxItem } from '~/components/UI/combobox/combobox.ui.type';

type ComboTextPairProps = {
  codeName: string;
  textName: string;
  options: { [key: string]: string }[];
};

export const getCodeTextPairList = ({
  codeName,
  textName,
  options,
}: ComboTextPairProps): IComboBoxItem[] => {
  return options.reduce((list, option) => {
    const { code, text } = {
      code: option[codeName],
      text: option[textName],
    };

    if (code && text) {
      return [...list, { code, text }];
    }

    return list;
  }, []);
};
