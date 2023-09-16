import { Schema } from "mongoose";

export default function softDelete(schema: Schema) {
  schema.add({
    isDeleted: {
      type: Boolean,
      required: true,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  });

  schema.pre("save", function (next) {
    if (!this.isDeleted) {
      this.isDeleted = false;
    }

    if (!this.deletedAt) {
      this.deletedAt = null;
    }
    next();
  });

  schema.methods.softDelete = function (callback: any) {
    this.isDeleted = true;
    this.deletedAt = new Date();
    this.save(callback);
  };

  schema.methods.restore = function (callback: any) {
    this.isDeleted = false;
    this.deletedAt = null;
    this.save(callback);
  };

  schema.pre(
    ["find", "findOne", "findById", "countDocuments"] as any,
    function () {
      this.where("isDeleted").in([false, undefined, null]);
    }
  );
}
