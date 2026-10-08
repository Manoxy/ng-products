
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  expires: number;
  rol: string;
  token: string;
  username: string;
}
