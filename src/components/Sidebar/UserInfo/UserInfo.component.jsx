import React from 'react';
import { Grid, Header, Icon, Image, Dropdown } from 'semantic-ui-react';
import { connect } from "react-redux";
import firebase from '../../../server/firebase';

import './UserInfo.css';

const UserInfo = (props) => {

    const getDropDownOptions = () => {
        return [{
            key: 'signout',
            text: <span onClick={signOut}>Sign Out</span>
        }]
    }

    const signOut = () => {
        firebase.auth()
        .signOut()
        .then(() => console.log('User signed out.'));
    }

    if (props.user) {
        return (
            <Grid>
                <Grid.Column>
                    <Grid.Row className="userinfo_grid_row">
                        <Header inverted as='h2'>
                            <Icon name='slack hash' />
                            <Header.Content>Slack</Header.Content>
                        </Header>
                        <Header inverted as='h4' className="userInfo_displayName">
                            <Dropdown trigger={
                                <span>
                                    <Image as='h2' src={props.user.photoURL} avatar></Image>
                                    {props.user.displayName}
                                </span>
                            }
                                options={getDropDownOptions()}
                            >
                            </Dropdown>
                        </Header>
                    </Grid.Row>
                </Grid.Column>
            </Grid>
        )
    }
    return null;
}

const mapStatetoProps = (state) => {
    return {
        user: state.user.currentUser
    }
}

export default connect(mapStatetoProps)(UserInfo);