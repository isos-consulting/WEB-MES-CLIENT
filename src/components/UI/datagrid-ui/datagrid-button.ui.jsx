/** 체크박스 에디터 */
export class DatagridButtonEditor {
  constructor(props) {
    // props 변수 선언
    const { rowKey } = props;
    const { name } = props.columnInfo;
    const { gridId } = props.columnInfo.editor.options;

    this.state = {
      gridId: gridId,
      rowKey: rowKey,
      colName: name,
    };

    // select 형식의 element 생성
    const rootDiv = document.createElement('input');
    rootDiv.className = 'tui-grid-content-number';

    rootDiv.type = 'button';
    rootDiv.name = name;

    // 넘겨받은 값으로 default value를 지정합니다.
    rootDiv.value = props.value;

    // 만들어진 sel element를 사용
    this.el = rootDiv;
  }

  getElement() {
    return this.el;
  }

  getValue() {
    return this.el?.value;
  }

  mounted() {
    this.el.focus();
  }
}

/** 버튼 렌더러 */
export class DatagridButtonRenderer {
  constructor(props) {
    const { rowKey, grid } = props;
    const { name } = props.columnInfo;
    const { gridId, onClick, disabled } = props.columnInfo.renderer?.options;
    const value = props.columnInfo.renderer?.options?.value;
    const formatter = props.columnInfo.renderer?.options?.formatter;

    this.state = {
      elementId: gridId + name + rowKey,
      value,
    };

    const rootDiv = document.createElement('div');
    const el = document.createElement('button');

    // el.type = 'button';
    el.disabled = disabled;
    el.id = gridId + name + rowKey;
    if (onClick) el.addEventListener('click', ev => onClick(ev, props));

    if (value != null) {
      el.innerText = value;
    } else if (formatter != null && typeof formatter === 'function') {
      el.innerText = formatter(props);
    } else {
      el.innerText = String(props?.value);
    }

    rootDiv.className = 'tui-grid-cell-content';

    rootDiv.appendChild(el);

    this.el = rootDiv;
    this.render(props);
  }

  getElement() {
    return this.el;
  }

  render(props, el) {
    this.el.value = el?.innerText;
    // const element = document.getElementById(this.state?.elementId);

    // if (el != null) {
    //   if (this.state?.value != null) {
    //     el.innerText = this.state?.value;
    //   } else {
    //     el.innerText = String(props?.value) === 'true' ? props.columnInfo.renderer?.options?.formatTrue : props.columnInfo.renderer?.options?.formatFalse;
    //   }

    // } else if(element != null) {

    //   if (props.columnInfo.renderer?.options?.value != null) {
    //     element.innerText = props.columnInfo.renderer?.options?.value;
    //   } else {
    //     element.innerText = String(props?.value) === 'true' ? props.columnInfo.renderer?.options?.formatTrue : props.columnInfo.renderer?.options?.formatFalse;
    //   }
    // }
  }
}
