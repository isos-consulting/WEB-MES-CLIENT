import '../styles/axios-progress.style.scss';
import {
  IGridColumn,
  IGridPopupColumnInfo,
} from '../components/UI/datagrid-new/datagrid.ui.type';
import dayjs, { Dayjs } from 'dayjs';
import Excel from 'exceljs';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
  afBooleanState,
  afStringState,
  afDateState,
} from '../recoils/recoil.atom-family';
import { atSideNavMenuContent } from '~/components/UI/side-navbar';
import { useLocation } from 'react-router-dom';

import { isNumber } from './number';

/**
 * xlsx => json으로 convert하는 함수입니다.
 * @param bufferData 엑셀파일 버퍼데이터
 * @returns 컬럼 및 object형식 데이터로 반환
 */
export const convExcelToJson = async (
  bufferData,
  columns: IGridColumn[],
): Promise<{ columns: IGridColumn[]; data: object[] }> => {
  const wb = new Excel.Workbook();
  let columnInfos = [];
  let rowData = {};
  let rowDatas = [];
  let columnRowIndex: number = null;
  let COLUMN_ROW_FLAG: boolean = true;

  try {
    const buffer = bufferData;
    await wb.xlsx.load(buffer as any).then(workbook => {
      workbook.eachSheet((sheet, id) => {
        // 우선 첫번째 시트만 읽도록 하였음
        if (id !== 1) return;

        rowData = {};
        rowDatas = [];
        columnRowIndex = null;
        COLUMN_ROW_FLAG = true;

        sheet.eachRow((row, rowIndex) => {
          rowData = {};

          // 첫행은 컬럼name, 두번째 행은 컬럼header라고 가정
          // 컬럼 매칭 (엑셀에 컬럼명과 그리드의 header명이 일치하는 col의 위치를 추출)
          if (COLUMN_ROW_FLAG) {
            if (columnRowIndex == null) {
              for (let i = 0; i < row.values.length; i++) {
                for (let z = 0; z < columns?.length; z++) {
                  if (columns[z].name === row.values[i]) {
                    columnInfos.push({
                      colName: columns[z].name,
                      colKey: i,
                    });
                    break;
                  }
                }
              }
            }

            if (columnRowIndex == null) {
              columnRowIndex = rowIndex;
            } else {
              COLUMN_ROW_FLAG = false;
            }

            // 컬럼 매칭된 기준으로 값 세팅
          } else {
            // 기본 edit값 세팅
            rowData['_edit'] = 'C';

            // 엑셀 값 삽입
            columnInfos.forEach(colInfo => {
              rowData[colInfo.colName] = row.getCell(colInfo.colKey).value;
            });

            rowDatas.push(rowData);
          }
        });
      });
    });

    return {
      columns,
      data: rowDatas,
    };
  } catch (e) {
    console.error(e);
    return {
      columns: null,
      data: null,
    };
  }
};

/**
 * 로그 작성 함수
 * @param logType 로그 타입
 * @param content 로그 내용
 * @param title 로그 제목 (default: 현재 라우트 위치)
 */
export const writeLog = (
  logType: 'Log' | 'Info' | 'Warning' | 'Error' = 'Log',
  content?: string,
  title: string = getCurrentRoute(),
): void => {
  switch (logType) {
    case 'Info':
      console.info('[ ' + title + ' ] : ', content);
      break;

    case 'Warning':
      console.warn('[ ' + title + ' ] : ', content);
      break;

    case 'Error':
      console.error('[ ' + title + ' ] : ', content);
      break;

    default:
      console.log('[ ' + title + ' ] : ', content);
      break;
  }
};

/** 현재 페이지의 URI를 리턴하는 함수 */
export const getCurrentRoute = (): string => {
  return window.location.pathname;
};

/**
 * 숫자 구문점 정규식 (숫자에 쉼표 붙이는 수량 및 금액에 주로 사용)
 * @param num 변형할 숫자 값
 * @param digit 숫자를 세는 단위 (default: 3)
 * @param dotSyntax 구문점 (default: 쉼표)
 */
export const setNumberToDigit = (
  num: number | string,
  digit: number = 3,
  dotSyntax: string = ',',
) => {
  var parts = num?.toString().split('.');
  var regex = new RegExp('\\B(?=(\\d{' + digit + '})+(?!\\d))', 'g');

  if (parts?.length > 0) {
    return (
      parts[0].replace(regex, dotSyntax) + (parts[1] ? '.' + parts[1] : '')
    );
  } else {
    return num;
  }
};

/**
 * object 배열 데이터를 csv로 추출하는 함수입니다.
 * @param JSONData 변환할 데이터 배열
 * @param ReportTitle 추출할 파일의 제목
 * @param ShowLabel 라벨 보임 여부
 * @returns
 */
export const JSONToCSVConvertor = (
  JSONData: object[],
  ReportTitle: string = dayjs().format('YYYYMMDDHHmmss').toString(),
  ShowLabel: boolean = false,
) => {
  //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
  var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;

  var CSV = '';
  //Set Report title in first row or line

  CSV += ReportTitle + '\r\n\n';
  //This condition will generate the Label/Header
  if (ShowLabel) {
    var row = '';

    //This loop will extract the label from 1st index of on array
    for (var index in arrData[0]) {
      //Now convert each value to string and comma-seprated
      row += index + ',';
    }
    row = row.slice(0, -1);

    //append Label row with line break
    CSV += row + '\r\n';
  }

  //1st loop is to extract each row
  for (var i = 0; i < arrData.length; i++) {
    var row = '';

    //2nd loop will extract each column and convert it in string comma-seprated
    for (var index in arrData[i]) {
      row += '"' + arrData[i][index] + '",';
    }

    //add a line break after each row
    CSV += row + '\r\n';
  }

  if (CSV == '') {
    alert('Invalid data');
    return;
  }

  //Generate a file name
  var fileName = 'MyReport_';
  //this will remove the blank-spaces from the title and replace it with an underscore
  fileName += ReportTitle.replace(/ /g, '_');

  //Initialize file format you want csv or xls
  var uri = 'data:text/csv;charset=UTF-8,\uFEFF' + encodeURI(CSV);

  // Now the little tricky part.
  // you can use either>> window.open(uri);
  // but this will not work in some browsers
  // or you will not get the correct file extension

  //this trick will generate a temp <a /> tag
  var link = document.createElement('a');
  link.href = uri;

  //set the visibility hidden so it will not effect on your web-layout
  link.download = fileName + '.csv';

  //this part will append the anchor tag and remove it after automatic click
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const convViewportToPixels = (value: string) => {
  var parts = value.match(/([0-9\.]+)(vh|vw)/);
  var q = Number(parts[1]);
  var side =
    window[['innerHeight', 'innerWidth'][['vh', 'vw'].indexOf(parts[2])]];
  return side * (q / 100);
};

/**
 * recoil state값을 컴포넌트 유형별로 조회하는 함수입니다.
 * @param type 컴포넌트 유형
 * @id recoil 아이디 값
 */
export const getItemState = (
  type:
    | 'text'
    | 'combo'
    | 'comboText'
    | 'radio'
    | 'check'
    | 'date'
    | 'dateString',
  id: string,
): [
  any,
  (val) => {
    // this is a function that will be called when the recoil state is changed
  },
] => {
  let result = null;

  switch (type) {
    case 'text':
    case 'combo':
    case 'comboText':
    case 'radio':
    case 'dateString':
      result = useRecoilState(afStringState(id));
      break;

    case 'check':
      result = useRecoilState(afBooleanState(id));
      break;

    case 'date':
      result = useRecoilState(afDateState(id));
      break;

    default:
      break;
  }

  return result;
};

/**
 * byte형식의 배열을 UTF8 형식의 문자열로 변환
 * @param data
 * @returns
 */
export const convByteArrayToUTF8string = async (data): Promise<string> => {
  const extraByteMap = [1, 1, 1, 1, 2, 2, 3, 0];
  var count = data.length;
  var str = '';

  for (var index = 0; index < count; ) {
    var ch = data[index++];

    if (ch & 0x80) {
      var extra = extraByteMap[(ch >> 3) & 0x07];

      if (!(ch & 0x40) || !extra || index + extra > count) return null;
      ch = ch & (0x3f >> extra);

      for (; extra > 0; extra -= 1) {
        var chx = data[index++];
        if ((chx & 0xc0) != 0x80) return null;
        ch = (ch << 6) | (chx & 0x3f);
      }
    }
    str += String.fromCharCode(ch);
  }
  return str;
};

/**
 * 두 개의 Object 타입 데이터를 비교하여 서로 같은 키를 가지고 있는지 확인해주는 함수
 * @param content keys
 * @param comparisonTarget
 * @returns
 */
export const getObjectKeyDuplicateCheck = (
  keys: string[],
  targetKeys: string[],
): boolean => {
  let _keys = cloneObject(keys);
  let _targetKeys = cloneObject(targetKeys);
  let result: boolean = false;

  for (let i = 0; i < _keys?.length; i++) {
    for (let z = 0; z < _targetKeys?.length; z++) {
      if (_keys[i] === _targetKeys[z]) {
        result = true;
        break;
      }
    }
  }

  return result;
};

/**
 * 현재 라우트의 페이지명을 반환합니다.
 * (함수 최상위에서 사용해야 합니다.)
 * @returns 현재 라우트 페이지명
 */
export const getPageName = () => {
  const menuContent = useRecoilValue(atSideNavMenuContent);
  const { pathname } = useLocation();

  return Object.keys(menuContent).find(
    (key: string) => menuContent[key].path === pathname,
  );
};

type dayOptions = {
  format?: string;
  unitType?: dayjs.UnitType;
};

/**
 * 오늘 날짜를 반환합니다.
 * @param addNum 오늘날짜 기준에서 더할 값
 * @param options 포맷 또는 유닛타입(day, year 등등... 기본값은 day)
 * @returns string형식의 오늘날짜
 */
export const getToday = (
  addNum: number = 0,
  options: dayOptions = {
    format: 'YYYY-MM-DD',
    unitType: 'day',
  },
): string => {
  return addNum === 0
    ? dayjs().format(options.format)
    : addDate(dayjs(), addNum, options);
};

/**
 * 오늘 년월시분초를 반환합니다.
 * @param addNum 오늘날짜 기준에서 더할 값
 * @param options 포맷 또는 유닛타입(day, year 등등... 기본값은 day)
 * @returns string형식의 오늘날짜
 */
export const getNow = (
  addNum: number = 0,
  options: dayOptions = {
    format: 'YYYY-MM-DD HH:mm:ss',
    unitType: 'day',
  },
): string => {
  return addNum === 0
    ? dayjs().format(options.format)
    : addDate(dayjs(), addNum, options);
};

/**
 * 일자를 더합니다.
 * @param date 기존일자
 * @param num 덧할 숫자
 * @param options 포맷 또는 유닛타입(day, year 등등... 기본값은 day)
 * @returns string형식의 날짜
 */
export const addDate = (
  date: string | Dayjs,
  num: number = 0,
  options: dayOptions = {
    format: 'YYYY-MM-DD',
    unitType: 'day',
  },
): string => {
  // if (num < 0)
  //   return dayjs(date).subtract(Math.abs(num), 'day').format(options.format);
  // else
  return dayjs(date).add(num, options.unitType).format(options.format);
};

/**
 * 앞 글자를 대문자로 변경하여 반환합니다.
 * @returns hello => Hello
 */
export const convUpperToFirstChar = (lowercaseFormatStr: string): string => {
  return lowercaseFormatStr?.replace(/\b[a-z]/, (firstCharacter: string) =>
    firstCharacter.toUpperCase(),
  );
};

/**
 * 스네이크 케이스 형식 문자열을 파스칼 케이스 형식으로 변환합니다.
 * @param value 문자열
 * @returns my_val => MyVal
 */
export const convSnakeToPascal = (
  includesSlashSnakeFormatStr: string,
): string => {
  return includesSlashSnakeFormatStr
    .split('/')
    .map((snakeFormatStr: string) =>
      snakeFormatStr
        .split('_')
        .map(substr => substr.charAt(0).toUpperCase() + substr.slice(1))
        .join(''),
    )
    .join('/');
};

/**
 * 오브젝트 값의 유효한 키만 남기고 불필요한 키는 제거해서 반환해주는 함수
 * @param objValue key:value 형식의 객체
 * @param keys 객체내 유효한 key명의 배열
 * @returns
 */
export const cleanupKeyOfObject = (
  objValue: object = {},
  keys: string[],
): object => {
  const newObject = cloneObject(objValue);

  for (const [key] of Object.entries(objValue)) {
    if (!keys?.includes(key)) {
      delete newObject[key];
    }
  }

  return newObject;
};

/**
 * 오브젝트 또는 오브젝트 배열 변수를 복사합니다. (깊은 복사 & 참조 제거)
 *
 * ※※※ 오브젝트 내에 function값을 체크한 후 undfined가 되지 않게 복사 합니다.
 * @param obj
 * @returns
 */
export const cloneObject = (obj: object | any[]): any => {
  if (obj == null) return obj;

  if (Array.isArray(obj)) {
    // object 배열인 경우
    const cloneObjArray = JSON.parse(JSON.stringify(obj));

    // function check
    (obj as any[])?.forEach((el, index) => {
      const objValues: any[] = Object.values(el);
      if (objValues?.length > 0) {
        for (const key in el) {
          if (typeof el[key] === 'function') {
            cloneObjArray[index][key] = el[key];
          }
        }
      }
    });

    return cloneObjArray;
  }
  if (typeof obj === 'object') {
    // object인 경우
    // function check
    const cloneObj = JSON.parse(JSON.stringify(obj));
    const objValues: any[] = Object.values(obj);
    if (objValues?.length === 0) return obj;

    for (const key in obj) {
      if (typeof obj[key] === 'function') {
        cloneObj[key] = obj[key];
      }
    }

    return cloneObj;
  } else {
    // 그 외의 타입인 경우엔 그대로 반환
    return obj;
  }
};

export const blankThenNull = (value: any) => {
  if (value == null || value === '') {
    return null;
  } else {
    return value;
  }
};

export const onAsyncFunction = async (func, ...argument) => {
  if (argument) func(...argument);
  else {
    func();
  }
};

/** 셀 단위 합/불 판정 */
export const getInspCheckResultValue = (value, { specMin, specMax }) => {
  let resultFg = true;
  let nullFg = true;

  resultFg = true;
  nullFg = true;

  if (value) {
    nullFg = false;
  }

  if (isNumber(specMin) || isNumber(specMax)) {
    if (isNumber(value) === false) {
      // 입력된 값이 숫자가 아니라면
      if (value) {
        resultFg = false;
      }
    } else {
      // 입력된 값이 숫자이면

      if (
        isNumber(specMin) &&
        isNumber(specMax) &&
        (Number(specMin) > Number(value) || Number(specMax) < Number(value))
      ) {
        resultFg = false;
      } else if (isNumber(specMin) && Number(specMin) > Number(value)) {
        resultFg = false;
      } else if (isNumber(specMax) && Number(specMax) < Number(value)) {
        resultFg = false;
      }
    }
  } else if (value && value.toUpperCase() !== 'OK') {
    resultFg = false;
  }

  return [
    /** nullFg */
    nullFg,
    /** resultFg */
    resultFg,
  ];
};

/** 행 단위 합/불 판정 */
export const getInspCheckResultInfo = (rowData, rowKey, { maxCnt }) => {
  let nullFg = false;
  let resultFg = true;

  for (let i = 0; i < maxCnt; i++) {
    const valueKey = 'x' + (i + 1) + '_insp_value';
    const value = rowData[valueKey];
    const columnName = 'x' + (i + 1) + '_insp_result_fg';
    if (!value) {
      nullFg = true;
    } else {
      if (!rowData[columnName]) {
        resultFg = false;
      }
    }
  }
  return [
    /** nullTotalFg */
    nullFg,
    /** resultTotalFg */
    resultFg,
  ];
};

/** 최종 합/불 판정 */
export const getInspCheckResultTotal = (rawData, maxRowCnt) => {
  let nullFg = false;
  let resultFg = true;
  let emptyFg = true;
  for (let i = 0; i <= maxRowCnt; i++) {
    if (rawData[i]?.insp_result_state) {
      resultFg &&= rawData[i]?.insp_result_fg as boolean;
      emptyFg = false;
    } else {
      nullFg = true;
    }
  }

  return [
    /** nullFg */
    nullFg,
    /** resultFg */
    resultFg,
    /** emptyFg */
    emptyFg,
  ];
};

export const addKeyOfObject = (
  target: object = {},
  keys: IGridPopupColumnInfo[],
) => {
  const result = cloneObject(target);

  keys?.forEach(({ original, popup }) => (result[original] = target[popup]));

  return result;
};
