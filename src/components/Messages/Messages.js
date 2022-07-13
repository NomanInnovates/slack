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
        isChannelStarred: false,
        user: this.props.currentUser,
        channel: this.props.currentChannel,
        privateChannel: this.props.isPrivateChannel,
        usersRef: firebase.database().ref("users"),
        messagesRef: firebase.database().ref("messages"),
        privateMessagesRef: firebase.database().ref('privateMessages'),
    };

    componentDidMount() {
        setTimeout(() => {
            const { channel, user } = this.state;
            if (this.props.currentChannel && user) {
                this.addListeners(this.props.currentChannel.id);
                this.addUserStarListener(channel.id, user.uid)
            }
        }, 1000)
    }

    addListeners = channelId => {
        this.addMessageListener(channelId);
    };
    addUserStarListener = (channelId, userId) => {
        this.state.usersRef.child(userId).child("starred").once('value').then(data => {
            if (data.val() !== null) {
                const channelIds = Object.keys(data.val())
                const prevStarred = channelIds.includes(channelId)
                this.setState({
                    isChannelStarred: prevStarred
                })
            }
        })

    }
    addMessageListener = channelId => {
        let loadedMessages = [];
        const ref = this.getMessagesRef()
        ref.child(channelId).on("child_added", snap => {
            loadedMessages.push(snap.val());
            this.setState({
                messages: loadedMessages,
                messagesLoading: false
            });
            this.countUniqeUsers(loadedMessages)
        });
    };

    getMessagesRef = () => {
        const { messagesRef, privateMessagesRef, privateChannel } = this.state
        return privateChannel ? privateMessagesRef : messagesRef
    }
    handleStar = () => {
        this.setState((prevState) => ({
            isChannelStarred: !prevState.isChannelStarred
        }), () => this.starChannel())
    }

    starChannel = () => {
        if (this.state.isChannelStarred) {

            this.state.usersRef.child(`${this.state.user.uid}/starred`).update({
                [this.state.channel.id]: {
                    name: this.state.channel.name,
                    details: this.state.channel.details,
                    createdBy: {
                        name: this.state.channel.createdBy.name,
                        avatar: this.state.channel.createdBy.avatar
                    }
                }
            })
        } else {
            this.state.usersRef.child(`${this.state.user.uid}/starred`).remove(err => {
                if (err !== null) {
                    console.error(err)
                }
            })


        }
    }
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
    countUserPosts = messages => {
        let userPosts = messages.reduce((acc, message) => {
            if (message.user.email in acc) {
                acc[message.user.email].count += 1
            } else {
                acc[message.user.email] = {
                    count: 1,
                    avatar: message.user.avatar
                }
            }
            return acc 
        }, {})
        console.log("userPosts",userPosts)
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
        return channel ? `${this.state.privateChannel ? "@" : "#"} ${channel.name} ` : " "
    }
    render() {
        const { messagesRef, messages, privateChannel, channel, user, progressBar, isChannelStarred, numUniqueUsers, searchResults, searchTerm } = this.state;

        return (
            <React.Fragment>
                <MessagesHeader
                    handleStar={this.handleStar}
                    privateChannel={privateChannel}
                    numUniqueUsers={numUniqueUsers}
                    isChannelStarred={isChannelStarred}
                    handleSearchChange={this.handleSearchChange}
                    channelName={this.displayChannelName(this.props.currentChannel)}
                />
                <Segment>
                    <Comment.Group className={progressBar ? "messages__progress" : "messages"}>
                        {searchTerm ? this.displayMessages(searchResults) : this.displayMessages(messages)}
                    </Comment.Group>
                </Segment>
                <MessageForm
                    currentUser={user}
                    messagesRef={messagesRef}
                    isPrivateChannel={privateChannel}
                    getMessagesRef={this.getMessagesRef}
                    currentChannel={this.props.currentChannel}
                    isProgressBarVisible={this.isProgressBarVissible}
                />
            </React.Fragment>
        );
    }
}

export default Messages;
