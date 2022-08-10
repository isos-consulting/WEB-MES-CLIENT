/** 그리드 콤보박스 에디터 */
export class DatagridComboboxEditor {
  constructor(props) {
    // props 변수 선언
    const { rowKey, grid } = props;
    const { name } = props.columnInfo;
    const { id, gridId, listItems, codeColName, textColName } =
      props.columnInfo.editor.options;

    // class 안에서 사용될 변수 선언
    this.state = {
      id,
      gridId,
      rowKey,
      textColName: textColName,
      codeColName: codeColName,
      grid: grid,
    };

    // select 형식의 element 생성
    const rootDiv = document.createElement('div');
    rootDiv.className = 'select';

    const sel = document.createElement('select');
    let opt = null;

    sel.id = id;
    sel.name = name;
    sel.className = 'select-selector';

    // 넘겨받은 list의 크기만큼 select안에 들어갈 option element 생성
    //sel.className = 'dropdown'
    for (let i = 0; i < listItems?.length; i++) {
      opt = document.createElement('option');
      opt.className = 'select-list';
      opt.value = String(listItems[i]?.code);
      opt.text = String(listItems[i]?.text);
      sel.add(opt, null);
    }

    // 넘겨받은 값으로 콤보박스의 default value를 지정합니다.
    sel.value = String(grid.getValue(rowKey, codeColName));

    // 만들어진 sel element를 사용
    rootDiv.appendChild(sel);
    this.el = rootDiv;
  }

  getElement() {
    return this.el;
  }

  getValue() {
    const { id, rowKey, codeColName, grid } = this.state;

    let e = document.getElementById(id);
    let selCode = e.options[e.selectedIndex]?.value;
    let selText = e.options[e.selectedIndex]?.text;

    grid.setValue(rowKey, codeColName, selCode);

    return selText;
  }

  mounted() {
    let e = document.getElementById(this.state.id);
    e.focus();
  }
}
