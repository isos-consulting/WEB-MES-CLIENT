import { getData } from '~/functions';

export const getWeeklyProductionWorkerWorkPrices = reg_date => {
  return getData(
    { reg_date, week_fg: true },
    '/kpi/production/worker-work-price',
  );
};

export const getDailyProductionWorkerWorkPrices = reg_date => {
  return getData(
    {
      reg_date,
      week_fg: false,
    },
    '/kpi/production/worker-work-price',
  );
};

export const getMonthlyProductionWorkerWorkPrices = reg_date => {
  return getData(
    {
      reg_date,
    },
    '/kpi/production/worker-work-month-price',
  );
};
