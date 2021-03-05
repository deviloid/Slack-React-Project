import React from "react";
import { Header, Icon, Input, Segment } from "semantic-ui-react";

const MessageHeader = (props) => {
    return <Segment clearing>
        <Header floated="left" fluid="true" as="h3">
            <span>
                {(props.isPrivateChat ? "@ " : "# ") + props.channelName} {!props.isPrivateChat && <Icon name="star outline" size="small"/>}
            </span>
            {!props.isPrivateChat && <Header.Subheader> {props.uniqueUsers} User{props.uniqueUsers === 1 ? "" : "s"} </Header.Subheader>}
        </Header>
        <Header floated="right">
            <Input
                name        = "search"
                icon        = "search"
                placeholder = "Search Messages"
                size        = "mini"
                onChange    = {props.searchTermChange}
            />
        </Header>
    </Segment>
}

export default MessageHeader;