import { IGridColumn } from '~/components/UI';
import { ENUM_DECIMAL } from '~/enums';
import { getWeeksAtMonth } from '~/functions/date.function';
import {
  getMonthlyProductionEquipDowntimeType,
  getWeeklyProductionEquipDowntimeType,
} from './bsn-production-equip-downtime-apis';

export class BsnProductionEquipDowntimeService {
  private static months = [
    '01',
    '02',
    '03',
    '04',
    '05',
    '06',
    '07',
    '08',
    '09',
    '10',
    '11',
    '12',
  ];

  private static colors = [
    'rgb(59, 194, 41)',
    'rgb(14, 203, 248)',
    'rgb(171, 161, 31)',
    'rgb(166, 57, 83)',
    'rgb(134, 41, 223)',
    'rgb(67, 4, 232)',
    'rgb(75, 75, 25)',
    'rgb(239, 18, 251)',
    'rgb(152, 150, 74)',
    'rgb(181, 208, 116)',
    'rgb(175, 165, 100)',
    'rgb(254, 29, 248)',
    'rgb(205, 254, 5)',
    'rgb(44, 131, 238)',
    'rgb(96, 61, 17)',
    'rgb(216, 47, 198)',
    'rgb(33, 231, 9)',
    'rgb(42, 152, 237)',
    'rgb(219, 115, 250)',
    'rgb(71, 54, 163)',
    'rgb(180, 196, 249)',
    'rgb(106, 204, 193)',
    'rgb(21, 132, 246)',
    'rgb(171, 108, 219)',
    'rgb(118, 134, 22)',
    'rgb(72, 155, 55)',
    'rgb(99, 113, 201)',
    'rgb(102, 107, 75)',
    'rgb(197, 91, 71)',
    'rgb(26, 180, 113)',
    'rgb(88, 33, 138)',
    'rgb(244, 16, 82)',
    'rgb(95, 32, 156)',
    'rgb(193, 57, 36)',
    'rgb(23, 102, 85)',
    'rgb(26, 185, 40)',
    'rgb(235, 174, 233)',
    'rgb(199, 195, 49)',
    'rgb(199, 110, 93)',
    'rgb(247, 208, 246)',
    'rgb(174, 253, 74)',
    'rgb(101, 69, 136)',
    'rgb(68, 7, 114)',
    'rgb(149, 63, 82)',
    'rgb(48, 136, 77)',
    'rgb(207, 104, 196)',
    'rgb(67, 146, 185)',
    'rgb(52, 97, 33)',
    'rgb(43, 174, 48)',
    'rgb(59, 80, 50)',
    'rgb(96, 248, 52)',
    'rgb(34, 19, 29)',
    'rgb(116, 225, 232)',
    'rgb(105, 163, 83)',
    'rgb(183, 223, 147)',
    'rgb(240, 59, 186)',
    'rgb(167, 121, 65)',
    'rgb(108, 229, 49)',
    'rgb(166, 166, 240)',
    'rgb(24, 252, 9)',
    'rgb(102, 227, 209)',
    'rgb(168, 123, 180)',
    'rgb(134, 106, 15)',
    'rgb(130, 26, 153)',
    'rgb(92, 18, 2)',
    'rgb(150, 113, 207)',
    'rgb(112, 137, 99)',
    'rgb(227, 112, 194)',
    'rgb(139, 184, 50)',
    'rgb(88, 188, 244)',
    'rgb(176, 39, 223)',
    'rgb(107, 76, 73)',
    'rgb(91, 67, 51)',
    'rgb(164, 61, 113)',
    'rgb(112, 242, 139)',
    'rgb(22, 219, 135)',
    'rgb(9, 62, 79)',
    'rgb(178, 20, 5)',
    'rgb(49, 115, 94)',
    'rgb(161, 45, 90)',
    'rgb(147, 62, 35)',
    'rgb(36, 162, 214)',
    'rgb(7, 6, 134)',
    'rgb(9, 89, 35)',
    'rgb(187, 168, 120)',
    'rgb(200, 17, 81)',
    'rgb(76, 11, 184)',
    'rgb(31, 140, 205)',
    'rgb(174, 72, 14)',
    'rgb(43, 141, 217)',
    'rgb(177, 90, 132)',
    'rgb(9, 118, 109)',
    'rgb(237, 15, 97)',
    'rgb(26, 149, 241)',
    'rgb(196, 22, 148)',
    'rgb(174, 195, 93)',
    'rgb(86, 24, 48)',
    'rgb(15, 157, 109)',
    'rgb(27, 43, 188)',
    'rgb(152, 74, 243)',
  ];

  static weekColumns(month: string): IGridColumn[] {
    const weeks: IGridColumn[] = getWeeksAtMonth(month).map(week => ({
      header: `${week}주차`,
      name: `${week}`,
      format: 'number',
      decimal: ENUM_DECIMAL.DEC_STCOK,
    }));

    return [
      { header: '원인항목', name: 'fg' },
      ...weeks,
      { header: '점유율', name: 'avg', format: 'percent' },
    ];
  }

  async weeklyData({ reg_date }: { reg_date: string }) {
    const weeks = getWeeksAtMonth(reg_date);

    const weeklyEquipDownTimeTypes = await getWeeklyProductionEquipDowntimeType(
      reg_date,
    );

    const weeklyEquipDownTimeTotal = weeklyEquipDownTimeTypes.reduce(
      (acc, { fg, ...equipDownTimesForWeek }) => {
        const totalCalculatedData = Object.entries(
          equipDownTimesForWeek,
        ).reduce(({ fg, total, ...datasForWeek }, [week, equipDownTime]) => {
          if (datasForWeek.hasOwnProperty(week))
            return {
              ...datasForWeek,
              [week]: datasForWeek[week] + equipDownTime,
              total: total + equipDownTime,
            };
          else
            return {
              ...datasForWeek,
              [week]: equipDownTime,
              total: total + equipDownTime,
            };
        }, acc);

        return { fg: '합계', ...totalCalculatedData };
      },
      { fg: '합계', total: 0 },
    );

    return [...weeklyEquipDownTimeTypes, weeklyEquipDownTimeTotal].map(
      (weeklyEquipDownTimeType, index) => {
        const filledWeeklyEquipDownTimeType = weeks.reduce(
          ({ fg, total, ...datasForWeek }, cur) => {
            if (!weeklyEquipDownTimeType.hasOwnProperty(cur))
              return {
                fg,
                [cur]: 0,
                total: total,
                ...datasForWeek,
              };
            else
              return {
                fg,
                [cur]: weeklyEquipDownTimeType[cur],
                total: total + weeklyEquipDownTimeType[cur],
                ...datasForWeek,
              };
          },
          { fg: weeklyEquipDownTimeType.fg, total: 0 },
        );

        if (index < weeklyEquipDownTimeTypes.length) {
          const avg =
            filledWeeklyEquipDownTimeType.total /
            weeklyEquipDownTimeTotal.total;

          if (Number.isNaN(avg)) {
            return {
              ...filledWeeklyEquipDownTimeType,
              avg: 0,
            };
          }

          return {
            ...filledWeeklyEquipDownTimeType,
            avg,
          };
        }

        return { ...filledWeeklyEquipDownTimeType, avg: 0 };
      },
    );
  }

  static weeklyGraphData(data: unknown[]) {
    const avgOverZeroFilteredData = data.filter(({ avg }) => avg > 0);
    const backgroundColors = this.colors.map(color =>
      color.replace(')', ', 0.2)').replace('rgb', 'rgba'),
    );

    if (avgOverZeroFilteredData.length === 0)
      return {
        labels: ['분석 데이터가 없습니다'],
        datasets: [
          {
            label: '월 설비가동율 미달성 유형별 분석',
            data: [100],
            backgroundColor: backgroundColors,
            borderColor: this.colors,
            borderWidth: 1,
          },
        ],
      };

    return {
      labels: avgOverZeroFilteredData.map(({ fg }) => fg),
      datasets: [
        {
          label: '월 설비가동율 미달성 유형별 분석',
          data: avgOverZeroFilteredData.map(({ avg }) => avg),
          backgroundColor: backgroundColors,
          borderColor: this.colors,
          borderWidth: 1,
        },
      ],
    };
  }

  static monthColumns(year): IGridColumn[] {
    const months: IGridColumn[] = this.months.map(month => ({
      header: `${Number(month)}월`,
      name: `${year}-${month}`,
      format: 'number',
      decimal: ENUM_DECIMAL.DEC_STCOK,
    }));

    return [
      { header: '원인항목', name: 'fg' },
      ...months,
      { header: '점유율', name: 'avg', format: 'percent' },
    ];
  }

  async monthlyData({ reg_date }: { reg_date: string }) {
    const monthlyEquipDownTimes = await getMonthlyProductionEquipDowntimeType(
      reg_date,
    );

    const monthlyEquipDownTimeTotal = monthlyEquipDownTimes.reduce(
      (acc, { fg, ...equipDownTimesForMonth }) => {
        const totalCalculatedData = Object.entries(
          equipDownTimesForMonth,
        ).reduce(({ fg, total, ...datasForMonth }, [month, equipDownTime]) => {
          if (datasForMonth.hasOwnProperty(month))
            return {
              ...datasForMonth,
              [month]: datasForMonth[month] + equipDownTime,
              total: total + equipDownTime,
            };
          else
            return {
              ...datasForMonth,
              [month]: equipDownTime,
              total: total + equipDownTime,
            };
        }, acc);

        return { fg: '합계', ...totalCalculatedData };
      },
      { fg: '합계', total: 0 },
    );

    return [...monthlyEquipDownTimes, monthlyEquipDownTimeTotal].map(
      (data, index) => {
        const filledMonthlyEquipDownTimeType =
          BsnProductionEquipDowntimeService.months.reduce(
            ({ fg, total, ...rest }, month) => {
              const downtimeMonth = `${reg_date.substring(0, 5)}${month}`;
              if (!data.hasOwnProperty(downtimeMonth)) {
                return {
                  ...rest,
                  fg,
                  total: total,
                  [downtimeMonth]: 0,
                };
              }

              return {
                ...rest,
                fg,
                total: total + data[downtimeMonth],
                [downtimeMonth]: data[downtimeMonth],
              };
            },
            {
              fg: data.fg,
              total: 0,
            },
          );

        if (index < monthlyEquipDownTimes.length) {
          const avg =
            filledMonthlyEquipDownTimeType.total /
            monthlyEquipDownTimeTotal.total;

          if (Number.isNaN(avg)) {
            return {
              ...filledMonthlyEquipDownTimeType,
              avg: 0,
            };
          }

          return {
            ...filledMonthlyEquipDownTimeType,
            avg,
          };
        }

        return { ...filledMonthlyEquipDownTimeType, avg: 0 };
      },
    );
  }
}
