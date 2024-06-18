import { EmailPassReq } from "../../types/api-payloads"
import { EmailPassRes } from "../../types/api-responses"
import { postRequest } from "./common"

async function register(payload: EmailPassReq) {
    return postRequest<EmailPassRes>("/auth/register", payload)
}

async function login(payload: EmailPassReq) {
    return postRequest<EmailPassRes>("/auth/login", payload)
}

async function logout() {
    return postRequest<void>("/auth/logout")
}

export const auth = {
    register,
    login,
    logout,

}
