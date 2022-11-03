import { useState, useEffect } from 'react';
import { getData } from '~/functions';
import { IComboboxItem } from '../combobox.ui.type';

type ComboAlias = {
  codeName: string;
  textName: string;
};

type ComboData = {
  code: string;
  text: string;
};

type ComboApiResponse = {
  [key: string]: string;
};

const pushFilteredData = ({ codeName, textName }: ComboAlias) => {
  return (data: ComboData[], item: ComboApiResponse) => {
    if (item[codeName] && item[textName]) {
      data.push({
        code: item[codeName],
        text: item[textName],
      });
    }
    return data;
  };
};

export const useComboDatas = ({ params, uriPath, codeName, textName }) => {
  const [comboData, setComboData] = useState<IComboboxItem[]>([]);

  const comboApi = async () =>
    await getData<{ data: any }>(uriPath, params).then(res => {
      const apiData = res.data.reduce(
        pushFilteredData({ codeName, textName }),
        [],
      );

      setComboData(apiData);

      return apiData;
    });

  useEffect(() => {
    comboApi();
  }, []);

  return { comboData, comboApi };
};
