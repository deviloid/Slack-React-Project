import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Icon, Menu } from "semantic-ui-react";
import firebase from "../../../server/firebase";
import { setChannel } from "../../../store/actioncreator";
import { } from "../../../store/actioncreator";

// import './Channels.css';

const PrivateChat = (props) => {

    const [usersState, setUsersState] = useState([]);

    const usersRef = firebase.database().ref("users");

    useEffect(() => {
        usersRef.on('child_added', (snap) => {
            console.log(snap.val());
            setUsersState((currentState) => {
                let updatedState = [...currentState];

                let user = snap.val();
                user.name = user.displayName;
                user.id = snap.key;
                user.isPrivateChat = true;
                user.photo = user.photoURL;
                updatedState.push(user);
                return updatedState;
            })
        });
        return () => usersRef.off();
    }, [])

    const displayUsers = () => {
        if (usersState.length > 0) {
            return usersState.filter((user) => user.id !== props.user.uid).map((user) => {
                return <Menu.Item className='clickable'
                    key={user.id}
                    name={user.name}
                    onClick={() => selectUser(user)}
                    active={props.channel && generateChannelId(user.id) === props.channel.id}
                >

                </Menu.Item>
            })
        }
    }

    const selectUser = (user) => {
        let userTemp = { ...user };
        userTemp.id = generateChannelId(user.id);
        props.selectChannel(userTemp);
    }

    const generateChannelId = (userId) => {
        if (props.user.uid < userId) {
            return props.user.uid + userId;
        }
        else {
            return userId + props.user.uid;
        }
    }


    return (
        <Menu.Menu>
            <Menu.Item>
                <span><Icon name='mail' /> Chat </span>
                ({usersState.length - 1})
                </Menu.Item>
            {displayUsers()}
        </Menu.Menu>
    )
}

const mapStatetoProps = (state) => {
    return {
        user: state.user.currentUser,
        channel: state.channel.currentChannel
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        selectChannel: (channel) => dispatch(setChannel(channel))
    }
}

export default connect(mapStatetoProps, mapDispatchToProps)(PrivateChat);