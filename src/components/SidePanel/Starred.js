import React, { Component } from 'react'
import { Icon, Menu } from 'semantic-ui-react'
import { connect } from 'react-redux'
import { setCurrentChannel, setPrivateChannel } from '../../actions'

 class Starred extends Component {
    state = {
        activeChannel:"",
        starredChannels:[]
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
    console.log(this.props)
    let {starredChannels} = this.state
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