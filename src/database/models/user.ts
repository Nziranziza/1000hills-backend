import mongoose from "mongoose";

const { Schema, model } = mongoose;

const schema = new Schema<any>(
  {
    name: String,
    phoneNumber: {
      type: String,
      unique: true,
      sparse: true,
    },
    password: {
      type: String,
      required: true
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      required: "Email address is required",
    },
    emailVerified: {
      type: Boolean,
      default: false
    },
    verified: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

export default model('User', schema)