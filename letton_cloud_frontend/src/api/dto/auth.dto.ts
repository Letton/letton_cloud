export interface LoginFormDTO {
  username: string;
  password: string;
}

export interface LoginResponseDTO {
  token: string;
}

export interface RegisterFormDTO {
  username: string;
  email: string;
  password: string;
}

export interface RegisterResponseDTO {
  token: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
}
