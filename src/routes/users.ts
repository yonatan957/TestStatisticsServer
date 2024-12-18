import { Request, Response } from "express";
import {
  loginService,
  registerService,
} from "../services/user";
import { registerDTO } from "../DTO/registerDTO";
import { loginDTO } from "../DTO/loginDTO";

export const login = async (
  req: Request<any, any, loginDTO>,
  res: Response
) => {
  try {
    const result = await loginService(req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const register = async (
  req: Request<any, any, registerDTO>,
  res: Response
) => {
  try {
    const result = await registerService(req.body);
    res.status(201).json({ message: "success" });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};