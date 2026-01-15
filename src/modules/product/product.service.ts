import { IProduct } from "./product.interface";
import { Product } from "./product.model";

export const createProductToDB = async(productData : IProduct)=>{
    const product = await Product.create(productData);
    return product;
}
export const getAllProductsFromDB = async()=>{
    const product = await Product.find();
    return product;
}