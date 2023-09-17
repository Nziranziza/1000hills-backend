import { NextFunction, Request, Response, RequestHandler } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { Types } from "mongoose";

import { Post } from "../database/models";
import { HTTP_STATUS, RESPONSE_MESSAGES } from "../constants";

type Query = {
  search: string;
  limit: string;
  page: string;
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
    const posts = await Post.find({
      $or: [{ title: searchConfig }, { description: searchConfig }],
    })
      .limit(limitNumber)
      .skip(skip);
    const count = await Post.countDocuments();
    return res.status(HTTP_STATUS.OK).json({
      message: RESPONSE_MESSAGES.SUCCESS,
      meta: {
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(count / limitNumber) || 1,
        count
      },
      data: posts,
    });
  } catch (error) {
    return next(error);
  }
};

export const getOne: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        message: RESPONSE_MESSAGES.NOT_FOUND,
      });
    }
    return res.status(HTTP_STATUS.OK).json({
      message: RESPONSE_MESSAGES.SUCCESS,
      data: post,
    });
  } catch (error) {
    return next(error);
  }
};

export const create: RequestHandler = async (req, res, next) => {
  try {
    const { userId } = req.headers;
    const post = await Post.create({
      ...req.body,
      userId,
    });
    return res.status(HTTP_STATUS.CREATED).json({
      message: RESPONSE_MESSAGES.SUCCESS,
      data: post,
    });
  } catch (error) {
    return next(error);
  }
};

export const update: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId } = req.headers;
    const post = await Post.findOneAndUpdate(
      {
        _id: new Types.ObjectId(id),
        userId: new Types.ObjectId(userId as string),
      },
      req.body,
      { new: true }
    );
    if (!post) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        message: RESPONSE_MESSAGES.NOT_FOUND,
      });
    }
    return res.status(HTTP_STATUS.OK).json({
      message: RESPONSE_MESSAGES.SUCCESS,
      data: post,
    });
  } catch (error) {
    return next(error);
  }
};

export const deleteOne: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId } = req.headers;
    const post = await Post.findOne({
      _id: new Types.ObjectId(id),
      userId: new Types.ObjectId(userId as string),
    });
    if (!post) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        message: RESPONSE_MESSAGES.NOT_FOUND,
      });
    }
    await post.softDelete();
    return res.status(HTTP_STATUS.OK).json({
      message: RESPONSE_MESSAGES.SUCCESS,
      data: post,
    });
  } catch (error) {
    return next(error);
  }
};
