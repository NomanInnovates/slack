import React from "react";
import { Segment, Comment } from "semantic-ui-react";

import Message from "./Message";
import firebase from "../../firebase";
import MessageForm from "./MessageForm";
import MessagesHeader from "./MessagesHeader";

class Messages extends React.Component {
    state = {
        messages: [],
        progressBar:false,
        messagesLoading: true,
        user: this.props.currentUser,
        channel: this.props.currentChannel,
        messagesRef: firebase.database().ref("messages"),
    };

    componentDidMount() {
        setTimeout(() => {
            const { channel, user } = this.state;
            if (this.props.currentChannel && user) {
                this.addListeners(this.props.currentChannel.id);
            }
        }, 2000)
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
        messages.map((message,index) => (
            <Message
                key={message.timestamp || index}
                message={message}
                user={this.state.user}
            />
        ));
    isProgressBarVissible = percent =>{
        if(percent > 0){
            this.setState({progressBar:true})
        }
    }
    render() {
        const { messagesRef, messages, channel, user,progressBar } = this.state;
        return (
            <React.Fragment>
                <MessagesHeader />
                <Segment>
                    <Comment.Group className={progressBar ? "messages__progress" :"messages"}>
                        {this.displayMessages(messages)}
                    </Comment.Group>
                </Segment>
                <MessageForm
                    messagesRef={messagesRef}
                    currentChannel={this.props.currentChannel}
                    currentUser={user}
                    isProgressBarVisible={this.isProgressBarVissible}
                />
            </React.Fragment>
        );
    }
}

export default Messages;
