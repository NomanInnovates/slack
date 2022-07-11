import React from "react";
import { Segment, Comment } from "semantic-ui-react";

import Message from "./Message";
import firebase from "../../firebase";
import MessageForm from "./MessageForm";
import MessagesHeader from "./MessagesHeader";

class Messages extends React.Component {
    state = {
        messages: [],
        searchTerm: "",
        searchResults: [],
        progressBar: false,
        numUniqueUsers: "",
        searchLoading: false,
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
            this.countUniqeUsers(loadedMessages)
        });
    };
    countUniqeUsers = messages => {
        const uniqueUser = messages.reduce((acc, message) => {
            if (!acc.includes(message.user.name)) {
                acc.push(message.user.name)
            }
            return acc
        }, [])
        let plural = uniqueUser.length > 1 || uniqueUser.length === 0
        let numUniqueUsers = `${uniqueUser.length || ""} user${plural ? 's' : ""}`
        this.setState({ numUniqueUsers })
    }
    handleSearchChange = event => {
        this.setState({
            searchTerm: event.target.value,
            searchLoading: true
        },
            this.handleSearchMessages
        )
    }
    handleSearchMessages = () => {
        let channelMessages = [...this.state.messages];
        let regex = new RegExp(this.state.searchTerm, 'gi')
        const searchResults = channelMessages.reduce((acc, message) => {
            if (message.content && message.content.match(regex)) {
                acc.push(message)
            }
            return acc
        }, [])
        this.setState({ searchResults })
    }
    displayMessages = messages =>
        messages.length > 0 &&
        messages.map((message, index) => (
            <Message
                key={message.timestamp || index}
                message={message}
                user={this.state.user}
            />
        ));
    isProgressBarVissible = percent => {
        if (percent > 0) {
            this.setState({ progressBar: true })
        }
    }
    displayChannelName = (channel) => {
        return channel ? ` #${channel.name} ` : " Channel "
    }
    render() {
        const { messagesRef, messages, channel, user, progressBar, numUniqueUsers ,searchResults,searchTerm} = this.state;

        return (
            <React.Fragment>
                <MessagesHeader
                    channelName={this.displayChannelName(this.props.currentChannel)}
                    numUniqueUsers={numUniqueUsers}
                    handleSearchChange={this.handleSearchChange}
                />
                <Segment>
                    <Comment.Group className={progressBar ? "messages__progress" : "messages"}>
                        {searchTerm ? this.displayMessages(searchResults) : this.displayMessages(messages)}
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
