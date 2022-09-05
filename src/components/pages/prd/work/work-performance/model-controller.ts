import { WORK_PERFORMANCE_FIXTURE } from './fixture';
import { WorkPerformanceAction, WorkPerformanceState } from './types';

export const setWorkPerformanceState = (
  state: WorkPerformanceState,
  action: WorkPerformanceAction,
) => {
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
        orderInfo: WORK_PERFORMANCE_FIXTURE.EMPTY.orderInfo,
      };

    case 'CLEAR_WORK_INFO':
      return {
        ...state,
        workInfo: WORK_PERFORMANCE_FIXTURE.EMPTY.workInfo,
      };

    case 'CLEAR_ROUTING_INFO':
      return {
        ...state,
        routingInfo: WORK_PERFORMANCE_FIXTURE.EMPTY.routingInfo,
      };

    case 'CLEAR_ALL':
      return WORK_PERFORMANCE_FIXTURE.EMPTY;

    default:
      return state;
  }
};
