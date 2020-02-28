import React, {useContext, useEffect, useState, Fragment, useCallback} from "react";
import {globalStore} from "../../store/globalState";
import {SocialMediaSource} from "../../models/SocialMediaSource";
import {socialMediaStyles} from "../../styles/socialMedia";
import {Button, Divider, List, ListItem, ListItemText, Paper} from "@material-ui/core";
import {routerEndpoints} from "../../data/routerEndpoints";
import {ViewCommonProps} from "../../types/ViewProps";

interface SocialMediaProps extends ViewCommonProps{}

const tempData: SocialMediaSource[] = [
    {
        name: 'Reddit',
        authURL: '/',
        imageURL: '/brand_logos/Reddit_Mark_OnWhite.png',
        isAuthenticated: false
    },
    {
        name: 'GitHub',
        authURL: '/',
        imageURL: '/brand_logos/GitHub-Mark-120px-plus.png',
        isAuthenticated: false
    },
    {
        name: 'Twitter',
        authURL: '/',
        imageURL: '/brand_logos/Twitter_Logo_Blue.png',
        isAuthenticated: false
    },
    {
        name: 'YouTube',
        authURL: '/',
        imageURL: '/brand_logos/yt_logo_rgb_light.png',
        isAuthenticated: false
    }
];

export function SocialMediaManagement(props: SocialMediaProps) {
    const {state} = useContext(globalStore);
    const [mediaSources, setMediaSources] = useState<SocialMediaSource[]>([]);
    const {updateTitle} = props;
    useEffect(() => {
        updateTitle();
    }, [updateTitle]);
    useEffect(() => {
        (async () => {
           // todo: fetch user data here
           setMediaSources(tempData);
        })();
    }, []);
    const onAuthMediaSource = useCallback(async (name: string) => {
        const newSource = mediaSources.slice(0);
        for (const item of newSource) {
            if (item.name === name) {
                // todo: add verification logic here
                item.isAuthenticated = true;
            }
        }
        setMediaSources(newSource);
    }, [mediaSources]);
    const styles = socialMediaStyles();
    return (
        <div>
            <h1 className={styles.titleStyle}>Available Sources</h1>
            <small className={styles.helperTextStyle}>If available, click on "Authorize" will redirect to authorization pages of corresponding social media platforms.</small>
            <List className={styles.root}>
                {
                    mediaSources.map((source) => {
                        const notAuth = <Button color="secondary" onClick={() => onAuthMediaSource(source.name)}>Authorize</Button>;
                        const auth = <ListItemText className={styles.authorizedTextStyle} primary={'Authorized'}/>;
                        return (
                            <Fragment>
                                <ListItem className={styles.listItemStyle} key={source.name} divider>
                                    <img className={styles.imageStyle} src={source.imageURL} alt={source.name} width={'48px'}/>
                                    <ListItemText primary={source.name}/>
                                    {source.isAuthenticated ? auth : notAuth}
                                </ListItem>
                            </Fragment>
                        )
                    })
                }
            </List>
        </div>
    );
}