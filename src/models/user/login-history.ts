export interface LoginHistoryApiResponse {
  id: string;
  user_nm: string;
  created_at: string;
}

class UserLoginHistory {
  private readonly userId: string;
  private readonly userName: string;
  private readonly accessDateTime: string;

  constructor({ id, user_nm, created_at }: LoginHistoryApiResponse) {
    this.userId = id;
    this.userName = user_nm;
    this.accessDateTime = created_at;
  }

  info(): LoginHistoryApiResponse {
    return {
      id: this.userId,
      user_nm: this.userName,
      created_at: this.accessDateTime,
    };
  }
}

export default UserLoginHistory;
