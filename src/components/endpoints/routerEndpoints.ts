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
        name: `Applications`,
        edit: {
            paramName: `name`,
            urlBase: `/app/edit/`,
            urlDynamic: `/app/edit/:name`,
        },
        create: {
            url: `/app/create`
        }
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
        name: `Users`,
        edit: {
            paramName: `name`,
            urlBase: `/ad-users/edit/`,
            urlDynamic: `/ad-users/edit/:name`
        }
    },
    help: {
        url: `/help`,
        name: `Help`
    },
    invalid: {
        url: `/404`
    },
    translator: {
        url: `/translate`,
        name: `Translator`
    },
    profile: {
        url: `/profile`,
        name: `Profile`
    }
};