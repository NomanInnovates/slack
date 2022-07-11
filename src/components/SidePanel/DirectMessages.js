import React, { Component } from 'react'
import { Icon, Menu } from 'semantic-ui-react'
import { database } from '../../firebase'

class DirectMessages extends Component {
    state = {
        users: [],
        user: this.props.currentUser,
        userRef: database.ref('users'),
        presenceRef: database.ref('info/connected'),
        connectedRef: database.ref('info/connected')
    }
    componentDidMount() {
        if (this.state.user) {
            this.addListeners(this.state.user.uid)
        }
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
    isUserOnline = user => {
        user.status === "online"
    }
    render() {
        let { users } = this.state
        return (
            <Menu.Menu className="menu">

                <Menu.Item>
                    <span>
                        <Icon name="mail" /> Direct Messages
                    </span>{" "} {users.length}
                </Menu.Item>
                {/* user to send msg directly */}
                {users.map(user => {
                    <Menu.Item key={user.uid}
                    style={{opacity:0.7,fontStyle:"italic"}}
                    onClick={() => console.log(user)}>
                        <Icon name="circle" color={this.isUserOnline(user) ? "green" : 'red'} />
                        @ {user.name}
                    </Menu.Item>
                })}
            </Menu.Menu>
        )
    }
}

export default DirectMessages