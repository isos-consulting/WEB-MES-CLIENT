import { ErrorBase } from './base';
import { ERROR_MESSAGES } from './messageEnum';

export const errorRequireDecimal = new ErrorBase(
  ERROR_MESSAGES.REQUIRE_DECIMAL,
);
