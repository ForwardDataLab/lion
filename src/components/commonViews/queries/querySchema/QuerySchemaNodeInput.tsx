import React, {useState} from "react";
import {queryCreateStyles} from "../../../../styles/queryStyle";
import {TextField} from "@material-ui/core";
import {JSONObject} from "../../../../types/Json";

interface QuerySchemaNodeInputProps {
    queryArgs: JSONObject[] | null,
    nodeName: string,
    initialInputs: any,
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
                value={inputs[name]}
                color={'secondary'}
                key={name}
                id="standard-basic"
                label="Standard"
                onChange={onTypeInputs}
            />;
        });
    }
    return (
        <div className={styles.sideInputWrapper}>
            <h2 className={styles.sideInputTitle}>Input fields for node {props.nodeName}</h2>
            <div className={styles.sideFieldWrapper}>{allInputs}</div>
        </div>
    );
}