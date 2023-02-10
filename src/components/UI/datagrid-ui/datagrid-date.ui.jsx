import dayjs from 'dayjs';
import EXPRESSSIONS from '~/constants/expressions';
import { isNil, isNull } from '~/helper/common';

/** 날짜 포멧 에디터 */
export class DatagridDateEditor {
  constructor(props) {
    // props 변수 선언
    const { name } = props.columnInfo;
    const { type, dateFormat } = props.columnInfo?.editor?.options;

    this.state = {
      dateFormat: dateFormat ?? 'YYYY-MM-DD',
      type,
      value: props.value,
      rawValue: props.value,
    };

    // select 형식의 element 생성
    const rootDiv = document.createElement('input');
    rootDiv.className = 'tui-grid-content-date';

    rootDiv.type = type === 'datetime' ? 'datetime-local' : type;

    if (type === 'dateym') {
      rootDiv.type = 'month';
    }

    rootDiv.name = name;

    if (type === 'time') {
      rootDiv.value = props.value;
    } else if (type === 'date') {
      rootDiv.value = props.value;
      rootDiv.max = '9999-12-31';
    } else if (type === 'dateym') {
      rootDiv.value = props.value;
      rootDiv.max = '9999-12';
    } else {
      rootDiv.max = '9999-12-31T23:59:59';
      if (!isNull(props.value)) {
        let value = String(props.value);

        this.state = {
          ...this.state,
          value: value?.replace('.000', '')?.trim(),
        };

        rootDiv.value = isNil(props.value)
          ? props.value
          : dayjs(value).format(dateFormat);
      } else {
        rootDiv.value = props.value;
      }
    }

    // 만들어진 sel element를 사용
    this.el = rootDiv;
  }

  getElement() {
    return this.el;
  }

  getValue() {
    if (this.state.type === 'datetime') {
      if (!isNull(this.el?.value)) {
        const value = String(this.el?.value);
        const stateValue = dayjs(this.state.value)
          .locale('ko')
          .format('YYYY-MM-DD[T]HH:mm:ss');

        // 값이 기존 값과 동일하면 원래 값을 그대로 출력합니다.
        if (stateValue === value) return this.state.rawValue;

        return isNil(this.el?.value)
          ? props.value
          : dayjs(value).format('YYYY-MM-DD HH:mm:ss');
      } else {
        return this.el?.value;
      }
    } else {
      return this.el?.value;
    }
  }

  mounted() {
    this.el.focus();
  }
}

/** 날짜 포멧 렌더러 */
export class DatagridDateRenderer {
  constructor(props) {
    const { dateFormat, type } = props.columnInfo.renderer?.options;

    this.state = {
      dateFormat: dateFormat ?? 'YYYY-MM-DD HH:mm:ss',
      type,
    };

    const rootDiv = document.createElement('div');

    rootDiv.className = 'tui-grid-cell-content';

    this.el = rootDiv;
    this.render(props);
  }

  getElement() {
    return this.el;
  }

  render(props) {
    if (this.state.type === 'time') {
      let value = props.value;
      if (
        EXPRESSSIONS.HOUR_MINUTE.test(value) === false &&
        EXPRESSSIONS.HOUR_MINUTE_SECOND.test(value) === false &&
        dayjs(value).isValid()
      ) {
        value = dayjs(value).format('HH:mm');
      }
      this.el.innerText = value;
    } else {
      if (dayjs(props.value).isValid()) {
        if (isNil(props.value)) this.el.innerText = null;
        else
          this.el.innerText = `${dayjs(props.value)
            .locale('ko')
            .format(this.state.dateFormat)}`;
      } else {
        this.el.innerText = props.value ?? null;
      }
    }
  }
}
