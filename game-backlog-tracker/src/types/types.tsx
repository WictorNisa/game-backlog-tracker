export interface User {
    id: number;
    username: string;
    email: string;
  }
  
  export interface LoginData {
    userEmail: string;
    userPassword: string;
  }
  
  export interface LoginResponse {
    message: string;
    token: string;
    user: User;
  }