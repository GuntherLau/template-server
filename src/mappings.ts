import { LoginController } from "./controller/socket/LoginController";


export const Mappings = [
    {
        path: "login",
        caller: LoginController,
        func: "onLogin"
    }
]