import { NextFunction, Response } from "express";
import createError from "http-errors";
import { IRequestWithUser, ROLE } from "../app/types";

export const authorize = (roles: ROLE[]) => {
  return (req: IRequestWithUser, _res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role as ROLE)) {
      throw createError.Forbidden(
        "You do not have permission to access this resource"
      );
    }
    next();
  };
};
