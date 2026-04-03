import { model, Schema } from "mongoose";

const PasswordSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    site: { type: String, required: true },
    username: { type: String, default: "" },
    password: { type: String, required: true },
    note: { type: String, default: "" },
    favorite: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

PasswordSchema.index({ user: 1, site: 1 }, { unique: true });

export default model("Password", PasswordSchema);
