import Grid from '@toast-ui/react-grid';
import { message, Modal } from 'antd';
import dayjs from 'dayjs';
import React, {
  useLayoutEffect,
  useReducer,
  useRef,
  useState,
  useMemo,
} from 'react';
import { TGridMode, useSearchbox } from '~/components/UI';
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
import { URL_PATH_PRD } from '~/enums';
import { cloneDeep, isEmpty, pick } from 'lodash';
import { workRoutingStore } from './work-components';
import EXPRESSSIONS from '~/constants/expressions';
import { WORKERREADONLY } from './work.page.worker.readonly';
import { REJECTREADONLY } from './work.page.reject.readonly';
import { DOWNTIMEREADONLY } from './work.page.downtime.readonly';
import {
  WORK_PERFORMANCE_FIXTURE,
  WORK_PERFORMANCE_TABS,
} from './work-performance/fixture';
import {
  showWorkPerformanceErrorMessage,
  toggleWorkCompleteButton,
  toggleWorkStartButton,
} from './work-performance/view-controller';
import { setWorkPerformanceState } from './work-performance/model-controller';
import { WorkPerformanceSelectableHeader } from './work-performance/components/Header';
import { WorkPerformanceHeaderGrid } from './work-performance/components/HeaderGrid';
import { ColumnStore } from '~/constants/columns';
import { CascadingSelectHeaderMessageBox } from './work-performance/components/MessageBox';
import { WorkPerformanceContent } from './work-performance/components/Content';
import {
  ProdOrderModalInWorkPerformancePage,
  WorkRoutingHistoryModalInWorkPerformancePage,
} from './work-performance/components/Modal';
import { TuiGridEvent } from 'tui-grid/types/event';

// 날짜 로케일 설정
dayjs.locale('ko-kr');

// moment 타입과 호환시키기 위한 행위
dayjs.extend(customParseFormat);
dayjs.extend(advancedFormat);
dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.extend(weekOfYear);
dayjs.extend(weekYear);

const TAB_CODE = WORK_PERFORMANCE_TABS;
const infoInit = WORK_PERFORMANCE_FIXTURE.EMPTY;
const onErrorMessage = showWorkPerformanceErrorMessage;
const infoReducer = setWorkPerformanceState;

interface ToggleButtonColumnEvent extends TuiGridEvent {
  rowKey: number;
  value: boolean;
}

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
  const [workRoutingHistoryPopupVisible, setWorkRoutingHistoryPopupVisible] =
    useState(false);

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

  const showWorkRoutingHistory = () => {
    setWorkRoutingHistoryPopupVisible(true);
  };
  const hideWorkRoutingHistory = () => {
    setWorkRoutingHistoryPopupVisible(false);
  };

  const onStartWork = () => {
    const SAVE_URI_PATH = '/prd/work-routings';
    const {
      work_routing_origin_uuid,
      proc_uuid,
      proc_no,
      workings_uuid,
      equip_uuid,
      mold_uuid,
      mold_cavity,
      qty,
      start_date,
      end_date,
      ongoing_fg,
      prd_signal_cnt,
      start_signal_val,
      remark,
      factory_uuid,
    } = routingInfo;
    const { work_uuid } = workInfo;
    modal.confirm({
      title: '작업 시작',
      content: '작업을 시작하시겠습니까?',
      okText: '예',
      cancelText: '아니오',
      onOk: () => {
        executeData(
          [
            {
              work_routing_origin_uuid,
              work_uuid,
              proc_uuid,
              proc_no,
              workings_uuid,
              equip_uuid,
              mold_uuid,
              mold_cavity,
              qty,
              start_date,
              end_date,
              ongoing_fg,
              prd_signal_cnt,
              start_signal_val,
              remark,
              factory_uuid,
            },
          ],
          SAVE_URI_PATH,
          'post',
        ).then(async res => {
          if (res.success === true) {
            message.info('작업이 시작되었습니다.');
            const selectedRow = { ...workRouting?.selectedRow };
            await onHeaderClick({ targetType: 'cell' }, workInfo?.work_uuid);

            onSearchAfterRouting(workInfo, selectedRow);
          } else {
            message.error('오류가 발생했습니다. 관리자에게 문의하세요.');
          }
        });
      },
    });
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

  const saveWorkRouting = async (_workData, routingData) => {
    const SAVE_URI_PATH = '/prd/work-routings';

    const isSavedWorkRouting = await executeData(
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
          work_routing_origin_uuid: routingData?.['work_routing_origin_uuid'],
        },
      ],
      SAVE_URI_PATH,
      'put',
      'success',
    );

    if (isSavedWorkRouting !== true)
      console.error(`공정별 분할 실적 중간 저장 API 요청 중 문제 발생했습니다.
     자세한 내용은 브라우저 개발자 도구의 네트워크 탭을 확인해주세요.`);

    return isSavedWorkRouting === true;
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

    const SAVE_URI_PATH = '/prd/work-routings/complete';
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
        //실적완료처리
        const {
          uuid,
          workings_uuid,
          equip_uuid,
          mold_uuid,
          mold_cavity,
          qty,
          start_date,
          end_date,
          ongoing_fg,
          prd_signal_cnt,
          start_signal_val,
          remark,
        } = routingInfo;
        const { work_uuid } = workInfo;
        executeData(
          [
            {
              uuid,
              work_uuid,
              workings_uuid,
              equip_uuid,
              mold_uuid,
              mold_cavity,
              qty,
              start_date,
              end_date,
              ongoing_fg,
              prd_signal_cnt,
              start_signal_val,
              remark,
            },
          ],
          SAVE_URI_PATH,
          'patch',
          'success',
        )
          .then(async success => {
            if (success === true) {
              message.info('정상적으로 종료되었습니다.');

              const selectedRow = { ...workRouting?.selectedRow };
              await onHeaderClick({ targetType: 'cell' }, workInfo?.work_uuid);

              onSearchAfterRouting(workInfo, selectedRow);
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
  //#endregion

  const onCompleteWorkPerformance = () => {
    executeData(
      [{ uuid: workInfo.work_uuid }],
      'prd/works/complete',
      'put',
    ).then(res => {
      if (res) {
        message.info('정상적으로 종료되었습니다.');
        onSearch(searchInfo.values);
      }
    });
  };

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
    const work_routing_origin_uuid = routingRow?.['work_routing_origin_uuid'];
    const work_uuid = workRow?.['work_uuid'];

    getData(
      {
        work_uuid,
        work_routing_origin_uuid,
        complete_fg: false,
      },
      '/prd/work-routings',
      undefined,
      undefined,
      undefined,
      undefined,
      { disabledZeroMessage: true },
    ).then(res => {
      if (res.length > 0) {
        const complete_fg = workRow?.['complete_fg'];
        const equip_uuid = routingRow?.['equip_uuid'];
        const { work_routing_uuid, start_date, end_date } = res[0];
        const startDatetime = dayjs(start_date);
        const endDatetime = dayjs(end_date);

        infoDispatch({
          type: 'CHANGE_ALL_ROUTING',
          value: {
            ...res[0],
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
          workWorker.setSearchParams({
            work_uuid,
            work_routing_uuid,
            complete_fg,
          });
          workWorker.setSaveOptionParams({
            work_uuid,
            work_routing_uuid,
          });
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
          workReject.setSearchParams({
            work_uuid,
            work_routing_uuid,
            complete_fg,
          });
          workReject.setRowAddedParams({ proc_uuid });
          workReject.setSaveOptionParams({
            work_uuid,
            work_routing_uuid,
          });
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
      } else {
        infoDispatch({
          type: 'CHANGE_ALL_ROUTING',
          value: {
            ...routingRow,
            _start_date: null,
            _start_time: null,
            _end_date: null,
            _end_time: null,
          },
        }); //실적 디스플레이
      }
    });
  };

  useLayoutEffect(() => {
    const routingInfo = workRouting?.selectedRow;
    if (isEmpty(routingInfo)) return;

    onSearchAfterRouting(workInfo, routingInfo);
  }, [workRouting?.selectedRow]);

  const HeaderGridElement = useMemo(() => {
    return (
      <WorkPerformanceHeaderGrid
        gridRef={gridRef}
        gridMode={gridMode}
        columns={[...ColumnStore.WORK_PERFORMANCE]}
        datas={workDatas}
        onHeaderClick={onHeaderClick}
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

  return (
    <>
      <WorkPerformanceSelectableHeader
        permissions={permissions}
        onProdOrder={onProdOrder}
        searchInfo={searchInfo}
        onSearch={onSearch}
        HeaderGridElement={HeaderGridElement}
      />
      {workInfo.work_uuid ? (
        <WorkPerformanceContent
          permissions={permissions}
          onStartWork={onStartWork}
          onCancelWork={onCancelWork}
          onDeleteWork={onDeleteWork}
          onWorkHistory={showWorkRoutingHistory}
          onCompleteWorkPerformance={onCompleteWorkPerformance}
          orderInfo={orderInfo}
          onSaveWork={onSaveWork}
          onCompleteWork={onCompleteWork}
          workRouting={workRouting}
          routingInfo={routingInfo}
          infoState={infoState}
          infoDispatch={infoDispatch}
          changeTab={changeTab}
          workInsp={workInsp}
          workInput={workInput}
          workWorker={workWorker}
          workReject={workReject}
          workDowntime={workDowntime}
          TAB_CODE={TAB_CODE}
          isWorkRoutingStarted={
            infoState.routingInfo?.work_routing_uuid != null
          }
        />
      ) : (
        <CascadingSelectHeaderMessageBox />
      )}

      {prodOrderPopupVisible ? (
        <ProdOrderModal
          visible={prodOrderPopupVisible}
          onClose={onProdOrderClose}
        />
      ) : null}

      {contextHolder}
      <WorkRoutingHisotryModal
        visible={workRoutingHistoryPopupVisible}
        work_uuid={workInfo.work_uuid}
        onCancel={hideWorkRoutingHistory}
      />
    </>
  );
};
//#endregion

//#region 🔶✅작업지시관리 팝업 (지시/마감 처리)
/** 작업지시관리 팝업 (지시/마감 처리) */
const ProdOrderModal = ({ visible, onClose }) => {
  const gridRef = useRef<Grid>();

  const [data, setData] = useState([]);
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

  const PROD_ORDER_COLUMNS = ColumnStore.PROD_ORDER.map(column => {
    if (column.name === '_work_start')
      column.onAfterChange = ({ value, rowKey }: ToggleButtonColumnEvent) =>
        toggleWorkStartButton({ value, rowKey, gridRef });

    if (column.name === 'complete_fg')
      column.onAfterChange = ({ value, rowKey }: ToggleButtonColumnEvent) =>
        toggleWorkCompleteButton({ value, rowKey, gridRef });

    return column;
  });

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
      return this.day.replace(EXPRESSSIONS.NON_DIGIT_GLOBAL, '');
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
          'order_date',
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

  return (
    <ProdOrderModalInWorkPerformancePage
      visible={visible}
      onClose={onClose}
      onSave={onSave}
      searchInfo={searchInfo}
      gridRef={gridRef}
      PROD_ORDER_COLUMNS={PROD_ORDER_COLUMNS}
      data={data}
    />
  );
};
//#endregion

const WorkRoutingHisotryModal = ({
  visible,
  work_uuid,
  onCancel,
}: {
  visible: boolean;
  work_uuid: string;
  onCancel: () => void;
}) => {
  if (visible === false) return <></>;
  const [workRoutingHistory, setWorkRoutingHistory] = useState<unknown>([]);

  const workerReadOnly = WORKERREADONLY();
  const rejectReadOnly = REJECTREADONLY();
  const downtimeReadOnly = DOWNTIMEREADONLY();

  useLayoutEffect(() => {
    getData({ work_uuid }, '/prd/work-routings').then(setWorkRoutingHistory);
  }, []);

  return (
    <WorkRoutingHistoryModalInWorkPerformancePage
      visible={visible}
      columns={[...ColumnStore.WORK_ROUTING_HISTORY]}
      data={workRoutingHistory}
      TAB_CODE={TAB_CODE}
      workerReadOnly={workerReadOnly}
      rejectReadOnly={rejectReadOnly}
      downtimeReadOnly={downtimeReadOnly}
      onCancel={onCancel}
      work_uuid={work_uuid}
    />
  );
};
