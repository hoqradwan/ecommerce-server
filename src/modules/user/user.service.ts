import { IUser } from "./user.interface";
import { User } from "./user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET_KEY } from "../../config";
export const registerUserToDB = async (userData: IUser) => {
    const { name, email, password, role } = userData;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
        role: role || "user",
        stripe_customer_id : null,
    });
    return newUser;
}
export const loginUserToDB = async (userData: IUser) => {
    const { email, password } = userData;
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error("User not found");
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
        throw new Error("Invalid password");
    }
    const token = jwt.sign({ id: user._id, name: user.name, email: user.email, role: user.role, stripe_customer_id: user.stripe_customer_id ? user.stripe_customer_id : null }, JWT_SECRET_KEY as string, {
        expiresIn: "7d",
    });
    return { user, token };
}

export const getPRofileInfoFromDB = async (userData: IUser) => {
    const { id } = userData;
    const user = await User.findById(id).select("-password");
    if (!user) {
        throw new Error("User not found");
    }
    return user;
}