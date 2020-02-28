export const routerEndpoints = {
    socialMedia: {
        url: `/soc`,
        name: `Social Media`
    },
    queries: {
        url: `/q`,
        name: `Queries`
    },
    metaQueries: {
        url: `/mq`,
        name: `Meta Queries`
    },
    applications: {
        url: `/app`,
        name: `Applications`
    },
    servers: {
        url: `/ad-servers`,
        create: {
            url: `/ad-servers/create-new-server`
        },
        detail: {
            paramName: `name`,
            urlBase: `/ad-servers/view/`,
            urlDynamic: `/ad-servers/view/:name`
        },
        name: `Servers`
    },
    users: {
        url: `/ad-users`,
        name: `Users`
    },
    help: {
        url: `/help`,
        name: `Help`
    },
    invalid: {
        url: `/404`
    }
};