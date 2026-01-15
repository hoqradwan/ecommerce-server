import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { Request, Response } from "express";
import { getPRofileInfoFromDB, loginUserToDB, registerUserToDB } from "./user.service";
import { CustomRequest } from "../../utils/customRequest";

export const register = catchAsync(async (req: Request, res: Response) => {
  const  userData  = req.body;
  const result = await registerUserToDB(userData);
  
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User registered successfully",
    data: result,
  });
});
export const login = catchAsync(async (req: Request, res: Response) => {
  const  userData  = req.body;
  const result = await loginUserToDB(userData);
  
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User logged in successfully",
    data: result,
  });
});

export const getSelfInfo = catchAsync(async (req: CustomRequest, res: Response) => {
  
const user = req.user; 
const result = await getPRofileInfoFromDB(user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Profile information retrieved successfully",
    data: result,
  });
});