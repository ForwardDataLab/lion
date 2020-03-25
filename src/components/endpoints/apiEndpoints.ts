import {LoginRequest} from "../../types/requests/loginRequests";
import {LoginResponses} from "../../types/responses/loginResponses";
import {ServerResponse, ServerUpdateResponse} from "../../types/responses/serverResponses";
import {ServerUpdateRequest} from "../../types/requests/serverRequests";
import {SocialMediaResponse} from "../../types/responses/socialMediaResponses";
import {
    QueryFullSchemaResponse,
    QueryHistoryRecordsResponse,
    QueryListResponse,
    QuerySelectedSchemaResponse,
    QuerySourcesListResponse,
    QueryUpdateResponse
} from "../../types/responses/queryResponses";
import {
    QueryFullSchemaRequest,
    QueryHistoryRecordsRequest,
    QuerySelectedSchemaRequest,
    QueryUpdateRequest
} from "../../types/requests/queryRequests";

export enum APIMethod {
    POST = 'post', GET = 'get', PUT = 'put'
}

export enum APIAuthLevel {
    NO_AUTH, USER, ADMIN
}

interface APIEndpointsShape {
    [name: string]: {
        url: string,
        authorization: APIAuthLevel,
        method?: APIMethod,
        response?: any,
        parameters?: any, // URL params, will be converted to string
        body?: any,
        description?: string
    }
}

const APP_BASE_URL = `/app`;
const getURL = (url: string) => APP_BASE_URL + '/api' + url;

export const PageEndpoints = {
    projectMainPage: {
        url: `/`,
        authorization: APIAuthLevel.NO_AUTH,
        description: `Redirect to main page. Note that this app has a different base url than the main page`
    },
    projectAppPage: {
        url: APP_BASE_URL,
        authorization: APIAuthLevel.USER,
        description: `Redirect to this app`
    }
};

export const APIEndPoints: APIEndpointsShape = {
    loginCredential: {
        url: getURL(`/login`),
        method: APIMethod.POST,
        body: {} as LoginRequest,
        response: {} as LoginResponses, // note that cookie will need to be sended along with the response
        authorization: APIAuthLevel.NO_AUTH,
    },
    serversList: {
        url: getURL(`/servers`),
        method: APIMethod.GET,
        response: {} as ServerResponse,
        authorization: APIAuthLevel.ADMIN
    },
    serverUpdate: {
        url: getURL(`/server-update`),
        method: APIMethod.PUT,
        body: {} as ServerUpdateRequest,
        response: {} as ServerUpdateResponse,
        authorization: APIAuthLevel.ADMIN
    },
    socialMediaList: {
        url: getURL(`/social-media`),
        method: APIMethod.GET,
        response: {} as SocialMediaResponse,
        authorization: APIAuthLevel.USER // note that redirection will be handed by server not by client; redirect to the original url
    },
    queriesList: {
        url: getURL(`/queries`),
        method: APIMethod.GET,
        response: {} as QueryListResponse,
        authorization: APIAuthLevel.USER
    },
    querySourcesList: {
        url: getURL(`/query-sources`),
        method: APIMethod.GET,
        response: {} as QuerySourcesListResponse,
        authorization: APIAuthLevel.USER
    },
    queryFullSchema: {
        url: getURL(`/query-full-schema`),
        method: APIMethod.GET,
        parameters: {} as QueryFullSchemaRequest,
        response: {} as QueryFullSchemaResponse,
        authorization: APIAuthLevel.USER,
        description: `get the full, unfilled schema from source`
    },
    queryUpdate: {
        url: getURL(`/query-update`),
        method: APIMethod.PUT,
        body: {} as QueryUpdateRequest,
        response: {} as QueryUpdateResponse,
        authorization: APIAuthLevel.ADMIN
    },
    querySelectedSchema: {
        url: getURL(`/query-selected-schema`),
        method: APIMethod.GET,
        parameters: {} as QuerySelectedSchemaRequest,
        response: {} as QuerySelectedSchemaResponse,
        authorization: APIAuthLevel.USER,
        description: `get selected portion of full schema. Note that this data structure is completely different from the full one`
    },
    queryHistoryRecords: {
        url: getURL(`/query-history-records`),
        method: APIMethod.GET,
        parameters: {} as QueryHistoryRecordsRequest,
        response: {} as QueryHistoryRecordsResponse,
        authorization: APIAuthLevel.USER
    }
};