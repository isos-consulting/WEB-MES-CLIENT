/**
 * 셀 태그 렌더러
 */
 export class DatagridTagRenderer {
  constructor(props) {
      const { rowKey } = props;
      const { name } = props.columnInfo;
      const { conditions } = props.columnInfo.renderer.options;

      this.state = {
          elementId: name + rowKey,
          conditions,
      }
      
      const tag = document.createElement('span');

      tag.id = name + rowKey;
      tag.className = convTagClassName(conditions, props.value);
      tag.innerText = convTagValue(conditions, props.value);

      this.el = tag;
      this.render(props);
  }

  getElement() {
      return this.el;
  }

  render(props) {
      const element = document.getElementById(this.state?.elementId);

      if (this.el != null) {
        this.el.className = convTagClassName(this.state?.conditions, props.value);
        this.el.innerText = convTagValue(this.state?.conditions, props?.value);
      } else if(element != null) {
        element.className = convTagClassName(this.state?.conditions, props.value);
        element.innerText = convTagValue(this.state?.conditions, props?.value);
      }
  }
}

const convTagClassName = (conditions, value) => {
  for (const condition of conditions) {
    if (condition?.value === value) {
      if (condition?.className)
        return condition?.className;
      else
        return 'ant-tag ant-tag-custom ant-tag-' + condition?.color;
    }
  }
  return 'ant-tag ant-tag-custom hidden';
}

const convTagValue = (conditions, value) => {
  for (const condition of conditions) {
    if (condition?.value === value) {
      return condition?.text;
    }
  }
  return value;
}