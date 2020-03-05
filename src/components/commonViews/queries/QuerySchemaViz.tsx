import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {JSONObject} from "../../../types/Json";
import d3 from 'd3';

interface QueryVizProps {
    allSchema: JSONObject,
    serializedChoices: ReadonlyArray<string>[],
    queryEntryName: string,
    containerElem: HTMLElement,
    onSelectNode(fieldName: string): void,
    onDeselectNode(fieldName: string): void,
}

const createViz = (props: QueryVizProps) => {

};


interface QuerySchemaVizProps {
    rawSchema: JSONObject,
    serializedChoices: ReadonlyArray<string>[],
    queryEntryName: string,
    // this function will be called very often and thus a more lightweight solution is proposed
    // todo: this function must be memoized
    setQuerySchema(data: QueryNodeCompact): void;
}

interface QueryArgType {
    kind: "SCALAR" | "OBJECT" | "LIST",
    name: string | null,
    "ofType": null | QueryArgType
}

interface QueryArg {
    name: string,
    type: QueryArgType | null,
    description: string | null,
    defaultValue: string | null
}

interface QueryNodeCompact {
    name?: string,
    args?: QueryArg[],
    description?: string
    children?: QueryNodeCompact[]
}

function findObject(obj: JSONObject, name: string) {

}


function generateFullSchema(rawSchema: JSONObject, queryEntryName: string) {

}


export function QuerySchemaViz(props: QuerySchemaVizProps) {
    // not memoized
    const [activeField, setActiveField] = useState<QueryArg | null>(null);
    // todo: all props should be memoized by parent
    const {rawSchema, serializedChoices, queryEntryName, setQuerySchema} = props;
    // memoized

    const paths = useRef({} as QueryNodeCompact);
    const onSelectNode = useCallback((fieldName: string) => {
        // todo: populate active field and paths variable
        setQuerySchema(paths.current);
    }, [setActiveField, setQuerySchema]);
    const onDeselectNode = useCallback((fieldName: string) => {
        // todo: remove active field and possibly keys in paths variable
        setQuerySchema(paths.current);
    }, [setActiveField, setQuerySchema]);
    const onRefUpdate = useCallback((ref: HTMLElement | null) => {
        if (ref == null) {
            return;
        }
        createViz({
            rawSchema: rawSchema,
            serializedChoices,
            queryEntryName,
            containerElem: ref,
            onSelectNode,
            onDeselectNode,
        })
    }, [onSelectNode, onDeselectNode, rawSchema, serializedChoices, queryEntryName]);
    return (<div ref={onRefUpdate}/>);
}