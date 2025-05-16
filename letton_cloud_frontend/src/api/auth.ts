import axios from "@/core/axios";
import {
  RegisterResponseDTO,
  LoginFormDTO,
  LoginResponseDTO,
  RegisterFormDTO,
  User,
} from "./dto/auth.dto";
import { destroyCookie } from "nookies";

export const login = async (
  values: LoginFormDTO
): Promise<LoginResponseDTO> => {
  return (await axios.post("/auth/login", values)).data;
};

export const register = async (
  values: RegisterFormDTO
): Promise<RegisterResponseDTO> => {
  return (await axios.post("/auth/register", values)).data;
};

export const getMe = async (): Promise<User> => {
  return (await axios.get("/users/me")).data;
};

export const logout = async (): Promise<void> => {
  destroyCookie(null, "_token", { path: "/" });
  window.location.reload();
};
