import { User, UserState } from './user';

type ProfileProps = User & UserState;

export interface Profile extends ProfileProps {
  resetPassword(newPassword: string): Profile;
  updatePassword(newPassword: string): Profile;
  authenticate(): Profile;
}

const UserProfile = class implements Profile {
  readonly id: string;
  readonly password: string;
  readonly isAuthenticated: boolean;
  readonly isResetPassword: boolean;

  constructor(user: ProfileProps) {
    this.id = user.id;
    this.password = user.password;
    this.isAuthenticated = user.isAuthenticated;
    this.isResetPassword = user.isResetPassword;
  }

  resetPassword(newPassword: string): Profile {
    return new UserProfile({
      id: this.id,
      password: newPassword,
      isAuthenticated: this.isAuthenticated,
      isResetPassword: true,
    });
  }

  updatePassword(newPassword: string): Profile {
    return new UserProfile({
      id: this.id,
      password: newPassword,
      isAuthenticated: this.isAuthenticated,
      isResetPassword: false,
    });
  }

  authenticate(): Profile {
    return new UserProfile({
      id: this.id,
      password: this.password,
      isAuthenticated: true,
      isResetPassword: this.isResetPassword,
    });
  }
};

export default UserProfile;
