import React, {useCallback, useRef, useState} from "react";
import {JSONObject} from "../../../types/Json";
import {createViz, VizNode} from "./querySchema/QueryCreateViz";
import {QuerySchemaNodeInput} from "./querySchema/QuerySchemaNodeInput";
import {queryCreateStyles} from "../../../styles/queryStyle";


interface QuerySchemaVizProps {
    rawSchema: JSONObject,
    // this function will be called very often and thus a more lightweight solution is proposed
    // todo: this function must be memoized
    setQuerySchema(data: PathsTree): void;
}


export interface ExtendedVizNode extends VizNode {
    arguments: any | null;
}

export interface PathsTree {
    [parentName: string]: ExtendedVizNode[]
}

const startingName = '__start_node';


export function QuerySchemaViz(props: QuerySchemaVizProps) {
    // todo: all props should be memoized by parent
    const {rawSchema, setQuerySchema} = props;
    // memoized properties
    const [activeNode, setActiveNode] = useState<JSONObject | null>(null);
    const [activeVizNode, setActiveVizNode] = useState<ExtendedVizNode | null>(null);
    const [inputs, setInputs] = useState<any>(null);
    const styles = queryCreateStyles();
    // todo: populate input fields when selected
    const paths = useRef({} as PathsTree);
    // computed properties
    const args = activeNode != null && activeNode.hasOwnProperty('args') ? (activeNode.args as JSONObject[]) : null;
    // memoized callbacks
    const onUpdateInputs = useCallback(() => {
        if (activeVizNode == null) {
            return;
        }
        const newActiveNode: ExtendedVizNode = {...activeVizNode, arguments: inputs};
        setActiveVizNode(newActiveNode);
        const parentName = newActiveNode.parentName;
        if (parentName == null) {
            return;
        }
        const existingNodes = paths.current[parentName];
        const index = existingNodes.findIndex(item => item.name === newActiveNode.name);
        paths.current[parentName] = existingNodes.splice(index, 1);
        paths.current[parentName].push(newActiveNode);
    }, [inputs, activeVizNode]);
    const onSelectNode = useCallback((data: VizNode, actualNode: JSONObject) => {
        const parantName = data.parentName ?? startingName;
        const extendedNode: ExtendedVizNode = {...data, arguments: null};
        if (paths.current.hasOwnProperty(parantName)) {
            paths.current[parantName].push(extendedNode);
        } else {
            paths.current[parantName] = [extendedNode];
        }
        if (inputs != null) {
            onUpdateInputs();
            setInputs(null);
        }
        setActiveNode(actualNode);
        setActiveVizNode(extendedNode);
        setQuerySchema(paths.current);
    }, [inputs, setQuerySchema, onUpdateInputs]);
    const onDeselectNode = useCallback((data: VizNode) => {
        // todo: remove active field and possibly keys in paths variable
        if (data.parentName == null) {
            delete paths.current[startingName];
        } else {
            const existingNodes = paths.current[data.parentName];
            const index = existingNodes.findIndex(item => item.name === data.name);
            paths.current[data.parentName] = existingNodes.splice(index, 1);
        }
        if (paths.current.hasOwnProperty(data.name)) {
            delete paths.current[data.name];
        }
        if (inputs != null) {
            onUpdateInputs();
            setInputs(null);
        }
        setActiveNode(null);
        setActiveVizNode(null);
        setQuerySchema(paths.current);
    }, [inputs, setQuerySchema, onUpdateInputs]);
    const onRefUpdate = useCallback((ref: HTMLElement | null) => {
        if (ref == null) {
            return;
        }
        createViz({
            rawSchema: rawSchema,
            containerElem: ref,
            onSelectNode,
            onDeselectNode,
        });
    }, [rawSchema, onDeselectNode, onSelectNode]);
    const onSubmit = useCallback(() => {
        if (inputs != null) {
            onUpdateInputs();
            setInputs(null);
        }
        setActiveNode(null);
        setActiveVizNode(null);
        setQuerySchema(paths.current);
    }, [inputs, setQuerySchema, onUpdateInputs]);
    return (
        <div className={styles.queryCreateWrapper}>
            <div className={styles.queryCreateInputPanel}>
                <QuerySchemaNodeInput
                    queryArgs={args}
                    nodeName={activeVizNode?.name ?? 'None'}
                    setInputs={setInputs}
                    initialInputs={{}}/>
            </div>
            <div className={styles.queryCreateVizPanel}>
                <div ref={onRefUpdate}/>
            </div>
        </div>
    );
}