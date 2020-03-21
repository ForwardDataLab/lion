import React, {useState} from "react";
import {queryCreateStyles} from "../../../../styles/queryStyle";
import {TextField} from "@material-ui/core";
import {JSONObject} from "../../../../types/Json";

export interface QueryFieldInputs {
    [name: string]: any
}


interface QuerySchemaNodeInputProps {
    queryArgs: JSONObject[] | null,
    nodeName: string,
    initialInputs: QueryFieldInputs,

    setInputs(newInputs: any): void;
}

export function QuerySchemaNodeInput(props: QuerySchemaNodeInputProps) {
    const [inputs, setInputs] = useState(props.initialInputs);
    const styles = queryCreateStyles();
    let allInputs;
    if (props.queryArgs == null) {
        allInputs = (
            <div className={styles.sideFieldWrapper}>
                <small className={styles.sideEmptyText}>If selected node has input fields, they will show up
                    here</small>
            </div>
        );
    } else {
        allInputs = props.queryArgs.map(item => {
            const name = item.name as string;
            const onTypeInputs = (e: React.ChangeEvent<HTMLInputElement>) => {
                const newInputs = {...inputs, [name]: e.target.value};
                setInputs(newInputs);
                props.setInputs(newInputs);
            };
            return <TextField
                className={styles.sideInputFields}
                value={inputs[name] == null ? '' : inputs[name]}
                color={'secondary'}
                key={name}
                id="standard-basic"
                label={name}
                onChange={onTypeInputs}
            />;
        });
    }
    return (
        <div className={styles.sideInputWrapper}>
            <h3 className={styles.sideInputTitle}>{
                props.nodeName === '' ? 'No node selected' : `Input fields for node ${props.nodeName}`
            }</h3>
            <div className={styles.sideFieldWrapper}>{allInputs}</div>
            {
                props.queryArgs != null && (
                    <small>Note that values will be automatically saved</small>
                )
            }
        </div>
    );
}