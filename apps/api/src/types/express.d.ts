import { IUser } from "@shared";
import * as express from "express";

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}