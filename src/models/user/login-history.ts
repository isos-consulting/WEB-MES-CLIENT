export interface LoginHistoryApiResponse {
  user_id: string;
  user_nm: string;
  logged_at: string;
}

class UserLoginHistory {
  private readonly userId: string;
  private readonly userName: string;
  private readonly accessDateTime: string;

  constructor({ user_id, user_nm, logged_at }: LoginHistoryApiResponse) {
    this.userId = user_id;
    this.userName = user_nm;
    this.accessDateTime = logged_at;
  }

  info(): LoginHistoryApiResponse {
    return {
      user_id: this.userId,
      user_nm: this.userName,
      logged_at: this.accessDateTime,
    };
  }
}

export default UserLoginHistory;
