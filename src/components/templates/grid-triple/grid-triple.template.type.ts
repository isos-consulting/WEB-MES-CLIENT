import Grid from "@toast-ui/react-grid";
import { IButtonProps, IDatagridProps, IGridPopupProps, IModalProps, ISearchboxProps } from "~/components/UI";
import { IInputGroupboxProps } from "~/components/UI/input-groupbox";

export default interface ITpTripleGridProps {
  /** 페이지 제목 */
  title: string;

  /** 버튼 글자 수정 */
  btnProps?: {
    create?: IButtonProps,
    add?: IButtonProps,
    edit?: IButtonProps,
    delete?: IButtonProps,
  }

  /** 페이지 유형 */
  templateType?: 'basic' | 'report';
  templateOrientation?: 'filledLayoutRight' | 'filledLayoutLeft';

  /** 기타 헤더 버튼 */
  headerExtraButtons?: IExtraButton[];

  /** 기타 팝업 */
  extraModals?: TExtraModals;
  extraGridPopups?: TExtraGridPopups;

  /** 그리드 레퍼런스 */
  gridRefs: React.MutableRefObject<Grid>[];
  popupGridRefs: React.MutableRefObject<Grid>[];

  /** 그리드 */
  gridInfos: IDatagridProps[];
  popupGridInfos: TPopupGridInfos;

  /** 검색조건 */
  searchProps: ISearchboxProps[];
  popupSearchProps?: ISearchboxProps[];

  /** 그룹입력박스 */
  inputProps: IInputGroupboxProps[];
  popupInputProps?: IInputGroupboxProps[];

  /** 모달 콘텍스트 */
  modalContext: React.ReactElement<any, string | React.JSXElementConstructor<any>>;

  /** 모달 visible */
  popupVisibles: boolean[];
  setPopupVisibles: React.Dispatch<React.SetStateAction<boolean>>[];

  dataSaveType?: 'basic' | 'headerInclude';

  /** 버튼 액션 */
  buttonActions: {
    search: () => void | null;
    update: () => void | null;
    delete: () => void | null;
    create: () => void | null;
    createDetail: () => void | null;
    save: () => void | null;
    cancelEdit: () => void | null;
    printExcel: () => void | null;
  };

  onAfterOkNewDataPopup?: (isSuccess:boolean, savedData?:any[]) => void;
  onAfterOkAddDataPopup?: (isSuccess:boolean, savedData?:any[]) => void;
  onAfterOkEditDataPopup?: (isSuccess:boolean, savedData?:any[]) => void;
};

export type TPopupGridInfos = (IDatagridProps & IModalProps)[];
export interface IExtraButton extends IButtonProps {};
export type TExtraModals = IModalProps[];
export type TExtraGridPopups = IGridPopupProps[];
