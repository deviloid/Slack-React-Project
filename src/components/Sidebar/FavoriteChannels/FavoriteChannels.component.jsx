import React from "react";
import { connect } from "react-redux";
import { Icon, Menu } from "semantic-ui-react";
import { setChannel } from "../../../store/actioncreator";


const FavoriteChannels = (props) => {

    const displayChannels = () => {
        if (Object.keys(props.favoriteChannels).length > 0) {
            return Object.keys(props.favoriteChannels).map((channelId) => {
                return <Menu.Item className='clickable'
                    key={channelId}
                    name={props.favoriteChannels[channelId]}
                    onClick={() => props.selectChannel({ id : channelId, name : props.favoriteChannels[channelId], isFavorite : true })}
                    active={props.channel && channelId === props.channel.id && props.channel.isFavorite }
                >
                    {props.favoriteChannels[channelId]} 
                </Menu.Item>
            })
        }
    }

    return ( Object.keys(props.favoriteChannels).length > 0 ? 
        <Menu.Menu>
            <Menu.Item>
                <span><Icon name='star' /> Favorite Channels </span>
                ({Object.keys(props.favoriteChannels).length})
                </Menu.Item>
            {displayChannels()}
        </Menu.Menu> : <div></div>
    )
}

const mapStatetoProps = (state) => {
    return {
        channel: state.channel.currentChannel,
        favoriteChannels: state.favoriteChannel.favoriteChannel

    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        selectChannel: (channel) => dispatch(setChannel(channel))
    }
}

export default connect(mapStatetoProps, mapDispatchToProps)(FavoriteChannels);