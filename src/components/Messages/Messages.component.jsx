import React, { useEffect, useState } from "react";
import MessageContent from "./MessageContent/MessageContent.component";
import MessageHeader from "./MessageHeader/MessageHeader.component";
import MessageInput from "./MessageInput/MessageInput.component";
import firebase from "../../server/firebase";
import { connect } from "react-redux";
import { Comment, Segment } from "semantic-ui-react";
import "./Messages.css"
import userEvent from "@testing-library/user-event";

const Messages = (props) => {

    const messageRef = firebase.database().ref('messages');

    const [messagesState, setMessagesState] = useState([]);

    useEffect(() => {
        if (props.channel) {
            setMessagesState([]);
            messageRef.child(props.channel.id).on('child_added', (snap) => {
                setMessagesState((currentState) => {
                    let updatedState = [...currentState];
                    updatedState.push(snap.val());
                    return updatedState;
                })
            })
            return () => messageRef.child(props.channel.id).off();
        }
    }, [props.channel])

    const displayMessages = () => {
        if (messagesState.length > 0) {
            return messagesState.map((message) => {
                return <MessageContent ownMessage={message.user.id === props.user.uid} key={message.timestamp} message={message} />
            })
        }
    }

    return <div id="message-content">
        <MessageHeader />
        <Segment className="messagecontent">
            <Comment.Group>
                {displayMessages()}
            </Comment.Group>
        </Segment>
        <MessageInput />
    </div>
}

const mapStateToProps = (state) => {
    return {
        channel: state.channel.currentChannel,
        user : state.user.currentUser
    }
}

export default connect(mapStateToProps)(Messages);