import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Icon, Menu } from "semantic-ui-react";
import firebase from "../../../server/firebase";
import { setChannel } from "../../../store/actioncreator";
import { } from "../../../store/actioncreator";
import "./PrivateChat.css";

// import './Channels.css';

const PrivateChat = (props) => {

    const [usersState, setUsersState] = useState([]);

    const [connectedUsersState, setConnectedUsersState] = useState([]);

    const usersRef = firebase.database().ref("users");

    const connectedRef = firebase.database().ref(".info/connected");

    const statusRef = firebase.database().ref("status");

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

        connectedRef.on("value", snap => {
            if (props.user && snap.val()) {
                const userStatusRef = statusRef.child(props.user.uid);
                userStatusRef.set(true);
                userStatusRef.onDisconnect().remove();
            }
        })

        return () => {
            usersRef.off();
            connectedRef.off();
        };
    }, [props.user])

    useEffect(() => {
        statusRef.on("child_added", snap => {
            setConnectedUsersState((currentState) => {
                let updatedState = [...currentState];
                updatedState.push(snap.key);
                return updatedState;
            })
        });
        statusRef.on("child_removed", snap => {
            setConnectedUsersState((currentState) => {
                let updatedState = [...currentState];

                let index = updatedState.indexOf(snap.key);
                updatedState.splice(index, 1);
                return updatedState;
            })
        });

        return () => statusRef.off();

    }, usersState);

    const displayUsers = () => {
        if (usersState.length > 0) {
            return usersState.filter((user) => user.id !== props.user.uid).map((user) => {
                return <Menu.Item className='clickable'
                    key={user.id}
                    name={user.name}
                    onClick={() => selectUser(user)}
                    active={props.channel && generateChannelId(user.id) === props.channel.id}
                >
                    {user.name} <Icon name="circle" color={`${connectedUsersState.indexOf(user.id) !== -1 ? "green" : "grey" }`} size="small" className="status" />
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
        selectChannel: (channel) => dispatch(setChannel(channel)),
        // activeUser : (active) =>dispatch(connectedUsersState)
    }
}

export default connect(mapStatetoProps, mapDispatchToProps)(PrivateChat);