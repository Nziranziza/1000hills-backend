import mongoose from "mongoose";

import { softDelete } from "../plugins";
import { slugify } from "../../utilities";

const { Schema, model } = mongoose;
const modelName = "Post";

const schema = new Schema<any>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      unique: true,
      require: true,
    },
    description: {
      type: String,
    },
    assets: {
      type: [
        {
          url: { type: String, required: true },
          type: { type: String, required: true, enum: ["image", "video"] },
        },
      ],
      validate: {
        validator: function (items: []) {
          return items && items.length > 0;
        },
        message: "At least one asset is required",
      },
    },
  },
  { timestamps: true }
);

schema.plugin(softDelete);

/**
 * Append a unique slug based on title
 * On create the slug is appended
 * When document title is update,
 * the slug is regenerated
 */
schema.plugin(function (schema) {
  schema.pre("save", async function (next) {
    const slug = slugify(this.title);
    const postWithSameSlug = await mongoose.model(modelName).findOne({ slug });
    if (!postWithSameSlug) {
      this.slug = slug;
      next();
    } else {
      this.slug = slugify(this.title, true);
    }
  });

  schema.pre("findOneAndUpdate", async function (next) {
    const update = this.getUpdate() as any;
    const query = this.getQuery() as any;
    if (update?.title) {
      const slug = slugify(update.title);
      const postWithSameSlug = await mongoose
        .model(modelName)
        .findOne({ slug });
      if (!postWithSameSlug) {
        update.slug = slug;
      } else if (query._id.toString() === postWithSameSlug._id.toString()) {
        update.slug = slug;
      } else {
        update.slug = slugify(update.title, true);
      }
    }
    next();
  });
});

export default model(modelName, schema);
