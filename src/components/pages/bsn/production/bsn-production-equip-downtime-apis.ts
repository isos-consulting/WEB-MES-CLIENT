import { getData } from '~/functions';

export const getWeeklyProductionEquipDowntimeType = (reg_date: string) => {
  return getData({ reg_date }, '/kpi/production/equip-downtime-type');
};

export const getMonthlyProductionEquipDowntimeType = (reg_date: string) => {
  return getData({ reg_date }, '/kpi/production/equip-downtime-type-month');
};
