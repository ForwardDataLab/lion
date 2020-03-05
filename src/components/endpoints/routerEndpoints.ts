export const routerEndpoints = {
    socialMedia: {
        url: `/soc`,
        name: `Social Media`
    },
    queries: {
        url: `/q`,
        name: `Queries`,
        create: {
            url: `/q/create`
        },
        history: {
            paramName: `name`,
            urlBase: `/q/history/`,
            urlDynamic: `/q/history/:name`
        }
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
        name: `Servers`,
        create: {
            url: `/ad-servers/create`
        },
        edit: {
            paramName: `name`,
            urlBase: `/ad-servers/edit/`,
            urlDynamic: `/ad-servers/edit/:name`
        }
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