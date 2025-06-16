
import ApiError from "./errorHanlder"

export const ErrorThrower = () => {
    throw new ApiError("unauthorized request", 402)
}