import { NextFunction, Request, Response, RequestHandler } from "express";
import { ParamsDictionary } from "express-serve-static-core";

import { User } from "../database/models";
import { HTTP_STATUS, RESPONSE_MESSAGES } from "../constants";
import { removeNilorEmptyProps } from "../utilities";

type Query = {
  search: string;
  limit: string;
  page: string;
};

export const getCurrent: RequestHandler = async (req, res, next) => {
  try {
    const { userId } = req.headers;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        message: RESPONSE_MESSAGES.NOT_FOUND,
      });
    }
    return res.status(HTTP_STATUS.OK).json({
      message: RESPONSE_MESSAGES.OK,
      data: user,
    });
  } catch (error) {
    return next(error);
  }
};

export const update: RequestHandler = async (req, res, next) => {
  try {
    const { userId } = req.headers;
    const user = await User.findByIdAndUpdate(userId, req.body, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        message: RESPONSE_MESSAGES.NOT_FOUND,
      });
    }
    return res.status(HTTP_STATUS.OK).json({
      message: RESPONSE_MESSAGES.SUCCESS,
      data: user,
    });
  } catch (error) {
    return next(error);
  }
};

export const getAll = async (
  req: Request<ParamsDictionary, any, any, Query>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { search = "", limit = 10, page = 1 } = req.query;
    const limitNumber = Number(limit);
    const pageNumber = Number(page);
    const skip = (pageNumber - 1) * limitNumber;
    const searchConfig = { $regex: search, $options: "i" };
    const searchQuery = removeNilorEmptyProps({
      $or: search && [
        { name: searchConfig },
        { bio: searchConfig },
        { email: searchConfig },
      ],
    });
    const users = await User.find(searchQuery)
      .select("-password")
      .sort({ name: 1 })
      .limit(limitNumber)
      .skip(skip);
    const count = await User.countDocuments(searchQuery);
    return res.status(HTTP_STATUS.OK).json({
      message: RESPONSE_MESSAGES.SUCCESS,
      meta: {
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(count / limitNumber) || 1,
        count,
      },
      data: users,
    });
  } catch (error) {
    return next(error);
  }
};

export const getOne: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("-password");
    if (!user) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        message: RESPONSE_MESSAGES.NOT_FOUND,
      });
    }
    return res.status(HTTP_STATUS.OK).json({
      message: RESPONSE_MESSAGES.OK,
      data: user,
    });
  } catch (error) {
    return next(error);
  }
};

export const deleteOne: RequestHandler = async (req, res, next) => {
  try {
    const { userId } = req.headers;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        message: RESPONSE_MESSAGES.NOT_FOUND,
      });
    }
    await user.softDelete();
    return res.status(HTTP_STATUS.OK).json({
      message: RESPONSE_MESSAGES.SUCCESS,
    });
  } catch (error) {
    return next(error);
  }
};
