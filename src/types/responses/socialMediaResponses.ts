import {HTTPResponse} from "./httpResponses";
import {SocialMediaSource} from "../../models/SocialMediaSource";

export interface SocialMediaResponse extends HTTPResponse {
    data: SocialMediaSource[]
}