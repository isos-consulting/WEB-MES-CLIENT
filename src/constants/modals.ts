import { IGridPopupInfo } from '~/components/UI';

interface ModalStoreProps {
  [modal: string]: IGridPopupInfo;
}

const ModalStore: ModalStoreProps = {
  autMenu: {
    columnNames: [
      { original: 'menuUuid', popup: 'menu_uuid' },
      { original: 'menuName', popup: 'menu_nm' },
    ],
    gridMode: 'select',
    popupKey: '메뉴관리',
  },
};

export default ModalStore;