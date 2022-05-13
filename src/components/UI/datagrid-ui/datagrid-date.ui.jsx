import dayjs from 'dayjs';
import { getToday } from '~/functions';

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

    rootDiv.name = name;

    if (type === 'time') {
      // rootDiv.step = '1'; //seconds표시
      rootDiv.value = props.value;
    } else if (type === 'date') {
      rootDiv.value = props.value;
      rootDiv.max = '9999-12-31';
    } else {
      rootDiv.max = '9999-12-31T23:59:59';
      // rootDiv.step = '1'; //seconds표시
      if (props.value !== null) {
        let value = String(props.value);

        this.state = {
          ...this.state,
          value: value?.replace('.000', '')?.trim(),
        };

        rootDiv.value =
          props.value == null ? props.value : dayjs(value).format(dateFormat);
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
      if (this.el?.value !== null) {
        const value = String(this.el?.value);
        const stateValue = dayjs(this.state.value)
          .locale('ko')
          .format('YYYY-MM-DD[T]HH:mm:ss');

        // 값이 기존 값과 동일하면 원래 값을 그대로 출력합니다.
        if (stateValue === value) return this.state.rawValue;

        return this.el?.value == null
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
    switch (this.state.type) {
      case 'time':
        var timeRegExp = /^([1-9]|[01][0-9]|2[0-3]):([0-5][0-9])$/;
        var timeSecondRegExp =
          /^([1-9]|[01][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/;
        let value = props.value;
        if (
          !timeRegExp.test(value) &&
          !timeSecondRegExp.test(value) &&
          dayjs(value).isValid()
        ) {
          value = dayjs(value).format('HH:mm');
        }
        this.el.innerText = value;
        break;

      default:
        if (dayjs(props.value).isValid()) {
          this.el.innerText =
            props.value == null
              ? props.value
              : String(
                  dayjs(props.value).locale('ko').format(this.state.dateFormat),
                );
        } else {
          this.el.innerText = props.value ?? null;
        }
        break;
    }
  }
}
