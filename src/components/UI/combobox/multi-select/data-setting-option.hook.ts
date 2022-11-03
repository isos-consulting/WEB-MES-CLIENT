import { useState, useEffect } from 'react';
import { getData } from '~/functions';
import { IComboboxItem } from '../combobox.ui.type';

type ComboAlias = {
  codeName: string;
  textName: string;
};

type OptionProps = {
  value: string;
  label: string;
};

type ComboApiResponse = {
  [key: string]: string;
};

const pushFilteredData = ({ codeName, textName }: ComboAlias) => {
  return (data: OptionProps[], item: ComboApiResponse) => {
    if (item[codeName] && item[textName]) {
      data.push({
        value: item[codeName],
        label: item[textName],
      });
    }
    return data;
  };
};

export const useComboDatas = ({ uriPath, params, codeName, textName }) => {
  const [comboData, setComboData] = useState<IComboboxItem[]>([]);

  const comboApi = async () =>
    await getData(params, uriPath).then(res => {
      const apiData = res.reduce(pushFilteredData({ codeName, textName }), []);

      setComboData(apiData);

      return apiData;
    });

  useEffect(() => {
    if (params && uriPath) {
      comboApi();
    }
  }, []);

  return { comboData, comboApi };
};
