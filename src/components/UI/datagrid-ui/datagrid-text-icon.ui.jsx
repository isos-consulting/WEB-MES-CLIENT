/**
 * 셀 이미지 렌더러
 */
export class DatagridTextIconRenderer {
  constructor(props) {
    const { rowKey } = props;
    const { name } = props.columnInfo;
    const { placeHolder, imageSrc } = props.columnInfo.renderer.options;

    this.state = {
      elementId: name + rowKey,
    };

    const rootDiv = document.createElement('div');

    const el_value = document.createElement('input');
    const el_image = document.createElement('img');

    rootDiv.className = 'popup';

    el_value.id = this.state.elementId;
    el_value.type = 'text';
    el_value.placeholder = placeHolder;
    el_value.className = 'popup-input';
    el_value.disabled = true;
    el_value.value = props.value;

    el_image.src = imageSrc;
    el_image.className = 'popup-image';

    rootDiv.appendChild(el_value);
    rootDiv.appendChild(el_image);

    this.el = rootDiv;
    this.render(props);
  }

  getElement() {
    return this.el;
  }

  render(props) {
    const element = document.getElementById(this.state?.elementId);

    if (!isNil(this.el)) {
      this.el.value = props?.value;
    } else if (!isNil(element)) {
      element.value = props?.value;
    }
  }
}
