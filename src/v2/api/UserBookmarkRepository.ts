import { AxiosInstance } from 'axios';

export class UserBookmarkRepository {
  private static instance: UserBookmarkRepository;
  private request: AxiosInstance;

  private constructor(request: AxiosInstance) {
    this.request = request;
  }

  static getInstance(request: AxiosInstance) {
    if (!UserBookmarkRepository.instance) {
      UserBookmarkRepository.instance = new UserBookmarkRepository(request);
    }
    return UserBookmarkRepository.instance;
  }

  getBookmarks() {
    return this.request.get('aut/bookmarks');
  }
}
