import Grid from '@toast-ui/react-grid';
import { useMemo, useReducer, useRef } from 'react';
import { useRecoilCallback } from 'recoil';
import { v4 as uuidv4 } from 'uuid';
import { afStringState } from '~/recoils/recoil.atom-family';
import { IInitialGridState, singleGridEvents, singleGridReducer } from '../grid-single-new';
import { ITpDoubleGridDetail, ITpDoubleGridHeader } from './grid-double.template.type';


//#region 더블 그리드 페이지 관련 리듀서
export const headerGridReducer = singleGridReducer;
export const detailGridReducer = singleGridReducer;


/** 신규 생성 팝업 그리드의 상태 초기값 */
export const newCreateGridInit:IInitialGridState = {
  gridId: uuidv4(),
  /** 사용할 때 값을 반드시 오버라이드해서 세팅해주세요!! */
  columns: null,
  /** 사용할 때 값을 반드시 오버라이드해서 세팅해주세요!! */
  searchItems: null,
  /** 사용할 때 값을 반드시 오버라이드해서 세팅해주세요!! */
  inputItems: null,
  gridMode:'create',
  data: [],
}


/** 세부 데이터 신규 생성 팝업 그리드의 상태 초기값 */
export const newDetailCreateGridInit:IInitialGridState = {
  gridId: uuidv4(),
  /** 사용할 때 값을 반드시 오버라이드해서 세팅해주세요!! */
  columns: null,
  /** 사용할 때 값을 반드시 오버라이드해서 세팅해주세요!! */
  searchItems: null,
  /** 사용할 때 값을 반드시 오버라이드해서 세팅해주세요!! */
  inputItems: null,
  gridMode:'create',
  data: [],
}


/** 더블 그리드 페이지 기본 액션 */
export const doubleGridEvents = {
  ...singleGridEvents,
  onShowNewCreatePopup: singleGridEvents.onShowCreatePopup,
  onShowDetailCreatePopup: singleGridEvents.onShowCreatePopup,
};


// const searchReducer = (state, action) => {
//   if (action.type) {
//     const stateKeys = Object.keys(state);

//     for (let i = 0; i < stateKeys.length; i++) {
//       if ('set' + convSnakeToPascal(stateKeys[i]) === action.type) {
//         return {...state, [stateKeys[i]]: action[stateKeys[i]]};
//       }
//     }
//   }
// }


export const baseHeaderDetailPage = (headerGridInit, detailGridInit, newCreateGridInit, newDetailGridInit) => {
  const NEW_CREATE_KEY = '$NEW';
  const headerGridRef = useRef<Grid>();
  const detailGridRef = useRef<Grid>();
  const newCreateGridRef = useRef<Grid>();
  const newDetailCreateGridRef = useRef<Grid>();

  // const [headerSearch, headerSearchDispatch] = useReducer(searchReducer, headerSearchInit);
  // const [detailSearch, detailSearchDispatch] = useReducer(searchReducer, detailSearchInit);

  const [headerGridState, headerGridDispatch] = useReducer(headerGridReducer, headerGridInit);
  const [detailGridState, detailGridDispatch] = useReducer(detailGridReducer, detailGridInit);
  
  const _newCreateGridInit = useMemo(() => {
    if (newCreateGridInit?.inputProps?.inputItems?.length > 0) {
      // 입력박스의 아이디만 치환해서 반환
      const inputItems = JSON.parse(JSON.stringify(newCreateGridInit?.inputProps?.inputItems));
      const newInputItems = [];

      inputItems.forEach((item) => {
        if (item?.id == null) {
          newInputItems.push(item);
          return;
        }

        if (Array.isArray(item['id']) === true) {
          item['id'][0] = NEW_CREATE_KEY + item['id'][0];
          item['id'][1] = NEW_CREATE_KEY + item['id'][1];

        } else {
          item['id'] = NEW_CREATE_KEY + item['id'];
        }

        if (item?.options == null) {
          newInputItems.push(item);
          return;
        }
        
        if (Object.keys(item?.options).length > 0) {
          item['options'] = item['options'].map((option) => {
            option['id'] = NEW_CREATE_KEY + option['id'];

            return option;
          });
        }
        
        newInputItems.push(item);
      });

      return {
        ...newCreateGridInit,
        inputProps: {
          inputItems: newInputItems
        }
      }

    } else {
      return newCreateGridInit;
    }
  }, [newCreateGridInit]);


  const [newCreateGridState] = useReducer(detailGridReducer, _newCreateGridInit);
  const [newDetailCreateGridState] = useReducer(detailGridReducer, newDetailGridInit);

  /** (header) 그리드 정보 */
  const header = useMemo<ITpDoubleGridHeader>(() => {
    return {
      gridRef: headerGridRef,
      gridDispatch: headerGridDispatch,
      gridItems: {
        ...headerGridState,
      },
      saveUriPath: headerGridState.saveUriPath,
      searchUriPath: headerGridState.searchUriPath,
      saveOptionParams: headerGridState.saveOptionParams,
      searchParams: headerGridState.searchParams,
    }
  }, [headerGridState]);  

  /** (detail) 그리드 정보 */
  const detail:ITpDoubleGridDetail = useMemo(() => {
    return {
      gridRef: detailGridRef,
      gridDispatch: detailGridDispatch,
      gridItems: {...detailGridState},
      saveUriPath: detailGridState.saveUriPath,
      searchUriPath: detailGridState.searchUriPath,
      saveOptionParams: detailGridState.saveOptionParams,
      searchParams: detailGridState.searchParams,
    }
  }, [detailGridState]); 



  
  /** 인풋박스의 값을 업데이트 하는 콜백함수 입니다. */
  const setInputboxItems = useRecoilCallback(({set, snapshot}) => async (newValues:object) => {
    const keys = Object.keys(newValues);
    let recoilState = null;

    keys?.forEach((id) => {
      for (let i = 0; i < detailGridState?.inputItems?.length; i++) {
        const item = detailGridState?.inputItems[i];
        if (item.id === id) {
          switch (item.type) {
            case 'text':
            case 'date':
              recoilState = afStringState(id);
              break;
              
            default:
              break;
          }
          break;
        }
      }

      if (recoilState != null) {
        set(recoilState, newValues[id]);
        recoilState = null
      }
    });
  });

  


  return {
    headerGrid: {
      // searchState: headerSearch,
      // searchDispatch: headerSearchDispatch,
      state: headerGridState,
      dispatch: headerGridDispatch,
      content: header
    },
    detailGrid: {
      // searchState: detailSearch,
      // searchDispatch: detailSearchDispatch,
      state: detailGridState,
      dispatch: detailGridDispatch,
      content: detail
    },
    newCreateGrid: {
      ref: newCreateGridRef,
      state: newCreateGridState
    },
    newDetailCreateGrid: {
      ref: newDetailCreateGridRef,
      state: newDetailCreateGridState
    },
    setInputboxItems
  }
}
//#endregion