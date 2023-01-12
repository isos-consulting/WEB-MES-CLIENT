import { IGridColumn } from '~/components/UI';
import { ENUM_DECIMAL, ENUM_WIDTH } from '~/enums';
import { isNumber } from '~/functions';
import {
  getRangeDateAtMonth,
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

  private calcTotal({ fg, ...prices }) {
    return Object.values(prices).reduce((acc, cur) => {
      if (isNumber(cur)) return acc + Number(cur);

      return acc;
    }, 0);
  }

  private workRate(plan, actual) {
    if (plan === 0) return 0;
    if (actual === 0) return 0;

    return (actual / plan) * 100;
  }

  monthColumn(): IGridColumn[] {
    const year = this.getCastedYearForNumber();
    const monthColumns = Array(12)
      .fill(0)
      .map((_, i): IGridColumn => {
        const month = i + 1;
        const monthKey = month > 9 ? `${month}` : `0${month}`;

        return {
          header: `${month}월`,
          name: `${year}-${monthKey}`,
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
      ...monthColumns,
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

  monthData(data) {
    const service = new BsnProductionOrderWorkRateService('');
    const planTotalPrice = service.calcTotal(data[0]);
    const actualTotalPrice = service.calcTotal(data[1]);
    const rate = this.workRate(planTotalPrice, actualTotalPrice);

    return [
      { ...data[0], total: planTotalPrice.toString() },
      { ...data[1], total: actualTotalPrice.toString() },
      { ...data[2], total: rate.toString() },
    ];
  }

  static monthGraphLabel() {
    return Array(12)
      .fill(0)
      .map((_, i) => `${i + 1}월`);
  }

  static monthGraphData({ fg, total, ...rest }: { [key: string]: number }) {
    return Object.values(rest);
  }

  static emptyData() {
    return [{}, {}, { fg: null }];
  }

  weekColumn(): IGridColumn[] {
    const year = this.getCastedYearForNumber();
    const month = this.getCastedMonthForNumber();
    const weeks = getWeeksAtMonth(this.month);

    const weekHeaders = weeks.map(week => {
      const dates = getRangeDateAtMonthForWeek(year, month, week);

      if (dates.length > 1) {
        return `${week}주(${dates[0]} ~ ${dates[dates.length - 1]})`;
      }

      return `${week}주(${dates[0]})`;
    });

    const weekColumns = weekHeaders.map((weekHeader, i): IGridColumn => {
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

  weekData(data) {
    const planTotalPrice = this.calcTotal(data[0]);
    const actualTotalPrice = this.calcTotal(data[1]);
    const rate = this.workRate(planTotalPrice, actualTotalPrice);

    return [
      { ...data[0], total: planTotalPrice.toString() },
      { ...data[1], total: actualTotalPrice.toString() },
      { ...data[2], total: rate.toString() },
    ];
  }

  weekGraphLabel() {
    return getWeeksAtMonth(this.month).map(week => `${week}주`);
  }

  static weekGraphData({ fg, total, ...rest }: { [key: string]: number }) {
    return Object.values(rest);
  }

  firstHalfDateColumn(): IGridColumn[] {
    const dates = getRangeDateAtMonth(this.month);

    const dateColumns = dates.map((date): IGridColumn => {
      const dateKey = date > 9 ? `${date}` : `0${date}`;

      return {
        header: `${date}일`,
        name: `${this.month}-${dateKey}`,
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
      ...dateColumns.slice(0, dateColumns.length / 2 + 1),
    ];
  }

  lastHalfDateColumn(): IGridColumn[] {
    const dates = getRangeDateAtMonth(this.month);

    const dateColumns = dates.map((date): IGridColumn => {
      return {
        header: `${date}일`,
        name: `${this.month}-${date}`,
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
      ...dateColumns.slice(dateColumns.length / 2 + 1, dateColumns.length),
      {
        header: '합계',
        name: 'total',
        width: ENUM_WIDTH.M,
        format: 'number',
        decimal: ENUM_DECIMAL.DEC_PRICE,
      },
    ];
  }

  dateData(data) {
    const planTotalPrice = this.calcTotal(data[0]);
    const actualTotalPrice = this.calcTotal(data[1]);
    const rate = this.workRate(planTotalPrice, actualTotalPrice);

    return [
      { ...data[0], total: planTotalPrice.toString() },
      { ...data[1], total: actualTotalPrice.toString() },
      { ...data[2], total: rate.toString() },
    ];
  }

  dateGraphLabel() {
    return getRangeDateAtMonth(this.month).map(date => `${date}일`);
  }

  static dateGraphData({ fg, total, ...rest }: { [key: string]: number }) {
    return Object.values(rest);
  }
}
