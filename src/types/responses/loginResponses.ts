import {HTTPResponse} from "./httpResponses";
import {UserExtended} from "../../models/User";

// data will not be used
export interface LoginResponses extends HTTPResponse {
    data: UserExtended
}
