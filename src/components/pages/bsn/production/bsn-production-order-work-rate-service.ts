import { IGridColumn } from '~/components/UI';
import { ENUM_DECIMAL, ENUM_WIDTH } from '~/enums';
import {
  getRangeDateAtMonthForWeek,
  getWeeksAtMonth,
} from '~/functions/date.function';

export class BsnProductionOrderWorkRateService {
  private month: string;

  constructor(month: string) {
    this.month = month.substring(0, 7);
  }

  private getCastedYearForNumber() {
    return Number(this.month.substring(0, 4));
  }

  private getCastedMonthForNumber() {
    return Number(this.month.substring(5, 7));
  }

  weekColumn(): IGridColumn[] {
    const year = this.getCastedYearForNumber();
    const month = this.getCastedMonthForNumber();
    const weeks = getWeeksAtMonth(this.month);

    const weekHeaders = weeks.map(week => {
      const dates = getRangeDateAtMonthForWeek(year, month, week);

      if (dates.length > 2) {
        return `${week}주(${dates[0]} ~ ${dates[dates.length - 1]})`;
      }

      return `${week}주(${dates[0]})`;
    });

    const weekColumns: IGridColumn[] = weekHeaders.map((weekHeader, i) => {
      const weekKey = weeks[i] > 9 ? `${weeks[i]}` : `0${weeks[i]}`;
      return {
        header: weekHeader,
        name: weekKey,
        format: 'number',
        decimal: ENUM_DECIMAL.DEC_PRICE,
        sortable: false,
      };
    });

    return [
      {
        header: '구분',
        name: 'fg',
        width: ENUM_WIDTH.M,
        sortable: false,
      },
      ...weekColumns,
      {
        header: '합계',
        name: 'total',
        width: ENUM_WIDTH.M,
        format: 'number',
        decimal: ENUM_DECIMAL.DEC_PRICE,
        sortable: false,
      },
    ];
  }

  weekLabel() {
    return getWeeksAtMonth(this.month).map(week => `${week}주`);
  }
}
