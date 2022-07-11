type UserProps = {
  id: string;
  password: string;
};

interface User {
  id: string;
  password: string;
}

const CurrentUser = class implements User {
  id: string;
  password: string;

  constructor(user: UserProps) {
    this.id = user.id;
    this.password = user.password;
  }

  resetPassword(newPassword: string): User {
    return new CurrentUser({ id: this.id, password: newPassword });
  }
};

const UserManager = class {
  private readonly _users: Set<User>;

  constructor() {
    this._users = new Set<User>();
  }

  users(): Array<User> {
    return Array.from(this._users);
  }

  add(user: User): void {
    this._users.add(user);
  }

  remove(user: User): void {
    this._users.delete(user);
  }
};

export default UserManager;
export { User, CurrentUser };
