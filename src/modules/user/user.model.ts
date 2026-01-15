// eslint-disable-next-line no-unused-expression
import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true, enum: ["user", "admin"], default: "user" },
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);

userSchema.pre("save", async function (next) {
    // only hash if password is new or modified
    if (!this.isModified("password")) return next();

    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);

    next();
});
