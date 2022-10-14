import {
  ExcelSample,
  SampleUploadableMenu,
  UserSelectableMenu,
} from './models';
import { useState } from 'react';

export const useButtonDisableWhenMenuSelectablePolicy = (
  selectableMenu: UserSelectableMenu,
) => {
  const [item, select] = useState<ExcelSample & SampleUploadableMenu>(null);
  const [unselectedMenuDisabled, setDisabled] = useState<boolean>(true);

  selectableMenu.item = item;
  selectableMenu.allocateSelectMenu(
    (item: ExcelSample & SampleUploadableMenu) => {
      select(item);
      if (item == null) {
        setDisabled(true);
      } else {
        setDisabled(false);
      }
    },
  );

  return { selectableMenu, unselectedMenuDisabled };
};
