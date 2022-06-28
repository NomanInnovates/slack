
import React, { Component } from 'react'
import { database } from '../../firebase'
import { Icon, Menu, Modal, Form, Input, Button } from 'semantic-ui-react'
import { setCurrrentChannel } from '../../actions'
import { connect } from 'react-redux'

export class Channels extends Component {
  state = {
    channels: [],
    modal: false,
    firstLoad:true,
    channelName: "",
    activeChannel:"",
    channelDetails: "",
    user: this.props.currentUser,
    channelsRef: database.ref('channels')
  }
  componentDidMount() {
    this.addListeners()
  }
  addListeners = () => {
    let loadedChannels = [];
    this.state.channelsRef.on('child_added', snap => {
      loadedChannels.push(snap.val())
      this.setState({ channels: loadedChannels },()=>{this.setFirstChannal()})
    })
  }
  setFirstChannal =  () =>{
    if(this.state.firstLoad && this.state.channels.length > 0  ){
      this.changeChannel(this.state.channels[0])
      this.setState({firstLoad:false})
    }
  }

  displayChannels = (channels) => (

    channels.length > 0 && channels.map((channel) => (<Menu.Item
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
  closeModal = () => {
    this.setState({
      modal: false
    })
  }
  openModal = () => {
    this.setState({
      modal: true
    })
  }
  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }
  setActiveChannel =channel=>{
    this.setState({activeChannel:channel.id})
  }
  changeChannel = channel =>{
    this.setActiveChannel(channel)
    this.props.setCurrrentChannel(channel)
  }
  isFormValid = ({ channelDetails, channelName }) => channelDetails && channelName
  addChannel = () => {
    const { channelsRef, channelName, channelDetails, user } = this.state
    const key = channelsRef.push().key
    let newChannel = {
      id: key,
      name: channelName,
      details: channelDetails,
      createdBy: {
        name: user.email || "n/a",
        avatar: user.photoUrl || "n/a"

      }
    }
    channelsRef.child(key).update(newChannel).then(() => {
      this.setState({ channelDetails: "", channelName: "" })
      this.closeModal()
    }).catch((err) => {
      console.log("err", err)
    })
  }

  handleSubmit = e => {
    e.preventDefault()
    if (this.isFormValid(this.state)) {
      this.addChannel()
    }
  }

  render() {

    const { channels, modal } = this.state
    return <div>
      <Menu.Menu style={{ padding: "2rem" }}>
        <Menu.Item style={{ padding: "0px" }} >
          <span>
            <Icon name="exchange" /> CHANNELS
          </span>
          ({"  " + channels.length}) <Icon name="add" className="add" onClick={this.openModal} style={{ cursor: "pointer" }} />
        </Menu.Item>
        {/* channels here */}
        {this.displayChannels(channels)}
      </Menu.Menu>
      <Modal basic open={modal} onClose={this.closeModal}>
        <Modal.Header>Add a Channel</Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Field>

              <Input
                fluid
                label="Name of Channel"
                name="channelName"
                onChange={this.handleChange}

              />
            </Form.Field>
            <Form.Field>
              <Input
                fluid
                label="About channel"
                name="channelDetails"
                onChange={this.handleChange}

              />
            </Form.Field>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button color="green" inverted onClick={this.handleSubmit}>
            <Icon name="checkmark" /> Add
          </Button>
          <Button color="red" inverted onClick={this.closeModal} >
            <Icon name="remove" /> Cancel
          </Button>
        </Modal.Actions>
      </Modal>
    </div>

  }
}

export default connect(null,{setCurrrentChannel})(Channels)