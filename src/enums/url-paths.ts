const URL_PATH = {
  ADM: {
    BOM_TYPE: {
      GET: {
        /** UUID 문자열 변환 필요 */
        BOM_TYPE: '/adm/bom-type/{uuid}',
        BOM_TYPES: '/adm/bom-types',
      },
      POST: {
        BOM_TYPES: '/adm/bom-types',
      },
      PUT: {
        BOM_TYPES: '/adm/bom-types',
      },
      PATCH: {
        BOM_TYPES: '/adm/bom-types',
      },
      DELETE: {
        BOM_TYPES: '/adm/bom-types',
      },
    },
    BOM_INPUT_TYPE: {
      GET: {
        /** UUID 문자열 변환 필요 */
        BOM_INPUT_TYPE: '/adm/bom-input-type/{uuid}',
        BOM_INPUT_TYPES: '/adm/bom-input-types',
      },
      POST: {
        BOM_INPUT_TYPES: '/adm/bom-input-types',
      },
      PUT: {
        BOM_INPUT_TYPES: '/adm/bom-input-types',
      },
      PATCH: {
        BOM_INPUT_TYPES: '/adm/bom-input-types',
      },
      DELETE: {
        BOM_INPUT_TYPES: '/adm/bom-input-types',
      },
    },
    INSP_TYPE: {
      GET: {
        /** UUID 문자열 변환 필요 */
        INSP_TYPE: '/adm/insp-type/{uuid}',
        INSP_TYPES: '/adm/insp-types',
      },
      POST: {
        INSP_TYPES: '/adm/insp-types',
      },
      PUT: {
        INSP_TYPES: '/adm/insp-types',
      },
      PATCH: {
        INSP_TYPES: '/adm/insp-types',
      },
      DELETE: {
        INSP_TYPES: '/adm/insp-types',
      },
    },
    INSP_HANDLING_TYPE: {
      GET: {
        /** UUID 문자열 변환 필요 */
        INSP_HANDLING_TYPE: '/adm/insp-handling-type/{uuid}',
        INSP_HANDLING_TYPES: '/adm/insp-handling-types',
      },
      POST: {
        INSP_HANDLING_TYPES: '/adm/insp-handling-types',
      },
      PUT: {
        INSP_HANDLING_TYPES: '/adm/insp-handling-types',
      },
      PATCH: {
        INSP_HANDLING_TYPES: '/adm/insp-handling-types',
      },
      DELETE: {
        INSP_HANDLING_TYPES: '/adm/insp-handling-types',
      },
    },
    PRD_PLAN_TYPE: {
      GET: {
        /** UUID 문자열 변환 필요 */
        PRD_PLAN_TYPE: '/adm/prd-plan-type/{uuid}',
        PRD_PLAN_TYPES: '/adm/prd-plan-types',
      },
      POST: {
        PRD_PLAN_TYPES: '/adm/prd-plan-types',
      },
      PUT: {
        PRD_PLAN_TYPES: '/adm/prd-plan-types',
      },
      PATCH: {
        PRD_PLAN_TYPES: '/adm/prd-plan-types',
      },
      DELETE: {
        PRD_PLAN_TYPES: '/adm/prd-plan-types',
      },
    },
    INSP_DETAIL_TYPE: {
      GET: {
        /** UUID 문자열 변환 필요 */
        INSP_DETAIL_TYPE: '/adm/insp-detail-type/{uuid}',
        INSP_DETAIL_TYPES: '/adm/insp-detail-types',
      },
      POST: {
        INSP_DETAIL_TYPES: '/adm/insp-detail-types',
      },
      PUT: {
        INSP_DETAIL_TYPES: '/adm/insp-detail-types',
      },
      PATCH: {
        INSP_DETAIL_TYPES: '/adm/insp-detail-types',
      },
      DELETE: {
        INSP_DETAIL_TYPES: '/adm/insp-detail-types',
      },
    },
    TRAN_TYPE: {
      GET: {
        /** UUID 문자열 변환 필요 */
        TRAN_TYPE: '/adm/tran-type/{uuid}',
        TRAN_TYPES: '/adm/tran-types',
      },
      POST: {
        TRAN_TYPES: '/adm/tran-types',
      },
      PUT: {
        TRAN_TYPES: '/adm/tran-types',
      },
      PATCH: {
        TRAN_TYPES: '/adm/tran-types',
      },
      DELETE: {
        TRAN_TYPES: '/adm/tran-types',
      },
    },
    DEMAND_TYPE: {
      GET: {
        /** UUID 문자열 변환 필요 */
        DEMAND_TYPE: '/adm/demand-type/{uuid}',
        DEMAND_TYPES: '/adm/demand-types',
      },
      POST: {
        DEMAND_TYPES: '/adm/demand-types',
      },
      PUT: {
        DEMAND_TYPES: '/adm/demand-types',
      },
      PATCH: {
        DEMAND_TYPES: '/adm/demand-types',
      },
      DELETE: {
        DEMAND_TYPES: '/adm/demand-types',
      },
    },
    PATTERN_OPT: {
      GET: {
        /** UUID 문자열 변환 필요 */
        PATTERN_OPT: '/adm/pattern-opt/{uuid}',
        PATTERN_OPTS: '/adm/pattern-opts',
      },
      POST: {
        PATTERN_OPTS: '/adm/pattern-opts',
      },
      PUT: {
        PATTERN_OPTS: '/adm/pattern-opts',
      },
      PATCH: {
        PATTERN_OPTS: '/adm/pattern-opts',
      },
      DELETE: {
        PATTERN_OPTS: '/adm/pattern-opts',
      },
    },
    REWORK_TYPE: {
      GET: {
        /** UUID 문자열 변환 필요 */
        REWORK_TYPE: '/adm/rework-type/{uuid}',
        REWORK_TYPES: '/adm/rework-types',
      },
      POST: {
        REWORK_TYPES: '/adm/rework-types',
      },
      PUT: {
        REWORK_TYPES: '/adm/rework-types',
      },
      PATCH: {
        REWORK_TYPES: '/adm/rework-types',
      },
      DELETE: {
        REWORK_TYPES: '/adm/rework-types',
      },
    },
    STORE_TYPE: {
      GET: {
        /** UUID 문자열 변환 필요 */
        STORE_TYPE: '/adm/store-type/{uuid}',
        STORE_TYPES: '/adm/store-types',
      },
      POST: {
        STORE_TYPES: '/adm/store-types',
      },
      PUT: {
        STORE_TYPES: '/adm/store-types',
      },
      PATCH: {
        STORE_TYPES: '/adm/store-types',
      },
      DELETE: {
        STORE_TYPES: '/adm/store-types',
      },
    },
    COMPANY_OPT: {
      GET: {
        /** UUID 문자열 변환 필요 */
        COMPANY_OPT: '/adm/company-opt/{uuid}',
        COMPANY_OPTS: '/adm/company-opts',
      },
      POST: {
        COMPANY_OPTS: '/adm/company-opts',
      },
      PUT: {
        COMPANY_OPTS: '/adm/company-opts',
      },
      PATCH: {
        COMPANY_OPTS: '/adm/company-opts',
      },
      DELETE: {
        COMPANY_OPTS: '/adm/company-opts',
      },
    },
    CYCLE_UNIT: {
      GET: {
        /** UUID 문자열 변환 필요 */
        CYCLE_UNIT: '/adm/cycle-unit/{uuid}',
        CYCLE_UNITS: '/adm/cycle-units',
      },
      POST: {
        CYCLE_UNITS: '/adm/cycle-units',
      },
      PUT: {
        CYCLE_UNITS: '/adm/cycle-units',
      },
      PATCH: {
        CYCLE_UNITS: '/adm/cycle-units',
      },
      DELETE: {
        CYCLE_UNITS: '/adm/cycle-units',
      },
    },
    DAILY_INSP_CYCLE: {
      GET: {
        /** UUID 문자열 변환 필요 */
        DAILY_INSP_CYCLE: '/adm/daily-insp-cycle/{uuid}',
        DAILY_INSP_CYCLES: '/adm/daily-insp-cycles',
      },
      POST: {
        DAILY_INSP_CYCLES: '/adm/daily-insp-cycles',
      },
      PUT: {
        DAILY_INSP_CYCLES: '/adm/daily-insp-cycles',
      },
      PATCH: {
        DAILY_INSP_CYCLES: '/adm/daily-insp-cycles',
      },
      DELETE: {
        DAILY_INSP_CYCLES: '/adm/daily-insp-cycles',
      },
    },
    FILE_MGMT: {
      GET: {
        /** UUID 문자열 변환 필요 */
        FILE_MGMT: '/adm/file-mgmt/{uuid}',
        PLURAL_FILE_MGMT: '/adm/file-mgmts',
      },
      POST: {
        PLURAL_FILE_MGMT: '/adm/file-mgmts',
      },
      PUT: {
        PLURAL_FILE_MGMT: '/adm/file-mgmts',
      },
      PATCH: {
        PLURAL_FILE_MGMT: '/adm/file-mgmts',
      },
      DELETE: {
        PLURAL_FILE_MGMT: '/adm/file-mgmts',
      },
    },
    FILE_MGMT_TYPE: {
      GET: {
        /** UUID 문자열 변환 필요 */
        FILE_MGMT_TYPE: '/adm/file-mgmt-type/{uuid}',
        FILE_MGMT_TYPES: '/adm/file-mgmt-types',
      },
      POST: {
        FILE_MGMT_TYPES: '/adm/file-mgmt-types',
      },
      PUT: {
        FILE_MGMT_TYPES: '/adm/file-mgmt-types',
      },
      PATCH: {
        FILE_MGMT_TYPES: '/adm/file-mgmt-types',
      },
      DELETE: {
        FILE_MGMT_TYPES: '/adm/file-mgmt-types',
      },
    },
    FILE_MANAGEMENT_DETAIL_TYPE: {
      GET: {
        /** UUID 문자열 변환 필요 */
        FILE_MGMT_DETAIL_TYPE: '/adm/file-mgmt-detail-type/{uuid}',
        FILE_MANAGEMENT_DETAIL_TYPES: '/adm/file-mgmt-detail-types',
      },
      POST: {
        FILE_MANAGEMENT_DETAIL_TYPES: '/adm/file-mgmt-detail-types',
      },
      PUT: {
        FILE_MANAGEMENT_DETAIL_TYPES: '/adm/file-mgmt-detail-types',
      },
      PATCH: {
        FILE_MANAGEMENT_DETAIL_TYPES: '/adm/file-mgmt-detail-types',
      },
      DELETE: {
        FILE_MANAGEMENT_DETAIL_TYPES: '/adm/file-mgmt-detail-types',
      },
    },
    INTERFACE_STATE: {
      GET: {
        /** UUID 문자열 변환 필요 */
        INTERFACE_STATE: '/adm/interface-state/{uuid}',
        INTERFACE_STATES: '/adm/interface-states',
      },
      POST: {
        INTERFACE_STATES: '/adm/interface-states',
      },
      PUT: {
        INTERFACE_STATES: '/adm/interface-states',
      },
      PATCH: {
        INTERFACE_STATES: '/adm/interface-states',
      },
      DELETE: {
        INTERFACE_STATES: '/adm/interface-states',
      },
    },
  },
  INV: {
    STORE: {
      GET: {
        /** UUID 문자열 변환 필요 */
        STORE: '/inv/store/{uuid}',
        STORES: '/inv/stores',
        TOTAL_HISTORY: '/inv/stores/total-history',
        INDIVIDUAL_HISTORY: '/inv/stores/individual-history',
        TYPE_HISTORY: '/inv/stores/type-history',
        HISTORY_BY_TRANSACTION: '/inv/stores/history-by-transaction',
        STOCKS_RETURN: '/inv/stores/stocks/return',
        STOCKS: '/inv/stores/stocks',
      },
      POST: {
        STORES: '/inv/stores',
      },
      PUT: {
        STORES: '/inv/stores',
      },
      PATCH: {
        STORES: '/inv/stores',
      },
      DELETE: {
        STORES: '/inv/stores',
      },
    },
    STOCK_REJECT: {
      GET: {
        /** UUID 문자열 변환 필요 */
        STOCK_REJECT: '/inv/stock-reject/{uuid}',
        STOCK_REJECTS: '/inv/stock-rejects',
      },
      POST: {
        STOCK_REJECTS: '/inv/stock-rejects',
      },
      PUT: {
        STOCK_REJECTS: '/inv/stock-rejects',
      },
      PATCH: {
        STOCK_REJECTS: '/inv/stock-rejects',
      },
      DELETE: {
        STOCK_REJECTS: '/inv/stock-rejects',
      },
    },
    MOVE: {
      GET: {
        /** UUID 문자열 변환 필요 */
        MOVE: '/inv/move/{uuid}',
        MOVES: '/inv/moves',
      },
      POST: {
        MOVES: '/inv/moves',
      },
      PUT: {
        MOVES: '/inv/moves',
      },
      PATCH: {
        MOVES: '/inv/moves',
      },
      DELETE: {
        MOVES: '/inv/moves',
      },
    },
  },
  MAT: {
    RELEASE: {
      GET: {
        /** UUID 문자열 변환 필요 */
        RELEASE: '/mat/release/{uuid}',
        RELEASES: '/mat/releases',
        REPORT: '/mat/releases/report',
      },
      POST: {
        RELEASES: '/mat/releases',
      },
      PUT: {
        RELEASES: '/mat/releases',
      },
      PATCH: {
        RELEASES: '/mat/releases',
      },
      DELETE: {
        RELEASES: '/mat/releases',
      },
    },
    RETURN: {
      GET: {
        /** UUID 문자열 변환 필요 */
        RETURN: '/mat/return/{uuid}',
        RETURNS: '/mat/returns',
        REPORT: '/mat/returns/report',
        /** UUID 문자열 변환 필요 */
        DETAILS: '/mat/return/{uuid}/details',
        /** UUID 문자열 변환 필요 */
        INCLUDE_DETAILS: '/mat/return/{uuid}/include-details',
      },
      POST: {
        RETURNS: '/mat/returns',
      },
      PUT: {
        RETURNS: '/mat/returns',
      },
      PATCH: {
        RETURNS: '/mat/returns',
      },
      DELETE: {
        RETURNS: '/mat/returns',
      },
    },
    RETURN_DETAIL: {
      GET: {
        /** UUID 문자열 변환 필요 */
        RETURN_DETAIL: '/mat/return-detail/{uuid}',
        RETURN_DETAILS: '/mat/return-details',
      },
    },
    ORDER: {
      GET: {
        REPORT: '/mat/orders/report',
        /** UUID 문자열 변환 필요 */
        ORDER: '/mat/order/{uuid}',
        ORDERS: '/mat/orders',
        /** UUID 문자열 변환 필요 */
        DETAILS: '/mat/order/{uuid}/details',
        /** UUID 문자열 변환 필요 */
        INCLUDE_DETAILS: '/mat/order/{uuid}/include-details',
      },
      POST: {
        ORDERS: '/mat/orders',
      },
      PUT: {
        ORDERS: '/mat/orders',
      },
      PATCH: {
        ORDERS: '/mat/orders',
      },
      DELETE: {
        ORDERS: '/mat/orders',
      },
    },
    ORDER_DETAIL: {
      GET: {
        /** UUID 문자열 변환 필요 */
        ORDER_DETAIL: '/mat/order-detail/{uuid}',
        ORDER_DETAILS: '/mat/order-details',
      },
      PUT: {
        COMPLETE: '/mat/order-details/complete',
      },
    },
    RECEIVE: {
      GET: {
        /** UUID 문자열 변환 필요 */
        RECEIVE: '/mat/receive/{uuid}',
        RECEIVES: '/mat/receives',
        LOT_TRACKING: '/mat/receives/lot-tracking',
        REPORT: '/mat/receives/report',
        /** UUID 문자열 변환 필요 */
        DETAILS: '/mat/receive/{uuid}/details',
        /** UUID 문자열 변환 필요 */
        INCLUDE_DETAILS: '/mat/receive/{uuid}/include-details',
      },
      POST: {
        RECEIVES: '/mat/receives',
      },
      PUT: {
        RECEIVES: '/mat/receives',
      },
      PATCH: {
        RECEIVES: '/mat/receives',
      },
      DELETE: {
        RECEIVES: '/mat/receives',
      },
    },
    RECEIVE_DETAIL: {
      GET: {
        /** UUID 문자열 변환 필요 */
        RECEIVE_DETAIL: '/mat/receive-detail/{uuid}',
        RECEIVE_DETAILS: '/mat/receive-details',
      },
    },
  },
  OUT: {
    RECEIVE: {
      GET: {
        REPORT: '/out/receives/report',
        /** UUID 문자열 변환 필요 */
        RECEIVE: '/out/receive/{uuid}',
        RECEIVES: '/out/receives',
        /** UUID 문자열 변환 필요 */
        DETAILS: '/out/receive/{uuid}/details',
        /** UUID 문자열 변환 필요 */
        INCLUDE_DETAILS: '/out/receive/{uuid}/include-details',
      },
      POST: {
        RECEIVES: '/out/receives',
      },
      PUT: {
        RECEIVES: '/out/receives',
      },
      PATCH: {
        RECEIVES: '/out/receives',
      },
      DELETE: {
        RECEIVES: '/out/receives',
      },
    },
    RECEIVE_DETAIL: {
      GET: {
        /** UUID 문자열 변환 필요 */
        RECEIVE_DETAIL: '/out/receive-detail/{uuid}',
        RECEIVE_DETAILS: '/out/receive-details',
      },
    },
    RELEASE: {
      REPORT: '/out/releases/report',
      /** UUID 문자열 변환 필요 */
      RELEASE: '/out/release/{uuid}',
      RELEASES: '/out/releases',
      /** UUID 문자열 변환 필요 */
      DETAILS: '/out/release/{uuid}/details',
      /** UUID 문자열 변환 필요 */
      INCLUDE_DETAILS: '/out/release/{uuid}/include-details',
    },
    RELEASES_DETAIL: {
      GET: {
        /** UUID 문자열 변환 필요 */
        RELEASES_DETAIL: '/out/release-detail/{uuid}',
        RELEASE_DETAILS: '/out/release-details',
      },
    },
  },
  PRD: {
    WORK: {
      GET: {
        REPORT: '/prd/works/report',
        /** UUID 문자열 변환 필요 */
        WORK: '/prd/work/{uuid}',
        WORKS: '/prd/works',
      },
      POST: {
        WORKS: '/prd/works',
      },
      PUT: {
        CANCEL_COMPLETE: '/prd/works/cancel-complete',
        COMPLETE: '/prd/works/complete',
        WORKS: '/prd/works',
      },
      PATCH: {
        WORKS: '/prd/works',
      },
      DELETE: {
        WORKS: '/prd/works',
      },
    },
    WORK_REJECT: {
      GET: {
        REPORT: '/prd/work-rejects/report',
        /** UUID 문자열 변환 필요 */
        REJECT: '/prd/work-reject/{uuid}',
        REJECTS: '/prd/work-rejects',
      },
      POST: {
        REJECTS: '/prd/work-rejects',
      },
      PUT: {
        REJECTS: '/prd/work-rejects',
      },
      PATCH: {
        REJECTS: '/prd/work-rejects',
      },
      DELETE: {
        REJECTS: '/prd/work-rejects',
      },
    },
    WORK_DOWNTIME: {
      GET: {
        REPORT: '/prd/work-downtimes/report',
        /** UUID 문자열 변환 필요 */
        DOWNTIME: '/prd/work-downtime/{uuid}',
        DOWNTIMES: '/prd/work-downtimes',
      },
      POST: {
        DOWNTIMES: '/prd/work-downtimes',
      },
      PUT: {
        DOWNTIMES: '/prd/work-downtimes',
      },
      PATCH: {
        DOWNTIMES: '/prd/work-downtimes',
      },
      DELETE: {},
    },
    INPUT: {
      GET: {
        ONGOING: '/prd/work-inputs/ongoing',
        ONGOING_GROUP: '/prd/work-inputs/ongoing-group',
        /** UUID 문자열 변환 필요 */
        INPUT: '/prd/work-input/{uuid}',
        INPUTS: '/prd/work-inputs',
      },
      POST: {
        INPUTS: '/prd/work-inputs',
      },
      PUT: {
        INPUTS: '/prd/work-inputs',
      },
      PATCH: {
        INPUTS: '/prd/work-inputs',
      },
      DELETE: {
        INPUTS: '/prd/work-inputs',
        INPUTS_BY_WORK: '/prd/work-inputs/by-work',
      },
    },
    WORKER: {
      GET: {
        /** UUID 문자열 변환 필요 */
        WORKER: '/prd/work-worker/{uuid}',
        WORKERS: '/prd/work-workers',
      },
      POST: {
        WORKERS: '/prd/work-workers',
      },
      PUT: {
        WORKERS: '/prd/work-workers',
      },
      PATCH: {
        WORKERS: '/prd/work-workers',
      },
      DELETE: {
        WORKERS: '/prd/work-workers',
      },
    },
    ROUTING: {
      GET: {
        /** UUID 문자열 변환 필요 */
        ROUTING: '/prd/work-routing/{uuid}',
        ROUTINGS: '/prd/work-routings',
      },
      PUT: {
        ROUTINGS: '/prd/work-routings',
      },
      PATCH: {
        ROUTINGS: '/prd/work-routings',
      },
    },
    RETURN: {
      GET: {
        REPORT: '/prd/returns/report',
        /** UUID 문자열 변환 필요 */
        RETURN: '/prd/return/{uuid}',
        RETURNS: '/prd/returns',
      },
      POST: {
        RETURNS: '/prd/returns',
      },
      PUT: {
        RETURNS: '/prd/returns',
      },
      PATCH: {
        RETURNS: '/prd/returns',
      },
      DELETE: {
        RETURNS: '/prd/returns',
      },
    },
    DEMANDS: {
      GET: {
        /** UUID 문자열 변환 필요 */
        DEMAND: '/prd/demand/{uuid}',
        DEMANDS: '/prd/demands',
      },
      POST: {
        DEMANDS: '/prd/demands',
      },
      PUT: {
        COMPLETE: '/prd/demands/complete',
        DEMANDS: '/prd/demands',
      },
      PATCH: {
        DEMANDS: '/prd/demands',
      },
      DELETE: {
        DEMANDS: '/prd/demands',
      },
    },
    ORDER: {
      GET: {
        /** UUID 문자열 변환 필요 */
        ORDER: '/prd/order/{uuid}',
        ORDERS: '/prd/orders',
      },
      POST: {
        ORDERS: '/prd/orders',
      },
      PUT: {
        COMPLETE: '/prd/orders/complete',
        WORKER_GROUP: '/prd/orders/worker-group',
        ORDERS: '/prd/orders',
      },
      PATCH: {
        ORDERS: '/prd/orders',
      },
      DELETE: {
        ORDERS: '/prd/orders',
      },
    },
    ORDER_ROUTING: {
      GET: {
        /** UUID 문자열 변환 필요 */
        ORDER_ROUTING: '/prd/order-routing/{uuid}',
        ORDER_ROUTINGS: '/prd/order-routings',
      },
      PUT: {
        ORDER_ROUTINGS: '/prd/order-routings',
      },
      PATCH: {
        ORDER_ROUTINGS: '/prd/order-routings',
      },
    },
    ORDER_INPUT: {
      GET: {
        /** UUID 문자열 변환 필요 */
        ROUTING: '/prd/order-routing/{uuid}',
      },
      POST: {
        ROUTINGS: '/prd/order-routings',
      },
      PUT: {
        ROUTINGS: '/prd/order-routings',
      },
      PATCH: {
        ROUTINGS: '/prd/order-routings',
      },
      DELETE: {
        ROUTINGS: '/prd/order-routings',
      },
    },
    ORDER_WORKER: {
      GET: {
        /** UUID 문자열 변환 필요 */
        WORKER: '/prd/order-worker/{uuid}',
        WORKERS: '/prd/order-workers',
      },
      POST: {
        WORKERS: '/prd/order-workers',
      },
      PUT: {
        WORKERS: '/prd/order-workers',
      },
      PATCH: {
        WORKERS: '/prd/order-workers',
      },
      DELETE: {
        WORKERS: '/prd/order-workers',
      },
    },
  },
  SAL: {
    RETURN: {
      GET: {
        REPORT: '/sal/returns/report',
        /** UUID 문자열 변환 필요 */
        RETURN: '/sal/return/{uuid}',
        RETURNS: '/sal/returns',
        /** UUID 문자열 변환 필요 */
        DETAILS: '/sal/return/{uuid}/details',
        /** UUID 문자열 변환 필요 */
        INCLUDE_DETAILS: '/sal/return/{uuid}/include-details',
      },
      POST: {
        RETURNS: '/sal/returns',
      },
      PUT: {
        RETURNS: '/sal/returns',
      },
      PATCH: {
        RETURNS: '/sal/returns',
      },
      DELETE: {
        RETURNS: '/sal/returns',
      },
    },
    RETURN_DETAIL: {
      GET: {
        /** UUID 문자열 변환 필요 */
        RETURN_DETAIL: '/sal/return-detail/{uuid}',
        RETURN_DETAILS: '/sal/return-details',
      },
    },
    ORDER: {
      GET: {
        REPORT: '/sal/orders/report',
        /** UUID 문자열 변환 필요 */
        ORDER: '/sal/order/{uuid}',
        ORDERS: '/sal/orders',
        /** UUID 문자열 변환 필요 */
        DETAILS: '/sal/order/{uuid}/details',
        /** UUID 문자열 변환 필요 */
        INCLUDE_DETAILS: '/sal/order/{uuid}/include-details',
      },
      POST: {
        ORDERS: '/sal/orders',
      },
      PUT: {
        ORDERS: '/sal/orders',
      },
      PATCH: {
        ORDERS: '/sal/orders',
      },
      DELETE: {
        ORDERS: '/sal/orders',
      },
    },
    ORDER_DETAIL: {
      GET: {
        /** UUID 문자열 변환 필요 */
        DETAIL: '/sal/order-detail/{uuid}',
        DETAILS: '/sal/order-details',
      },
      PUT: {
        COMPLETE: '/sal/order-details/complete',
      },
    },
    INCOME: {
      GET: {
        REPORT: '/sal/incomes/report',
        /** UUID 문자열 변환 필요 */
        INCOME: '/sal/income/{uuid}',
        INCOMES: '/sal/incomes',
      },
      POST: {
        INCOMES: '/sal/incomes',
      },
      PUT: {
        INCOMES: '/sal/incomes',
      },
      PATCH: {
        INCOMES: '/sal/incomes',
      },
      DELETE: {
        INCOMES: '/sal/incomes',
      },
    },
    RELEASE: {
      GET: {
        REPORT: '/sal/releases/report',
        /** UUID 문자열 변환 필요 */
        RELEASE: '/sal/release/{uuid}',
        RELEASES: '/sal/releases',
      },
      POST: {
        RELEASES: '/sal/releases',
      },
      PUT: {
        RELEASES: '/sal/releases',
      },
      PATCH: {
        RELEASES: '/sal/releases',
      },
      DELETE: {
        RELEASES: '/sal/releases',
      },
    },
    OUTGO_ORDER: {
      GET: {
        REPORT: '/sal/outgo-orders/report',
        /** UUID 문자열 변환 필요 */
        OUTGO_ORDER: '/sal/outgo-order/{uuid}',
        OUTGO_ORDERS: '/sal/outgo-orders',
        /** UUID 문자열 변환 필요 */
        DETAILS: '/sal/outgo-order/{uuid}/details',
        /** UUID 문자열 변환 필요 */
        INCLUDE_DETAILS: '/sal/outgo-order/{uuid}/include-details',
      },
      POST: {
        OUTGO_ORDERS: '/sal/outgo-orders',
      },
      PUT: {
        OUTGO_ORDERS: '/sal/outgo-orders',
      },
      PATCH: {
        OUTGO_ORDERS: '/sal/outgo-orders',
      },
      DELETE: {
        OUTGO_ORDERS: '/sal/outgo-orders',
      },
    },
    OUTGO_ORDER_DETAIL: {
      GET: {
        /** UUID 문자열 변환 필요 */
        DETAIL: '/sal/outgo-order-detail/{uuid}',
        DETAILS: '/sal/outgo-order-details',
      },
      PUT: {
        COMPLETE: '/sal/outgo-order-details/complete',
      },
    },
    OUTGO: {
      GET: {
        LOT_TRACKING: '/sal/outgos/lot-tracking',
        REPORT: '/sal/outgos/report',
        /** UUID 문자열 변환 필요 */
        OUTGO: '/sal/outgo/{uuid}',
        OUTGOES: '/sal/outgos',
        /** UUID 문자열 변환 필요 */
        DETAILS: '/sal/outgo/{uuid}/details',
        /** UUID 문자열 변환 필요 */
        INCLUDE_DETAILS: '/sal/outgo/{uuid}/include-details',
      },
      POST: {
        OUTGOES: '/sal/outgos',
      },
      PUT: {
        OUTGOES: '/sal/outgos',
      },
      PATCH: {
        OUTGOES: '/sal/outgos',
      },
      DELETE: {
        OUTGOES: '/sal/outgos',
      },
    },
    OUTGO_DETAIL: {
      GET: {
        /** UUID 문자열 변환 필요 */
        DETAIL: '/sal/outgo-detail/{uuid}',
        DETAILS: '/sal/outgo-details',
      },
    },
  },
  STD: {
    BOM: {
      GET: {
        TREES: '/std/boms/trees',
        BOM: '/std/bom/{uuid}',
        PLURAL_BOM: '/std/boms',
      },
      POST: {
        PLURAL_BOM: '/std/boms',
      },
      PUT: {
        PLURAL_BOM: '/std/boms',
      },
      PATCH: {
        PLURAL_BOM: '/std/boms',
      },
      DELETE: {
        PLURAL_BOM: '/std/boms',
      },
    },
    PARTNER_TYPE: {
      GET: {
        PARTNER_TYPE: '/std/partner-type/{uuid}',
        PARTNER_TYPES: '/std/partner-types',
      },
      POST: {
        EXCEL_UPLOAD: '/std/partner-types/excel-upload',
        PARTNER_TYPES: '/std/partner-types',
      },
      PUT: {
        PARTNER_TYPES: '/std/partner-types',
      },
      PATCH: {
        PARTNER_TYPES: '/std/partner-types',
      },
      DELETE: {
        PARTNER_TYPES: '/std/partner-types',
      },
    },
    PARTNER: {
      GET: {
        PARTNER: '/std/partner/{uuid}',
        PARTNERS: '/std/partners',
      },
      POST: {
        EXCEL_UPLOAD: '/std/partners/excel-upload',
        PARTNERS: '/std/partners',
      },
      PUT: {
        PARTNERS: '/std/partners',
      },
      PATCH: {
        PARTNERS: '/std/partners',
      },
      DELETE: {
        PARTNERS: '/std/partners',
      },
    },
    PARTNER_PROD: {
      GET: {
        PARTNER_PROD: '/std/partner-prod/{uuid}',
        PARTNER_PRODS: '/std/partner-prods',
      },
      POST: {
        EXCEL_UPLOAD: '/std/partner-prods/excel-upload',
        PARTNER_PRODS: '/std/partner-prods',
      },
      PUT: {
        PARTNER_PRODS: '/std/partner-prods',
      },
      PATCH: {
        PARTNER_PRODS: '/std/partner-prods',
      },
      DELETE: {
        PARTNER_PRODS: '/std/partner-prods',
      },
    },
    INSP_TOOL: {
      GET: {
        INSP_TOOL: '/std/insp-tool{uuid}',
        INSP_TOOLS: '/std/insp-tools',
      },
      POST: {
        EXCEL_UPLOAD: '/std/insp-tools/excel-upload',
        INSP_TOOLS: '/std/insp-tools',
      },
      PUT: {
        INSP_TOOLS: '/std/insp-tools',
      },
      PATCH: {
        INSP_TOOLS: '/std/insp-tools',
      },
      DELETE: {
        INSP_TOOLS: '/std/insp-tools',
      },
    },
    INSP_METHOD: {
      GET: {
        INSP_METHOD: '/std/insp-method{uuid}',
        INSP_METHODS: '/std/insp-methods',
      },
      POST: {
        EXCEL_UPLOAD: '/std/insp-methods/excel-upload',
        INSP_METHODS: '/std/insp-methods',
      },
      PUT: {
        INSP_METHODS: '/std/insp-methods',
      },
      PATCH: {
        INSP_METHODS: '/std/insp-methods',
      },
      DELETE: {
        INSP_METHODS: '/std/insp-methods',
      },
    },
    INSP_ITEM_TYPE: {
      GET: {
        INSP_ITEM_TYPE: '/std/insp-item-type/{uuid}',
        INSP_ITEM_TYPES: '/std/insp-item-types',
      },
      POST: {
        EXCEL_UPLOAD: '/std/insp-item-types/excel-upload',
        ITEM_TYPES: '/std/insp-item-types',
      },
      PUT: {
        INSP_ITEM_TYPES: '/std/insp-item-types',
      },
      PATCH: {
        INSP_ITEM_TYPES: '/std/insp-item-types',
      },
      DELETE: {
        INSP_ITEM_TYPES: '/std/insp-item-types',
      },
    },
    INSP_ITEM: {
      GET: {
        INSP_ITEM: '/std/insp-item/{uuid}',
        INSP_ITEMS: '/std/insp-items',
      },
      POST: {
        EXCEL_UPLOAD: '/std/insp-items/excel-upload',
        INSP_ITEMS: '/std/insp-items',
      },
      PUT: {
        INSP_ITEMS: '/std/insp-items',
      },
      PATCH: {
        INSP_ITEMS: '/std/insp-items',
      },
      DELETE: {
        INSP_ITEMS: '/std/insp-items',
      },
    },
    CUSTOMER_PRICE: {
      GET: {
        CUSTOMER_PRICE: '/std/customer-price/{uuid}',
        CUSTOMER_PRICES: '/std/customer-prices',
      },
      POST: {
        EXCEL_UPLOAD: '/std/customer-prices/excel-upload',
        CUSTOMER_PRICES: '/std/customer-prices',
      },
      PUT: {
        CUSTOMER_PRICES: '/std/customer-prices',
      },
      PATCH: {
        CUSTOMER_PRICES: '/std/customer-prices',
      },
      DELETE: {
        CUSTOMER_PRICES: '/std/customer-prices',
      },
    },
    SUPPLIER: {
      GET: {
        SUPPLIER: '/std/supplier/{uuid}',
        SUPPLIERS: '/std/suppliers',
      },
      POST: {
        EXCEL_UPLOAD: '/std/suppliers/excel-upload',
        SUPPLIERS: '/std/suppliers',
      },
      PUT: {
        SUPPLIERS: '/std/suppliers',
      },
      PATCH: {
        SUPPLIERS: '/std/suppliers',
      },
      DELETE: {
        SUPPLIERS: '/std/suppliers',
      },
    },
    FACTORY: {
      GET: {
        SING_IN: '/std/factories/sign-in',
        FACTORY: '/std/factory/{uuid}',
        FACTORIES: '/std/factories',
      },
      POST: {
        EXCEL_UPLOAD: '/std/factories/excel-upload',
        FACTORIES: '/std/factories',
      },
      PUT: {
        FACTORIES: '/std/factories',
      },
      PATCH: {
        FACTORIES: '/std/factories',
      },
      DELETE: {
        FACTORIES: '/std/factories',
      },
    },
    PROC: {
      GET: {
        PROC: '/std/proc/{uuid}',
        PLURAL_PROC: '/std/procs',
      },
      POST: {
        EXCEL_UPLOAD: '/std/procs',
        PLURAL_PROC: '/std/procs',
      },
      PUT: {
        PLURAL_PROC: '/std/procs',
      },
      PATCH: {
        PLURAL_PROC: '/std/procs',
      },
      DELETE: {
        PLURAL_PROC: '/std/procs',
      },
    },
    PROC_EQUIP: {
      GET: {
        PROC_EQUIP: '/std/proc-equip/{uuid}',
        PROC_EQUIPS: '/std/proc-equips',
      },
      POST: {
        PROC_EQUIPS: '/std/proc-equips',
      },
      PUT: {
        PROC_EQUIPS: '/std/proc-equips',
      },
      PATCH: {
        PROC_EQUIPS: '/std/proc-equips',
      },
      DELETE: {
        PROC_EQUIPS: '/std/proc-equips',
      },
    },
    PROC_REJECT: {
      GET: {
        PROC_REJECT: '/std/proc-reject/{uuid}',
        PROC_REJECTS: '/std/proc-rejects',
      },
      POST: {
        EXCEL_UPLOAD: '/std/proc-rejects/excel-upload',
        PROC_REJECTS: '/std/proc-rejects',
      },
      PUT: {
        PROC_REJECTS: '/std/proc-rejects',
      },
      PATCH: {
        PROC_REJECTS: '/std/proc-rejects',
      },
      DELETE: {
        PROC_REJECTS: '/std/proc-rejects',
      },
    },
    DELIVERY: {
      GET: {
        DELIVERY: '/std/delivery/{uuid}',
        DELIVERIES: '/std/deliveries',
      },
      POST: {
        EXCEL_UPLOAD: '/std/deliveries/excel-upload',
        DELIVERIES: '/std/deliveries',
      },
      PUT: {
        DELIVERIES: '/std/deliveries',
      },
      PATCH: {
        DELIVERIES: '/std/deliveries',
      },
      DELETE: {
        DELIVERIES: '/std/deliveries',
      },
    },
    PRICE_TYPE: {
      GET: {
        PRICE_TYPE: '/std/price-type/{uuid}',
        PRICE_TYPES: '/std/price-types',
      },
      POST: {
        EXCEL_UPLOAD: '/std/price-types/excel-upload',
        PRICE_TYPES: '/std/price-types',
      },
      PUT: {
        PRICE_TYPES: '/std/price-types',
      },
      PATCH: {
        PRICE_TYPES: '/std/price-types',
      },
      DELETE: {
        PRICE_TYPES: '/std/price-types',
      },
    },
    UNIT: {
      GET: {
        UNIT: '/std/unit/{uuid}',
        UNITS: '/std/units',
      },
      POST: {
        EXCEL_UPLOAD: '/std/units/excel-upload',
        UNITS: '/std/units',
      },
      PUT: {
        UNIT: '/std/units',
      },
      PATCH: {
        UNIT: '/std/units',
      },
      DELETE: {
        UNIT: '/std/units',
      },
    },
    UNIT_CONVERT: {
      GET: {
        UNIT_CONVERT: '/std/unit-convert/{uuid}',
        UNIT_CONVERTS: '/std/unit-converts',
      },
      POST: {
        EXCEL_UPLOAD: '/std/unit-converts/excel-upload',
        UNIT_CONVERTS: '/std/unit-converts',
      },
      PUT: {
        UNIT_CONVERTS: '/std/unit-converts',
      },
      PATCH: {
        UNIT_CONVERTS: '/std/unit-converts',
      },
      DELETE: {
        UNIT_CONVERTS: '/std/unit-converts',
      },
    },
    ROUTING: {
      GET: {
        ACTIVATED_PROD: '/std/routings/actived-prod',
        ROUTING: '/std/routing/{uuid}',
        ROUTINGS: '/std/routings',
      },
      POST: {
        ROUTINGS: '/std/routings',
      },
      PUT: {
        ROUTINGS: '/std/routings',
      },
      PATCH: {
        ROUTINGS: '/std/routings',
      },
      DELETE: {
        ROUTINGS: '/std/routings',
      },
    },
    MODEL: {
      GET: {
        MODEL: '/std/model/{uuid}',
        MODELS: '/std/models',
      },
      POST: {
        EXCEL_UPLOAD: '/std/models/excel-upload',
        MODELS: '/std/models',
      },
      PUT: {
        MODELS: '/std/models',
      },
      PATCH: {
        MODELS: '/std/models',
      },
      DELETE: {
        MODELS: '/std/models',
      },
    },
    DEPT: {
      GET: {
        DEPT: '/std/dept/{uuid}',
        PLURAL_DEPT: '/std/depts',
      },
      POST: {
        EXCEL_UPLOAD: '/std/depts/excel-upload',
        PLURAL_DEPT: '/std/depts',
      },
      PUT: {
        PLURAL_DEPT: '/std/depts',
      },
      PATCH: {
        PLURAL_DEPT: '/std/depts',
      },
      DELETE: {
        PLURAL_DEPT: '/std/depts',
      },
    },
    REJECT_TYPE: {
      GET: {
        REJECT_TYPE: '/std/reject-type/{uuid}',
        REJECT_TYPES: '/std/reject-types',
      },
      POST: {
        EXCEL_UPLOAD: '/std/reject-types/excel-upload',
        REJECT_TYPES: '/std/reject-types',
      },
      PUT: {
        REJECT_TYPES: '/std/reject-types',
      },
      PATCH: {
        REJECT_TYPES: '/std/reject-types',
      },
      DELETE: {
        REJECT_TYPES: '/std/reject-types',
      },
    },
    REJECT: {
      GET: {
        REJECT: '/std/reject/{uuid}',
        REJECTS: '/std/rejects',
      },
      POST: {
        EXCEL_UPLOAD: '/std/rejects/excel-upload',
        REJECTS: '/std/rejects',
      },
      PUT: {
        REJECTS: '/std/rejects',
      },
      PATCH: {
        REJECTS: '/std/rejects',
      },
      DELETE: {
        REJECTS: '/std/rejects',
      },
    },
    DOWNTIME_TYPE: {
      GET: {
        DOWNTIME_TYPE: '/std/downtime-type/{uuid}',
        DOWNTIME_TYPES: '/std/downtime-types',
      },
      POST: {
        EXCEL_UPLOAD: '/std/downtime-types/excel-upload',
        DOWNTIME_TYPES: '/std/downtime-types',
      },
      PUT: {
        DOWNTIME_TYPES: '/std/downtime-types',
      },
      PATCH: {
        DOWNTIME_TYPES: '/std/downtime-types',
      },
      DELETE: {
        DOWNTIME_TYPES: '/std/downtime-types',
      },
    },
    DOWNTIME: {
      GET: {
        DOWNTIME: '/std/downtimes/{uuid}',
        DOWNTIMES: '/std/downtimes',
      },
      POST: {
        EXCEL_UPLOAD: '/std/downtimes/excel-upload',
        DOWNTIMES: '/std/downtimes',
      },
      PUT: {
        DOWNTIMES: '/std/downtimes',
      },
      PATCH: {
        DOWNTIMES: '/std/downtimes',
      },
      DELETE: {
        DOWNTIMES: '/std/downtimes',
      },
    },
    EMP: {
      GET: {
        EMP: '/std/emp/{uuid}',
        EMPLOYERS: '/std/emps',
      },
      POST: {
        EXCEL_UPLOAD: '/std/emps/excel-upload',
        EMPLOYERS: '/std/emps',
      },
      PUT: {
        EMPLOYERS: '/std/emps',
      },
      PATCH: {
        EMPLOYERS: '/std/emps',
      },
      DELETE: {
        EMPLOYERS: '/std/emps',
      },
    },
    ROUTING_RESOURCE: {
      GET: {
        ROUTING_RESOURCE: '/std/routing-resource/{uuid}',
        ROUTING_RESOURCES: '/std/routing-resources',
      },
      POST: {
        ROUTING_RESOURCES: '/std/routing-resources',
      },
      PUT: {
        ROUTING_RESOURCES: '/std/routing-resources',
      },
      PATCH: {
        ROUTING_RESOURCES: '/std/routing-resources',
      },
      DELETE: {
        ROUTING_RESOURCES: '/std/routing-resources',
      },
    },
    EQUIP_TYPE: {
      GET: {
        EQUIP_TYPE: '/std/equip-type/{uuid}',
        EQUIP_TYPES: '/std/equip-types',
      },
      POST: {
        EXCEL_UPLOAD: '/std/equip-types/excel-upload',
        EQUIP_TYPES: '/std/equip-types',
      },
      PUT: {
        EQUIP_TYPES: '/std/equip-types',
      },
      PATCH: {
        EQUIP_TYPES: '/std/equip-types',
      },
      DELETE: {
        EQUIP_TYPES: '/std/equip-types',
      },
    },
    EQUIP: {
      GET: {
        EQUIP: '/std/equip/{uuid}',
        EQUIPS: '/std/equips',
      },
      POST: {
        EXCEL_UPLOAD: '/std/equips/excel-upload',
        EQUIPS: '/std/equips',
      },
      PUT: {
        EQUIPS: '/std/equips',
      },
      PATCH: {
        EQUIPS: '/std/equips',
      },
      DELETE: {
        EQUIPS: '/std/equips',
      },
    },
    LOCATION: {
      GET: {
        LOCATION: '/std/location/{uuid}',
        LOCATIONS: '/std/locations',
      },
      POST: {
        EXCEL_UPLOAD: '/std/locations/excel-upload',
        LOCATIONS: '/std/locations',
      },
      PUT: {
        LOCATIONS: '/std/locations',
      },
      PATCH: {
        LOCATIONS: '/std/locations',
      },
      DELETE: {
        LOCATIONS: '/std/locations',
      },
    },
    SHIFT: {
      GET: {
        SHIFT: '/std/shift/{uuid}',
        SHIFTS: '/std/shifts',
      },
      POST: {
        EXCEL_UPLOAD: '/std/shifts/excel-upload',
        SHIFTS: '/std/shifts',
      },
      PUT: {
        SHIFTS: '/std/shifts',
      },
      PATCH: {
        SHIFTS: '/std/shifts',
      },
      DELETE: {
        SHIFTS: '/std/shifts',
      },
    },
    WORKER: {
      GET: {
        WORKER: '/std/worker/{uuid}',
        WORKERS: '/std/workers',
      },
      POST: {
        EXCEL_UPLOAD: '/std/worker/excel-upload',
        WORKERS: '/std/workers',
      },
      PUT: {
        WORKERS: '/std/workers',
      },
      PATCH: {
        WORKERS: '/std/workers',
      },
      DELETE: {
        WORKERS: '/std/workers',
      },
    },
    WORKINGS: {
      GET: {
        WORKINGS: '/std/workings/{uuid}',
        PLURAL_WORKINGS: '/std/workingses',
      },
      POST: {
        EXCEL_UPLOAD: '/std/workingses/excel-upload',
        PLURAL_WORKINGS: '/std/workingses',
      },
      PUT: {
        PLURAL_WORKINGS: '/std/workingses',
      },
      PATCH: {
        PLURAL_WORKINGS: '/std/workingses',
      },
      DELETE: {
        PLURAL_WORKINGS: '/std/workingses',
      },
    },
    WORKER_GROUP: {
      GET: {
        WORKER_GROUP: '/std/worker-group/{uuid}',
        WORKER_GROUPS: '/std/worker-groups',
      },
      POST: {
        EXCEL_UPLOAD: '/std/worker-groups/excel-upload',
        WORKER_GROUPS: '/std/worker-groups',
      },
      PUT: {
        WORKER_GROUPS: '/std/worker-groups',
      },
      PATCH: {
        WORKER_GROUPS: '/std/worker-groups',
      },
      DELETE: {
        WORKER_GROUPS: '/std/worker-groups',
      },
    },
    WORKER_GROUP_WORKER: {
      GET: {
        WORKER_GROUP_WORKER: '/std/worker-group-worker/{uuid}',
        WORKER_GROUP_WORKERS: '/std/worker-group-workers',
      },
      POST: {
        EXCEL_UPLOAD: '/std/worker-groups/excel-upload',
        WORKER_GROUP_WORKERS: '/std/worker-group-workers',
      },
      PUT: {
        WORKER_GROUP_WORKERS: '/std/worker-group-workers',
      },
      PATCH: {
        WORKER_GROUP_WORKERS: '/std/worker-group-workers',
      },
      DELETE: {
        WORKER_GROUP_WORKERS: '/std/worker-group-workers',
      },
    },
    PROD_TYPE: {
      GET: {
        PROD_TYPE: '/std/prod-type/{uuid}',
        PROD_TYPES: '/std/prod-types',
      },
      POST: {
        EXCEL_UPLOAD: '/std/prod-types/excel-upload',
        PROD_TYPES: '/std/prod-types',
      },
      PUT: {
        PROD_TYPES: '/std/prod-types',
      },
      PATCH: {
        PROD_TYPES: '/std/prod-types',
      },
      DELETE: {
        PROD_TYPES: '/std/prod-types',
      },
    },
    GRADE: {
      GET: {
        GRADE: '/std/grade/{uuid}',
        GRADES: '/std/grades',
      },
      POST: {
        EXCEL_UPLOAD: '/std/grades/excel_upload',
        GRADES: '/std/grades',
      },
      PUT: {
        GRADES: '/std/grades',
      },
      PATCH: {
        GRADES: '/std/grades',
      },
      DELETE: {
        GRADES: '/std/grades',
      },
    },
    STORE: {
      GET: {
        STORE: '/std/store/{uuid}',
        STORES: '/std/stores',
      },
      POST: {
        EXCEL_UPLOAD: '/std/stores/excel_upload',
        STORES: '/std/stores',
      },
      PUT: {
        STORES: '/std/stores',
      },
      PATCH: {
        STORES: '/std/stores',
      },
      DELETE: {
        STORES: '/std/stores',
      },
    },
    ROUTING_WORKINGS: {
      GET: {
        ROUTING_WORKINGS: '/std/routing-workings/{uuid}',
        ROUTING_PLURAL_WORKINGS: '/std/routing-workingses',
      },
      POST: {
        ROUTING_PLURAL_WORKINGS: '/std/routing-workingses',
      },
      PUT: {
        ROUTING_PLURAL_WORKINGS: '/std/routing-workingses',
      },
      PATCH: {
        ROUTING_PLURAL_WORKINGS: '/std/routing-workingses',
      },
      DELETE: {
        ROUTING_PLURAL_WORKINGS: '/std/routing-workingses',
      },
    },
    ITEM_TYPE: {
      GET: {
        ITEM_TYPE: '/std/item-type/{uuid}',
        ITEM_TYPES: '/std/item-types',
      },
      POST: {
        EXCEL_UPLOAD: '/std/item-types/excel-upload',
        ITEM_TYPES: '/std/item-types',
      },
      PUT: {
        ITEM_TYPES: '/std/item-types',
      },
      PATCH: {
        ITEM_TYPES: '/std/item-types',
      },
      DELETE: {
        ITEM_TYPES: '/std/item-types',
      },
    },
    PROD: {
      GET: {
        PROD: '/std/prod/{uuid}',
        PRODS: '/std/prods',
      },
      POST: {
        EXCEL_UPLOAD: '/std/prods/excel-upload',
        PRODS: '/std/prods',
      },
      PUT: {
        PRODS: '/std/prods',
      },
      PATCH: {
        PRODS: '/std/prods',
      },
      DELETE: {
        PRODS: '/std/prods',
      },
    },
    VENDOR_PRICE: {
      GET: {
        VENDOR_PRICE: '/std/vendor-price/{uuid}',
        VENDOR_PRICES: '/std/vendor-prices',
      },
      POST: {
        EXCEL_UPLOAD: '/std/vendor-prices/excel-upload',
        VENDOR_PRICES: '/std/vendor-prices',
      },
      PUT: {
        VENDOR_PRICES: '/std/vendor-prices',
      },
      PATCH: {
        VENDOR_PRICES: '/std/vendor-prices',
      },
      DELETE: {
        VENDOR_PRICES: '/std/vendor-prices',
      },
    },
    MONEY_UNIT: {
      GET: {
        MONEY_UNIT: '/std/money-unit/{uuid}',
        MONEY_UNITS: '/std/money-units',
      },
      POST: {
        EXCEL_UPLOAD: '/std/money-units/excel-upload',
        MONEY_UNITS: '/std/money-units',
      },
      PUT: {
        MONEY_UNITS: '/std/money-units',
      },
      PATCH: {
        MONEY_UNITS: '/std/money-units',
      },
      DELETE: {
        MONEY_UNITS: '/std/money-units',
      },
    },
    COMPANY: {
      GET: {
        COMPANY: '/std/company/{uuid}',
        COMPANIES: '/std/companies',
      },
      POST: {
        EXCEL_UPLOAD: '/std/companies/excel-upload',
        COMPANIES: '/std/companies',
      },
      PUT: {
        COMPANIES: '/std/companies',
      },
      PATCH: {
        COMPANIES: '/std/companies',
      },
      DELETE: {
        COMPANIES: '/std/companies',
      },
    },
  },
  QMS: {
    INSP: {
      GET: {
        INSP: '/qms/insp/{uuid}',
        PLURAL_INSP: '/qms/insps',
        DETAILS: '/qms/insp/{uuid}/details',
        INCLUDE_DETAILS: '/qms/insp/{uuid}/include-details',
        RECEIVE_INCLUDE_DETAILS: '/qms/insp/receive/include-details',
        PROC_INCLUDE_DETAILS: '/qms/insp/proc/include-details',
      },
      POST: {
        PLURAL_INSP: '/qms/insps',
      },
      PUT: {
        APPLY: '/qms/insps/apply',
        CANCEL_APPLY: '/qms/insps/cancel-apply',
        PLURAL_INSP: '/qms/insps',
      },
      PATCH: {
        PLURAL_INSP: '/qms/insps',
      },
      DELETE: {
        PLURAL_INSP: '/qms/insps',
      },
    },
    INSP_DETAIL: {
      GET: {
        INSP_DETAIL: '/qms/insp-detail/{uuid}',
        INSP_DETAILS: '/qms/insp-details',
      },
    },
    PROC_INSP: {
      GET: {
        INSP_RESULT_MAX_SEQ: '/qms/proc/insp-result/max-seq',
        INSP_RESULT_REPORT: '/qms/proc/insp-results/report',
        INSP_RESULT_INCLUDE_DETAILS:
          '/qms/proc/insp-result/{uuid}/include-details',
        INSP_RESULTS: '/qms/proc/insp-results',
      },
      POST: {
        INSP_RESULTS: '/qms/proc/insp-results',
      },
      PUT: {
        INSP_RESULTS: '/qms/proc/insp-results',
      },
      DELETE: {
        INSP_RESULTS: '/qms/proc/insp-results',
      },
    },
    RECEIVE_INSP: {
      GET: {
        INSP_RESULT_WAITING: '/qms/receive/insp-result/waiting',
        INSP_RESULT_INCLUDE_DETAILS:
          '/qms/receive/insp-result/{uuid}/include-details',
        INSP_RESULTS: '/qms/receive/insp-results',
      },
      POST: {
        INSP_RESULTS: '/qms/receive/insp-results',
      },
      PUT: {
        INSP_RESULTS: '/qms/receive/insp-results',
      },
      DELETE: {
        INSP_RESULTS: '/qms/receive/insp-results',
      },
    },
    FINAL_INSP: {
      GET: {
        INSP_RESULT_INCLUDE_DETAILS:
          '/qms/final/insp-result/{uuid}/include-details',
        INSP_RESULTS: '/qms/final/insp-results',
      },
      POST: {
        INSP_RESULTS: '/qms/final/insp-results',
      },
      PUT: {
        INSP_RESULTS: '/qms/final/insp-results',
      },
      DELETE: {
        INSP_RESULTS: '/qms/final/insp-results',
      },
    },
    REWORK: {
      GET: {
        REWORK: '/qms/rework/{uuid}',
        REWORKS: '/qms/reworks',
      },
      POST: {
        DISASSEMBLES: '/qms/reworks/disassembles',
        REWORKS: '/qms/reworks',
      },
      PUT: {
        REWORKS: '/qms/reworks',
      },
      PATCH: {
        REWORKS: '/qms/reworks',
      },
      DELETE: {
        REWORKS: '/qms/reworks',
      },
    },
    REWORK_DISASSEMBLE: {
      GET: {
        REWORK_DISASSEMBLE: '/qms/rework-disassemble/{uuid}',
        REWORK_DISASSEMBLES: '/qms/rework-disassembles',
      },
    },
  },
  DAS: {
    WORK_COMPARED_ORDER: {
      GET: {
        WORK_COMPARED_ORDER: '/das/work-compared-order',
      },
    },
    PASSED_INSP_RESULT: {
      GET: {
        PASSED_INSP_RESULT: '/das/passed-insp-result',
      },
    },
    DELAYED_SAL_ORDER: {
      GET: {
        DELAYED_SAL_ORDER: '/das/delayed-sal-order',
      },
    },
    OPERATING_RATE: {
      GET: {
        OPERATING_RATE: '/das/operating-rate',
      },
    },
    DELIVERED_IN_WEEK: {
      GET: {
        DELIVERED_IN_WEEK: '/das/delivered-in-week',
      },
    },
    OVERALL_STATUS: {
      GET: {
        OVERALL_STATUS: '/das/overall-status',
      },
    },
    REALTIME_STATUS: {
      GET: {
        REALTIME_STATUS: '/das/realtime-status',
      },
    },
  },
  AUT: {
    PERMISSION: {
      GET: {
        /** UUID 문자열 변환 필요 */
        PERMISSION: '/aut/permission/{uuid}',
        PERMISSIONS: '/aut/permissions',
      },
      POST: {
        PERMISSIONS: '/aut/permissions',
      },
      PUT: {
        PERMISSIONS: '/aut/permissions',
      },
      PATCH: {
        PERMISSIONS: '/aut/permissions',
      },
      DELETE: {
        PERMISSIONS: '/aut/permissions',
      },
    },
    GROUP: {
      GET: {
        /** UUID 문자열 변환 필요 */
        GROUP: '/aut/group/{uuid}',
        GROUPS: '/aut/groups',
      },
      POST: {
        GROUPS: '/aut/groups',
      },
      PUT: {
        GROUPS: '/aut/groups',
      },
      PATCH: {
        GROUPS: '/aut/groups',
      },
      DELETE: {
        GROUPS: '/aut/groups',
      },
    },
    GROUP_PERMISSION: {
      GET: {
        GROUP_PERMISSION: '/aut/group-permissions',
      },
      PUT: {
        GROUP_PERMISSION: '/aut/group-permissions',
      },
    },
    MENU_TYPE: {
      GET: {
        /** UUID 문자열 변환 필요 */
        MENU_TYPE: '/aut/menu-type/{uuid}',
        MENU_TYPES: '/aut/menu-types',
      },
      POST: {
        MENU_TYPES: '/aut/menu-types',
      },
      PUT: {
        MENU_TYPES: '/aut/menu-types',
      },
      PATCH: {
        MENU_TYPES: '/aut/menu-types',
      },
      DELETE: {
        MENU_TYPES: '/aut/menu-types',
      },
    },
    MENU: {
      GET: {
        /** UUID 문자열 변환 필요 */
        MENUS_PERMISSION: '/aut/menus/permission',
        MENU: '/aut/menu',
        MENUS: '/aut/menus',
      },
      PUT: {
        MENUS: '/aut/menus',
      },
      DELETE: {
        MENUS: '/aut/menus',
      },
    },
    USER: {
      GET: {
        /** UUID 문자열 변환 필요 */
        USER: '/aut/user/{uuid}',
        USERS: '/aut/users',
      },
      POST: {
        SIGN_IN: '/aut/user/sign-in',
        USERS: '/aut/users',
      },
      PUT: {
        PWD: '/aut/users/pwd',
        USERS: '/aut/users',
      },
      PATCH: {
        USERS: '/aut/users',
      },
      DELETE: {
        USERS: '/aut/users',
      },
    },
    USER_PERMISSION: {
      GET: {
        USER_PERMISSIONS: '/aut/user-permissions',
      },
      PUT: {
        USER_PERMISSIONS: '/aut/user-permissions',
      },
    },
    TENANT: {
      GET: {
        TENANT: '/tenant/auth',
      },
    },
  },
  EQM: {
    INSP: {
      GET: {
        INSP: '/eqm/insp/{uuid}',
        PLURAL_INSP: '/eqm/insps',
        DETAILS: '/eqm/insp/{uuid}/details',
        INCLUDE_DETAILS: '/eqm/insp/{uuid}/include-details',
      },
      POST: {
        PLURAL_INSP: '/eqm/insps',
      },
      PUT: {
        APPLY: '/eqm/insp/apply',
        CANCEL_APPLY: '/eqm/insp/cancel-apply',
        PLURAL_INSP: '/eqm/insps',
      },
      PATCH: {
        PLURAL_INSP: '/eqm/insps',
      },
      DELETE: {
        PLURAL_INSP: '/eqm/insps',
      },
    },
    INSP_DETAIL: {
      GET: {
        INSP_DETAIL: '/qms/insp-detail/{uuid}',
        INSP_DETAILS: '/qms/insp-details',
      },
    },
    REPAIR_HISTORY: {
      GET: {
        /** UUID 문자열 변환 필요 */
        REPAIR_HISTORY: '/eqm/repair-history/{uuid}',
        REPAIR_HISTORIES: '/eqm/repair-histories',
      },
      POST: {
        REPAIR_HISTORIES: '/eqm/repair-histories',
      },
      PUT: {
        REPAIR_HISTORIES: '/eqm/repair-histories',
      },
      PATCH: {
        REPAIR_HISTORIES: '/eqm/repair-histories',
      },
      DELETE: {
        REPAIR_HISTORIES: '/eqm/repair-histories',
      },
    },
    HISTORY: {
      GET: {
        /** UUID 문자열 변환 필요 */
        HISTORY: '/eqm/history/{uuid}',
        HISTORY_CARD: '/eqm/history/card',
        HISTORIES: '/eqm/histories',
      },
      POST: {
        HISTORIES: '/eqm/histories',
      },
      PUT: {
        HISTORIES: '/eqm/histories',
      },
      PATCH: {
        HISTORIES: '/eqm/histories',
      },
      DELETE: {
        HISTORIES: '/eqm/histories',
      },
    },
    INSP_RESULT: {
      GET: {
        /** UUID 문자열 변환 필요 */
        INSP_RESULT: '/eqm/insp-result/{uuid}',
        INSP_RESULTS: '/eqm/insp-results',
      },
      POST: {
        INSP_RESULTS: '/eqm/insp-results',
      },
      PUT: {
        INSP_RESULTS: '/eqm/insp-results',
      },
      PATCH: {
        INSP_RESULTS: '/eqm/insp-results',
      },
      DELETE: {
        INSP_RESULTS: '/eqm/insp-results',
      },
    },
  },
  MLD: {
    REPORT: {
      GET: {
        REPORT: '/mld/molds/report',
      },
    },
    REPAIR_HISTORY: {
      GET: {
        /** UUID 문자열 변환 필요 */
        REPAIR_HISTORY: '/mld/repair-history/{uuid}',
        REPAIR_HISTORIES: '/mld/repair-histories',
      },
      POST: {
        REPAIR_HISTORIES: '/mld/repair-histories',
      },
      PUT: {
        REPAIR_HISTORIES: '/mld/repair-histories',
      },
      PATCH: {
        REPAIR_HISTORIES: '/mld/repair-histories',
      },
      DELETE: {
        REPAIR_HISTORIES: '/mld/repair-histories',
      },
    },
    MOLD: {
      GET: {
        /** UUID 문자열 변환 필요 */
        MOLD: '/mld/mold/{uuid}',
        MOLDS: '/mld/molds',
      },
      POST: {
        MOLDS: '/mld/molds',
      },
      PUT: {
        MOLDS: '/mld/molds',
      },
      PATCH: {
        MOLDS: '/mld/molds',
      },
      DELETE: {
        MOLDS: '/mld/molds',
      },
    },
    PROBLEM: {
      GET: {
        /** UUID 문자열 변환 필요 */
        PROBLEM: '/mld/problem/{uuid}',
        PROBLEMS: '/mld/problems',
      },
      POST: {
        PROBLEMS: '/mld/problems',
      },
      PUT: {
        PROBLEMS: '/mld/problems',
      },
      PATCH: {
        PROBLEMS: '/mld/problems',
      },
      DELETE: {
        PROBLEMS: '/mld/problems',
      },
    },
    PROD_MOLD: {
      GET: {
        /** UUID 문자열 변환 필요 */
        PROD_MOLD: '/mld/prod-mold/{uuid}',
        PROD_MOLDS: '/mld/prod-molds',
      },
      POST: {
        PROD_MOLDS: '/mld/prod-molds',
      },
      PUT: {
        PROD_MOLDS: '/mld/prod-molds',
      },
      PATCH: {
        PROD_MOLDS: '/mld/prod-molds',
      },
      DELETE: {
        PROD_MOLDS: '/mld/prod-molds',
      },
    },
  },
};

export const URL_PATH_ADM = URL_PATH.ADM;
export const URL_PATH_INV = URL_PATH.INV;
export const URL_PATH_MAT = URL_PATH.MAT;
export const URL_PATH_OUT = URL_PATH.OUT;
export const URL_PATH_PRD = URL_PATH.PRD;
export const URL_PATH_SAL = URL_PATH.SAL;
export const URL_PATH_STD = URL_PATH.STD;
export const URL_PATH_QMS = URL_PATH.QMS;
export const URL_PATH_DAS = URL_PATH.DAS;
export const URL_PATH_AUT = URL_PATH.AUT;
export const URL_PATH_EQM = URL_PATH.EQM;
export const URL_PATH_MLD = URL_PATH.MLD;
