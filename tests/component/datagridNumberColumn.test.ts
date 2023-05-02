import { errorRequireDecimal } from './../../src/error/index';
import { ENUM_DECIMAL } from './../../src/enums/datagrid.enum';
import { Props as GridProps } from '@toast-ui/react-grid';
import { ERROR_MESSAGES } from '../../src/error/messageEnum';

class Datagrid implements GridProps {
  format: string;
  decimal?: number;

  constructor(props: GridProps) {
    this.format = props.format;

    if (props.format === 'number') {
      if (props.decimal == null) {
        errorRequireDecimal.generate();
      }
      this.decimal = props.decimal;
    }
  }
}

test('type이 number인경우 decimal값은 필수적으로 넘겨주어야 함', () => {
  const grid = new Datagrid({
    format: 'number',
    decimal: ENUM_DECIMAL.DEC_NORMAL,
  });

  expect(grid).toEqual({ format: 'number', decimal: ENUM_DECIMAL.DEC_NORMAL });
});

test('정상적으로 decimal값이 넘어온 경우 테스트에 통과함', () => {
  try {
    new Datagrid({
      format: 'number',
    });
  } catch (error) {
    expect(error.message).toBe(ERROR_MESSAGES.REQUIRE_DECIMAL);
  }
});
