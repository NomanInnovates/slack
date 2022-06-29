import React from "react";
import { Segment, Comment } from "semantic-ui-react";
import firebase from "../../firebase";

import MessagesHeader from "./MessagesHeader";
import MessageForm from "./MessageForm";
import Message from "./Message";

class Messages extends React.Component {
    state = {
        messagesRef: firebase.database().ref("messages"),
        messages: [],
        messagesLoading: true,
        channel: this.props.currentChannel,
        user: this.props.currentUser
    };

    componentDidMount() {
        setTimeout(()=>{
            console.log("sate in mount",this.state)

            const { channel, user } = this.state;
            
            if (this.props.currentChannel && user) {
                this.addListeners(this.props.currentChannel.id);
            }
        },2000)
    }

    addListeners = channelId => {
        this.addMessageListener(channelId);
    };

    addMessageListener = channelId => {
        let loadedMessages = [];
        this.state.messagesRef.child(channelId).on("child_added", snap => {
            loadedMessages.push(snap.val());
            this.setState({
                messages: loadedMessages,
                messagesLoading: false
            });
        });
    };

    displayMessages = messages =>
        messages.length > 0 &&
        messages.map(message => (
            <Message
                key={message.timestamp}
                message={message}
                user={this.state.user}
            />
        ));

    render() {
        console.log("props",this.props)
        const { messagesRef, messages, channel, user } = this.state;
        console.log("state", this.state)
        return (
            <React.Fragment>
                <MessagesHeader />

                <Segment>
                    <Comment.Group className="messages">
                        {this.displayMessages(messages)}
                    </Comment.Group>
                </Segment>

                <MessageForm
                    messagesRef={messagesRef}
                    currentChannel={this.props.currentChannel}
                    currentUser={user}
                />
            </React.Fragment>
        );
    }
}

export default Messages;
