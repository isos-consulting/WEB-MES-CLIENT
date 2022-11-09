export class InputForm {
  private fields: Set<InputField>;

  constructor() {
    this.fields = new Set<InputField>();
  }

  addField(field) {
    if (!(field instanceof InputField)) console.log('invalid field');
    this.fields.add(field);
  }

  removeField(field) {
    if (!(field instanceof InputField)) console.log('invalid field');
    this.fields.delete(field);
  }

  getFields() {
    return Array.from(this.fields.values());
  }
}

export class InputField {
  private name: string;
  private isEnable: boolean;

  constructor(name: string) {
    this.name = name;
    this.isEnable = true;
  }

  toggle() {
    this.isEnable = !this.isEnable;
  }

  info() {
    return { name: this.name, enable: this.isEnable };
  }
}

export class QuantityField {
  private quantity: number;
  private field: InputField;

  constructor(field: InputField) {
    this.field = field;
    this.quantity = 0;
  }

  setQuantity(quantity: number) {
    this.quantity = quantity;
  }

  getQuantity() {
    return this.quantity;
  }

  toggle() {
    this.field.toggle();
  }

  info() {
    return { ...this.field.info(), quantity: this.quantity };
  }
}
