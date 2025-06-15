
import { NextFunction, Request, Response } from "express";


export type controllerType = (
    req:Request,
    res:Response,
    next:NextFunction
)=>Promise< void | Response <any, Record<string,any>>>