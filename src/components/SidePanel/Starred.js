import React, { Component } from 'react'
import { Icon, Menu } from 'semantic-ui-react'
import { connect } from 'react-redux'
import { setCurrentChannel, setPrivateChannel } from '../../actions'
import { database } from '../../firebase'

class Starred extends Component {
  state = {
    activeChannel: "",
    starredChannels: [],
    user: this.props.currentUser,
    userRef: database.ref('users')
  }

  componentDidMount() {
    if (this.state.user) {
      this.addListener(this.state.user.uid)
    }
  }

  componentWillUnmount() {
    let { userRef, user } = this.state
    userRef.child(`${user.uid}/starred`).off()

  }

  addListener = (userId) => {
    this.state.userRef.child(userId).child('starred').on('child_added', snap => {
      const starredChannel = {
        id: snap.key, ...snap.val()
      }
      this.setState({
        starredChannels: [...this.state.starredChannels, starredChannel]
      })
    })
    this.state.userRef.child(userId).child('starred').on('child_removed', snap => {
      const channelToRemove = {
        id: snap.key, ...snap.val()
      }
      const filterChannels = this.state.starredChannels.filter(channel => {
        return channel.id !== channelToRemove.id
      })
      this.setState({
        starredChannels: filterChannels
      })
    })
  }
  setActiveChannel = channel => {
    this.setState({ activeChannel: channel.id })
  }

  changeChannel = channel => {
    this.setActiveChannel(channel)
    this.props.setCurrentChannel(channel)
    this.props.setPrivateChannel(false)
  }
  displayChannels = (starredChannels) => (

    starredChannels.length > 0 && starredChannels.map((channel) => (<Menu.Item
      key={channel.id}
      onClick={() => this.changeChannel(channel)}
      name={channel.name}
      style={{
        opacity: 0.7
      }}
      active={channel.id === this.state.activeChannel}
    >#
      {channel.name}
    </Menu.Item>
    ))
  )
  render() {
    let { starredChannels } = this.state
    return (
      <div> <Menu.Menu style={{ padding: "2rem" }}>
        <Menu.Item style={{ padding: "0px" }} >
          <span>
            <Icon name="star" /> STARRED
          </span>
          ({"  " + starredChannels.length})
        </Menu.Item>
        {/* channels here */}
        {this.displayChannels(starredChannels)}
      </Menu.Menu></div>
    )
  }
}


export default connect(null, { setCurrentChannel, setPrivateChannel })(Starred)