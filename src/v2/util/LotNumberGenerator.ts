import { getToday } from '~/functions';
import EXPRESSSIONS from '~/constants/expressions';

export class LotNumberGenerator {
  private day: string;

  constructor(day) {
    this.day = day;
  }

  /**
   *
   * @returns {LotNumberGenerator}
   * @memberof LotNumberGenerator
   * @description This method is used to get a instance of LotNumberGenerator
   * @example
   * LotNumberGenerator.today();
   *
   */
  static today() {
    return new LotNumberGenerator(getToday());
  }

  /**
   *
   * @param workday
   * @returns
   * @memberof LotNumberGenerator
   * @description This method is used to get a instance of LotNumberGenerator
   * @throws InvalidDateException
   * @example
   * LotNumberGenerator.workday('2021-01-01');
   *
   */
  static workday(workday: string) {
    return new LotNumberGenerator(workday);
  }

  /**
   *
   * @returns {string}
   * @memberof LotNumberGenerator
   * @description This method is used to generate a lot number
   * @example
   * LotNumberGenerator.today().generate();
   *
   */
  generate() {
    return this.day.replace(EXPRESSSIONS.NON_DIGIT_GLOBAL, '');
  }
}
