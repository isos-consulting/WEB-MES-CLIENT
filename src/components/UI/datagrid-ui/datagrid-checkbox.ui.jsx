import { isNil } from '~/helper/common';

/** 체크박스 에디터 */
export class DatagridCheckboxEditor {
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
    rootDiv.className = 'tui-grid-content-check';

    rootDiv.type = 'checkbox';
    rootDiv.name = name;

    // 넘겨받은 값으로 default value를 지정합니다.
    rootDiv.checked = props.value || false;
    rootDiv.value = props.checked;

    // 만들어진 sel element를 사용
    this.el = rootDiv;
  }

  getElement() {
    return this.el;
  }

  getValue() {
    return this.el?.checked;
  }

  mounted() {
    this.el.focus();
  }
}

/** 체크박스 렌더러 */
export class DatagridCheckboxRenderer {
  constructor(props) {
    const { rowKey } = props;
    const { name } = props.columnInfo;
    const { gridId, gridMode, editable } = props.columnInfo.renderer?.options;
    const grid = props.grid;
    const rootDiv = document.createElement('div');
    const el = document.createElement('input');

    this.state = {
      elementId: gridId + name + rowKey,
    };

    el.type = 'checkbox';
    el.id = gridId + name + rowKey;
    el.style = 'transform: scale(1.3);';

    const isEditable =
      editable === true && ['create', 'update'].includes(gridMode) === true;

    if (isEditable) {
      el.addEventListener('change', e => {
        const { checked } = e.target;
        grid.setValue(rowKey, name, checked);
      });
    } else {
      el.onclick = () => false;
    }

    rootDiv.className = 'tui-grid-cell-content';
    rootDiv.appendChild(el);

    this.el = rootDiv;
    this.render(props, el);
  }

  getElement() {
    return this.el;
  }

  render(props, el) {
    const element = document.getElementById(this.state?.elementId);

    if (!isNil(el)) {
      el.checked = props?.value;
    } else if (!isNil(element)) {
      element.checked = props?.value;
    }
  }
}
