import mongoose from "mongoose";

import { softDelete } from "../plugins";
import { REGEX } from "../../constants";

const { Schema, model } = mongoose;

const schema = new Schema<any>(
  {
    name: String,
    phoneNumber: {
      type: String,
      unique: true,
      sparse: true,
      validate: {
        validator: function (value: string) {
          return REGEX.PHONE.test(value)
        },
        message: "Invalid phone number format"
      }
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      required: "Email address is required",
      validate: {
        validator: function (value: string) {
          return REGEX.EMAIL.test(value)
        },
        message: "Invalid email format"
      }
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    bio: {
      type: String,
    },
    //TODO: Create a better regex for url
    profileUrl: {
      type: String,
    },
  },
  { timestamps: true }
);

schema.plugin(softDelete);

export default model("User", schema);
