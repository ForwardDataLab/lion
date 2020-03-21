import React, {useCallback, useEffect} from "react";
import {JSONObject} from "../../../../types/Json";
import {cleanUpViz, createViz, VizNode} from "./QueryCreateViz";
import {QueryFieldInputs, QuerySchemaNodeInput} from "./QuerySchemaNodeInput";
import {queryCreateStyles} from "../../../../styles/queryStyle";


interface QuerySchemaVizProps {
    rawSchema: JSONObject,
    lastActiveRawNode: JSONObject | null,
    inputs: QueryFieldInputs,

    setActiveNode(vizNode: VizNode, rawNode: JSONObject): void,

    setInputs(inputs: QueryFieldInputs): void,

    deleteVizNode(node: VizNode): void,
}

export function QuerySchemaViz(props: QuerySchemaVizProps) {
    // todo: all props should be memoized by parent
    const {
        rawSchema, lastActiveRawNode, inputs,
        setActiveNode, setInputs, deleteVizNode
    } = props;
    // memoized properties
    const styles = queryCreateStyles();
    // computed properties
    const args = lastActiveRawNode != null && lastActiveRawNode.hasOwnProperty('args') ?
        (lastActiveRawNode.args as JSONObject[]) : null;
    const tempName = lastActiveRawNode?.["name"];
    const name = tempName ? tempName as string : '';
    // memoized callbacks
    useEffect(() => {
        return () => {
            cleanUpViz();
        }
    }, []);
    const onSelectNode = useCallback((data: VizNode, actualNode: JSONObject) => {
        setActiveNode(data, actualNode);
    }, [setActiveNode]);
    const onDeselectNode = useCallback((data: VizNode) => {
        deleteVizNode(data);
    }, [deleteVizNode]);
    const onRefUpdate = useCallback((ref: HTMLElement | null) => {
        if (ref == null) {
            return;
        }
        console.log('Rerendered Viz');
        createViz({
            rawSchema: rawSchema,
            containerElem: ref,
            onSelectNode,
            onDeselectNode,
        });
    }, [rawSchema, onDeselectNode, onSelectNode]);
    return (
        <div className={styles.queryCreateWrapper}>
            <div className={styles.queryCreateInputPanel}>
                <QuerySchemaNodeInput
                    queryArgs={args}
                    nodeName={name}
                    setInputs={setInputs}
                    initialInputs={inputs}/>
            </div>
            <div className={styles.queryCreateVizPanel}>
                <div ref={onRefUpdate}/>
            </div>
        </div>
    );
}