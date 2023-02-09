import { message } from 'antd';
import { ENUM_DECIMAL } from '~/enums';
import { isNumber, setNumberToDigit } from '~/functions';

/** 그리드 숫자 인풋박스 */
export class DatagridNumberEditor {
  constructor(props) {
    // props 변수 선언
    const { name } = props.columnInfo;
    const { decimal } = props.columnInfo.editor?.options;

    this.state = props.columnInfo.editor?.options;

    // select 형식의 element 생성
    const rootDiv = document.createElement('input');
    rootDiv.className = 'tui-grid-content-number';

    rootDiv.type = 'number';
    rootDiv.name = name;

    // 넘겨받은 값으로 default value를 지정합니다.
    rootDiv.value = isNil(props.value)
      ? props.value
      : String(Number(props?.value).toFixed(decimal));

    if (decimal === 0) {
      rootDiv.step = '1';
    } else if (decimal) {
      let zeros = '';

      for (let index = 1; index < decimal; index++) {
        zeros += '0';
      }
      rootDiv.step = `0.${zeros}1`;
    }

    // 만들어진 sel element를 사용
    this.el = rootDiv;
  }

  getElement() {
    return this.el;
  }

  getValue() {
    const value = this.el?.value;
    if (value < this.state?.min) {
      message.error(
        `입력하신 숫자가 작습니다. ${this.state?.min} 이상의 숫자로 입력해주세요.`,
      );
      return this.state?.min;
    }

    if (value > this.state?.max) {
      message.error(
        `입력하신 숫자가 큽니다. ${this.state?.max} 이하의 숫자로 입력해주세요.`,
      );
      return this.state?.max;
    }

    if (this.state?.disableZero && Number(value) === 0) {
      message.error('숫자 0은 입력할 수 없습니다.');
      return null;
    }

    return this.el?.value;
  }

  mounted() {
    this.el.focus();
  }
}

/** 그리드 숫자 렌더러 */
export class DatagridNumberRenderer {
  constructor(props) {
    const { unit, decimal } = props.columnInfo.renderer?.options;

    this.state = {
      unit: unit ? ' ' + unit : '',
      decimal: decimal ? decimal : ENUM_DECIMAL.DEC_NOMAL,
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
    if (isNil(props?.value)) {
      this.el.innerText = null;
    } else {
      if (isNumber(props?.value || null)) {
        this.el.innerText =
          setNumberToDigit(Number(props?.value).toFixed(this.state?.decimal)) +
          this.state?.unit;
      } else {
        this.el.innerText = null;
      }
    }
  }
}
