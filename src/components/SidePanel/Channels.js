
import React, { Component } from 'react'
import { database } from '../../firebase'
import { Icon, Menu, Modal, Form, Input, Button } from 'semantic-ui-react'

export class Channels extends Component {
  state = {
    channels: [],
    modal: false,
    channelName: "",
    channelDetails: "",
    user:this.props.currentUser,
    channelsRef:database.ref('channels')
  }
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
  isFormValid = ({channelDetails,channelName}) => channelDetails && channelName
  addChannel = () => {
   const {channelsRef,channelName,channelDetails,user } = this.state
   const key = channelsRef.push().key
   let newChannel = {
    id:key,
    name:channelName,
    details:channelDetails,
    createdBy:{
      name:user.email || "n/a",
      avatar:user.photoUrl || "n/a"

    }
   }
   channelsRef.child(key).update(newChannel).then(()=>{
    this.setState({channelDetails:"",channelName:""})
    this.closeModal()
   }).catch((err)=>{
    console.log("err",err)
   })
  }

  handleSubmit = e => {
    e.preventDefault()
    if(this.isFormValid(this.state)){
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

export default Channels