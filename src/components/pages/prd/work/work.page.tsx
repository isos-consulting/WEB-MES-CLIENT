import { CaretRightOutlined } from '@ant-design/icons';
import Grid from '@toast-ui/react-grid';
import {
  Divider,
  message,
  Space,
  Typography,
  Modal,
  Col,
  Row,
  Input,
} from 'antd';
import dayjs from 'dayjs';
import React, {
  useLayoutEffect,
  useReducer,
  useRef,
  useState,
  useMemo,
} from 'react';
import {
  Button,
  Container,
  Datagrid,
  IGridColumn,
  Label,
  Searchbox,
  Tabs,
  TGridMode,
  useSearchbox,
} from '~/components/UI';
import {
  executeData,
  getData,
  getPageName,
  getPermissions,
  getToday,
  saveGridData,
} from '~/functions';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import localeData from 'dayjs/plugin/localeData';
import weekday from 'dayjs/plugin/weekday';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import weekYear from 'dayjs/plugin/weekYear';
import { INSP } from './work.page.insp';
import { INPUT } from './work.page.input';
import { WORKER } from './work.page.worker';
import { REJECT } from './work.page.reject';
import { DOWNTIME } from './work.page.downtime';
import { ENUM_WIDTH, URL_PATH_PRD } from '~/enums';
import Fonts from '~styles/font.style.scss';
import { cloneDeep, isEmpty, pick } from 'lodash';
import { RoutingInfo, WorkInfo, workRoutingStore } from './work-components';

// 날짜 로케일 설정
dayjs.locale('ko-kr');

// moment 타입과 호환시키기 위한 행위
dayjs.extend(customParseFormat);
dayjs.extend(advancedFormat);
dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.extend(weekOfYear);
dayjs.extend(weekYear);

const TAB_CODE = {
  WORK_INSP: 'INSP',
  WORK_INPUT: 'INPUT',
  WORK_WORKER: 'WORKER',
  WORK_REJECT: 'REJECT',
  WORK_DOWNTIME: 'DOWNTIME',
  공정순서: 'ROUTING',
};

const onErrorMessage = type => {
  switch (type) {
    case '하위이력작업시도':
      message.warn('작업이력을 선택한 후 다시 시도해주세요.');
      break;

    case '공정순서이력작업시도':
      message.warn('공정순서를 선택한 후 다시 시도해주세요.');
      break;

    case '완료된작업시도':
      message.warn('이미 완료된 작업은 수정할 수 없습니다.');
      break;

    default:
      break;
  }
};

//#region ✅작업정보 / 생산정보 관련 상태 값
const infoInit = {
  orderInfo: {
    prod_uuid: null,
    prod_no: null,
    prod_nm: null,
    item_type_uuid: null,
    item_type_nm: null,
    prod_type_uuid: null,
    prod_type_nm: null,
    model_uuid: null,
    model_nm: null,
    rev: null,
    prod_std: null,
    unit_uuid: null,
    unit_nm: null,
    equip_uuid: null,
    equip_nm: null,
    proc_uuid: null,
    proc_nm: null,
    shift_uuid: null,
    shift_nm: null,
    workings_uuid: null,
    workings_nm: null,
    order_remark: null,
  },
  workInfo: {
    work_uuid: null,
    complete_fg: null,
    start_date: null,
    end_date: null,
    _start_date: null,
    _end_date: null,
    _start_time: null,
    _end_time: null,
    to_store_uuid: null,
    to_store_nm: null,
    to_location_uuid: null,
    to_location_nm: null,
    order_qty: null, //지시수량
    total_qty: null, //생산수량
    qty: null, //양품수량
    reject_qty: null, //부적합수량
    lot_no: null,
    remark: null,
  },
  routingInfo: {
    work_routing_uuid: null,
    factory_uuid: null,
    factory_cd: null,
    factory_nm: null,
    work_uuid: null,
    proc_uuid: null,
    proc_cd: null,
    proc_nm: null,
    proc_no: null,
    workings_uuid: null,
    workings_cd: null,
    workings_nm: null,
    equip_uuid: null,
    equip_cd: null,
    equip_nm: null,
    mold_uuid: null,
    mold_cd: null,
    mold_nm: null,
    mold_cavity: null,
    qty: null,
    start_date: null,
    end_date: null,
    _start_date: null,
    _end_date: null,
    _start_time: null,
    _end_time: null,
    work_time: null,
    ongoing_fg: null,
    remark: null,
  },
};

type TAction =
  | { type: 'CHANGE_ORDER_INFO'; name: string; value: any }
  | { type: 'CHANGE_WORK_INFO'; name: string; value: any }
  | { type: 'CHANGE_ROUTING_INFO'; name: string; value: any }
  | { type: 'CHANGE_ALL'; name?: string; value?: any }
  | { type: 'CHANGE_ALL_ORDER'; name?: string; value?: any }
  | { type: 'CHANGE_ALL_WORK'; name?: string; value?: any }
  | { type: 'CHANGE_ALL_ROUTING'; name?: string; value?: any }
  | { type: 'CLEAR_ORDER_INFO'; name?: string; value?: any }
  | { type: 'CLEAR_WORK_INFO'; name?: string; value?: any }
  | { type: 'CLEAR_ROUTING_INFO'; name?: string; value?: any }
  | { type: 'CLEAR_ALL'; name?: string; value?: any };

type TState = {
  orderInfo: {
    prod_uuid: string;
    prod_no: string;
    prod_nm: string;
    item_type_uuid: string;
    item_type_nm: string;
    prod_type_uuid: string;
    prod_type_nm: string;
    model_uuid: string;
    model_nm: string;
    rev: string;
    prod_std: string;
    unit_uuid: string;
    unit_nm: string;
    equip_uuid: string;
    equip_nm: string;
    proc_uuid: string;
    proc_nm: string;
    shift_uuid: string;
    shift_nm: string;
    workings_uuid: string;
    workings_nm: string;
    order_remark: string;
  };
  workInfo: {
    work_uuid: string;
    complete_fg: string;
    start_date: string;
    end_date: string;
    _start_date: dayjs.Dayjs;
    _end_date: dayjs.Dayjs;
    _start_time: dayjs.Dayjs;
    _end_time: dayjs.Dayjs;
    to_store_uuid: string;
    to_store_nm: string;
    to_location_uuid: string;
    to_location_nm: string;
    order_qty: string | number; //지시수량
    total_qty: string | number; //생산수량
    qty: string | number; //양품수량
    reject_qty: string | number; //부적합수량
    lot_no: string;
    remark: string;
  };
  routingInfo: {
    work_routing_uuid: string;
    factory_uuid: string;
    factory_cd: string;
    factory_nm: string;
    work_uuid: string;
    proc_uuid: string;
    proc_cd: string;
    proc_nm: string;
    proc_no: string | number;
    workings_uuid: string;
    workings_cd: string;
    workings_nm: string;
    equip_uuid: string;
    equip_cd: string;
    equip_nm: string;
    mold_uuid: string;
    mold_cd: string;
    mold_nm: string;
    mold_cavity: string | number;
    qty: string | number;
    start_date: string;
    end_date: string;
    _start_date: dayjs.Dayjs;
    _end_date: dayjs.Dayjs;
    _start_time: dayjs.Dayjs;
    _end_time: dayjs.Dayjs;
    work_time: string | number;
    ongoing_fg: boolean;
    remark: string;
  };
};

const infoReducer = (state: TState, action: TAction) => {
  const { type } = action;

  switch (type) {
    case 'CHANGE_ORDER_INFO':
      return {
        ...state,
        orderInfo: {
          ...state.orderInfo,
          [action.name]: action.value,
        },
      };

    case 'CHANGE_WORK_INFO':
      return {
        ...state,
        workInfo: {
          ...state.workInfo,
          [action.name]: action.value,
        },
      };

    case 'CHANGE_ROUTING_INFO':
      return {
        ...state,
        routingInfo: {
          ...state.routingInfo,
          [action.name]: action.value,
        },
      };

    case 'CHANGE_ALL':
      return action.value;

    case 'CHANGE_ALL_ORDER':
      return {
        ...state,
        orderInfo: action.value,
      };

    case 'CHANGE_ALL_WORK':
      return {
        ...state,
        workInfo: action.value,
      };

    case 'CHANGE_ALL_ROUTING':
      return {
        ...state,
        routingInfo: action.value,
      };

    case 'CLEAR_ORDER_INFO':
      return {
        ...state,
        orderInfo: infoInit.orderInfo,
      };

    case 'CLEAR_WORK_INFO':
      return {
        ...state,
        workInfo: infoInit.workInfo,
      };

    case 'CLEAR_ROUTING_INFO':
      return {
        ...state,
        routingInfo: infoInit.routingInfo,
      };

    case 'CLEAR_ALL':
      return infoInit;

    default:
      return state;
  }
};
//#endregion

//#region 🔶🚫생산실적
/** 생산실적 */
export const PgPrdWork = () => {
  /** 페이지 제목 */
  const title = getPageName();

  /** 권한 관련 */
  const permissions = getPermissions(title);

  //#region ✅설정값
  const [modal, contextHolder] = Modal.useModal();

  const [gridMode] = useState<TGridMode>('view');

  const [workDatas, setWorkDatas] = useState([]);

  const [tabKey, setTabKey] = useState('');

  const gridRef = useRef<Grid>();

  const SEARCH_URI_PATH = '/prd/works';

  const workInsp = INSP();
  const workInput = INPUT();
  const workWorker = WORKER();
  const workReject = REJECT();
  const workDowntime = DOWNTIME();
  const workRouting = workRoutingStore();

  // 팝업 관련
  const [prodOrderPopupVisible, setProdOrderPopupVisible] = useState(false);

  // 작업정보, 생산정보 관리
  const [infoState, infoDispatch] = useReducer(infoReducer, infoInit);
  const { orderInfo, workInfo, routingInfo } = infoState;
  //#endregion

  //#region 🚫함수
  const onProdOrder = () => {
    setProdOrderPopupVisible(true);
  };

  const onProdOrderClose = () => {
    setProdOrderPopupVisible(false);
  };

  /** 작업 취소 처리 */
  const onCancelWork = () => {
    if (workInfo.work_uuid == null) {
      onErrorMessage('하위이력작업시도');
      return;
    }

    if (workInfo.complete_fg !== true) {
      message.warn('완료된 실적만 취소 가능합니다.');
      return;
    }

    const SAVE_URI_PATH = '/prd/works/cancel-complete';

    modal.confirm({
      title: '작업 취소',
      content: '작업을 취소하시겠습니까?',
      okText: '예',
      cancelText: '아니오',
      onOk: () => {
        //작업 취소처리
        executeData(
          [
            {
              uuid: workInfo.work_uuid,
            },
          ],
          SAVE_URI_PATH,
          'put',
          'success',
        )
          .then(success => {
            if (success === true) {
              message.info('정상적으로 취소되었습니다.');
              searchInfo.onSearch();
            } else {
              message.error('오류가 발생했습니다. 관리자에게 문의해주세요.');
            }
          })
          .catch(e => {
            console.error(e);
            message.error('오류가 발생했습니다. 관리자에게 문의해주세요.');
          });
      },
    });
  };

  /** 실적 삭제 처리 */
  const onDeleteWork = () => {
    if (workInfo.work_uuid == null) {
      onErrorMessage('하위이력작업시도');
      return;
    }

    const SAVE_URI_PATH = '/prd/works';

    modal.confirm({
      title: '실적 제거',
      content: '실적을 삭제하시겠습니까?',
      okText: '예',
      cancelText: '아니오',
      onOk: () => {
        //실적 삭제처리
        executeData(
          [
            {
              uuid: workInfo.work_uuid,
            },
          ],
          SAVE_URI_PATH,
          'delete',
          'success',
        )
          .then(success => {
            if (success === true) {
              message.info('정상적으로 삭제되었습니다.');
              searchInfo?.onSearch();
            } else {
              message.error('오류가 발생했습니다. 관리자에게 문의해주세요.');
            }
          })
          .catch(e => {
            console.error(e);
            message.error('오류가 발생했습니다. 관리자에게 문의해주세요.');
          });
      },
    });
  };

  const saveWorkRouting = async (workData, routingData) => {
    const SAVE_URI_PATH = '/prd/work-routings';

    const result = await executeData(
      [
        {
          uuid: routingData?.['uuid'],
          workings_uuid: routingData?.['workings_uuid'],
          equip_uuid: routingData?.['equip_uuid'],
          mold_uuid: routingData?.['mold_uuid'],
          mold_cavity: Number(routingData?.['mold_cavity']),
          qty: Number(routingData?.['qty']),
          start_date: routingData?.['start_date'],
          end_date: routingData?.['end_date'],
          ongoing_fg: routingData?.['ongoing_fg'],
          prd_signal_cnt: routingData?.['prd_signal_cnt'],
          remark: routingData?.['remark'],
        },
      ],
      SAVE_URI_PATH,
      'put',
      'success',
    )
      .then(success => {
        return true;
      })
      .catch(e => {
        console.error(e);
        message.error('오류가 발생했습니다. 관리자에게 문의해주세요.');
      });

    return !!result;
  };

  /** 생산실적 중간저장 처리 */
  const onSaveWork = async () => {
    if (workInfo.work_uuid == null) {
      onErrorMessage('하위이력작업시도');
      return;
    }

    if (routingInfo.work_routing_uuid == null) {
      onErrorMessage('공정순서이력작업시도');
      return;
    }

    if (workInfo.complete_fg === true) {
      onErrorMessage('완료된작업시도');
      return;
    }

    const workData = cloneDeep(workInfo);
    const routingData = cloneDeep(routingInfo);

    if (!routingData?.['_start_date'] && routingData?.['_start_time']) {
      message.warn('시작일자를 입력해주세요.');
      return;
    }
    if (routingData?.['_start_date'] && !routingData?.['_start_time']) {
      message.warn('시작시간을 입력해주세요.');
      return;
    }
    if (!routingData?.['_end_date'] && routingData?.['_end_time']) {
      message.warn('종료일자를 입력해주세요.');
      return;
    }
    if (routingData?.['_end_date'] && !routingData?.['_end_time']) {
      message.warn('종료시간을 입력해주세요.');
      return;
    }

    modal.confirm({
      title: '중간 저장',
      content: '실적을 중간 저장하시겠습니까?',
      okText: '예',
      cancelText: '아니오',
      onOk: () => {
        // 실적 중간 저장
        saveWorkRouting(workData, routingData).then((result: boolean) => {
          if (result === true) {
            message.info('정상적으로 저장되었습니다.');
            onSearch(searchInfo.values, () => {
              onHeaderClick({ targetType: 'cell' }, workData?.work_uuid);
            });
          } else {
            message.error('오류가 발생했습니다. 관리자에게 문의해주세요.');
          }
        });
      },
    });
  };

  /** 생산실적 완료 처리 */
  const onCompleteWork = async () => {
    if (workInfo.work_uuid == null) {
      onErrorMessage('하위이력작업시도');
      return;
    }

    if (workInfo.complete_fg === true) {
      onErrorMessage('완료된작업시도');
      return;
    }

    const SAVE_URI_PATH = '/prd/works/complete';
    const workData = cloneDeep(workInfo);
    const routingData = cloneDeep(routingInfo);

    if (!routingData?.['_start_date'] && routingData?.['_start_time']) {
      message.warn('시작일자를 입력해주세요.');
      return;
    }
    if (routingData?.['_start_date'] && !routingData?.['_start_time']) {
      message.warn('시작시간을 입력해주세요.');
      return;
    }
    if (!routingData?.['_end_date'] && routingData?.['_end_time']) {
      message.warn('종료일자를 입력해주세요.');
      return;
    }
    if (routingData?.['_end_date'] && !routingData?.['_end_time']) {
      message.warn('종료시간을 입력해주세요.');
      return;
    }

    modal.confirm({
      title: '작업 종료',
      content: '작업을 종료하시겠습니까?',
      okText: '예',
      cancelText: '아니오',
      onOk: () => {
        saveWorkRouting(workData, routingData).then((result: boolean) => {
          //실적완료처리
          executeData(
            [
              {
                uuid: workInfo.work_uuid,
              },
            ],
            SAVE_URI_PATH,
            'put',
            'success',
          )
            .then(success => {
              if (success === true) {
                message.info('정상적으로 종료되었습니다.');
                searchInfo?.onSearch(searchInfo.values);
              } else {
                message.error('오류가 발생했습니다. 관리자에게 문의해주세요.');
              }
            })
            .catch(e => {
              console.error(e);
              message.error('오류가 발생했습니다. 관리자에게 문의해주세요.');
            });
        });
      },
    });
  };
  //#endregion

  //#region ✅조회조건
  const onSearch = (
    values,
    afterSearch: () => void = () => {
      // this function is for search after search
    },
  ) => {
    const dateParams = !values?.complete_fg
      ? {
          start_date: values?.start_date,
          end_date: values?.end_date,
        }
      : {};
    const searchParams = {
      ...dateParams,
      complete_fg: values?.complete_fg,
    };

    getData(searchParams, SEARCH_URI_PATH)
      .then(res => {
        setWorkDatas(res || []);

        // 작업정보 및 실적정보 초기화
        infoDispatch({ type: 'CLEAR_ALL' });

        // 실적이력 조회되면서 하위 데이터 초기화
        workInsp.onReset();

        workInput.setGridMode('view');

        // 실적이력 조회되면서 하위 데이터 초기화
        workInput.setSearchParams({});
        workInput.setSaveOptionParams({});
        workInput.setData([]);

        workWorker.setSearchParams({});
        workWorker.setSaveOptionParams({});
        workWorker.setData([]);

        workReject.setSearchParams({});
        workReject.setSaveOptionParams({});
        workReject.setData([]);

        workDowntime.setSearchParams({});
        workDowntime.setSaveOptionParams({});
        workDowntime.setData([]);

        workRouting.setData([]);
      })
      .finally(afterSearch);
  };

  const [completeChk, setCompleteChk] = useState<boolean>(false);
  const searchItems = useMemo(() => {
    return [
      {
        type: 'date',
        id: 'start_date',
        label: '작업기간',
        default: getToday(-7),
        disabled: !completeChk,
      },
      {
        type: 'date',
        id: 'end_date',
        default: getToday(),
        disabled: !completeChk,
      },
      {
        type: 'radio',
        id: 'complete_fg',
        default: 'false',
        options: [
          { code: 'false', text: '작업중' },
          { code: 'true', text: '작업완료' },
        ],
      },
    ];
  }, [completeChk]);

  const searchInfo = useSearchbox('WORK_SEARCHBOX', searchItems, onSearch, {
    validate: values => {
      const completeFg = values?.complete_fg;
      if (completeFg === 'true') {
        setCompleteChk(true);
      } else {
        setCompleteChk(false);
      }
      return values;
    },
  });

  useLayoutEffect(() => {
    if (searchInfo && searchItems) {
      searchInfo.setSearchItems(searchItems);
    }
  }, [searchInfo, searchItems]);
  //#endregion

  //#region ✅컬럼
  const WORK_COLUMNS: IGridColumn[] = [
    {
      header: '생산실적UUID',
      name: 'work_uuid',
      alias: 'uuid',
      width: ENUM_WIDTH.L,
      hidden: true,
      format: 'text',
    },
    {
      header: '실적 일시',
      name: 'reg_date',
      width: ENUM_WIDTH.L,
      hidden: true,
      format: 'text',
    },
    {
      header: '작업지시UUID',
      name: 'order_uuid',
      width: ENUM_WIDTH.L,
      hidden: true,
      format: 'text',
    },
    {
      header: '지시번호',
      name: 'order_no',
      width: ENUM_WIDTH.L,
      hidden: true,
      format: 'text',
    },
    {
      header: '생산실적 순번',
      name: 'seq',
      width: ENUM_WIDTH.L,
      hidden: true,
      format: 'text',
    },
    {
      header: '공정UUID',
      name: 'proc_uuid',
      width: ENUM_WIDTH.L,
      hidden: true,
      format: 'text',
    },
    {
      header: '공정',
      name: 'proc_nm',
      width: ENUM_WIDTH.M,
      hidden: false,
      format: 'text',
    },
    {
      header: '작업장UUID',
      name: 'workings_uuid',
      width: ENUM_WIDTH.L,
      hidden: true,
      format: 'text',
    },
    {
      header: '작업장',
      name: 'workings_nm',
      width: ENUM_WIDTH.M,
      hidden: false,
      format: 'text',
    },
    // {header:'설비UUID', name:'equip_uuid', width:ENUM_WIDTH.L, hidden:true, format:'text'},
    // {header:'설비', name:'equip_nm', width:ENUM_WIDTH.M, hidden:false, format:'text'},
    // {header: '금형UUID', name:'mold_uuid', width:150, filter:'text', hidden:true},
    // {header: '금형명', name:'mold_nm', width:ENUM_WIDTH.L, filter:'text'},
    // {header: '금형번호', name:'mold_no', width:ENUM_WIDTH.L, filter:'text'},
    // {header: 'cavity', name:'mold_cavity', width:ENUM_WIDTH.S,  format:'number', decimal:ENUM_DECIMAL.DEC_NOMAL},
    {
      header: '품목UUID',
      name: 'prod_uuid',
      width: ENUM_WIDTH.L,
      hidden: true,
      format: 'text',
    },
    {
      header: '품목유형UUID',
      name: 'item_type_uuid',
      width: ENUM_WIDTH.L,
      hidden: true,
      format: 'text',
    },
    {
      header: '품목유형',
      name: 'item_type_nm',
      width: ENUM_WIDTH.M,
      hidden: false,
      format: 'text',
    },
    {
      header: '제품유형UUID',
      name: 'prod_type_uuid',
      width: ENUM_WIDTH.L,
      hidden: true,
      format: 'text',
    },
    {
      header: '제품유형',
      name: 'prod_type_nm',
      width: ENUM_WIDTH.M,
      hidden: false,
      format: 'text',
    },
    {
      header: '품번',
      name: 'prod_no',
      width: ENUM_WIDTH.M,
      hidden: false,
      format: 'text',
    },
    {
      header: '품명',
      name: 'prod_nm',
      width: ENUM_WIDTH.M,
      hidden: false,
      format: 'text',
    },
    {
      header: '모델UUID',
      name: 'model_uuid',
      width: ENUM_WIDTH.L,
      hidden: true,
      format: 'text',
    },
    {
      header: '모델',
      name: 'model_nm',
      width: ENUM_WIDTH.M,
      hidden: false,
      format: 'text',
    },
    {
      header: 'Rev',
      name: 'rev',
      width: ENUM_WIDTH.M,
      hidden: false,
      format: 'text',
    },
    {
      header: '규격',
      name: 'prod_std',
      width: ENUM_WIDTH.M,
      hidden: false,
      format: 'text',
    },
    {
      header: '단위UUID',
      name: 'unit_uuid',
      width: ENUM_WIDTH.L,
      hidden: true,
      format: 'text',
    },
    {
      header: '단위',
      name: 'unit_nm',
      width: ENUM_WIDTH.S,
      hidden: false,
      format: 'text',
    },
    {
      header: 'LOT NO',
      name: 'lot_no',
      width: ENUM_WIDTH.M,
      hidden: false,
      format: 'text',
    },
    {
      header: '지시 수량',
      name: 'order_qty',
      width: ENUM_WIDTH.M,
      hidden: false,
      format: 'number',
    },
    {
      header: '생산 수량',
      name: 'total_qty',
      width: ENUM_WIDTH.M,
      hidden: false,
      format: 'number',
    },
    {
      header: '양품 수량',
      name: 'qty',
      width: ENUM_WIDTH.M,
      hidden: false,
      format: 'number',
    },
    {
      header: '부적합 수량',
      name: 'reject_qty',
      width: ENUM_WIDTH.M,
      hidden: false,
      format: 'number',
    },
    {
      header: '생산시작 일시',
      name: 'start_date',
      width: ENUM_WIDTH.M,
      hidden: false,
      format: 'datetime',
    },
    {
      header: '생산종료 일시',
      name: 'end_date',
      width: ENUM_WIDTH.M,
      hidden: false,
      format: 'datetime',
    },
    {
      header: '작업시간',
      name: 'work_time',
      width: ENUM_WIDTH.S,
      hidden: true,
      format: 'text',
    },
    {
      header: '작업교대UUID',
      name: 'shift_uuid',
      width: ENUM_WIDTH.L,
      hidden: true,
      format: 'text',
    },
    {
      header: '작업교대명',
      name: 'shift_nm',
      width: ENUM_WIDTH.M,
      hidden: false,
      format: 'text',
    },
    {
      header: '작업자수',
      name: 'worker_cnt',
      width: ENUM_WIDTH.M,
      hidden: false,
      format: 'text',
    },
    {
      header: '작업자명',
      name: 'worker_nm',
      width: ENUM_WIDTH.M,
      hidden: false,
      format: 'text',
    },
    {
      header: '생산 완료여부(완료, 미완료)',
      name: 'complete_state',
      width: ENUM_WIDTH.L,
      hidden: true,
      format: 'text',
    },
    {
      header: '생산 종료여부',
      name: 'complete_fg',
      width: ENUM_WIDTH.L,
      hidden: true,
      format: 'text',
    },
    {
      header: '입고 창고UUID',
      name: 'to_store_uuid',
      width: ENUM_WIDTH.L,
      hidden: true,
      format: 'text',
    },
    {
      header: '입고 창고',
      name: 'to_store_nm',
      width: ENUM_WIDTH.M,
      hidden: false,
      format: 'text',
    },
    {
      header: '입고 위치UUID',
      name: 'to_location_uuid',
      width: ENUM_WIDTH.L,
      hidden: true,
      format: 'text',
    },
    {
      header: '입고 위치',
      name: 'to_location_nm',
      width: ENUM_WIDTH.M,
      hidden: false,
      format: 'text',
    },
    {
      header: '지시 비고',
      name: 'order_remark',
      width: ENUM_WIDTH.L,
      hidden: false,
      format: 'text',
    },
    {
      header: '생산 비고',
      name: 'remark',
      width: ENUM_WIDTH.L,
      hidden: false,
      format: 'text',
    },
  ];
  //#endregion

  // infoDispatch 실행
  const setInfoData = data => {
    infoDispatch({
      type: 'CHANGE_ALL',
      value: {
        orderInfo: {
          prod_uuid: data?.prod_uuid,
          prod_no: data?.prod_no,
          prod_nm: data?.prod_nm,
          item_type_uuid: data?.item_type_uuid,
          item_type_nm: data?.item_type_nm,
          prod_type_uuid: data?.prod_type_uuid,
          prod_type_nm: data?.prod_type_nm,
          model_uuid: data?.model_uuid,
          model_nm: data?.model_nm,
          rev: data?.rev,
          prod_std: data?.prod_std,
          unit_uuid: data?.unit_uuid,
          unit_nm: data?.unit_nm,
          equip_uuid: data?.equip_uuid,
          equip_nm: data?.equip_nm,
          proc_uuid: data?.proc_uuid,
          proc_nm: data?.proc_nm,
          shift_uuid: data?.shift_uuid,
          shift_nm: data?.shift_nm,
          workings_uuid: data?.working_uuid,
          workings_nm: data?.working_nm,
          order_remark: data?.order_remark,
        },

        workInfo: {
          work_uuid: data?.work_uuid,
          complete_fg: data?.complete_fg,
          start_date: [null, undefined, ''].includes(data?.start_date)
            ? null
            : dayjs(data?.start_date)
                .locale('ko')
                .format('YYYY-MM-DD HH:mm:ss'),
          end_date: [null, undefined, ''].includes(data?.end_date)
            ? null
            : dayjs(data?.end_date).locale('ko').format('YYYY-MM-DD HH:mm:ss'),
          _start_date: [null, undefined, ''].includes(data?.start_date)
            ? null
            : dayjs(data?.start_date).locale('ko'),
          _end_date: [null, undefined, ''].includes(data?.end_date)
            ? null
            : dayjs(data?.end_date).locale('ko'),
          _start_time: [null, undefined, ''].includes(data?.start_date)
            ? null
            : dayjs(data?.start_date).locale('ko'),
          _end_time: [null, undefined, ''].includes(data?.end_date)
            ? null
            : dayjs(data?.end_date).locale('ko'),
          to_store_uuid: data?.to_store_uuid,
          to_store_nm: data?.to_store_nm,
          to_location_uuid: data?.to_location_uuid,
          to_location_nm: data?.to_location_nm,
          order_qty: data?.order_qty, //지시수량
          total_qty: data?.total_qty, //생산수량
          qty: data?.qty, //양품수량
          reject_qty: data?.reject_qty, //부적합수량
          lot_no: data?.lot_no,
          remark: data?.remark,
          mold_uuid: data?.mold_uuid, // 금형UUID
          mold_nm: data?.mold_nm, // 금형명
          mold_cavity: data?.mold_cavity, // 금형Cavity
        },
      },
    });
  };

  const onHeaderClick = async (ev, _work_uuid?) => {
    const { rowKey, targetType } = ev;

    if (targetType === 'cell') {
      try {
        const searchParams = searchInfo.values;
        let row: any = {};
        if (_work_uuid) {
          await getData(
            null,
            URL_PATH_PRD.WORK.GET.WORK.replace('{uuid}', _work_uuid),
          ).then(res => {
            row = res[0];
          });
        } else {
          row = ev?.instance?.store?.data?.rawData?.find(
            el => el?.rowKey === rowKey,
          );
        }

        setInfoData(row);
        infoDispatch({ type: 'CHANGE_ALL_WORK', value: row }); //실적 디스플레이

        const work_uuid = row?.work_uuid;
        const prod_uuid = row?.prod_uuid;
        const lot_no = row?.lot_no;
        const order_qty = row?.order_qty;
        const complete_fg = searchParams?.complete_fg;

        //#region 하위 데이터들 조회
        // 공정검사 데이터 조회
        workInsp.onSearch({
          work_uuid,
          prod_uuid,
          lot_no,
        });

        // 투입품목관리 데이터 조회
        if (searchParams?.complete_fg === 'true') {
          getData(
            {
              work_uuid: String(work_uuid),
            },
            workInput.SEARCH_URI_PATH,
            undefined,
            undefined,
            undefined,
            undefined,
            { disabledZeroMessage: true },
          ).then(res => {
            workInput.setData(res);
            workInput.setSearchParams({ work_uuid, complete_fg, order_qty });
            workInput.setSaveOptionParams({ work_uuid });
            workInput.setParentParams(searchParams);
            workInput.setGridMode('view');
          });
        } else if (work_uuid != null) {
          getData(
            {
              work_uuid: String(work_uuid),
            },
            workInput.GOING_SEARCH_URI_PATH,
            undefined,
            undefined,
            undefined,
            undefined,
            { disabledZeroMessage: true },
          ).then(res => {
            workInput.setData(res);
            workInput.setSearchParams({ work_uuid, complete_fg, order_qty });
            workInput.setSaveOptionParams({ work_uuid });
            workInput.setParentParams(searchParams);
            workInput.setGridMode('view');
          });
        }

        // 공정순서 데이터 조회
        getData(
          {
            work_uuid: String(work_uuid),
          },
          workRouting.uriPath,
        ).then(res => {
          workRouting.setData(res);

          let selectedRow = {};

          if (res?.length > 0) {
            selectedRow = res[0];
          }

          onSearchAfterRouting(row, selectedRow);
        });
        //#endregion
      } catch (e) {
        console.log(e);
      } finally {
        // 헤더 클릭 시 처리할 코드 작성할 것
      }
    }
  };

  const onSearchAfterRouting = (workRow, routingRow) => {
    const startDatetime = dayjs(routingRow?.['start_date']);
    const endDatetime = dayjs(routingRow?.['end_date']);
    infoDispatch({
      type: 'CHANGE_ALL_ROUTING',
      value: {
        ...routingRow,
        _start_date: startDatetime.isValid()
          ? startDatetime?.format('YYYY-MM-DD')
          : null,
        _start_time: startDatetime.isValid()
          ? startDatetime?.format('HH:mm:ss')
          : null,
        _end_date: endDatetime.isValid()
          ? endDatetime?.format('YYYY-MM-DD')
          : null,
        _end_time: endDatetime.isValid()
          ? endDatetime?.format('HH:mm:ss')
          : null,
      },
    }); //실적 디스플레이

    const work_uuid = workRow?.['work_uuid'];
    const complete_fg = workRow?.['complete_fg'];
    const work_routing_uuid = routingRow?.['work_routing_uuid'];
    const equip_uuid = routingRow?.['equip_uuid'];

    // 투입인원관리 데이터 조회
    getData(
      {
        work_uuid: String(work_uuid),
        work_routing_uuid: work_routing_uuid,
      },
      workWorker.SEARCH_URI_PATH,
      undefined,
      undefined,
      undefined,
      undefined,
      { disabledZeroMessage: true },
    ).then(res => {
      workWorker.setData(res);
      workWorker.setSearchParams({ work_uuid, work_routing_uuid, complete_fg });
      workWorker.setSaveOptionParams({ work_uuid, work_routing_uuid });
    });

    // 부적합관리 데이터 조회
    getData(
      {
        work_uuid: String(work_uuid),
        work_routing_uuid: work_routing_uuid,
      },
      workReject.SEARCH_URI_PATH,
      undefined,
      undefined,
      undefined,
      undefined,
      { disabledZeroMessage: true },
    ).then(res => {
      const { proc_uuid } = routingRow;
      workReject.setData(res);
      workReject.setSearchParams({ work_uuid, work_routing_uuid, complete_fg });
      workReject.setRowAddedParams({ proc_uuid });
      workReject.setSaveOptionParams({ work_uuid, work_routing_uuid });
    });

    // 비가동관리 데이터 조회
    getData(
      {
        work_uuid: String(work_uuid),
        work_routing_uuid: work_routing_uuid,
      },
      workDowntime.SEARCH_URI_PATH,
      undefined,
      undefined,
      undefined,
      undefined,
      { disabledZeroMessage: true },
    ).then(res => {
      workDowntime.setData(res);
      workDowntime.setSearchParams({
        work_uuid,
        work_routing_uuid,
        complete_fg,
      });
      workDowntime.setSaveOptionParams({
        work_uuid,
        work_routing_uuid,
        equip_uuid,
      });
    });
  };

  useLayoutEffect(() => {
    const routingInfo = workRouting?.selectedRow;
    if (isEmpty(routingInfo)) return;

    onSearchAfterRouting(workInfo, routingInfo);
  }, [workRouting?.selectedRow]);

  const HeaderGridElement = useMemo(() => {
    return (
      <Datagrid
        gridId={'WORK_GRID'}
        ref={gridRef}
        gridMode={gridMode}
        columns={WORK_COLUMNS}
        height={300}
        data={workDatas}
        onAfterClick={onHeaderClick}
      />
    );
  }, [workDatas, gridRef, gridMode]);

  function changeTab(key) {
    setTabKey(key);
  }

  useLayoutEffect(() => {
    if (tabKey) {
      switch (tabKey) {
        case 'INSP':
          workInsp?.gridRef?.current?.getInstance()?.refreshLayout();
          workInsp?.detailGrid?.gridRef?.current
            ?.getInstance()
            ?.refreshLayout();
          break;
        case 'INPUT':
          workInput?.gridRef?.current?.getInstance()?.refreshLayout();
          break;
        case 'WORKER':
          workWorker?.gridRef?.current?.getInstance()?.refreshLayout();
          break;
        case 'REJECT':
          workReject?.gridRef?.current?.getInstance()?.refreshLayout();
          break;
        case 'DOWNTIME':
          workDowntime?.gridRef?.current?.getInstance()?.refreshLayout();
          break;
        case 'ROUTING':
          workRouting?.gridRef?.current?.getInstance()?.refreshLayout();
          break;

        default:
          break;
      }
    }
  }, [tabKey, workReject?.gridRef]);

  //#region 🚫렌더부
  return (
    <>
      <Typography.Title level={5} style={{ marginBottom: -16, fontSize: 14 }}>
        <CaretRightOutlined />
        생산이력
      </Typography.Title>
      <Divider style={{ marginBottom: 10 }} />
      <Container>
        <div style={{ width: '100%', display: 'inline-block' }}>
          <Space size={[6, 0]} align="start">
            {/* <Input.Search
              placeholder='전체 검색어를 입력하세요.'
              enterButton
              onSearch={onAllFiltered}/> */}
            {/* <Button btnType='buttonFill' widthSize='small' ImageType='search' colorType='blue' onClick={onSearch}>조회</Button> */}
          </Space>
          <Space size={[6, 0]} style={{ float: 'right' }}>
            <Button
              btnType="buttonFill"
              widthSize="large"
              heightSize="small"
              fontSize="small"
              ImageType="add"
              colorType="blue"
              onClick={onProdOrder}
              disabled={!permissions?.update_fg}
            >
              작업지시 관리
            </Button>
            {/* <Button btnType='buttonFill' widthSize='medium' ImageType='add' colorType='blue' onClick={onAppend}>신규 추가</Button> */}
          </Space>
        </div>
        <div style={{ maxWidth: 700, marginTop: -33, marginLeft: 0 }}>
          <Searchbox
            {...searchInfo.props}
            onSearch={permissions?.read_fg ? onSearch : null}
            boxShadow={false}
          />
        </div>
        <p />
        {HeaderGridElement}
      </Container>

      <Row gutter={[16, 0]}>
        {/* 작업 정보 */}
        <Col span={24} style={{ paddingLeft: 0, paddingRight: 0 }}>
          <Typography.Title
            level={5}
            style={{ marginTop: 30, marginBottom: -16, fontSize: 14 }}
          >
            <CaretRightOutlined />
            작업 정보
          </Typography.Title>
          <div
            style={{ width: '100%', display: 'inline-block', marginTop: -26 }}
          >
            <div style={{ float: 'right', paddingRight: 4 }}>
              <Space>
                <Button
                  btnType="buttonFill"
                  colorType="blue"
                  widthSize="large"
                  heightSize="small"
                  fontSize="small"
                  ImageType="cancel"
                  onClick={onCancelWork}
                  disabled={!permissions?.update_fg}
                >
                  실행 취소
                </Button>
                <Button
                  btnType="buttonFill"
                  colorType="red"
                  widthSize="large"
                  heightSize="small"
                  fontSize="small"
                  ImageType="delete"
                  onClick={onDeleteWork}
                  disabled={!permissions?.delete_fg}
                >
                  실적 삭제
                </Button>
              </Space>
            </div>
          </div>
          <Divider style={{ marginTop: 2, marginBottom: 10 }} />
          <Row gutter={[16, 16]}>
            <Col span={12} style={{ paddingLeft: 0 }}>
              <Container>
                <Row gutter={[16, 16]}>
                  <Col span={6} style={{ marginBottom: 8 }}>
                    <Label text="품번" />
                    <Input
                      disabled={true}
                      value={orderInfo.prod_no}
                      style={{ fontSize: Fonts.fontSize_default }}
                    />
                  </Col>
                  <Col span={6} style={{ marginBottom: 8 }}>
                    <Label text="품명" />
                    <Input
                      disabled={true}
                      value={orderInfo.prod_nm}
                      style={{ fontSize: Fonts.fontSize_default }}
                    />
                  </Col>
                  <Col span={6} style={{ marginBottom: 8 }}>
                    <Label text="품목유형" />
                    <Input
                      disabled={true}
                      value={orderInfo.item_type_nm}
                      style={{ fontSize: Fonts.fontSize_default }}
                    />
                  </Col>
                  <Col span={6} style={{ marginBottom: 8 }}>
                    <Label text="제품유형" />
                    <Input
                      disabled={true}
                      value={orderInfo.prod_type_nm}
                      style={{ fontSize: Fonts.fontSize_default }}
                    />
                  </Col>
                  <Col span={6} style={{ marginBottom: 4 }}>
                    <Label text="모델" />
                    <Input
                      disabled={true}
                      value={orderInfo.model_nm}
                      style={{ fontSize: Fonts.fontSize_default }}
                    />
                  </Col>
                  <Col span={6} style={{ marginBottom: 4 }}>
                    <Label text="REV" />
                    <Input
                      disabled={true}
                      value={orderInfo.rev}
                      style={{ fontSize: Fonts.fontSize_default }}
                    />
                  </Col>
                  <Col span={6} style={{ marginBottom: 4 }}>
                    <Label text="규격" />
                    <Input
                      disabled={true}
                      value={orderInfo.prod_std}
                      style={{ fontSize: Fonts.fontSize_default }}
                    />
                  </Col>
                  <Col span={6} style={{ marginBottom: 4 }}>
                    <Label text="단위" />
                    <Input
                      disabled={true}
                      value={orderInfo.unit_nm}
                      style={{ fontSize: Fonts.fontSize_default }}
                    />
                  </Col>
                </Row>
              </Container>
            </Col>
            <Col span={12} style={{ paddingRight: 0 }}>
              <Container>
                <Row gutter={[16, 16]}>
                  <Col span={6} style={{ marginBottom: 8 }}>
                    <Label text="설비" />
                    <Input
                      disabled={true}
                      value={orderInfo.equip_nm}
                      style={{ fontSize: Fonts.fontSize_default }}
                    />
                  </Col>
                  <Col span={6} style={{ marginBottom: 8 }}>
                    <Label text="공정" />
                    <Input
                      disabled={true}
                      value={orderInfo.proc_nm}
                      style={{ fontSize: Fonts.fontSize_default }}
                    />
                  </Col>
                  <Col span={6} style={{ marginBottom: 8 }}>
                    <Label text="작업교대" />
                    <Input
                      disabled={true}
                      value={orderInfo.shift_nm}
                      style={{ fontSize: Fonts.fontSize_default }}
                    />
                  </Col>
                  <Col span={6} style={{ marginBottom: 8 }}>
                    <Label text="작업장" />
                    <Input
                      disabled={true}
                      value={orderInfo.workings_nm}
                      style={{ fontSize: Fonts.fontSize_default }}
                    />
                  </Col>
                  <Col span={24} style={{ marginBottom: 4 }}>
                    <Label text="지시 비고" />
                    <Input
                      disabled={true}
                      value={orderInfo.remark}
                      style={{ fontSize: Fonts.fontSize_default }}
                    />
                  </Col>
                </Row>
              </Container>
            </Col>
          </Row>
        </Col>

        {/* 실적 정보 */}
        <Col
          span={24}
          style={{ paddingLeft: 0, paddingRight: 0, marginTop: 12 }}
        >
          <Typography.Title
            level={5}
            style={{ marginTop: 30, marginBottom: -16, fontSize: 14 }}
          >
            <CaretRightOutlined />
            실적 정보
          </Typography.Title>
          <div
            style={{ width: '100%', display: 'inline-block', marginTop: -26 }}
          >
            <div style={{ float: 'right', paddingRight: 4 }}>
              <Space>
                <Button
                  btnType="buttonFill"
                  colorType="blue"
                  widthSize="large"
                  heightSize="small"
                  fontSize="small"
                  ImageType="add"
                  onClick={onSaveWork}
                  disabled={!permissions?.update_fg}
                >
                  실행 저장
                </Button>
                <Button
                  btnType="buttonFill"
                  colorType="delete"
                  widthSize="large"
                  heightSize="small"
                  fontSize="small"
                  ImageType="check"
                  onClick={onCompleteWork}
                  disabled={!permissions?.update_fg}
                >
                  작업 종료
                </Button>
              </Space>
            </div>
          </div>
          <Divider style={{ marginTop: 2, marginBottom: 10 }} />
          <Row gutter={[16, 16]}>
            <Col span={6} style={{ paddingLeft: 0 }}>
              {/* 공정순서 */}
              <RoutingInfo
                permissions={permissions}
                height={709}
                {...workRouting}
              />
            </Col>
            <Col span={18} style={{ paddingRight: 0 }}>
              <Container>
                <Row>
                  <WorkInfo
                    permissions={permissions}
                    values={routingInfo}
                    infoState={infoState}
                    infoDispatch={infoDispatch}
                  />
                </Row>
                <Divider style={{ marginTop: 2 }} />
                <Row>
                  <Col span={24}>
                    <Tabs
                      type="card"
                      onChange={changeTab}
                      panels={[
                        {
                          tab: '공정검사',
                          tabKey: TAB_CODE.WORK_INSP,
                          content: workInsp.component,
                        },
                        {
                          tab: '투입품목 관리',
                          tabKey: TAB_CODE.WORK_INPUT,
                          content: workInput.component,
                        },
                        {
                          tab: '투입인원 관리',
                          tabKey: TAB_CODE.WORK_WORKER,
                          content: workWorker.component,
                        },
                        {
                          tab: '부적합 관리',
                          tabKey: TAB_CODE.WORK_REJECT,
                          content: workReject.component,
                        },
                        {
                          tab: '비가동 관리',
                          tabKey: TAB_CODE.WORK_DOWNTIME,
                          content: workDowntime.component,
                        },
                        // {
                        //   tab: '공정순서',
                        //   tabKey: TAB_CODE.공정순서,
                        //   content: 공정순서.component,
                        // },
                      ]}
                    />
                  </Col>
                </Row>
              </Container>
            </Col>
          </Row>
        </Col>
      </Row>

      {prodOrderPopupVisible ? (
        <ProdOrderModal
          visible={prodOrderPopupVisible}
          onClose={onProdOrderClose}
        />
      ) : null}

      {contextHolder}
    </>
  );
  //#endregion
};
//#endregion

//#region 🔶✅작업지시관리 팝업 (지시/마감 처리)
/** 작업지시관리 팝업 (지시/마감 처리) */
const ProdOrderModal = ({ visible, onClose }) => {
  //#region ✅설정값
  const gridRef = useRef<Grid>();

  const [data, setData] = useState([]);

  // 마감작업 체크용
  const [completeChk, setCompleteChk] = useState<boolean>(false);
  const searchItems = useMemo(() => {
    return [
      {
        type: 'radio',
        id: 'complete_fg',
        default: 'wait',
        options: [
          { code: 'wait', text: '작업대기' },
          { code: 'complete', text: '마감작업' },
        ],
      },
      {
        type: 'date',
        id: 'start_date',
        default: getToday(-7),
        label: '마감일',
        disabled: !completeChk,
      },
      {
        type: 'date',
        id: 'end_date',
        default: getToday(),
        disabled: !completeChk,
      },
    ];
  }, [completeChk]);

  //#region ✅함수
  const onSearch = values => {
    const dateParams =
      values?.complete_fg === 'complete'
        ? {
            start_date: values?.start_date,
            end_date: values?.end_date,
          }
        : {};
    const searchParams = {
      order_state: values?.complete_fg,
      ...dateParams,
    };

    getData(searchParams, '/prd/orders').then(res => {
      const datas = res.map(data => ({
        ...data,
        reg_date: data.reg_date.substr(0, 10),
      }));

      setData(datas);
    });
  };

  const searchInfo = useSearchbox(
    'PRD_ORDER_CREATE_SEARCHBOX',
    searchItems,
    onSearch,
    {
      validate: values => {
        const completeFg = values?.complete_fg;
        if (completeFg === 'complete') {
          setCompleteChk(true);
        } else {
          setCompleteChk(false);
        }

        return values;
      },
    },
  );

  useLayoutEffect(() => {
    if (searchInfo && searchItems) {
      searchInfo.setSearchItems(searchItems);
    }
  }, [searchInfo, searchItems]);

  const searchParams = searchInfo.values;

  const WORK_START_SAVE_URI_PATH = '/prd/works';
  const COMPLETE_SAVE_URI_PATH = '/prd/orders/complete';
  //#endregion

  useLayoutEffect(() => {
    if (!visible) {
      setData([]);
    }
  }, [visible]);

  //#region ✅컬럼
  const PROD_ORDER_COLUMNS: IGridColumn[] = [
    {
      header: '작업지시UUID',
      name: 'order_uuid',
      width: 200,
      hidden: true,
      format: 'text',
    },
    {
      header: '구분',
      name: 'order_state',
      width: 80,
      hidden: false,
      format: 'text',
      align: 'center',
    },
    {
      header: '작업일자',
      name: 'reg_date',
      width: 150,
      hidden: false,
      format: 'date',
      editable: true,
      disabled: true,
    },
    {
      header: '작업시작',
      name: '_work_start',
      width: 80,
      hidden: false,
      format: 'check',
      editable: true,
      onAfterChange: ({ value, rowKey }) => {
        const rowData = gridRef.current.getInstance().getData()[rowKey];

        value
          ? (() => {
              gridRef.current.getInstance().setRow(rowKey, {
                ...rowData,
                complete_fg: false,
              });
              gridRef.current.getInstance().enableCell(rowKey, 'reg_date');
            })()
          : (() => {
              gridRef.current.getInstance().disableCell(rowKey, 'reg_date');
            })();
      },
    },
    {
      header: '마감',
      name: 'complete_fg',
      width: 80,
      hidden: false,
      format: 'check',
      editable: true,
      onAfterChange: ({ value, rowKey }) => {
        const { getData, setRow } = gridRef.current.getInstance();

        if (value === true)
          setRow(rowKey, { ...getData[rowKey], _work_start: false });
      },
    },
    {
      header: '공정UUID',
      name: 'proc_uuid',
      width: 200,
      hidden: true,
      format: 'text',
    },
    {
      header: '공정',
      name: 'proc_nm',
      width: 120,
      hidden: false,
      format: 'text',
    },
    {
      header: '작업장UUID',
      name: 'workings_uuid',
      width: 200,
      hidden: true,
      format: 'text',
    },
    {
      header: '작업장',
      name: 'workings_nm',
      width: 120,
      hidden: false,
      format: 'text',
    },
    {
      header: '설비UUID',
      name: 'equip_uuid',
      width: 200,
      hidden: true,
      format: 'text',
    },
    {
      header: '설비',
      name: 'equip_nm',
      width: 120,
      hidden: false,
      format: 'text',
    },
    {
      header: '품목 유형UUID',
      name: 'item_type_uuid',
      width: 200,
      hidden: true,
      format: 'text',
    },
    {
      header: '품목 유형',
      name: 'item_type_nm',
      width: 120,
      hidden: false,
      format: 'text',
    },
    {
      header: '제품 유형UUID',
      name: 'prod_type_uuid',
      width: 200,
      hidden: true,
      format: 'text',
    },
    {
      header: '제품 유형',
      name: 'prod_type_nm',
      width: 120,
      hidden: false,
      format: 'text',
    },
    {
      header: '품목UUID',
      name: 'prod_uuid',
      width: 200,
      hidden: true,
      format: 'text',
    },
    {
      header: '품번',
      name: 'prod_no',
      width: 120,
      hidden: false,
      format: 'text',
    },
    {
      header: '품목',
      name: 'prod_nm',
      width: 120,
      hidden: false,
      format: 'text',
    },
    {
      header: '모델UUID',
      name: 'model_uuid',
      width: 200,
      hidden: true,
      format: 'text',
    },
    {
      header: '모델',
      name: 'model_nm',
      width: 120,
      hidden: false,
      format: 'text',
    },
    { header: 'Rev', name: 'rev', width: 100, hidden: false, format: 'text' },
    {
      header: '규격',
      name: 'prod_std',
      width: 120,
      hidden: false,
      format: 'text',
    },
    {
      header: '단위UUID',
      name: 'unit_uuid',
      width: 200,
      hidden: true,
      format: 'text',
    },
    {
      header: '단위',
      name: 'unit_nm',
      width: 80,
      hidden: false,
      format: 'text',
    },
    {
      header: '입고 창고UUID',
      name: 'to_store_uuid',
      width: 200,
      hidden: true,
      format: 'text',
    },
    {
      header: '입고 창고',
      name: 'to_store_nm',
      width: 120,
      hidden: false,
      format: 'text',
    },
    {
      header: '입고 위치UUID',
      name: 'to_location_uuid',
      width: 200,
      hidden: true,
      format: 'text',
    },
    {
      header: '입고 위치',
      name: 'to_location_nm',
      width: 120,
      hidden: false,
      format: 'text',
    },
    {
      header: '계획 수량',
      name: 'plan_qty',
      width: 200,
      hidden: true,
      format: 'text',
    },
    {
      header: '지시 수량',
      name: 'qty',
      width: 100,
      hidden: false,
      format: 'text',
    },
    {
      header: '지시 순번',
      name: 'seq',
      width: 200,
      hidden: true,
      format: 'text',
    },
    {
      header: '작업교대UUID',
      name: 'shift_uuid',
      width: 200,
      hidden: true,
      format: 'text',
    },
    {
      header: '작업교대명',
      name: 'shift_nm',
      width: 120,
      hidden: false,
      format: 'text',
    },
    {
      header: '시작예정',
      name: 'start_date',
      width: 120,
      hidden: false,
      format: 'date',
    },
    {
      header: '종료예정',
      name: 'end_date',
      width: 120,
      hidden: false,
      format: 'date',
    },
    {
      header: '작업조UUID',
      name: 'worker_group_uuid',
      width: 200,
      hidden: true,
      format: 'text',
    },
    {
      header: '작업조',
      name: 'worker_group_nm',
      width: 120,
      hidden: false,
      format: 'text',
    },
    {
      header: '작업인원',
      name: 'worker_cnt',
      width: 100,
      hidden: false,
      format: 'number',
    },
    {
      header: '수주UUID',
      name: 'sal_order_uuid',
      width: 200,
      hidden: true,
      format: 'text',
    },
    {
      header: '수주상세UUID',
      name: 'sal_order_detail_uuid',
      width: 200,
      hidden: true,
      format: 'text',
    },
    {
      header: '생산 진행여부',
      name: 'work_fg',
      width: 200,
      hidden: true,
      format: 'text',
    },
    // {header:'마감 여부', name:'complete_fg', width:200, hidden:true, format:'text'},
    {
      header: '마감 일시',
      name: 'complete_date',
      width: 120,
      hidden: false,
      format: 'datetime',
    },
    {
      header: '비고',
      name: 'remark',
      width: 150,
      hidden: false,
      format: 'text',
    },
  ];
  //#endregion

  const handleSaveWorkDatas = workStartDatas => {
    try {
      if (workStartDatas.length > 0) {
        let errMessage: string = '';
        workStartDatas.map(workSaveData => {
          const reg_date = workSaveData.reg_date;
          const workings_uuid = workSaveData.workings_uuid;
          const lot_no = workSaveData.lot_no;
          const shift_uuid = workSaveData.shift_uuid;
          const to_store_uuid = workSaveData.to_store_uuid;

          if (!reg_date) {
            errMessage = '실적 일시를 확인해주세요.';
          } else if (!workings_uuid) {
            errMessage = '작업장 정보를 확인해주세요.';
          } else if (!lot_no) {
            errMessage = 'LOT NO를 확인해주세요.';
          } else if (!shift_uuid) {
            errMessage = '작업교대 정보를 확인해주세요';
          } else if (!to_store_uuid) {
            errMessage = '입고창고 정보를 확인해주세요';
          }

          if (errMessage !== '') throw errMessage;
        });

        const workSaveData = {
          createdRows: workStartDatas,
          updatedRows: undefined,
          deletedRows: undefined,
        };

        saveGridData(
          workSaveData as any,
          PROD_ORDER_COLUMNS,
          WORK_START_SAVE_URI_PATH,
        )
          .then(() => {
            gridRef?.current?.getInstance()?.clearModifiedData();
          })
          .catch(e => {
            throw new Error('myException');
          });
      }
      return true;
    } catch (e) {
      message.warn(e);
      return false;
    }
  };

  class LotNumberGenerator {
    private day: string;

    constructor(day) {
      this.day = day;
    }

    static today() {
      return new LotNumberGenerator(getToday());
    }

    static workday(workday: string) {
      return new LotNumberGenerator(workday);
    }

    generate() {
      return this.day.replace(/[^0-9]/g, '');
    }
  }

  const onSave = () => {
    let updatedRows = gridRef?.current?.getInstance().getModifiedRows()
      ?.updatedRows as any[];
    const start_date = getToday();

    // 작업시작 처리
    const workStartList = updatedRows
      ?.filter(el => el?._work_start === true)
      ?.map(row => {
        let newRow = {
          ...row,
          lot_no: LotNumberGenerator.workday(row.reg_date).generate(),
        };
        newRow = pick(newRow, [
          'factory_uuid',
          'reg_date',
          'order_uuid',
          'workings_uuid',
          'prod_uuid',
          'lot_no',
          'shift_uuid',
          'to_store_uuid',
          'to_location_uuid',
          'remark',
        ]);
        return newRow;
      });
    if (!handleSaveWorkDatas(workStartList)) return;

    // 마감 처리
    let completeChkList = [];
    if (searchParams?.complete_fg === 'complete') {
      completeChkList = updatedRows?.map(el => ({
        ...el,
        uuid: el?.order_uuid,
        complete_date: start_date,
      }));
    } else {
      completeChkList = updatedRows
        ?.filter(el => el?.complete_fg === true)
        ?.map(el => ({
          ...el,
          uuid: el?.order_uuid,
          complete_date: start_date,
        }));
    }

    const completeSaveData = {
      createdRows: undefined,
      updatedRows: completeChkList,
      deletedRows: undefined,
    };

    if (completeChkList?.length > 0) {
      saveGridData(
        completeSaveData as any,
        PROD_ORDER_COLUMNS,
        COMPLETE_SAVE_URI_PATH,
      )
        .then(() => {
          gridRef?.current?.getInstance()?.clearModifiedData();
        })
        .catch(e => console.log(e));
    }
    onClose();
  };
  //#endregion

  //#region ✅렌더부
  return (
    <Modal
      title="작업지시 관리"
      okText={null}
      cancelText={null}
      maskClosable={false}
      visible={visible}
      onCancel={onClose}
      onOk={onSave}
      width="80%"
    >
      <>
        <Searchbox
          {...searchInfo.props}
          onSearch={searchInfo.onSearch}
          boxShadow={false}
        />
        <Datagrid
          gridId="PROD_ORDER_GRID"
          ref={gridRef}
          gridMode="update"
          columns={PROD_ORDER_COLUMNS}
          columnOptions={{
            frozenCount: 3,
            frozenBorderWidth: 2,
          }}
          data={data}
        />
      </>
    </Modal>
  );
  //#endregion
};
//#endregion
