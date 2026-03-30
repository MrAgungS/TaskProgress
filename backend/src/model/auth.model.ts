export class RegisterUserDto {
  name: string;
  email: string;
  password: string;
}

export class LoginUserDto {
  email: string;
  password: string;
}

export class LogoutDto {
  user_id: number;
  access_token: string;
}
