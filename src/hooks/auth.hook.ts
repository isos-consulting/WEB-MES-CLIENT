import { atom } from "recoil";


/** 유저 정보 인터페이스 */
export interface IUser {
  uid: number;
  id: string;
  userNm: string;
  token: string;
}


/** 유저 클래스 */
class User {
  state = atom<undefined | IUser>({
    key: "user",
    //default: null,
    default: JSON.parse(sessionStorage.getItem("userInfo")),
  });
}


/** 유저 클래스 */
class AuthStore {
  user: User;
  constructor() {
    this.user = new User();
  }
}

export const authStore = new AuthStore();
