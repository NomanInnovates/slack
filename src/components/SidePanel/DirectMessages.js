import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Icon, Menu } from 'semantic-ui-react'
import { database } from '../../firebase'
import { setCurrentChannel, setPrivateChannel } from '../../config/store/actions'

class DirectMessages extends Component {
    state = {
        users: [],
        user: {},
        activeChannel: '',
        userRef: database.ref('users'),
        presenceRef: database.ref('info/connected'),
        connectedRef: database.ref('info/connected')
    }
    componentDidMount() {
        if (this.state.user) {
            this.addListeners(this.state.user.uid)
            this.setState({
                user: this.props.currentUser
            })
        }
    }
    componentWillUnmount() {
        let { userRef, presenceRef, connectedRef } = this.state
        userRef.off()
        presenceRef.off()
        connectedRef.off()
    }
    addListeners = currentUserUid => {
        let loadedUser = [];
        this.state.userRef.on("child_added", snap => {
            if (currentUserUid !== snap.key) {
                let user = snap.val();
                user['uid'] = snap.key;
                user['status'] = 'offline'
                loadedUser.push(user)
                this.setState({ users: loadedUser })
            }
        })
        this.state.connectedRef.on("value", snap => {
            if (snap.val() === true) {
                const ref = this.state.presenceRef.child(currentUserUid);
                ref.set(true);
                ref.onDisconnect.remove(err => {
                    if (err !== null) {
                        console.error(err)
                    }
                })
            }
        })
        this.state.presenceRef.on('child_added', snap => {
            if (currentUserUid !== snap.key) {
                // add status to the user
                this.addStatusToUser(snap.key)
            }
        })
        this.state.presenceRef.on('child_removed', snap => {
            if (currentUserUid !== snap.key) {
                // add status to the user
                this.addStatusToUser(snap.key, false)
            }
        })
    }

    addStatusToUser = (userId, connected = true) => {
        const updateusers = this.state.users.reduce((acc, user) => {
            if (user.uid === userId) {
                user['status'] = `${connected ? "online" : 'offline'}`
            }
            return acc.concat(user)
        }, [])
        this.setState({ users: updateusers })

    }
    isUserOnline = user => user.status === "online"

    changeChannel = user => {
        const channelId = this.getChannelId(user.uid)
        const channelData = {
            id: channelId,
            name: user.name
        }
        this.props.setCurrentChannel(channelData)
        this.props.setPrivateChannel(true)
        this.setActiveChannel(user.uid)
    }
    setActiveChannel = uid => {
        this.setState({
            setActiveChannel: uid
        })
    }
    getChannelId = userId => {

        const currentUserId = this.state.user.uid
        return userId < currentUserId ? `${userId}/${currentUserId}` : `${currentUserId}/${userId}`
    }
    render() {
        let { users, activeChannel } = this.state

        return (
            <Menu.Menu className="menu" style={{ padding: "1em" }}>

                <Menu.Item>
                    <span>
                        <Icon name="mail" /> Direct Messages
                    </span>{" "} {users.length}
                </Menu.Item>
                {/* user to send msg directly */}
                {users.map(user => {

                    return <Menu.Item
                        key={user.uid}
                        active={user.uid === activeChannel}
                        style={{ opacity: 0.7, fontStyle: "italic" }}
                        onClick={() => this.changeChannel(user)}>
                        <Icon name="circle" color={this.isUserOnline(user) ? "green" : 'red'} />
                        @ {user.name}
                    </Menu.Item>
                })}
            </Menu.Menu>
        )
    }
}
// const mapStateToProps = state => {
//     return state
// }
export default connect(null, { setPrivateChannel, setCurrentChannel })(DirectMessages)