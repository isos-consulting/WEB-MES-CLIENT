import { AxiosInstance } from 'axios';

export class DasRepository {
  private static instance: DasRepository;
  private request: AxiosInstance;

  private constructor(request: AxiosInstance) {
    this.request = request;
  }

  static getInstance(request: AxiosInstance) {
    if (!DasRepository.instance) {
      DasRepository.instance = new DasRepository(request);
    }
    return DasRepository.instance;
  }

  getOverallStatus(reg_date: string) {
    return this.request.get('das/overall-status', {
      params: { reg_date },
    });
  }

  getRealtimeStatus(reg_date: string) {
    return this.request.get('das/realtime-status', {
      params: { reg_date },
    });
  }
}
