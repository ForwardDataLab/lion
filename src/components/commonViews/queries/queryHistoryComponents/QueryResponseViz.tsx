import React, {useCallback} from "react";
import {JSONObject} from "../../../../types/Json";
import {queryHistoryStyles} from "../../../../styles/queryStyle";
import {cleanUpResponseViz, createResponseViz} from "./QueryCreateResponseViz";

interface QueryResponseVizProps {
    data: null | JSONObject
}

export function QueryResponseViz(props: QueryResponseVizProps) {
    const {data} = props;
    const onRefUpdate = useCallback((ref: HTMLElement | null) => {
        if (ref == null) {
            cleanUpResponseViz();
            return;
        }
        if (data == null) {
            return;
        }
        createResponseViz({
            data,
            containerElem: ref
        });
    }, [data]);
    // computed
    const styles = queryHistoryStyles();
    let child = null;
    if (data == null) {
        child = (
            <div key={'empty-text'} className={styles.responseVizTextWrapper}>
                <div>
                    <h3 className={styles.responseVizEmptyTitle}>No record data selected</h3>
                </div>
            </div>
        );
    } else {
        if (data.hasOwnProperty('errors')) {
            const errors = data['errors'] as JSONObject[];
            if (errors.length !== 0) {
                child = (
                    <div key={'error-text'} className={styles.responseVizTextWrapper}>
                        <div>
                            <h3 className={styles.responseVizErrorTitle}>Following error(s) occurred</h3>
                            {errors.map((item, index) => {
                                if (item.hasOwnProperty('message')) {
                                    return (<p key={`error-message-detail-${index}`}>{item['message']}</p>)
                                } else {
                                    return null
                                }
                            }).filter(Boolean)}
                        </div>
                    </div>
                )
            }
        }
        if (child == null) {
            child = (
                <div key={'viz'} className={styles.responseVizOutline} ref={onRefUpdate}/>
            )
        }
    }
    return (
        <div className={styles.responseVizWrapper}>{child}</div>
    );
}