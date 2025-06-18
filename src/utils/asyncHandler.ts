import { NextFunction, Request, RequestHandler, Response } from "express";



const AsyncHandler = (func:(req:Request<any>,res:Response,next:NextFunction)=>Promise<any>):RequestHandler=>{
    return (req,res,next)=>{
        Promise.resolve(func(req,res,next)).catch(next)
    }
}

export default AsyncHandler