// utils/asyncHandler.ts
import { Request, Response, NextFunction, RequestHandler } from "express";

const AsyncHandler = <P = any,ResBody = any,ReqBody = any,ReqQuery = any>(
  func: (
    req: Request<P, ResBody, ReqBody, ReqQuery>,
    res: Response,
    next: NextFunction
  ) => Promise<any>
): RequestHandler<P, ResBody, ReqBody, ReqQuery> => {
  return (req, res, next) => {
    Promise.resolve(func(req, res, next)).catch(next);
  };
};

export default AsyncHandler;
