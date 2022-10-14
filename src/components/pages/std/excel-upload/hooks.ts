import {
  ExcelSample,
  SampleUploadableMenu,
  UserSelectableMenu,
} from './models';
import { useState } from 'react';

export const useButtonDisableWhenMenuSelectablePolicy = () => {
  const selectableMenu = new UserSelectableMenu();
  const [item, select] = useState<ExcelSample & SampleUploadableMenu>(null);

  selectableMenu.item = item;
  selectableMenu.allocateSelectMenu(
    (item: ExcelSample & SampleUploadableMenu) => {
      select(item);
    },
  );

  return { selectableMenu };
};
