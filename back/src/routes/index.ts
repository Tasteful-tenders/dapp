import { Express } from "express"
import { userRouter } from "./user.route"

export function buildRoutes(app: Express) {
    app.use('/user', userRouter)  
}