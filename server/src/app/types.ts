import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";
import { Types } from "mongoose";

export interface ISuccessResponse {
  statusCode?: number;
  message?: string;
  payload?: object;
}

export interface IErrorResponse {
  success: boolean;
  message: string;
  errors: { path: string | number; message: string }[];
  stack?: string;
}

export interface IJwtPayload extends JwtPayload {
  _id: string;
  role: "superadmin" | "admin" | "user";
  loginCode: number;
}

export type ROLE = "user" | "admin";

export interface IUserSchema {
  name: string;
  email: string;
  password: string;
  role: ROLE;
}

export interface IUser extends IUserSchema {
  _id: string;
  createdAt: Date;
  notes?: string;
  history?: {
    date: Date;
    status: "active" | "inactive";
  }[];
}

export interface IRequestWithUser extends Request {
  user?: Pick<IUser, "_id" | "email" | "role">;
}

export interface ICctv {
  _id: string;
  name: string;
  latitude: number;
  longitude: number;
  zone: Types.ObjectId;
  pole: number;
  location: string;
  mac_id: string;
  ip: string;
  status: "active" | "inactive";
  //   rtsp_url: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICameraSchema {
  name: string;
  latitude: number;
  longitude: number;
  zone: Types.ObjectId;
  pole: number;
  location: string;
  mac_id: string;
  ip: string;
  status: "active" | "inactive";
  notes?: string;
  history?: {
    date: Date;
    status: "active" | "inactive";
  }[];
}
export interface IZone {
  _id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IZoneSchema {
  name: string;
  description?: string;
  location?: string;
  cameras?: Types.ObjectId[];
}

export interface IPagination {
  currentPage: number;
  totalPages: number;
  items: number;
  limit: number;
}
