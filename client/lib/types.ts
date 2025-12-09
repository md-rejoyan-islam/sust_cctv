export type ROLE = "user" | "admin";

export interface IUserSchema {
  _id?: string;
  name: string;
  email: string;
  password?: string;
  role: ROLE;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICameraSchema {
  _id?: string;
  name: string;
  latitude: number;
  longitude: number;
  zone: IZone | string;
  pole: number;
  location: string;
  mac_id: string;
  ip: string;
  status: "active" | "inactive";
  history: {
    date: string;
    status: "active" | "inactive";
  }[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IZone {
  _id: string;
  name: string;
  description?: string;
  location?: string;
  createdAt: Date;
  cameras?: string[];
  updatedAt: Date;
}

export interface ICameraHistory {
  _id?: string;
  camera_id: string;
  status: "active" | "inactive";
  timestamp: Date;
  reason?: string;
}

export interface IPagination {
  currentPage: number;
  totalPages: number;
  items: number;
  limit: number;
}
