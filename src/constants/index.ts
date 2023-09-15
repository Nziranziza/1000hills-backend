export enum HTTP_STATUS {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  NOT_FOUND = 404,
  CONFLICT = 409,
  UNPROCESSED = 422,
  SERVER_ERROR = 500,
  UNAUTHORIZED = 401,
}

export enum RESPONSE_MESSAGES {
  DELETED = "deleted",
  EMAIL_TAKEN = "email already taken",
  SOMETHING_WRONG = "something went wrong!",
  INVALID_CREDENTIALS = "Wrong email or password",
  OK = "OK",
  VERIFY_EMAIL = "Verify your email!",
  INVALID_TOKEN = "Invalid token",
  SUCCESS = "SUCCESS",
  EMAIL_NOT_REGISTERED = "Email is not registered"
}

export enum MONGO_CODE_ERROR {
  duplicate = 11000,
}

export enum EMAIL_SETTINGS {
  VERIFY_TITLE = "Verify Your Email",
  NO_REPLY = "1000hills <noreply@1000hills.com>",
  FORGOT_PASSWORD_TITLE = "Reset Your Password"
}

export enum VERIFY_EMAIL_TEMPLATE_SETTINGS {
  title = "Email Confirmation",
  buttonTitle = "Verify your email",
  body = `
    <p>Dear <strong>User</strong>
    <p>To activate your account at <strong>1000hills</strong>, please click the button below to confirm your email address:</p>
    <p>Thank you for joining us!</p>
  `,
};

export enum RESET_PASSWORD_TEMPLATE_SETTINGS {
  title = "Reset Password",
  buttonTitle = "Reset your password",
  body = `
    <p>Dear <strong>{user}</strong>
    <p>To reset your password for the <strong>1000hills</strong>, app, please click the button below:</p>
    <p>If you didn't request this, please ignore this email.</p>
  `
}

export enum JWT_SETTINGS {
  expiresIn = "24h"
}