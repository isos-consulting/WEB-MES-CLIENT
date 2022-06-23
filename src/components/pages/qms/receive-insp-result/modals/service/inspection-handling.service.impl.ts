import { InputField, InputForm } from '../../models/fields';
import { InspectionService } from './inspection-service';

const InspectionHandlingServiceImpl = class implements InspectionService {
  private form: InputForm;

  constructor(inputForm: InputForm) {
    this.form = inputForm;
  }

  addFields(keys: string[]) {
    keys.forEach((key: string) => this.form.addField(new InputField(key)));
  }

  getField(key: string) {
    return this.form.getFields().find(field => field.info().name === key);
  }

  toggle() {
    this.form.getFields().forEach(field => field.toggle());
  }

  attributes() {
    const attribute = {};

    this.form
      .getFields()
      .forEach(field => (attribute[field.info().name] = !field.info().enable));

    return attribute;
  }
};

export default InspectionHandlingServiceImpl;
