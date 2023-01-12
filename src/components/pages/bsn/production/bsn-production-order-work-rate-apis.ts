import { getData } from '~/functions';

export const getWeeklyProductionOrderWorkRate = reg_date => {
  return getData(
    { reg_date, week_fg: true },
    '/kpi/production/order-work-rate',
  );
};

export const getDailyProductionOrderWorkRate = reg_date => {
  return getData(
    {
      reg_date,
      week_fg: false,
    },
    '/kpi/production/order-work-rate',
  );
};

export const getMonthlyProductionOrderWorkRate = reg_date => {
  return getData(
    {
      reg_date,
    },
    '/kpi/production/order-work-month-rate',
  );
};
