import React, {useCallback, useEffect, useRef, useState} from "react";
import {QueryGeneral} from "../../../models/Query";
import {JSONObject} from "../../../types/Json";
import fakeSchema from "../../../data/fakeSchema2.json";
import {isBlank} from "../../utils/commonMethods";
import {Button, Snackbar} from "@material-ui/core";
import SaveOutlinedIcon from '@material-ui/icons/SaveOutlined';
import {SnackBarTransition} from "../../utils/commonComponents";
import {queryCreateStyles} from "../../../styles/queryStyle";
import {QuerySchemaViz} from "./queryCreateComponents/QuerySchemaViz";
import clsx from "clsx";
import {VizNode} from "./queryCreateComponents/QueryCreateViz";
import {allSchedules, QueryCreateErrorMessage, QueryCreateForm} from "./queryCreateComponents/QueryCreateForm";
import {addNodeToTree, removeNodeFromTree, replaceNodeinTree, SchemaTree} from "./queryCreateComponents/SchemaTree";
import {
    addRecordToHistory,
    removeRecordsInHistory,
    SchemaHistory,
    SchemaSelectRecord
} from "./queryCreateComponents/SchemaHistory";
import {QueryFieldInputs} from "./queryCreateComponents/QuerySchemaNodeInput";


// todo: query request structure is not reasonable, may be more efficient, but need rework at the backend

interface QueryCreateProps {
    addQuery(query: QueryGeneral): void;
}

const fakeSources = ['Reddit', 'GitHub'];
const allSchemas: {[source: string]: JSONObject} = {};

export function QueryCreate(props: QueryCreateProps) {
    // assumptions:
    //  only fields can have arguments
    //  all object names are unique
    const {addQuery} = props;
    const [fullSchema, setFullSchema] = useState<JSONObject>({});
    const [allSources, setAllSources] = useState<string[]>([]);
    const [queryForm, setQueryForm] = useState<QueryGeneral>({
        name: ``, source: ``, schedule: allSchedules[0]
    });
    const [formErrorMessages, setFormErrorMessages] = useState<QueryCreateErrorMessage>({
        name: null, source: null, schedule: null
    });
    const [schemaErrorMessage, setSchemaErrorMessage] = useState<string | null>(null);

    const [selectedSchema, setSelectedSchema] = useState<SchemaTree>({});
    const [nodesHistory, setNodesHistory] = useState<SchemaHistory>([]);
    const [activeRecord, setActiveRecord] = useState<SchemaSelectRecord | null>(null);
    useEffect(() => {
        // todo: retrieve all available sources here
        (async () => {
            setAllSources(fakeSources);
        })();
    }, [setAllSources]);

    const styles = queryCreateStyles();
    const validateFormAttribute = useCallback((attribute: 'name' | 'source' | 'schedule') => {
        return !isBlank(queryForm[attribute])
    }, [queryForm]);
    const onValidateForm = useCallback(() => {
        let isFormValid = true;
        if (!validateFormAttribute('name')) {
            setFormErrorMessages(formErrorMessages => ({...formErrorMessages, name: 'Name cannot be empty'}));
            isFormValid = false;
        } else {
            setFormErrorMessages(formErrorMessages => ({...formErrorMessages, name: null}));
        }
        if (!validateFormAttribute('source')) {
            setFormErrorMessages(formErrorMessages => ({...formErrorMessages, source: 'Schema cannot be empty'}));
            isFormValid = false;
        } else {
            setFormErrorMessages(formErrorMessages => ({...formErrorMessages, source: null}));
        }
        // todo: add server-side verification here
        return isFormValid
    }, [validateFormAttribute]);
    const validateSchema = useCallback(() => {
        // todo: add server-side verification
        return selectedSchema != null;
    }, [selectedSchema]);
    const onValidateSchema = useCallback(() => {
        let isSchemaValid = true;
        if (!validateSchema()) {
            setSchemaErrorMessage('Schema cannot be empty');
            isSchemaValid = false;
        } else {
            setSchemaErrorMessage(null);
        }
        return isSchemaValid;
    }, [validateSchema]);
    const onSaveQuery = useCallback(() => {
        if (!(onValidateForm() && onValidateSchema())) {
            return
        }
        console.log('Saved Data', selectedSchema);
        // todo: submit save request here
        addQuery(queryForm);
    }, [onValidateSchema, onValidateForm, addQuery, queryForm, selectedSchema]);
    const onCloseSnackBar = useCallback(() => {
        setSchemaErrorMessage(null);
    }, []);
    const onSetQueryForm = useCallback((newQueryForm: QueryGeneral) => {
        if (newQueryForm == null) {
            return;
        }
        const source = newQueryForm.source;
        if (source.trim() !== '') {
            if (allSchemas.hasOwnProperty(source)) {
                setFullSchema(allSchemas[source]);
            } else {
                (async () => {
                    // todo: http request to get schema
                    allSchemas[source] = fakeSchema;
                    setFullSchema(fakeSchema);
                })();
            }
            setQueryForm(newQueryForm);
        }
    }, []);
    const onNodeSelected = useCallback((vizNode: VizNode, rawNode: JSONObject) => {
        setActiveRecord(activeRecord => {
            if (activeRecord != null) {
                setNodesHistory(nodesHistory => addRecordToHistory(activeRecord, nodesHistory));
            }
            const newRecord = {
                vizNode: vizNode,
                rawNode: rawNode,
                inputs: {}
            };
            setSelectedSchema(selectedSchema => addNodeToTree({...vizNode, arguments: null}, selectedSchema));
            return newRecord
        });
    }, []);

    const onNodeDeselected = useCallback((vizNode: VizNode) => {
        setSelectedSchema(selectedSchema => removeNodeFromTree(vizNode, selectedSchema));
        setNodesHistory(nodesHistory => {
            const newHistory = removeRecordsInHistory(vizNode, nodesHistory);
            if (newHistory == null) {
                setActiveRecord(null);
                return [];
            } else {
                setActiveRecord(newHistory[newHistory.length - 1]);
                return newHistory.slice(0, newHistory.length - 1)
            }
        });
    }, []);

    const onInputsChange = useCallback((newInputs: QueryFieldInputs) => {
        if (activeRecord == null) {
            throw new Error('Active record must not be null for updating inputs');
        }
        setActiveRecord(activeRecord => {
            const newRecord = {...activeRecord, inputs: newInputs} as SchemaSelectRecord;
            setSelectedSchema(selectedSchema => replaceNodeinTree({...newRecord.vizNode, arguments: newRecord.inputs}, selectedSchema));
            return newRecord;
        });
    }, [activeRecord]);

    // not memoized
    let lastActiveRawNode;
    if (activeRecord) {
        lastActiveRawNode = activeRecord.rawNode;
    } else {
        lastActiveRawNode = nodesHistory.length > 0 ? nodesHistory[nodesHistory.length - 1].rawNode : null
    }

    const basicForm = (
        <QueryCreateForm
            errorMessages={formErrorMessages}
            allSources={allSources}
            query={queryForm}
            onUpdateQuery={onSetQueryForm}
        />
    );

    const visualization = (
        <div>
            <h1 className={styles.titleStyle}>Configure Query</h1>
            {
                (Object.keys(fullSchema).length !== 0 && fullSchema.constructor === Object) ? (
                    <QuerySchemaViz
                        rawSchema={fullSchema}
                        deleteVizNode={onNodeDeselected}
                        inputs={activeRecord?.inputs ?? {}}
                        lastActiveRawNode={lastActiveRawNode}
                        setActiveNode={onNodeSelected}
                        setInputs={onInputsChange}
                    />
                ) : (
                    <small>Source must be selected first</small>
                )
            }
        </div>
    );
    return (
        <div>
            {basicForm}
            <br/>
            {visualization}
            <br/>
            <div className={clsx(styles.buttonWrapper, styles.formSubmitSpacing)}>
                <Button
                    variant="contained"
                    color="secondary"
                    className={styles.buttonRightGap}
                    startIcon={<SaveOutlinedIcon/>}
                    onClick={onSaveQuery}>
                    Save Form
                </Button>
            </div>
            <Snackbar
                open={schemaErrorMessage !== '' && schemaErrorMessage != null}
                TransitionComponent={SnackBarTransition}
                message={schemaErrorMessage}
                action={<Button color="secondary" size="small" onClick={onCloseSnackBar}>Close</Button>}
            />
        </div>
    );
}