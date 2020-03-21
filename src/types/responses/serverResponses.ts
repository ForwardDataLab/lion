import {Server} from "../../models/Server";
import {HTTPResponse} from "./httpResponses";

export interface ServerResponse extends HTTPResponse{
    data: Server[]
}

export interface ServerUpdateResponse extends HTTPResponse{
    data: Server[]
}