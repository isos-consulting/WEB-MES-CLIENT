import { AxiosInstance } from 'axios';

export class MenuRepository {
  private static instance: MenuRepository;
  private request: AxiosInstance;

  private constructor(request: AxiosInstance) {
    this.request = request;
  }

  static getInstance(request: AxiosInstance) {
    if (!MenuRepository.instance) {
      MenuRepository.instance = new MenuRepository(request);
    }
    return MenuRepository.instance;
  }

  getPermissionMenus() {
    return this.request.get('aut/menus/permission');
  }
}
