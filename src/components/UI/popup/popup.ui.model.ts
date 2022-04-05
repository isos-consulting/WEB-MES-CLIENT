import { ENUM_DECIMAL, ENUM_WIDTH } from '~/enums';
import { IPopupItemOptionProps, IPopupItemsRetrunProps } from './popup.ui.type';



/**
 * 팝업키
 */
export type TPopupKey = 
| '신규추가'
| '신규항목선택' 
| '부서관리' 
| '품목관리' 
| '설비관리' 
| '설비유형관리' 
| '공장관리' 
| '품목유형관리' 
| '위치관리' 
| '모델관리' 
| '공정관리' 
| '제품유형관리' 
| '불량유형관리' 
| '부적합관리' 
| '창고관리' 
| '창고유형' 
| '단위관리' 
| '직급관리' 
| '사원관리' 
| '비가동관리' 
| '비가동유형관리' 
| '화폐단위관리' 
| '거래처관리' 
| '거래처유형관리' 
| '공급처관리' 
| '납품처관리' 
| '단가유형관리' 
| '검사기준관리' 
| '검사기준유형관리' 
| '검사유형관리' 
| '작업장관리' 
| '구매단가관리' 
| '검사구관리' 
| '재고관리' 
| '검사방법관리' 
| '판매단가관리' 
| '수주품목관리' 
| '출하지시품목관리' 
| '품목관리2'
| '금형관리'
| '금형문제점관리'
| 'BOM투입유형관리'
| undefined;

/**
 * 그리드 모듈에서 호출될 팝업에 관한 정보를 기술하여 리턴시켜주는 함수입니다.
 * @param popupKey 
 * @param option 
 * @returns 
 */ 
export function getPopupForm(popupKey:TPopupKey, option?:IPopupItemOptionProps):IPopupItemsRetrunProps {
  let retrunPopupItem:IPopupItemsRetrunProps = null
  switch (popupKey) {
    case '부서관리': return getPI_StdDept(option);
    case '설비관리': return getPI_StdEquip(option);
    case '설비유형관리': return getPI_StdEquipType(option);
    case '공장관리': return getPI_StdFactory(option);
    case '품목유형관리': return getPI_StdItemType(option);
    case '위치관리': return getPI_StdLocation(option);
    case '모델관리': return getPI_StdModel(option);
    case '공정관리': return getPI_StdProc(option);
    case '품목관리': return getPI_StdProd(option);
    case '품목관리2': return getPI_StdProd2(option);
    case '제품유형관리': return getPI_StdProdType(option);
    case '불량유형관리': return getPI_StdRejectType(option);
    case '부적합관리': return getPI_StdReject(option);
    case '창고관리': return getPI_StdStore(option);
    case '창고관리': return getPI_AdmStoreType(option);
    case '단위관리': return getPI_StdUnit(option);
    case '직급관리': return getPI_StdGrade(option);
    case '사원관리': return getPI_StdEmp(option);
    case '비가동관리': return getPI_StdDowntime(option);
    case '비가동유형관리': return getPI_StdDowntimeType(option);
    case '화폐단위관리': return getPI_StdMoneyUnit(option);
    case '거래처관리': return getPI_StdPartner(option);
    case '거래처유형관리': return getPI_StdPartnerType(option);
    case '공급처관리': return getPI_StdSupplier(option);
    case '납품처관리': return getPI_StdDelivery(option);
    case '단가유형관리': return getPI_StdPriceType(option);
    case '검사기준관리': return getPI_StdInspItem(option);
    case '검사기준유형관리': return getPI_StdInspItemType(option);
    case '검사유형관리': return getPI_StdInspType(option);
    case '작업장관리': return getPI_StdWorkings(option);
    case '구매단가관리': return getPI_StdVendorPrice(option);
    case '검사구관리': return getPI_StdInspTool(option);
    case '재고관리': return getPI_InvStore(option);
    case '검사방법관리': return getPI_StdInspMethod(option);
    case '판매단가관리': return getPI_StdCustomerPrice(option);
    case '수주품목관리': return getPI_SalOrderDetail(option);
    case '출하지시품목관리': return getPI_SalOutgoOrderDetail(option);
    case '금형문제점관리': return getPI_MldProblem(option);
    case '금형관리': return getPI_MldMold(option);
    case 'BOM투입유형관리': return getPI_AdmBomInputType(option);

    default:
      break;
  }

  return retrunPopupItem
}


// ====팝업 아이템 리스트=======================================================================================================
const getPI_StdDept = (option?:IPopupItemOptionProps):IPopupItemsRetrunProps => {
  let result:IPopupItemsRetrunProps = {
    modalProps:{
      title:'부서관리',
      visible: true,
    },
    datagridProps:{
      gridId: option?.id,
      columns:[
        {header: '부서아이디',name:'dept_uuid', hidden:true},
        {header: '부서코드',name:'dept_cd', width:200, filter:'text'},
        {header: '부서명칭',name:'dept_nm', width:200, filter:'text'},
      ]
    },
    uriPath:'/std/depts',
    params: option?.params,
    parentGridId: option?.parentGridId,
  }

  return result;
}

const getPI_StdEquip = (option?:IPopupItemOptionProps):IPopupItemsRetrunProps => {
  let result:IPopupItemsRetrunProps = {
    modalProps:{
      title:'설비관리',
      visible: true,
    },
    datagridProps:{
      gridId: option?.id,
      columns:[
        {header: '설비아이디',name:'equip_uuid', hidden:true},
        {header: '설비유형아이디',name:'equip_type_uuid', hidden:true},
        {header: '설비유형코드',name:'equip_type_cd', width:ENUM_WIDTH.L, filter:'text'},
        {header: '설비유형명칭',name:'equip_type_nm', width:ENUM_WIDTH.L, filter:'text'},
        {header: '설비코드',name:'equip_cd', width:ENUM_WIDTH.L, filter:'text'},
        {header: '설비명칭',name:'equip_nm', width:ENUM_WIDTH.L, filter:'text'},
      ],
      gridMode: 'select',
    },
    uriPath:'/std/equips',
    parentGridId: option?.parentGridId,
  }

  return result;
}

const getPI_StdEquipType = (option?:IPopupItemOptionProps):IPopupItemsRetrunProps => {
  let result:IPopupItemsRetrunProps = {
    modalProps:{
      title:'설비유형관리',
      visible: true,
    },
    datagridProps:{
      gridId: option?.id,
      columns:[
        {header: '설비유형아이디',name:'equip_type_uuid', hidden:true},
        {header: '설비유형코드',name:'equip_type_cd', width:ENUM_WIDTH.L, filter:'text'},
        {header: '설비유형명칭',name:'equip_type_nm', width:ENUM_WIDTH.L, filter:'text'},
      ],
      gridMode: 'select',
    },
    uriPath:'/std/equip-types',
    parentGridId: option?.parentGridId,
  }

  return result;
}

const getPI_StdFactory = (option?:IPopupItemOptionProps):IPopupItemsRetrunProps => {
  let result:IPopupItemsRetrunProps = {
    modalProps:{
      title:'공장 관리',
      visible: true,
    },
    datagridProps:{
      gridId: option?.id,
      columns:[
        {header: '공장아이디',name:'factory_uuid', hidden:true},
        {header: '공장코드',name:'factory_cd', width:200, filter:'text'},
        {header: '공장명칭',name:'factory_nm', width:200, filter:'text'},
      ],
      gridMode: 'select',
    },
    uriPath:'/std/factories',
    parentGridId: option?.parentGridId,
  }

  return result;
}

const getPI_StdItemType = (option?:IPopupItemOptionProps):IPopupItemsRetrunProps => {
  let result:IPopupItemsRetrunProps = {
    modalProps:{
      title:'품목유형관리',
      visible: true,
    },
    datagridProps:{
      gridId: option?.id,
      columns:[
        {header: '품목유형아이디',name:'item_type_uuid', hidden:true},
        {header: '품목유형코드',name:'item_type_cd', width:200, filter:'text'},
        {header: '품목유형명',name:'item_type_nm', width:200, filter:'text'},
      ],
      gridMode: 'select',
    },
    uriPath:'/std/item-types',
    parentGridId: option?.parentGridId,
  }

  return result;
}

const getPI_StdLocation = (option?:IPopupItemOptionProps):IPopupItemsRetrunProps => {
  let result:IPopupItemsRetrunProps = {
    modalProps:{
      title:'위치관리',
      visible: true,
    },
    datagridProps:{
      gridId: option?.id,
      columns:[
        {header: '위치아이디',name:'location_uuid', hidden:true},
        {header: '위치코드',name:'location_cd', width:200, filter:'text'},
        {header: '위치명칭',name:'location_nm', width:200, filter:'text'},
      ],
      gridMode: 'select',
    },
    uriPath:'/std/locations',
    parentGridId: option?.parentGridId,
  }

  return result;
}

const getPI_StdModel = (option?:IPopupItemOptionProps):IPopupItemsRetrunProps => {
  let result:IPopupItemsRetrunProps = {
    modalProps:{
      title:'모델관리',
      visible: true,
    },
    datagridProps:{
      gridId: option?.id,
      columns:[
        {header: '모델아이디',name:'model_uuid', hidden:true},
        {header: '모델코드',name:'model_cd', width:200, filter:'text'},
        {header: '모델명칭',name:'model_nm', width:200, filter:'text'},
      ],
      gridMode: 'select',
    },
    uriPath:'/std/models',
    parentGridId: option?.parentGridId,
  }

  return result;
}

const getPI_StdProc = (option?:IPopupItemOptionProps):IPopupItemsRetrunProps => {
  let result:IPopupItemsRetrunProps = {
    modalProps:{
      title:'공정 관리',
      visible: true,
    },
    datagridProps:{
      gridId: option?.id,
      columns:[
        {header: '공정아이디',name:'proc_uuid', hidden:true},
        {header: '공정코드',name:'proc_cd', width:200, filter:'text'},
        {header: '공정명칭',name:'proc_nm', width:200, filter:'text'},
      ],
      gridMode: 'select',
    },
    uriPath:'/std/procs',
    parentGridId: option?.parentGridId,
  }

  return result;
}

const getPI_StdProd = (option?:IPopupItemOptionProps):IPopupItemsRetrunProps => {
  let result:IPopupItemsRetrunProps = {
    modalProps:{
      title:'품목관리',
      visible: true,
    },
    datagridProps:{
      gridId: option?.id,
      columns:[
        {header: '품목아이디', name:'prod_uuid', width:150, filter:'text', hidden:true},
        {header: '품번', name:'prod_no', width:150, filter:'text', format:'text'},
        {header: '품목명', name:'prod_nm', width:150, filter:'text', format:'text'},
        {header: '품목 유형아이디', name:'item_type_uuid', width:150, filter:'text', format:'text', hidden:true },
        {header: '품목 유형코드', name:'item_type_cd', width:150, filter:'text', format:'text', hidden:true},
        {header: '품목 유형명', name:'item_type_nm', width:100, align:'center', filter:'text', format:'text' },
        {header: '제품 유형아이디', name:'prod_type_uuid', width:150, filter:'text', format:'text', hidden:true},
        {header: '제품 유형코드', name:'prod_type_cd', width:150, filter:'text', format:'text', hidden:true},
        {header: '제품 유형명', name:'prod_type_nm', width:150, filter:'text', format:'text'},
        {header: '모델아이디', name:'model_uuid', width:150, filter:'text', format:'text', hidden:true},
        {header: '모델코드', name:'model_cd', width:150, filter:'text', format:'text', hidden:true},
        {header: '모델명', name:'model_nm', width:150, filter:'text', format:'text'},
        {header: '리비전', name:'rev', width:100, filter:'text', format:'text'},
        {header: '규격', name:'prod_std', width:150, filter:'text', format:'text'},
        {header: '단위아최소 단위수량', name:'mat_order_min_qty', width:150, filter:'text', format:'number'},
        {header: '발주 소요일', name:'mat_supply_days', width:150, filter:'text', format:'date'},
        {header: '수주 사용유무', name:'sal_order_fg', width:120, filter:'text', format:'check'},
        {header: '창고 사용유무', name:'inv_use_fg', width:120, filter:'text', format:'check'},
        {header: '단위수량', name:'inv_package_qty', width:100, filter:'text', format:'number'},
        {header: '안전 재고수량', name:'inv_safe_qty', width:150, filter:'text', format:'number'},
        {header: '입고 창고아이디', name:'inv_to_store_uuid', width:150, filter:'text', format:'text', hidden:true},
        {header: '위치 아이디', name:'inv_to_location_uuid', width:150, filter:'text', editable:true, format:'text', hidden:true},
        {header: '위치코드', name:'inv_to_location_cd', width:150, filter:'text', editable:true, format:'text', hidden:true},
        {header: '위치명', name:'inv_to_location_nm', width:100, align:'center', filter:'text', editable:true, format:'text'},
        {header: '창고코드', name:'inv_to_store_cd', width:150, filter:'text', format:'text', hidden:true},
        {header: '창고명', name:'inv_to_store_nm', width:100, align:'center', filter:'text', format:'text'},
        {header: '수입검사유무', name:'qms_recv_insp_fg', width:120, filter:'text', format:'check'},
        {header: '공정검사유무', name:'qms_proc_insp_fg', width:120, filter:'text', format:'check'},
        {header: '출하검사유무', name:'qms_outgo_insp_fg', width:120, filter:'text', format:'check'},
        {header: '생산품유무', name:'prd_active_fg', width:100, filter:'text', format:'check'},
        {header: '계획유형코드 (MPS/MRP)', name:'prd_plan_type_cd', width:180, align:'center', filter:'text', format:'text'},
        {header: '최소값', name:'prd_min', width:150, filter:'text', format:'number'},
        {header: '최대값', name:'prd_max', width:150, filter:'text', format:'number'},
        {header: '등록일자', name:'updated_at', width:100, filter:'text', format:'date'},
        {header: '등록자이디', name:'unit_uuid', width:150, filter:'text', format:'text', hidden:true},
        {header: '단위코드', name:'unit_cd', width:150, filter:'text', format:'text', hidden:true},
        {header: '단위명', name:'unit_nm', width:150, filter:'text', format:'text'},
        {header: 'LOT 사용유무', name:'lot_fg', width:120, filter:'text', format:'check'},
        {header: '사용유무', name:'use_fg', width:100, filter:'text', format:'check'},
        {header: '품목 활성 상태', name:'active_fg', width:120, filter:'text', format:'check'},
        {header: 'BOM 유형 코드', name:'bom_type_cd', width:150, align:'center', filter:'text', format:'text'},
        {header: '폭', name:'width', width:100, filter:'text', format:'number'},
        {header: '길이', name:'length', width:100, filter:'text', format:'number'},
        {header: '높이', name:'height', width:100, filter:'text', format:'number'},
        {header: '재질', name:'material', width:100, filter:'text', format:'text'},
        {header: '색상', name:'color', width:100, filter:'text', format:'text'},
        {header: '중량', name:'weight', width:100, filter:'text', format:'number'},
        {header: '두께', name:'thickness', width:100, filter:'text', format:'number'},
        {header: '발주 사용유무', name:'mat_order_fg', width:120, filter:'text', format:'check'},
        {header: '발주 ', name:'updated_nm', width:100, align:'center', filter:'text', format:'text'},
      ],
      gridMode: 'select',
    },
    uriPath:'/std/prods',
    parentGridId: option?.parentGridId,
  }

  return result;
}


const getPI_StdProd2 = (option?:IPopupItemOptionProps):IPopupItemsRetrunProps => {
  let result:IPopupItemsRetrunProps = {
    modalProps:{
      title:'품목관리',
      visible: true,
    },
    datagridProps:{
      gridId: option?.id,
      columns:[
        {header: '품목UUID', name:'prod_uuid', width:ENUM_WIDTH.M, filter:'text', hidden:true},
        {header: '품번', name:'prod_no', width:ENUM_WIDTH.M, filter:'text', format:'text'},
        {header: '품목', name:'prod_nm', width:ENUM_WIDTH.M, filter:'text', format:'text'},
        {header: '품목 유형UUID', name:'item_type_uuid', width:ENUM_WIDTH.M, filter:'text', format:'text', hidden:true },
        {header: '품목 유형', name:'item_type_nm', width:ENUM_WIDTH.M, align:'center', filter:'text', format:'text' },
        {header: '제품 유형UUID', name:'prod_type_uuid', width:ENUM_WIDTH.M, filter:'text', format:'text', hidden:true},
        {header: '제품 유형', name:'prod_type_nm', width:ENUM_WIDTH.M, filter:'text', format:'text'},
        {header: '모델UUID', name:'model_uuid', width:ENUM_WIDTH.M, filter:'text', format:'text', hidden:true},
        {header: '모델명', name:'model_nm', width:ENUM_WIDTH.M, filter:'text', format:'text'},
        {header: 'Rev', name:'rev', width:ENUM_WIDTH.M, filter:'text', format:'text'},
        {header: '규격', name:'prod_std', width:ENUM_WIDTH.M, filter:'text', format:'text'},
        {header: '안전재고', name:'saft_stock', width:ENUM_WIDTH.M, filter:'text', format:'number'},
        {header: '단위UUID', name:'unit_uuid', width:ENUM_WIDTH.M, filter:'text', format:'text', hidden:true},
        {header: '단위', name:'unit_nm', width:ENUM_WIDTH.M, filter:'text', format:'text'},
      ],
      gridMode: 'select',
    },
    uriPath:'/std/prods',
    parentGridId: option?.parentGridId,
  }

  return result;
}

const getPI_StdProdType = (option?:IPopupItemOptionProps):IPopupItemsRetrunProps => {
  let result:IPopupItemsRetrunProps = {
    modalProps:{
      title:'제품유형관리',
      visible: true,
    },
    datagridProps:{
      gridId: option?.id,
      columns:[
        {header: '제품유형아이디',name:'prod_type_uuid', hidden:true},
        {header: '제품유형코드',name:'prod_type_cd', width:200, filter:'text'},
        {header: '제품유형명칭',name:'prod_type_nm', width:200, filter:'text'},
      ],
      gridMode: 'select',
    },
    uriPath:'/std/prod-types',
    parentGridId: option?.parentGridId,
  }

  return result;
}

const getPI_StdRejectType = (option?:IPopupItemOptionProps):IPopupItemsRetrunProps => {
  let result:IPopupItemsRetrunProps = {
    modalProps:{
      title:'불량유형관리',
      visible: true,
    },
    datagridProps:{
      gridId: option?.id,
      columns:[
        {header: '불량유형아이디',name:'reject_type_uuid', hidden:true},
        {header: '불량유형코드',name:'reject_type_cd', width:200, filter:'text'},
        {header: '불량유형명칭',name:'reject_type_nm', width:200, filter:'text'},
      ],
      gridMode: 'select',
    },
    uriPath:'/std/reject-types',
    parentGridId: option?.parentGridId,
  }

  return result;
}

const getPI_StdReject = (option?:IPopupItemOptionProps):IPopupItemsRetrunProps => {
  let result:IPopupItemsRetrunProps = {
    modalProps:{
      title:'부적합관리',
      visible: true,
    },
    datagridProps:{
      gridId: option?.id,
      columns:[
        {header: '불량아이디',name:'reject_uuid', hidden:true},
        {header: '불량유형',name:'reject_type_nm', width:200, filter:'text'},
        {header: '불량코드',name:'reject_cd', width:200, filter:'text'},
        {header: '불량명칭',name:'reject_nm', width:200, filter:'text'},
      ],
      gridMode: 'select',
    },
    uriPath:'/std/rejects',
    parentGridId: option?.parentGridId,
  }

  return result;
}

const getPI_StdStore = (option?:IPopupItemOptionProps):IPopupItemsRetrunProps => {
  let result:IPopupItemsRetrunProps = {
    modalProps:{
      title:'창고관리',
      visible: true,
    },
    datagridProps:{
      gridId: option?.id,
      columns:[
        {header: '창고아이디',name:'store_uuid', hidden:true},
        {header: '창고코드',name:'store_cd', width:200, filter:'text'},
        {header: '창고명칭',name:'store_nm', width:200, filter:'text'},
      ],
      gridMode: 'select',
    },
    uriPath:'/std/stores',
    parentGridId: option?.parentGridId,
  }

  return result;
}

const getPI_AdmStoreType = (option?:IPopupItemOptionProps):IPopupItemsRetrunProps => {
  let result:IPopupItemsRetrunProps = {
    modalProps:{
      title:'창고유형',
      visible: true,
    },
    datagridProps:{
      gridId: option?.id,
      columns:[
        {header: '창고유형아이디',name:'store_type_uuid', hidden:true},
        {header: '창고유형코드',name:'store_type_cd', width:200, filter:'text'},
        {header: '창고유형명칭',name:'store_type_nm', width:200, filter:'text'},
      ],
      gridMode: 'select',
    },
    uriPath:'/adm/store-types',
    parentGridId: option?.parentGridId,
  }

  return result;
}

const getPI_StdUnit = (option?:IPopupItemOptionProps):IPopupItemsRetrunProps => {
  let result:IPopupItemsRetrunProps = {
    modalProps:{
      title:'단위관리',
      visible: true,
    },
    datagridProps:{
      gridId: option?.id,
      columns:[
        {header: '단위아이디',name:'unit_uuid', hidden:true},
        {header: '단위코드',name:'unit_cd', width:200, filter:'text'},
        {header: '단위명칭',name:'unit_nm', width:200, filter:'text'},
      ],
      gridMode: 'select',
    },
    uriPath:'/std/units',
    parentGridId: option?.parentGridId,
  }

  return result;
}

const getPI_StdGrade = (option?:IPopupItemOptionProps):IPopupItemsRetrunProps => {
  let result:IPopupItemsRetrunProps = {
    modalProps:{
      title:'직급관리',
      visible: true,
    },
    datagridProps:{
      gridId: option?.id,
      columns:[
        {header: '직급아이디',name:'grade_uuid', hidden:true},
        {header: '직급코드',name:'grade_cd', width:200, filter:'text'},
        {header: '직급명칭',name:'grade_nm', width:200, filter:'text'},
      ],
      gridMode: 'select',
    },
    uriPath:'/std/grades',
    parentGridId: option?.parentGridId,
  }

  return result;
}

const getPI_StdEmp = (option?:IPopupItemOptionProps):IPopupItemsRetrunProps => {
  let result:IPopupItemsRetrunProps = {
    modalProps:{
      title:'사원관리',
      visible: true,
    },
    datagridProps:{
      gridId: option?.id,
      columns:[
        {header: '사원아이디',name:'emp_uuid', hidden:true},
        {header: '사원코드',name:'emp_cd', width:200, filter:'text'},
        {header: '사원명칭',name:'emp_nm', width:200, filter:'text'},
      ],
      gridMode: 'select',
    },
    uriPath:'/std/emps',
    params: option?.params,
    parentGridId: option?.parentGridId,
  }

  return result;
}

const getPI_StdDowntime = (option?:IPopupItemOptionProps):IPopupItemsRetrunProps => {
  let result:IPopupItemsRetrunProps = {
    modalProps:{
      title:'비가동관리',
      visible: true,
    },
    datagridProps:{
      gridId: option?.id,
      columns:[
        {header: '비가동아이디',name:'downtime_uuid', hidden:true},
        {header: '비가동코드',name:'downtime_cd', width:200, filter:'text'},
        {header: '비가동명칭',name:'downtime_nm', width:200, filter:'text'},
      ],
      gridMode: 'select',
    },
    uriPath:'/std/downtimes',
    parentGridId: option?.parentGridId,
  }

  return result;
}

const getPI_StdDowntimeType = (option?:IPopupItemOptionProps):IPopupItemsRetrunProps => {
  let result:IPopupItemsRetrunProps = {
    modalProps:{
      title:'비가동유형관리',
      visible: true,
    },
    datagridProps:{
      gridId: option?.id,
      columns:[
        {header: '비가동유형아이디',name:'downtime_type_uuid', hidden:true},
        {header: '비가동유형코드',name:'downtime_type_cd', width:200, filter:'text'},
        {header: '비가동유형명칭',name:'downtime_type_nm', width:200, filter:'text'},
      ],
      gridMode: 'select',
    },
    uriPath:'/std/downtime-types',
    parentGridId: option?.parentGridId,
  }

  return result;
}

const getPI_StdMoneyUnit = (option?:IPopupItemOptionProps):IPopupItemsRetrunProps => {
  let result:IPopupItemsRetrunProps = {
    modalProps:{
      title:'화폐단위관리',
      visible: true,
    },
    datagridProps:{
      gridId: option?.id,
      columns:[
        {header: '화폐단위아이디',name:'money_unit_uuid', hidden:true},
        {header: '화폐단위코드',name:'money_unit_cd', width:200, filter:'text'},
        {header: '화폐단위명',name:'money_unit_nm', width:200, filter:'text'},
      ],
      gridMode: 'select',
    },
    uriPath:'/std/money-units',
    parentGridId: option?.parentGridId,
  }

  return result;
}

const getPI_StdPartner = (option?:IPopupItemOptionProps):IPopupItemsRetrunProps => {
  let result:IPopupItemsRetrunProps = {
    modalProps:{
      title:'거래처관리',
      visible: true,
    },
    datagridProps:{
      gridId: option?.id,
      columns:[
        // {header: '거래처유형아이디',name:'partner_type_uuid', hidden:true},
        {header: '거래처아이디',name:'partner_uuid', hidden:true},
        {header: '거래처코드',name:'partner_cd', width:200, filter:'text'},
        {header: '거래처명',name:'partner_nm', width:200, filter:'text'},
      ],
      gridMode: 'select',
    },
    uriPath:'/std/partners',
    parentGridId: option?.parentGridId,
  }

  return result;
}

const getPI_StdPartnerType = (option?:IPopupItemOptionProps):IPopupItemsRetrunProps => {
  let result:IPopupItemsRetrunProps = {
    modalProps:{
      title:'거래처유형관리',
      visible: true,
    },
    datagridProps:{
      gridId: option?.id,
      columns:[
        {header: '거래처유형아이디',name:'partner_type_uuid', hidden:true},
        {header: '거래처유형코드',name:'partner_type_cd', width:200, filter:'text'},
        {header: '거래처유형명',name:'partner_type_nm', width:200, filter:'text'},
      ],
      gridMode: 'select',
    },
    uriPath:'/std/partner-types',
    parentGridId: option?.parentGridId,
  }

  return result;
}

const getPI_StdSupplier = (option?:IPopupItemOptionProps):IPopupItemsRetrunProps => {
  let result:IPopupItemsRetrunProps = {
    modalProps:{
      title:'공급처관리',
      visible: true,
    },
    datagridProps:{
      gridId: option?.id,
      columns:[
        {header: '공급처아이디',name:'supplier_uuid', hidden:true},
        {header: '공급처코드',name:'supplier_cd', width:200, filter:'text'},
        {header: '공급처명',name:'supplier_nm', width:200, filter:'text'},
      ],
      gridMode: 'select',
    },
    uriPath:'/std/suppliers',
    parentGridId: option?.parentGridId,
  }

  return result;
}

const getPI_StdDelivery = (option?:IPopupItemOptionProps):IPopupItemsRetrunProps => {
  let result:IPopupItemsRetrunProps = {
    modalProps:{
      title:'납품처관리',
      visible: true,
    },
    datagridProps:{
      gridId: option?.id,
      columns:[
        {header: '납품처아이디',name:'delivery_uuid', hidden:true},
        {header: '납품처코드',name:'delivery_cd', width:200, filter:'text'},
        {header: '납품처명',name:'delivery_nm', width:200, filter:'text'},
      ],
      gridMode: 'select',
    },
    uriPath:'/std/deliveries',
    parentGridId: option?.parentGridId,
  }

  return result;
}

const getPI_StdPriceType = (option?:IPopupItemOptionProps):IPopupItemsRetrunProps => {
  let result:IPopupItemsRetrunProps = {
    modalProps:{
      title:'단가유형관리',
      visible: true,
    },
    datagridProps:{
      gridId: option?.id,
      columns:[
        {header: '단가유형아이디',name:'price_type_uuid', hidden:true},
        {header: '단가유형코드',name:'price_type_cd', width:200, filter:'text'},
        {header: '단가유형명',name:'price_type_nm', width:200, filter:'text'},
      ],
      gridMode: 'select',
    },
    uriPath:'/std/price-types',
    parentGridId: option?.parentGridId,
  }

  return result;
}

const getPI_StdInspItem = (option?:IPopupItemOptionProps):IPopupItemsRetrunProps => {
  let result:IPopupItemsRetrunProps = {
    modalProps:{
      title:'검사기준관리',
      visible: true,
    },
    datagridProps:{
      gridId: option?.id,
      columns:[
        {header: '검사기준아이디',name:'insp_item_uuid', hidden:true},
        {header: '검사기준코드',name:'insp_item_cd', width:200, filter:'text'},
        {header: '검사기준명',name:'insp_item_nm', width:200, filter:'text'},
      ],
      gridMode: 'select',
    },
    uriPath:'/std/insp-items',
    parentGridId: option?.parentGridId,
  }

  return result;
}

const getPI_StdInspItemType = (option?:IPopupItemOptionProps):IPopupItemsRetrunProps => {
  let result:IPopupItemsRetrunProps = {
    modalProps:{
      title:'검사기준유형관리',
      visible: true,
    },
    datagridProps:{
      gridId: option?.id,
      columns:[
        {header: '검사기준유형아이디',name:'insp_item_type_uuid', hidden:true},
        {header: '검사기준유형코드',name:'insp_item_type_cd', width:200, filter:'text'},
        {header: '검사기준유형명',name:'insp_item_type_nm', width:200, filter:'text'},
      ],
      gridMode: 'select',
    },
    uriPath:'/std/insp-item-types',
    parentGridId: option?.parentGridId,
  }

  return result;
}

const getPI_StdInspType = (option?:IPopupItemOptionProps):IPopupItemsRetrunProps => {
  let result:IPopupItemsRetrunProps = {
    modalProps:{
      title:'검사유형관리',
      visible: true,
    },
    datagridProps:{
      gridId: option?.id,
      columns:[
        {header: '검사유형UUID',name:'insp_type_uuid', width:200, filter:'text', hidden:true},
        {header: '검사유형코드',name:'insp_type_cd', width:200, filter:'text'},
        {header: '검사유형명',name:'insp_type_nm', width:200, filter:'text'},
      ],
      gridMode: 'select',
    },
    uriPath:'/adm/insp-types',
    parentGridId: option?.parentGridId,
  }

  return result;
}

const getPI_StdWorkings = (option?:IPopupItemOptionProps):IPopupItemsRetrunProps => {
  let result:IPopupItemsRetrunProps = {
    modalProps:{
      title:'작업장관리',
      visible: true,
    },
    datagridProps:{
      gridId: option?.id,
      columns:[
        {header: '작업장아이디',name:'workings_uuid', hidden:true},
        {header: '작업장코드',name:'workings_cd', width:200, filter:'text'},
        {header: '작업장명',name:'workings_nm', width:200, filter:'text'},
      ],
      gridMode: 'select',
    },
    uriPath:'/std/workingses',
    parentGridId: option?.parentGridId,
  }

  return result;
}

const getPI_StdVendorPrice= (option?:IPopupItemOptionProps):IPopupItemsRetrunProps => {
  let result:IPopupItemsRetrunProps = {
    modalProps:{
      title:'협력사단가',
      visible: true,
    },
    datagridProps:{
      gridId: option?.id,
      columns:[
        {header: '협력사단가아이디', name:'vendor_price_uuid', alias:'uuid', width:150, filter:'text', hidden:true},
        {header: '거래처아이디', name:'partner_uuid', width:150, filter:'text', hidden:true, requiredField:true },
        {header: '거래처코드', name:'partner_cd', width:150, filter:'text', hidden:true},
        {header: '거래처명', name:'partner_nm', width:150, filter:'text', hidden:true},
        {header: '품목아이디', name:'prod_uuid', width:150, filter:'text', editable:true, format:'text',hidden:true, requiredField:true},
        {header: '품번', name:'prod_no', width:200, filter:'text', editable:true, format:'popup'},
        {header: '품명', name:'prod_nm', width:200, filter:'text', editable:true, format:'popup'},
        {header: '품목유형', name:'item_type_nm', width:200, filter:'text', editable:true, format:'text', },
        {header: '제품유형', name:'prod_type_nm', width:200, filter:'text', editable:true, format:'text', },
        {header: '모델', name:'model_nm', width:100, filter:'text', editable:true, format:'text', },
        {header: 'Rev', name:'rev', width:100, filter:'text', editable:true, format:'text', },
        {header: '규격', name:'prod_std', width:100, filter:'text', editable:true, format:'text',},
        {header: '단위', name:'unit_nm', width:200, filter:'text', editable:true, format:'text', },
        {header: '입고창고아이디', name:'to_store_uuid', width:150, filter:'text', editable:true, format:'text',hidden:true, requiredField:true},
        {header: '입고창고코드', name:'to_store_cd', width:200, filter:'text', editable:true, format:'text',hidden:true},
        {header: '입고창고명', name:'to_store_nm', width:200, filter:'text', editable:true, format:'popup'},
        {header: '입고위치아이디', name:'to_location_uuid', width:150, filter:'text', editable:true, format:'text',hidden:true, requiredField:true},
        {header: '입고위치코드', name:'to_location_cd', width:200, filter:'text', editable:true, format:'text',hidden:true},
        {header: '입고위치명', name:'to_location_nm', width:200, filter:'text', editable:true, format:'popup'},
        {header: '화폐단위아이디', name:'money_unit_uuid', width:200, filter:'text', editable:true, format:'text', hidden:true, requiredField:true },
        {header: '화폐단위', name:'money_unit_nm', width:200, filter:'text', editable:true, format:'combo', },
        {header: '단가유형아이디', name:'price_type_uuid', width:200, filter:'text', editable:true, format:'text', hidden:true, requiredField:true },
        {header: '단가유형', name:'price_type_nm', width:100, filter:'text', editable:true, format:'combo', },
        {header: '단가', name:'price', width:100, filter:'text', editable:true, format:'text', requiredField:true},
        {header: '단가적용일자', name:'start_date', width:200, filter:'text', editable:true, format:'date', requiredField:true },
        {header: '소급단가', name:'retroactive_price', width:100, filter:'text', editable:true, format:'text',},
        {header: '배분율', name:'division', width:200, filter:'text', editable:true, format:'number', },
        {header: '등록일자', name:'updated_at', width:100, filter:'text', format:'date'},
        {header: '등록자', name:'updated_nm', width:100, align:'center', filter:'text', format:'text'},
      ],
      gridMode: 'select',
    },
    uriPath:'/std/vendor-prices',
    parentGridId: option?.parentGridId,
  }

  return result;
}

const getPI_StdInspTool = (option?:IPopupItemOptionProps):IPopupItemsRetrunProps => {
  let result:IPopupItemsRetrunProps = {
    modalProps:{
      title:'검사구관리',
      visible: true,
    },
    datagridProps:{
      gridId: option?.id,
      columns:[
        {header: '검사구 아이디', name:'insp_tool_uuid', alias:'uuid', width:150, filter:'text', format:'text', editable:true, hidden:true},
        {header: '검사구코드', name:'insp_tool_cd', width:150, filter:'text', editable:true, format:'text', requiredField:true},
        {header: '검사구명', name:'insp_tool_nm', width:200, filter:'text', editable:true, format:'text', requiredField:true},
        {header: '등록일자', name:'updated_at', width:100, filter:'text', format:'date'},
        {header: '등록자', name:'updated_nm', width:100, align:'center', filter:'text', format:'text'},
      ],
      gridMode: 'select',
    },
    uriPath:'/std/insp-tools',
    parentGridId: option?.parentGridId,
  }

  return result;
}

const getPI_InvStore = (option?:IPopupItemOptionProps):IPopupItemsRetrunProps => {
  const priceVisible:boolean= (option?.params as any)?.partner_uuid ? true : false
  let result:IPopupItemsRetrunProps = {
    modalProps:{
      title:'재고관리',
      visible: true,
    },
    datagridProps:{
      gridId: option?.id,
      columns:[
        {header: '품목UUID', name:'prod_uuid', width:ENUM_WIDTH.M, format:'text', filter:'text', hidden:true},
        {header: '품목유형UUID', name:'item_type_uuid', width:ENUM_WIDTH.M, format:'text', filter:'text', hidden:true},
        {header: '품목유형', name:'item_type_nm', width:ENUM_WIDTH.M, format:'text', filter:'text'},
        {header: '제품유형UUID', name:'prod_type_uuid', width:ENUM_WIDTH.M, format:'text', filter:'text', hidden:true},
        {header: '제품유형', name:'prod_type_nm', width:ENUM_WIDTH.M, format:'text', filter:'text'},
        {header: '품번', name:'prod_no', width:ENUM_WIDTH.M, format:'text', filter:'text'},
        {header: '품명', name:'prod_nm', width:ENUM_WIDTH.L, format:'text', filter:'text'},
        {header: '모델', name:'model_nm', width:ENUM_WIDTH.M, format:'text', filter:'text'},
        {header: 'Rev', name:'rev', width:ENUM_WIDTH.M, format:'text', filter:'text'},
        {header: '규격', name:'prod_std', width:ENUM_WIDTH.M, format:'text', filter:'text', hidden:true},
        {header: '단위', name:'unit_nm', width:ENUM_WIDTH.S, format:'text', filter:'text'},
        {header: '창고UUID', name:'store_uuid', width:ENUM_WIDTH.L, format:'text', filter:'text', hidden:true},
        {header: '창고', name:'store_nm', width:ENUM_WIDTH.M, format:'text', filter:'text'},
        {header: '위치UUID', name:'location_uuid', width:ENUM_WIDTH.L, format:'text', filter:'text', hidden:true},
        {header: '위치', name:'location_nm', width:ENUM_WIDTH.M, format:'text', filter:'text'},
        {header: 'LOT NO', name:'lot_no', width:ENUM_WIDTH.M, format:'text', filter:'text'},
        {header: '재고', name:'qty', width:ENUM_WIDTH.M, format:'number', filter:'number', decimal:ENUM_DECIMAL.DEC_STCOK},
        {header: '화폐단위UUID', name:'money_unit_uuid', width:ENUM_WIDTH.M, format:'text', filter:'text', hidden:true},
        {header: '화폐단위', name:'money_unit_nm', width:ENUM_WIDTH.M, format:'text', filter:'text', hidden:priceVisible},
        {header: '단가유형UUID', name:'price_type_uuid', width:ENUM_WIDTH.M, format:'text', filter:'text', hidden:true},
        {header: '단가유형', name:'price_type_nm', width:ENUM_WIDTH.M, format:'text', filter:'text', hidden:priceVisible},
        {header: '단가', name:'price', width:ENUM_WIDTH.M, format:'number', filter:'number', decimal:ENUM_DECIMAL.DEC_PRICE, hidden:priceVisible},
        {header: '환율', name:'exchange', width:ENUM_WIDTH.M, format:'number', filter:'number', decimal:ENUM_DECIMAL.DEC_PRICE, hidden:priceVisible},
      ],
      gridMode: 'select',
    },
    uriPath:'/inv/stores/stocks',
    params: option?.params,
    parentGridId: option?.parentGridId,
  }

  return result;
}

const getPI_StdInspMethod = (option?:IPopupItemOptionProps):IPopupItemsRetrunProps => {
  let result:IPopupItemsRetrunProps = {
    modalProps:{
      title:'검사방법관리',
      visible: true,
    },
    datagridProps:{
      gridId: option?.id,
      columns:[
        {header: '검사방법아이디', name:'insp_method_uuid', alias:'uuid', width:150, filter:'text', hidden:true},
        {header: '검사방법코드', name:'insp_method_cd', width:150, filter:'text', editable:true, format:'text', requiredField:true},
        {header: '검사방법명', name:'insp_method_nm', width:200, filter:'text', editable:true, format:'text', requiredField:true},
        {header: '등록일자', name:'updated_at', width:100, filter:'text', format:'datetime'},
        {header: '등록자', name:'updated_nm', width:100, align:'center', filter:'text', format:'text'},
      ],
      gridMode: 'select',
    },
    uriPath:'/std/insp-methods',
    parentGridId: option?.parentGridId,
  }

  return result;
}

const getPI_StdCustomerPrice = (option?:IPopupItemOptionProps):IPopupItemsRetrunProps => {
  let result:IPopupItemsRetrunProps = {
    modalProps:{
      title:'판매단가관리',
      visible: true,
    },
    datagridProps:{
      gridId: option?.id,
      columns:[
        {header: '품목UUID', name:'prod_uuid', format:'text', hidden:true},
        {header: '품목유형UUID', name:'item_type_uuid', format:'text', hidden:true},
        {header: '품목유형', name:'item_type_nm', width:ENUM_WIDTH.L, format:'text'},
        {header: '제품유형UUID', name:'prod_type_uuid', format:'text', hidden:true},
        {header: '제품유형', name:'prod_type_nm', width:ENUM_WIDTH.L, format:'text'},
        {header: '품번', name:'prod_no', width:ENUM_WIDTH.M, format:'text'},
        {header: '품명', name:'prod_nm', width:ENUM_WIDTH.L, format:'text'},
        {header: '모델UUID', name:'model_uuid', format:'text', hidden:true},
        {header: '모델코드', name:'model_cd', width:ENUM_WIDTH.M, format:'text', hidden:true},
        {header: '모델', name:'model_nm', width:ENUM_WIDTH.M, format:'text'},
        {header: 'Rev', name:'rev', width:ENUM_WIDTH.S, format:'text'},
        {header: '규격', name:'prod_std', width:ENUM_WIDTH.L, format:'text'},
        {header: '안전재고', name:'safe_stock', width:ENUM_WIDTH.M, format:'text'},
        {header: '단위수량', name:'unit_qty', width:ENUM_WIDTH.M, format:'number'},
        {header: '단위UUID', name:'unit_uuid', format:'text', hidden:true},
        {header: '단위코드', name:'unit_cd', width:ENUM_WIDTH.M, format:'text', hidden:true},
        {header: '단위', name:'unit_nm', width:ENUM_WIDTH.M, format:'text'},
        {header: '화폐단위UUID', name:'money_unit_uuid', format:'text', hidden:true},
        {header: '화폐단위', name:'money_unit_nm', width:ENUM_WIDTH.M, format:'text'},
        {header: '단가유형UUID', name:'price_type_uuid', format:'text', hidden:true},
        {header: '단가유형', name:'price_type_nm', width:ENUM_WIDTH.M, format:'text'},
        {header: '단가', name:'price', width:ENUM_WIDTH.S, format:'number', decimal:ENUM_DECIMAL.DEC_PRICE},
        {header: '환율', name:'exchange', width:ENUM_WIDTH.S, format:'number', decimal:ENUM_DECIMAL.DEC_PRICE, hidden:true},
      ],
      gridMode: 'select',
    },
    uriPath:'/std/customer-prices',
    parentGridId: option?.parentGridId,
  }

  return result;
}


const getPI_SalOrderDetail = (option?:IPopupItemOptionProps):IPopupItemsRetrunProps => {
  let result:IPopupItemsRetrunProps = {
    modalProps:{
      title:'수주품목',
      visible: true,
    },
    datagridProps:{
      gridId: option?.id,
      columns:[
        {header: '수주UUID', name:'order_uuid', width:ENUM_WIDTH.M, format:'text', filter:'text', hidden:true},
        {header: '세부수주UUID', name:'order_detail_uuid', width:ENUM_WIDTH.M, format:'text', filter:'text', hidden:true},
        {header: '완료구분', name:'complete_state', width:ENUM_WIDTH.M, format:'text', filter:'text', align:'center'},
        {header: '전표번호', name:'stmt_no', width:ENUM_WIDTH.M, format:'text', filter:'text'},
        {header: '납기일', name:'due_date', width:ENUM_WIDTH.M, format:'date', filter:'text'},
        {header: '품목UUID', name:'prod_uuid', width:ENUM_WIDTH.M, format:'text', filter:'text', hidden:true},
        {header: '품목유형UUID', name:'item_type_uuid', width:ENUM_WIDTH.M, format:'text', filter:'text', hidden:true},
        {header: '품목유형', name:'item_type_nm', width:ENUM_WIDTH.M, format:'text', filter:'text'},
        {header: '제품유형UUID', name:'prod_type_uuid', width:ENUM_WIDTH.M, format:'text', filter:'text', hidden:true},
        {header: '제품유형', name:'prod_type_nm', width:ENUM_WIDTH.M, format:'text', filter:'text'},
        {header: '품번', name:'prod_no', width:ENUM_WIDTH.M, format:'text', filter:'text', hidden:true},
        {header: '품명', name:'prod_nm', width:ENUM_WIDTH.L, format:'text', filter:'text'},
        {header: '모델', name:'model_nm', width:ENUM_WIDTH.M, format:'text', filter:'text'},
        {header: 'Rev', name:'rev', width:ENUM_WIDTH.M, format:'text', filter:'text'},
        {header: '규격', name:'prod_std', width:ENUM_WIDTH.M, format:'text', filter:'text', hidden:true},
        {header: '안전재고', name:'safe_stock', width:ENUM_WIDTH.M, format:'number', filter:'number', decimal:ENUM_DECIMAL.DEC_STCOK},
        {header: '단위UUID', name:'unit_uuid', width:ENUM_WIDTH.S, format:'text', filter:'text', hidden:true},
        {header: '단위', name:'unit_nm', width:ENUM_WIDTH.S, format:'text', filter:'text'},
        {header: '수주량', name:'qty', width:ENUM_WIDTH.M, format:'number', filter:'number'},
        {header: '미납량', name:'balance', width:ENUM_WIDTH.M, format:'number', filter:'number'},
        {header: '화폐단위UUID', name:'money_unit_uuid', width:ENUM_WIDTH.M, format:'text', filter:'text', hidden:true},
        {header: '화폐단위', name:'money_unit_nm', width:ENUM_WIDTH.M, format:'text', filter:'text'},
        {header: '단가유형UUID', name:'price_type_uuid', width:ENUM_WIDTH.M, format:'text', filter:'text', hidden:true},
        {header: '단가유형', name:'price_type_nm', width:ENUM_WIDTH.M, format:'text', filter:'text'},
        {header: '단가', name:'price', width:ENUM_WIDTH.M, format:'number', filter:'number', decimal:ENUM_DECIMAL.DEC_PRICE},
        {header: '환율', name:'exchange', width:ENUM_WIDTH.M, format:'number', filter:'number', decimal:ENUM_DECIMAL.DEC_PRICE},
      ],
      gridMode: 'select',
    },
    uriPath:'/sal/order-details',
    parentGridId: option?.parentGridId,
  }

  return result;
}


const getPI_SalOutgoOrderDetail = (option?:IPopupItemOptionProps):IPopupItemsRetrunProps => {
  let result:IPopupItemsRetrunProps = {
    modalProps:{
      title:'출하지시품목',
      visible: true,
    },
    datagridProps:{
      gridId: option?.id,
      columns:[
        {header: '출하지시UUID', name:'outgo_order_uuid', width:ENUM_WIDTH.M, format:'text', filter:'text', hidden:true},
        {header: '세부출하지시UUID', name:'outgo_order_detail_uuid', width:ENUM_WIDTH.M, format:'text', filter:'text', hidden:true},
        {header: '세부수주UUID', name:'order_detail_uuid', width:ENUM_WIDTH.M, format:'text', filter:'text', hidden:true},
        {header: '완료구분', name:'complete_state', width:ENUM_WIDTH.M, format:'text', filter:'text', align:'center'},
        {header: '품목UUID', name:'prod_uuid', width:ENUM_WIDTH.M, format:'text', filter:'text', hidden:true},
        {header: '품목유형UUID', name:'item_type_uuid', width:ENUM_WIDTH.M, format:'text', filter:'text', hidden:true},
        {header: '품목유형', name:'item_type_nm', width:ENUM_WIDTH.M, format:'text', filter:'text'},
        {header: '제품유형UUID', name:'prod_type_uuid', width:ENUM_WIDTH.M, format:'text', filter:'text', hidden:true},
        {header: '제품유형', name:'prod_type_nm', width:ENUM_WIDTH.M, format:'text', filter:'text'},
        {header: '품번', name:'prod_no', width:ENUM_WIDTH.M, format:'text', filter:'text', hidden:true},
        {header: '품명', name:'prod_nm', width:ENUM_WIDTH.L, format:'text', filter:'text'},
        {header: '모델', name:'model_nm', width:ENUM_WIDTH.M, format:'text', filter:'text'},
        {header: 'Rev', name:'rev', width:ENUM_WIDTH.M, format:'text', filter:'text'},
        {header: '규격', name:'prod_std', width:ENUM_WIDTH.M, format:'text', filter:'text', hidden:true},
        {header: '단위UUID', name:'unit_uuid', width:ENUM_WIDTH.S, format:'text', filter:'text', hidden:true},
        {header: '단위', name:'unit_nm', width:ENUM_WIDTH.S, format:'text', filter:'text'},
        {header: '수주수량', name:'order_qty', width:ENUM_WIDTH.M, format:'number', filter:'number'},
        {header: '지시수량', name:'qty', width:ENUM_WIDTH.M, format:'number', filter:'number'},
        {header: '미납수량', name:'balance', width:ENUM_WIDTH.M, format:'number', filter:'number'},
        {header: '비고', name:'remark', width:ENUM_WIDTH.M, format:'text', filter:'text'},
      ],
      gridMode: 'select',
    },
    uriPath:'/sal/outgo-order-details',
    parentGridId: option?.parentGridId,
  }

  return result;
}


const getPI_MldMold = (option?:IPopupItemOptionProps):IPopupItemsRetrunProps => {
  let result:IPopupItemsRetrunProps = {
    modalProps:{
      title:'금형관리',
      visible: true,
    },
    datagridProps:{
      gridId: option?.id,
      columns:[
        {header: '금형UUID', name:'mold_uuid', alias:'uuid', width:150, filter:'text', hidden:true},
        {header: '금형코드', name:'mold_cd', width:150, filter:'text', editable:true, requiredField:true},
        {header: '금형명', name:'mold_nm', width:ENUM_WIDTH.L, filter:'text', editable:true, requiredField:true},
        {header: '금형번호', name:'mold_no', width:ENUM_WIDTH.L, filter:'text', editable:true, requiredField:true},
        {header: 'cavity', name:'cavity', width:ENUM_WIDTH.S,  format:'number', decimal:ENUM_DECIMAL.DEC_NOMAL, editable:true, requiredField:true},
        {header: '보증타수', name:'guarantee_cnt', width:ENUM_WIDTH.S,  format:'number', decimal:ENUM_DECIMAL.DEC_NOMAL, editable:true, requiredField:true},
        {header: '기초타수', name:'basic_cnt', width:ENUM_WIDTH.S,  format:'number', decimal:ENUM_DECIMAL.DEC_NOMAL, editable:true, requiredField:true},
        {header: '제조사', name:'manufacturer', width:ENUM_WIDTH.L, filter:'text', editable:true},
        {header: '구매 일자', name:'purchase_date', width:ENUM_WIDTH.M, editable:true, format:'date'},
        {header: '금형무게', name:'weight', width:ENUM_WIDTH.S,  format:'number', decimal:ENUM_DECIMAL.DEC_NOMAL, editable:true},
        {header: '금형크기', name:'size', width:ENUM_WIDTH.L, filter:'text', editable:true},
        {header: '사용유무', name:'use_fg', width:ENUM_WIDTH.S, format:'check', editable:true, requiredField:true},
      ]
    },
    uriPath:'/mld/molds',
    params: option?.params,
    parentGridId: option?.parentGridId,
  }

  return result;
}


const getPI_MldProblem = (option?:IPopupItemOptionProps):IPopupItemsRetrunProps => {
  let result:IPopupItemsRetrunProps = {
    modalProps:{
      title:'금형문제점관리',
      visible: true,
    },
    datagridProps:{
      gridId: option?.id,
      columns:[
        {header: '금형 문제점UUID',name:'problem_uuid', hidden:true},
        {header: '금형 문제점코드',name:'problem_cd', width:ENUM_WIDTH.M, filter:'text'},
        {header: '금형 문제점명',name:'problem_nm', width:ENUM_WIDTH.L, filter:'text'},
      ]
    },
    uriPath:'/mld/problems',
    params: option?.params,
    parentGridId: option?.parentGridId,
  }

  return result;
}

const getPI_AdmBomInputType = (option?:IPopupItemOptionProps):IPopupItemsRetrunProps => {
  let result:IPopupItemsRetrunProps = {
    modalProps:{
      title:'BOM투입유형관리',
      visible: true,
    },
    datagridProps:{
      gridId: option?.id,
      columns:[
        {header: 'BOM 투입유형UUID',name:'bom_input_type_uuid', hidden:true},
        {header: 'BOM 투입유형코드',name:'bom_input_type_cd', width:ENUM_WIDTH.M, filter:'text'},
        {header: 'BOM 투입유형',name:'bom_input_type_nm', width:ENUM_WIDTH.L, filter:'text'},
      ]
    },
    uriPath:'/adm/bom-input-types',
    params: option?.params,
    parentGridId: option?.parentGridId,
  }

  return result;
}