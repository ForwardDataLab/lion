import React from 'react';

import {Server} from "../../types/Server";

interface ServerListProps {
    servers: Server[],
    onDelete(server: Server): void
}

export function ServerList(props: ServerListProps) {
    return (<div/>)
}