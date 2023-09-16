import { NextFunction, Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import format from "string-template";

import { User } from "../database/models";
import {
  RESPONSE_MESSAGES,
  HTTP_STATUS,
  MONGO_CODE_ERROR,
  EMAIL_SETTINGS,
  VERIFY_EMAIL_TEMPLATE_SETTINGS,
  JWT_SETTINGS,
  RESET_PASSWORD_TEMPLATE_SETTINGS
} from "../constants";
import { mailer } from "../services";
import { authEmailTemplate } from "../templates";

const {
  PRIVATE_KEY,
  EMAIL_PRIVATE_KEY,
  VERIFY_EMAIL_LINK_URL,
  RESET_PASSWORD_LINK_URL
} = process.env;

export const login = async (
  req: Request<ParamsDictionary>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, emailVerified: true });
    if (!user) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        message: RESPONSE_MESSAGES.INVALID_CREDENTIALS,
      });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: RESPONSE_MESSAGES.INVALID_CREDENTIALS,
      });
    }
    const token = jwt.sign({ id: user._id }, PRIVATE_KEY as string);
    return res.status(HTTP_STATUS.OK).json({
      message: RESPONSE_MESSAGES.OK,
      token,
    });
  } catch (error) {
    return next(error);
  }
};

export const signup = async (
  req: Request<ParamsDictionary>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    const user = await User.create({
      password: hashedPassword,
      email,
    });
    const token = jwt.sign({ id: user._id }, EMAIL_PRIVATE_KEY as string, {
      expiresIn: JWT_SETTINGS.expiresIn,
    });
    const { title, buttonTitle, body } = VERIFY_EMAIL_TEMPLATE_SETTINGS;
    mailer.sendMail({
      from: EMAIL_SETTINGS.NO_REPLY,
      to: user.email,
      subject: EMAIL_SETTINGS.VERIFY_TITLE,
      html: format(authEmailTemplate, {
        title,
        body,
        buttonTitle,
        link: `${VERIFY_EMAIL_LINK_URL}/${token}`,
      }),
    });
    return res.status(HTTP_STATUS.CREATED).json({
      message: RESPONSE_MESSAGES.VERIFY_EMAIL,
    });
  } catch (error: any) {
    if (error?.code === MONGO_CODE_ERROR.duplicate) {
      return res.status(HTTP_STATUS.CONFLICT).json({
        message: RESPONSE_MESSAGES.EMAIL_TAKEN,
      });
    }
    return next(error);
  }
};

export const verifyEmail = async (
  req: Request<ParamsDictionary>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { token } = req.params;
    const decoded = jwt.verify(token, EMAIL_PRIVATE_KEY as string) as any;
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        message: RESPONSE_MESSAGES.INVALID_TOKEN,
      });
    }
    user.emailVerified = true;
    await user.save();
    return res.status(HTTP_STATUS.OK).json({
      message: RESPONSE_MESSAGES.SUCCESS,
    });
  } catch (error) {
    return next(error);
  }
};

export const forgotPassword = async (
  req: Request<ParamsDictionary>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email, emailVerified: true });
    if(!user) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        message: RESPONSE_MESSAGES.EMAIL_NOT_REGISTERED
      })
    }
    const token = jwt.sign({ id: user._id }, EMAIL_PRIVATE_KEY as string);
    const { title, buttonTitle, body } = RESET_PASSWORD_TEMPLATE_SETTINGS;
    mailer.sendMail({
      from: EMAIL_SETTINGS.NO_REPLY,
      to: user.email,
      subject: EMAIL_SETTINGS.FORGOT_PASSWORD_TITLE,
      html: format(authEmailTemplate, {
        title,
        buttonTitle,
        body: format(body, {
          user: user.name || 'User'
        }),
        link: `${RESET_PASSWORD_LINK_URL}/${token}`
      })
    })
    return res.status(HTTP_STATUS.OK).json({
      message: RESPONSE_MESSAGES.SUCCESS
    })
  } catch(error) {
    return next(error);
  }
}

export const resetPassword = async (
  req: Request<ParamsDictionary>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { password } = req.body;
    const { token } = req.params;
    const decoded = jwt.verify(token, EMAIL_PRIVATE_KEY as string) as any;
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        message: RESPONSE_MESSAGES.INVALID_TOKEN,
      });
    }
    const hashedPassword = bcrypt.hashSync(password, 10);
    user.password = hashedPassword;
    await user.save();
    return res.status(HTTP_STATUS.OK).json({
      message: RESPONSE_MESSAGES.SUCCESS
    });
  } catch(error) {
    return next(error);
  }
}