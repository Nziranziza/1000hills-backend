import { RequestHandler } from "express";
import jwt from "jsonwebtoken";

import { HTTP_STATUS, RESPONSE_MESSAGES } from "../constants";
import { User } from "../database/models";

export const verifyToken: RequestHandler = async (req, res, next) => {
  try {
    const { token } = req.headers;
    if (!token) {
      return next();
    }
    const decoded = jwt.verify(
      token as string,
      process.env.PRIVATE_KEY as string
    ) as any;
    const user = await User.findById(decoded.id).lean();
    if (!user) {
      req.headers.userId = undefined;
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        message: RESPONSE_MESSAGES.INVALID_TOKEN,
      });
    }
    req.headers.userId = user._id as string;
    return next();
  } catch (error) {
    req.headers.userId = undefined;
    return next(error);
  }
};

export const requireLogin: RequestHandler = async (req, res, next) => {
  try {
    const { userId } = req.headers;
    if(!userId) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        message: RESPONSE_MESSAGES.AUTHORIZATION_REQUIRED,
      });
    }
    return next();
  } catch(error) {
    return next(error)
  }
}
