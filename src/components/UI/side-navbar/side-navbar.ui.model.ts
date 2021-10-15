import { IMenuInfo } from "./side-navbar.ui.type";



/** 메뉴 데이터 */
export const menuData: IMenuInfo[] = [
  {
    lv:1,
    menu_type: 'page',
    component_nm: 'PgDashboard',
    menu_uri:'/dashboard',
    menu_nm:'대시보드',
    icon:'ico_nav_dashboard',
    
  },
  {
    lv:1,
    menu_type: 'menu',
    component_nm: null,
    menu_uri:'std',
    menu_nm:'기준정보',
    icon:'ico_nav_basic',
    subMenu: [
      {
        lv:2,
        menu_type:'page',
        component_nm:'PgStdFactory',
        menu_uri:'/std/factory',
        menu_nm:'공장 관리',
        icon:null,
      },
      {
        lv:2,
        menu_type:'menu',
        component_nm:null,
        menu_uri:'/group/emp',
        menu_nm:'사원 정보',
        icon:null,
        subMenu: [
          {
            lv:3,
            menu_type:'page',
            component_nm:'PgDept',
            menu_uri:'/std/dept',
            menu_nm:'부서 관리',
            icon:null,
          },
          {
            lv:3,
            menu_type:'page',
            component_nm:'PgGrade',
            menu_uri:'/std/grade',
            menu_nm:'직급 관리',
            icon:null,
          },
          {
            lv:3,
            menu_type:'page',
            component_nm:'PgEmp',
            menu_uri:'/std/emp',
            menu_nm:'사원 관리',
            icon:null,
          },
        ]
      },
      {
        lv:2,
        menu_type:'menu',
        component_nm:null,
        menu_uri:'/group/customer',
        menu_nm:'거래처 정보',
        icon:null,
        subMenu: [
          {
            lv:3,
            menu_type:'page',
            component_nm:'PgPartnerType',
            menu_uri:'/std/partner-menu_type',
            menu_nm:'거래처유형 관리',
            icon:null,
          },
          {
            lv:3,
            menu_type:'page',
            component_nm:'PgPartner',
            menu_uri:'/std/partner',
            menu_nm:'거래처 관리',
            icon:null,
          },
          {
            lv:3,
            menu_type:'page',
            component_nm:'PgPartnerProd',
            menu_uri:'/std/partner-prod',
            menu_nm:'거래처 품번 관리',
            icon:null,
          },
          {
            lv:3,
            menu_type:'page',
            component_nm:'PgSupplier',
            menu_uri:'/std/supplier',
            menu_nm:'공급처 관리',
            icon:null,
          },
          {
            lv:3,
            menu_type:'page',
            component_nm:'PgDelivery',
            menu_uri:'/std/delivery',
            menu_nm:'납품처 관리',
            icon:null,
          },
        ]
      },
      {
        lv:2,
        menu_type:'menu',
        component_nm:null,
        menu_uri:'/group/price',
        menu_nm:'단가 정보',
        icon:null,
        subMenu: [
          {
            lv:3,
            menu_type:'page',
            component_nm:'PgVendorPrice',
            menu_uri:'/std/vendor-price',
            menu_nm:'협력사단가 관리',
            icon:null,
          },
          {
            lv:3,
            menu_type:'page',
            component_nm:'PgCustomerPrice',
            menu_uri:'/std/customer-price',
            menu_nm:'고객사단가 관리',
            icon:null,
          },
          {
            lv:3,
            menu_type:'page',
            component_nm:'PgMoneyUnit',
            menu_uri:'/std/money-unit',
            menu_nm:'화폐단위 관리',
            icon:null,
          },
          {
            lv:3,
            menu_type:'page',
            component_nm:'PgPriceType',
            menu_uri:'/std/price-menu_type',
            menu_nm:'단가유형 관리',
            icon:null,
          },
        ]
      },
      {
        lv:2,
        menu_type:'page',
        component_nm:'PgProc',
        menu_uri:'/std/proc',
        menu_nm:'공정 관리',
        icon:null,
      },
      {
        lv:2,
        menu_type:'page',
        component_nm:'PgEquip',
        menu_uri:'/std/equip',
        menu_nm:'설비 관리',
        icon:null,
      },
      {
        lv:2,
        menu_type:'page',
        component_nm:'PgWorkings',
        menu_uri:'/std/workings',
        menu_nm:'작업장 관리',
        icon:null
      },
      {
        lv:2,
        menu_type:'menu',
        component_nm:null,
        menu_uri:'/group/downtime',
        menu_nm:'비가동 정보',
        icon:null,
        subMenu: [
          {
            lv:3,
            menu_type:'page',
            component_nm:'PgDowntimeType',
            menu_uri:'/std/downtimeType',
            menu_nm:'비가동 유형 관리',
            icon:null,
          },
          {
            lv:3,
            menu_type:'page',
            component_nm:'PgDowntime',
            menu_uri:'/std/downtime',
            menu_nm:'비가동 관리',
            icon:null,
          },
        ]
      },
      {
        lv:2,
        menu_type:'menu',
        component_nm:null,
        menu_uri:'/group/reject',
        menu_nm:'부적합 정보',
        icon:null,
        subMenu: [
          {
            lv:3,
            menu_type:'page',
            component_nm:'PgRejectType',
            menu_uri:'/std/reject-menu_type',
            menu_nm:'부적합 유형 관리',
            icon:null,
          },
          {
            lv:3,
            menu_type:'page',
            component_nm:'PgReject',
            menu_uri:'/std/reject',
            menu_nm:'부적합 관리',
            icon:null,
          },
          {
            lv:3,
            menu_type:'page',
            component_nm:'PgProcReject',
            menu_uri:'/std/proc-reject',
            menu_nm:'공정별 불량 관리',
            icon:null,
          },
        ]
      },
      {
        lv:2,
        menu_type:'menu',
        component_nm:null,
        menu_uri:'/group/worker',
        menu_nm:'작업자 정보',
        icon:null,
        subMenu: [
          {
            lv:3,
            menu_type:'page',
            component_nm:'PgWorker',
            menu_uri:'/std/worker',
            menu_nm:'작업자 관리',
            icon:null
          },
          {
            lv:3,
            menu_type:'page',
            component_nm:'PgWorkerGroup',
            menu_uri:'/std/worker-group',
            menu_nm:'작업조 관리',
            icon:null
          },
          {
            lv:3,
            menu_type:'page',
            component_nm:'PgShift',
            menu_uri:'/std/shift',
            menu_nm:'작업 교대',
            icon:null
          },
          {
            lv:3,
            menu_type:'page',
            component_nm:'PgWorkerGroupWorker',
            menu_uri:'/std/worker-group-workers',
            menu_nm:'작업조-작업자',
            icon:null
          },
        ]
      },
      {
        lv:2,
        menu_type:'menu',
        component_nm:null,
        menu_uri:'/group/inspitem',
        menu_nm:'검사기준 정보',
        icon:null,
        subMenu: [
          {
            lv:3,
            menu_type:'page',
            component_nm:'PgInspItemType',
            menu_uri:'/std/inspitem-menu_type',
            menu_nm:'검사항목 유형 관리',
            icon:null,
          },
          {
            lv:3,
            menu_type:'page',
            component_nm:'PgInspTool',
            menu_uri:'/std/inspTool',
            menu_nm:'검사구 관리',
            icon:null,
          },
          {
            lv:3,
            menu_type:'page',
            component_nm:'PgInspMethod',
            menu_uri:'/std/inspMethod',
            menu_nm:'검사방법 관리',
            icon:null,
          },
          {
            lv:3,
            menu_type:'page',
            component_nm:'PgInspItem',
            menu_uri:'/std/inspitem',
            menu_nm:'검사항목 관리',
            icon:null,
          },
        ]
      },
      {
        lv:2,
        menu_type:'page',
        component_nm:'PgStore',
        menu_uri:'/std/store',
        menu_nm:'창고 관리',
        icon:null,
      },
      {
        lv:2,
        menu_type:'page',
        component_nm:'PgLocation',
        menu_uri:'/std/location',
        menu_nm:'위치 관리',
        icon:null,
      },
      {
        lv:2,
        menu_type:'menu',
        component_nm:null,
        menu_uri:'/group/unit',
        menu_nm:'단위 관리',
        icon:null,
        subMenu: [
          {
            lv:3,
            menu_type:'page',
            component_nm:'PgUnit',
            menu_uri:'/std/unit',
            menu_nm:'단위 관리',
            icon:null,
          },
          {
            lv:3,
            menu_type:'page',
            component_nm:'PgUnitConvert',
            menu_uri:'/std/unit-convert',
            menu_nm:'단위변환 관리',
            icon:null,
          },
        ]
      },
      {
        lv:2,
        menu_type:'menu',
        component_nm:null,
        menu_uri:'/group/prod',
        menu_nm:'품목 정보',
        icon:null,
        subMenu: [
          {
            lv:3,
            menu_type:'page',
            component_nm:'PgItemType',
            menu_uri:'/std/item-menu_type',
            menu_nm:'품목유형 관리',
            icon:null,
          },
          {
            lv:3,
            menu_type:'page',
            component_nm:'PgProdType',
            menu_uri:'/std/prod-menu_type',
            menu_nm:'제품유형 관리',
            icon:null,
          },
          {
            lv:3,
            menu_type:'page',
            component_nm:'PgModel',
            menu_uri:'/std/model',
            menu_nm:'모델 관리',
            icon:null,
          },
          {
            lv:3,
            menu_type:'page',
            component_nm:'PgProd',
            menu_uri:'/std/prod',
            menu_nm:'품목 관리',
            icon:null,
          },
        ]
      },
      {
        lv:2,
        menu_type:'page',
        component_nm:'PgBom',
        menu_uri:'/std/bom',
        menu_nm:'BOM관리',
        icon:null,
      },
      { 
        lv:2,
        menu_type: 'menu',
        component_nm:null,
        menu_uri:'/group/routing',
        menu_nm:'라우팅 정보',
        icon:null,
        subMenu: [
          {
            lv:3,
            menu_type:'page',
            component_nm:'PgRouting',
            menu_uri:'/std/routing',
            menu_nm:'라우팅 관리',
            icon:null,
          },
          {
            lv:3,
            menu_type:'page',
            component_nm:'PgRoutingResource',
            menu_uri:'/std/routing-resource',
            menu_nm:'생산자원 정보 관리',
            icon:null,
          },
          {
            lv:3,
            menu_type:'page',
            component_nm:'PgRoutingWorking',
            menu_uri:'/std/routing-working',
            menu_nm:'품목별 작업장 관리',
            icon:null,
          },
        ]
      },
    ]
  },
  // {
  //   lv:1,
  //   menu_type:'menu',
  //   component_nm:null,
  //   menu_uri:'std',
  //   menu_nm:'사양관리',
  //   icon:'ico_nav_basic',
  //   subMenu: [
  //     {
  //       lv:2,
  //       menu_type:'menu',
  //       component_nm:null,
  //       menu_uri:'/group/prod',
  //       menu_nm:'품목 정보',
  //       icon:null,
  //       subMenu: [
  //         {
  //           lv:3,
  //           menu_type:'page',
  //           component_nm:'PgItemType',
  //           menu_uri:'/std/item-menu_type',
  //           menu_nm:'품목유형 관리',
  //           icon:null,
  //         },
  //         {
  //           lv:3,
  //           menu_type:'page',
  //           component_nm:'PgProdType',
  //           menu_uri:'/std/prod-menu_type',
  //           menu_nm:'제품유형 관리',
  //           icon:null,
  //         },
  //         {
  //           lv:3,
  //           menu_type:'page',
  //           component_nm:'PgModel',
  //           menu_uri:'/std/model',
  //           menu_nm:'모델 관리',
  //           icon:null,
  //         },
  //         {
  //           lv:3,
  //           menu_type:'page',
  //           component_nm:'PgProd',
  //           menu_uri:'/std/prod',
  //           menu_nm:'품목 관리',
  //           icon:null,
  //         },
  //       ]
  //     },
  //     {
  //       lv:2,
  //       menu_type:'page',
  //       component_nm:'PgBom',
  //       menu_uri:'/std/bom',
  //       menu_nm:'BOM관리',
  //       icon:null,
  //     },
  //     { 
  //       lv:2,
  //       menu_type: 'menu',
  //       component_nm:null,
  //       menu_uri:'/group/routing',
  //       menu_nm:'라우팅 정보',
  //       icon:null,
  //       subMenu: [
  //         {
  //           lv:3,
  //           menu_type:'page',
  //           component_nm:'PgRouting',
  //           menu_uri:'/std/routing',
  //           menu_nm:'라우팅 관리',
  //           icon:null,
  //         },
  //         {
  //           lv:3,
  //           menu_type:'page',
  //           component_nm:'PgRoutingResource',
  //           menu_uri:'/std/routing-resource',
  //           menu_nm:'생산자원 정보 관리',
  //           icon:null,
  //         },
  //         {
  //           lv:3,
  //           menu_type:'page',
  //           component_nm:'PgRoutingWorking',
  //           menu_uri:'/std/routing-working',
  //           menu_nm:'품목별 작업장 관리',
  //           icon:null,
  //         },
  //       ]
  //     },
  //   ]
  // },

  {
    lv:1,
    menu_type:'menu',
    component_nm:null,
    menu_uri:'mat',
    menu_nm:'자재관리',
    icon:'ico_nav_material',
    subMenu: [
      {
        lv:2,
        menu_type:'menu',
        component_nm:null,
        menu_uri:'/group/order',
        menu_nm:'발주관리',
        icon:null,
        subMenu: [
          {
            lv:3,
            menu_type:'page',
            component_nm:'PgMatOrder',
            menu_uri:'/mat/order',
            menu_nm:'발주등록',
            icon:null,
          },
          {
            lv:3,
            menu_type:'page',
            component_nm:'PgOrderReport',
            menu_uri:'/mat/orders/report',
            menu_nm:'발주현황',
            icon:null,
          },
          
        ],
      },
      {
        lv:2,
        menu_type:'menu',
        component_nm:null,
        menu_uri:'/group/receive',
        menu_nm:'입하관리',
        icon:null,
        subMenu: [
          {
            lv:3,
            menu_type:'page',
            component_nm:'PgReceive',
            menu_uri:'/mat/receive',
            menu_nm:'입하등록',
            icon:null,
          },
          {
            lv:3,
            menu_type:'page',
            component_nm:'PgReceiveReport',
            menu_uri:'/mat/receives/report',
            menu_nm:'입하현황',
            icon:null,
          },
          
        ]
      },
      {
        lv:2,
        menu_type:'menu',
        component_nm:null,
        menu_uri:'/group/return',
        menu_nm:'반출관리',
        icon:null,
        subMenu: [
          {
            lv:3,
            menu_type:'page',
            component_nm:'PgMatReturn',
            menu_uri:'/mat/mat-return',
            menu_nm:'반출등록',
            icon:null,
          },
          {
            lv:3,
            menu_type:'page',
            component_nm:'PgReturnReport',
            menu_uri:'/mat/returns/report',
            menu_nm:'반출현황',
            icon:null,
          },
          
        ]
      },
      {
        lv:2,
        menu_type:'menu',
        component_nm:null,
        menu_uri:'/group/release',
        menu_nm:'자재공정출고관리',
        icon:null,
        subMenu: [
          {
            lv:3,
            menu_type:'page',
            component_nm:'PgRelease',
            menu_uri:'/mat/release',
            menu_nm:'자재공정출고등록',
            icon:null,
          },
          {
            lv:3,
            menu_type:'page',
            component_nm:'PgReleaseReport',
            menu_uri:'/mat/releases/report',
            menu_nm:'자재공정출고현황',
            icon:null,
          },
        ]
      },
    ]
  },
  {
    lv:1,
    menu_type:'menu',
    component_nm:null,
    menu_uri:'out',
    menu_nm:'외주관리',
    icon:'ico_nav_outsourcing',
    subMenu: [
      {
        lv:2,
        menu_type:'menu',
        component_nm:null,
        menu_uri:'/group/release',
        menu_nm:'외주출고관리',
        icon:null,
        subMenu: [
          {
            lv:3,
            menu_type:'page',
            component_nm:'PgOutRelease',
            menu_uri:'/out/out-release',
            menu_nm:'외주출고등록',
            icon:null,
          },
          {
            lv:3,
            menu_type:'page',
            component_nm:'PgOutReleaseReport',
            menu_uri:'/out/out-release-report',
            menu_nm:'외주출고현황',
            icon:null,
          },
        ]
      },
      {
        lv:2,
        menu_type:'menu',
        component_nm:null,
        menu_uri:'/group/receive',
        menu_nm:'외주입고관리',
        icon:null,
        subMenu: [
          {
            lv:3,
            menu_type:'page',
            component_nm:'PgOutReceive',
            menu_uri:'/out/out-receive',
            menu_nm:'외주입고등록',
            icon:null,
          },
          {
            lv:3,
            menu_type:'page',
            component_nm:'PgOutReceiveReport',
            menu_uri:'/out/receives/report',
            menu_nm:'외주입고현황',
            icon:null,
          },
        ]
      },
    ]
  },
  {
    lv:1,
    menu_type:'menu',
    component_nm:null,
    menu_uri:'prd',
    menu_nm:'생산관리',
    icon:'ico_nav_production',
    subMenu: [
      {
        lv:2,
        menu_type:'page',
        component_nm:'PgPrdOrder',
        menu_uri:'/prd/order',
        menu_nm:'작업지시관리',
        icon:null,
      },
      {
        lv:2,
        menu_type:'page',
        component_nm:'PgDemand',
        menu_uri:'/prd/demand',
        menu_nm:'자재출고요청',
        icon:null,
      },
      {
        lv:2,
        menu_type:'page',
        component_nm:'PgReturn',
        menu_uri:'/prd/return',
        menu_nm:'자재반납등록',
        icon:null,
      },
      {
        lv:2,
        menu_type:'page',
        component_nm:'PgWork',
        menu_uri:'/prd/work',
        menu_nm:'생산실적관리',
        icon:null,
      },
    ]
  },
  {
    lv:1,
    menu_type:'menu',
    component_nm:null,
    menu_uri:'sal',
    menu_nm:'제품관리',
    icon:'ico_nav_product',
    subMenu: [
      {
        lv:2,
        menu_type:'menu',
        component_nm:null,
        menu_uri:'/group/order',
        menu_nm:'수주관리',
        icon:null,
        subMenu: [
          {
            lv:3,
            menu_type:'page',
            component_nm:'PgSalOrder',
            menu_uri:'/sal/sal-order',
            menu_nm:'수주등록',
            icon:null,
          },
          {
            lv:3,
            menu_type:'page',
            component_nm:'PgSalOrdersReport',
            menu_uri:'/sal/orders/report',
            menu_nm:'수주현황',
            icon:null,
          },
        ]
      },
      {
        lv:2,
        menu_type:'menu',
        component_nm:null,
        menu_uri:'/group/income',
        menu_nm:'제품입고관리',
        icon:null,
        subMenu: [
          {
            lv:3,
            menu_type:'page',
            component_nm:'PgIncome',
            menu_uri:'/sal/income',
            menu_nm:'제품입고등록',
            icon:null,
          },
          {
            lv:3,
            menu_type:'page',
            component_nm:'PgSalIncomesReport',
            menu_uri:'/sal/incomes/report',
            menu_nm:'제품입고현황',
            icon:null,
          },
        ]
      },
      {
        lv:2,
        menu_type:'menu',
        component_nm:null,
        menu_uri:'/group/outgo-order',
        menu_nm:'제품출하지시관리',
        icon:null,
        subMenu: [
          {
            lv:3,
            menu_type:'page',
            component_nm:'PgOutgoOrder',
            menu_uri:'/sal/outgo-order',
            menu_nm:'제품출하지시등록',
            icon:null,
          },
        ]
      },
      {
        lv:2,
        menu_type:'menu',
        component_nm:null,
        menu_uri:'/group/release',
        menu_nm:'제품출고관리',
        icon:null,
        subMenu: [
          {
            lv:3,
            menu_type:'page',
            component_nm:'PgSalRelease',
            menu_uri:'/sal/release',
            menu_nm:'제품출고등록',
            icon:null,
          },
          {
            lv:3,
            menu_type:'page',
            component_nm:'PgSalReleaseReport',
            menu_uri:'/sal/releases/report',
            menu_nm:'제품출고현황',
            icon:null,
          },
        ]
      },
      {
        lv:2,
        menu_type:'menu',
        component_nm:null,
        menu_uri:'/group/outgo',
        menu_nm:'제품출하관리',
        icon:null,
        subMenu: [
          {
            lv:3,
            menu_type:'page',
            component_nm:'PgOutgo',
            menu_uri:'/sal/outgo',
            menu_nm:'제품출하등록',
            icon:null,
          },
          {
            lv:3,
            menu_type:'page',
            component_nm:'PgSalOutgoReport',
            menu_uri:'/sal/outgos/report',
            menu_nm:'제품출하현황',
            icon:null,
          },
        ]
      },
      {
        lv:2,
        menu_type:'menu',
        component_nm:null,
        menu_uri:'/group/sal-return',
        menu_nm:'제품반입',
        icon:null,
        subMenu: [
          {
            lv:3,
            menu_type:'page',
            component_nm:'PgSalReturn',
            menu_uri:'/sal/sal-return',
            menu_nm:'제품반입등록',
            icon:null,
          },
          {
            lv:3,
            menu_type:'page',
            component_nm:'PgSalReturnReport',
            menu_uri:'/sal/sal-returns/report',
            menu_nm:'제품반입현황',
            icon:null,
          },
        ]
      },
    ]
  },
  
  {
    lv:1,
    menu_type:'menu',
    component_nm:null,
    menu_uri:'qms',
    menu_nm:'QMS',
    icon:'ico_nav_qms',
    subMenu: [
      {
        lv:2,
        menu_type:'page',
        component_nm:'PgInsp',
        menu_uri:'/qms/insp',
        menu_nm:'검사기준서 관리',
        icon:null,
      },
      {
        lv:2,
        menu_type:'menu',
        component_nm:null,
        menu_uri:'/group/receive/insp-result',
        menu_nm:'수입검사 정보',
        icon:null,
        subMenu: [
          {
            lv:3,
            menu_type:'page',
            component_nm:'PgRecevieInspResult',
            menu_uri:'/qms/receive/insp-result',
            menu_nm:'수입검사성적서 관리',
            icon:null,
          },
          {
            lv:3,
            menu_type:'page',
            component_nm:'PgRecevieInspResultReport',
            menu_uri:'/qms/receive/insp-result/report',
            menu_nm:'수입검사성적서 결과조회',
            icon:null, 
          }
        ]
      },
      {
        lv:2,
        menu_type:'menu',
        component_nm:null,
        menu_uri:'/group/proc/insp-result',
        menu_nm:'공정검사 정보',
        icon:null,
        subMenu: [
          {
            lv:3,
            menu_type:'page',
            component_nm:'PgProcInspResult',
            menu_uri:'/qms/proc/insp-result',
            menu_nm:'공정검사성적서 관리',
            icon:null,
          },
          {
            lv:3,
            menu_type:'page',
            component_nm:'PgProcInspResultReport',
            menu_uri:'/qms/proc/insp-result/report',
            menu_nm:'공정검사성적서 결과조회',
            icon:null,
          }
        ]
      },
      {
        lv:2,
        menu_type:'menu',
        component_nm:null,
        menu_uri:'/group/final/insp-result',
        menu_nm:'최종검사 정보',
        icon:null,
        subMenu: [
          {
            lv:3,
            menu_type:'page',
            component_nm:'PgFinalInspResult',
            menu_uri:'/qms/final/insp-result',
            menu_nm:'최종검사성적서 관리',
            icon:null,
          },
          {
            lv:3,
            menu_type:'page',
            component_nm:'PgFinalInspResultReport',
            menu_uri:'/qms/final/insp-result/report',
            menu_nm:'최종검사성적서 결과조회',
            icon:null,
          }
        ]
      },
      {
        lv:2,
        menu_type:'menu',
        component_nm:null,
        menu_uri:'/group/rework',
        menu_nm:'부적합품 판정 정보',
        icon:null,
        subMenu: [
          {
            lv:3,
            menu_type:'page',
            component_nm:'PgRework',
            menu_uri:'/qms/rework',
            menu_nm:'부적합품 판정 관리',
            icon:null,
          },
          {
            lv:3,
            menu_type:'page',
            component_nm:'PgReworkReport',
            menu_uri:'/qms/rework/report',
            menu_nm:'부적합품 판정 결과조회',
            icon:null,
          }
        ]
      },
    ]
  },
  
  {
    lv:1,
    menu_type:'menu',
    component_nm:null,
    menu_uri:'KPI',
    menu_nm:'KPI',
    icon:'ico_nav_kpi',
  },
  
  {
    lv:1,
    menu_type:'menu',
    component_nm:null,
    menu_uri:'mon',
    menu_nm:'모니터링',
    icon:'ico_nav_monitoring',
  },
  {
    lv:1,
    menu_type:'menu',
    component_nm:null,
    menu_uri:'inv',
    menu_nm:'창고관리',
    icon:'ico_nav_store',
    subMenu: [
      {
        lv:2,
        menu_type:'page',
        component_nm:'PgMove',
        menu_uri:'/inv/move',
        menu_nm:'재고이동등록',
        icon:null,
      },
      {
        lv:2,
        menu_type:'page',
        component_nm:'PgInvStore',
        menu_uri:'/inv/store',
        menu_nm:'재고실사등록',
        icon:null,
      },
      {
        lv:2,
        menu_type:'page',
        component_nm:'PgStockReject',
        menu_uri:'/inv/stock-reject',
        menu_nm:'재고부적합관리',
        icon:null,
      },
    ]
  },
  
  {
    lv:1,
    menu_type:'menu',
    component_nm:null,
    menu_uri:'debug',
    menu_nm:'DEBUG',
    icon:'ico_nav_corporate',
  },
];