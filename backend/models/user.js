import { model, Schema } from "mongoose";

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    quote: { type: String },
  },
  {
    timestamps: true,
  }
);

export default model("User", UserSchema);