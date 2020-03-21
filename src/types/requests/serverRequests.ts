import {Server} from "../../models/Server";
import {ServerUpdateType} from "../props/ServerProps";

export interface ServerUpdateRequest {
    readonly data: Server,
    readonly type: ServerUpdateType
}