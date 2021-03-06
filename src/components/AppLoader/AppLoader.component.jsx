import React from 'react';
import { Dimmer, Loader } from 'semantic-ui-react';
import "./AppLoader.css";

export const AppLoader = (props) => {
    return (<Dimmer active={props.loading} >
        <Loader size="huge" content="Loading" />
    </Dimmer>
    )}