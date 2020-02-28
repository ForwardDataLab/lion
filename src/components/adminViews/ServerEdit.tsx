import React from 'react';
import {Server} from "../../types/Server";

interface ServerEditProps {
    server: Server,
    onSave(server: Server): void
}

export function ServerEdit(props: ServerEditProps) {
    return (<div/>);
}