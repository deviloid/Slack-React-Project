import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Icon, Menu, Modal, Form, Segment, Button } from "semantic-ui-react";
import firebase from "../../../server/firebase";
import { setChannel } from "../../../store/actioncreator";
import {  } from "../../../store/actioncreator";

import './Channels.css';

const Channels = (props) => {

    const [modalOpenState, setModalOpenState] = useState(false);
    const [channelAddState, setchannelAddState] = useState({ name: '', description: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [channelState, setChannelState] = useState([]);

    const channelsRef = firebase.database().ref("channels");

    useEffect(() => {
        channelsRef.on('child_added', (snap) => {
            console.log(snap.val());
            setChannelState((currentState) => {
                let updatedState = [...currentState];
                updatedState.push(snap.val());
                return updatedState;
            })
        });
        return () => channelsRef.off();
    }, [])

    useEffect(() => {
        if(channelState.length > 0) {
            props.selectChannel(channelState[0])
        }
    },[!props.channel ? channelState : null])

    // console.log(channelAddState);

    const openModal = () => {
        setModalOpenState(true);
    }

    const closeModal = () => {
        setModalOpenState(false);
    }

    const checkIfFormValid = () => {
        return channelAddState && channelAddState.name && channelAddState.description;
    }

    const displayChannels = () => {
        if (channelState.length > 0) {
            return channelState.map((channel) => {
                return <Menu.Item className='clickable'
                    key     ={channel.id}
                    name    ={channel.name}
                    onClick ={() => props.selectChannel(channel)}
                    active  ={props.channel && channel.id == props.channel.id}
                >

                </Menu.Item>
            })
        }
    }

    const onSubmit = () => {
        if (!checkIfFormValid()) {
            return;
        }

        const key = channelsRef.push().key;

        const channel = {
            id: key,
            name: channelAddState.name,
            description: channelAddState.description,
            created_by: {
                name: props.user.displayName,
                avatar: props.user.photoURL
            }
        }
        setIsLoading(true);
        channelsRef.child(key)
            .update(channel)
            .then(() => {
                setchannelAddState({ name: '', description: '' })
                setIsLoading(false);
                closeModal();
            })
            .catch((err) => {
                console.log(err);
            })
    }

    const handleInput = (e) => {
        let target = e.target;
        setchannelAddState((currentState) => {
            let updatedState = { ...currentState };
            updatedState[target.name] = target.value;
            return updatedState;
        })
    }

    return (
        <>
            <Menu.Menu>
                <Menu.Item>
                    <span><Icon name='exchange' /> Channels </span>
                ({channelState.length})
                </Menu.Item>
                {displayChannels()}
                <Menu.Item className='clickable'>
                    <span onClick={openModal}>
                        <Icon name='add' /> Add
                </span>
                </Menu.Item>
            </Menu.Menu>
            <Modal open={modalOpenState} onClose={closeModal}>
                <Modal.Header>
                    Create Channel
                                </Modal.Header>
                <Modal.Content>
                    <Form onSubmit={onSubmit} >
                        <Segment stacked>
                            <Form.Input
                                name="name"
                                value={channelAddState.Name}
                                onChange={handleInput}
                                type="text"
                                placeholder="Channel Name"
                            />
                            <Form.Input
                                name="description"
                                value={channelAddState.Description}
                                onChange={handleInput}
                                type="text"
                                placeholder="Channel Description"
                            />
                        </Segment>
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button loading={isLoading} onClick={onSubmit}>
                        <Icon name='checkmark' /> Save
                    </Button>
                    <Button onClick={closeModal}>
                        <Icon name='remove' /> Cancel
                    </Button>
                </Modal.Actions>
            </Modal>
        </>
    )
}

const mapStatetoProps = (state) => {
    return {
        user    : state.user.currentUser,
        channel : state.channel.currentChannel
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        selectChannel : (channel) => dispatch(setChannel(channel))
    }
}

export default connect(mapStatetoProps, mapDispatchToProps)(Channels);