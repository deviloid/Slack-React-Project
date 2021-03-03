import React, { useState } from "react";
import { Button, Input, Segment } from "semantic-ui-react";
import firebase from "../../../server/firebase";
import { connect } from "react-redux";
import { ImageUpload } from "../ImageUpload/ImageUpload.component";
import uuidv4 from "uuid/dist/v4";

const MessageInput = (props) => {

    const messageRef = firebase.database().ref('messages');

    const storageRef = firebase.storage().ref();

    const [messageState, setMessageState] = useState("");
    
    const [fileDialogState, setFileDialogState] = useState(false);

    const createMessageInfo = (downloadURL) => {
        return {
            user: {
                avatar: props.user.photoURL,
                name: props.user.displayName,
                id: props.user.uid
            },
            content: messageState,
            image: downloadURL || "",
            timestamp: firebase.database.ServerValue.TIMESTAMP
        }
    }

    const sendMessage = (downloadURL) => {
        if (messageState || downloadURL) {
            messageRef.child(props.channel.id)
                .push()
                .set(createMessageInfo(downloadURL))
                .then(() => {
                    setMessageState("")
                    console.log('sent')
                })
                .catch((err) => console.log(err))
        }
    }

    const onMessageChange = (e) => {
        const target = e.target;
        setMessageState(target.value);
    }

    const createActionButtons = () => {
        return <>
            <Button icon="send" onClick={() => {sendMessage() }} />
            <Button icon="upload" onClick={() => setFileDialogState(true)}/>
        </>
    }

    const uploadImage = (file, contentType) => {
        const filePath = `chat/images/${uuidv4()}.jpg`;

        storageRef.child(filePath).put(file, {contentType: contentType})
        .then((data) => {
            data.ref.getDownloadURL()
            .then((url) => {
                sendMessage(url);
            })
            .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));
    }

    return <Segment>
        <Input
            onChange={onMessageChange}
            fluid={true}
            name="message"
            value={messageState}
            label={createActionButtons()}
            labelPosition="right"
        />
        <ImageUpload uploadImage={uploadImage} open={fileDialogState} onClose={() => setFileDialogState(false)}/>
    </Segment>
}

const mapStateToProps = (state) => {
    return {
        user: state.user.currentUser,
        channel: state.channel.currentChannel
    }
}

export default connect(mapStateToProps)(MessageInput);