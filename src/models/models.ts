import { Schema, model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const BlogSchema = new Schema({
  _id: { type: String, required: true, immutable: true, alias: "id", default: uuidv4 },
  name: { type: String, required: true },
  description: { type: String, required: true },
  websiteUrl: { type: String, required: true },
  createdAt: { type: String, required: true },
  isMembership: { type: Boolean, required: true },
});

const Blog = model("Blog", BlogSchema);

module.exports = { Blog };
