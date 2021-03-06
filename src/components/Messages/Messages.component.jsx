import React, { useEffect, useState } from "react";
import MessageContent from "./MessageContent/MessageContent.component";
import MessageHeader from "./MessageHeader/MessageHeader.component";
import MessageInput from "./MessageInput/MessageInput.component";
import firebase from "../../server/firebase";
import { setFavoriteChannel, removeFavoriteChannel } from "../../store/actioncreator";
import { connect } from "react-redux";
import { Comment, Segment } from "semantic-ui-react";
import "./Messages.css"
// import userEvent from "@testing-library/user-event";

const Messages = (props) => {

    const messageRef = firebase.database().ref('messages');

    const usersRef = firebase.database().ref("users");

    const [messagesState, setMessagesState] = useState([]);

    const [searchTermState, setSearchTermState] = useState("");

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

    useEffect(() => {
        if (props.user) {
            usersRef.child(props.user.uid).child("favorite")
                .on('child_added', (snap) => {
                    props.setFavoriteChannel(snap.val());
                })
            usersRef.child(props.user.uid).child("favorite")
                .on('child_removed', (snap) => {
                    props.removeFavoriteChannel(snap.val());
                })
            return () => usersRef.child(props.user.uid).child("favorite").off();
        }
    }, [props.channel])

    const displayMessages = () => {
        let messagesToDisplay = searchTermState ? filterMessageBySearchTerm() : messagesState;
        if (messagesToDisplay.length > 0) {
            return messagesToDisplay.map((message) => {
                return <MessageContent ownMessage={message.user.id === props.user.uid} key={message.timestamp} message={message} />
            })
        }
    }

    const uniqueUsersCount = () => {
        const uniqueUsers = messagesState.reduce((acc, message) => {
            if (!acc.includes(message.user.name)) {
                acc.push(message.user.name);
            }
            return acc;
        }, []);
        // console.log(uniqueUsers.length)
        return uniqueUsers.length;
    }

    const searchTermChange = (e) => {
        const target = e.target;
        setSearchTermState(target.value);
    }

    const filterMessageBySearchTerm = () => {
        const regex = new RegExp(searchTermState, "gi");
        const messages = messagesState.reduce((acc, message) => {
            if ((message.content && message.content.match(regex)) || message.user.name.match(regex)) {
                acc.push(message);
            }
            return acc;
        }, []);
        return messages;
    }

    const starChange = () => {
        let favoriteRef = usersRef.child(props.user.uid).child("favorite").child(props.channel.id)
        if (isStarred()) {
            favoriteRef.remove();
            console.log("unstarred!")
        }
        else {
            favoriteRef.set({ channelId: props.channel.id, channelName: props.channel.name })
            console.log("starred!")
        }
    }

   
    const isStarred = () => {
        if (props.channel === null){
            setTimeout(() => {
                isStarred();
            }, 100)
        }
        else
        return (Object.keys(props.favoriteChannels)[0] === props.channel.id);
    }

    return <div id="message-content">
        <MessageHeader channelName={props.channel?.name} uniqueUsers={uniqueUsersCount()} searchTermChange={searchTermChange} isPrivateChat={props.channel?.isPrivateChat} photo={props.channel?.photo} starChange={starChange} starred={isStarred()} />
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
        user: state.user.currentUser,
        favoriteChannels: state.favoriteChannel.favoriteChannel
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setFavoriteChannel: (channel) => dispatch(setFavoriteChannel(channel)),
        removeFavoriteChannel: (channel) => dispatch(removeFavoriteChannel(channel))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Messages);