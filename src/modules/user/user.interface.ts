export interface IUser {
    id?: string;
    name: string;
    email: string;
    password: string;
    role?: string;
    stripe_customer_id?: string;
}