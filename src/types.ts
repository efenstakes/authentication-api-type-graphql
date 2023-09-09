import { Response, Request, } from "express"
import { Account } from "./accounts/types"


export interface Context {
    req: Request
    res: Response
    user?: Account
}
