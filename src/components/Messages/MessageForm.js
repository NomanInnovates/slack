import React from "react";
import { database, storage } from "../../firebase";
import uuidv4 from 'uuid/v4'
import { Segment, Button, Input } from "semantic-ui-react";

import FileModal from "./FileModal";
import ProgressBar from "./ProgressBar/ProgressBar";
import {Picker,emojiIndex} from 'emoji-mart'
import 'emoji-mart/css/emoji-mart.css'

class MessageForm extends React.Component {
  state = {
    errors: [],
    message: "",
    modal: false,
    uploadState: "",
    loading: false,
    uploadTask: null,
    emojiPicker:false,
    percentUploaded: 0,
    storageRef: storage.ref(),
    user: this.props.currentUser,
    typingRef: database.ref("typing"),
    channel: this.props.currentChannel,
   
  };
  
  componentWillUnmount(){
    if(this.state.uploadTask !== null){
      this.state.uploadTask.cancel();
      this.setState({uploadTask:null})
    }
  }

  openModal = () => this.setState({ modal: true });

  closeModal = () => this.setState({ modal: false });

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  handleKeyDown = event => {
    if(event.ctrlKey && event.keyCode === 17){
      this.sendMessage()
    }
    const {message,typingRef,user,channel} = this.state
    if(message){
      typingRef.child(channel.id).child(user.uid).set(user.email)
    }else{
      typingRef.child(channel.id).child(user.uid).remove()
    }
  }
  handleTogglePicker = () => {
    this.setState({emojiPicker:!this.state.emojiPicker})
  }
  handleAddEmoji = emoji => {
    let oldMessage = this.state.message;
    let newMessage = this.colonToUniCode(`${oldMessage} ${emoji.colons}`)
    this.setState({message:newMessage, emojiPicker:false})
  }
  colonToUniCode = message => {
    return message.replace(/:[A-Za-z0-9_+-]+:/g, x => {
      x = x.replace(/:/g,"");
      let emoji = emojiIndex.emojis[x];
      if( typeof emoji !== 'undefined'){
        let unicode = emoji.native;
        if(typeof unicode !== "undefined"){
          return unicode
        }
      }
      x = ":" + x + ":";
      return x
    })
  }
  createMessage = (fileUrl = null) => {
    const message = {
      timestamp: new Date(),
      user: {
        id: this.state.user.uid,
        name: this.state.user.email,
        avatar: this.state.user.photoURL
      },
     
    };
    if(fileUrl !== null){
      message["image"] = fileUrl
    }
    else{
      message["content"] = this.state.message
    }
    return message;
  };

  sendMessage = () => {
    const { getMessagesRef } = this.props;
    const { message, channel,user,typingRef } = this.state;

    if (message) {
      this.setState({ loading: true });
      getMessagesRef()
        .child(this.props.currentChannel.id)
        .push()
        .set(this.createMessage())
        .then(() => {
          this.setState({ loading: false, message: "", errors: [] });
          typingRef.child(channel.id).child(user.uid).remove()
        })
        .catch(err => {
          console.error(err);
          this.setState({
            loading: false,
            errors: this.state.errors.concat(err)
          });
        });
    } else {
      this.setState({
        errors: this.state.errors.concat({ message: "Add a message" })
      });
    }
  };
  getPath = () =>{
    if(this.props.isPrivateChannel){
      return `chat/private-${this.state.channel.id}`
    }else{
      return `chat/public`
    }
  }
  uploadFile = (file,metaData) => {
   
    let pathToUpload = this.state.channel.id
    let ref = this.props.getMessagesRef();
    const filePath = `${this.getPath()}${uuidv4()}.jpg`

    this.setState({
      uploadState: "uploading",
      uploadTask: this.state.storageRef.child(filePath).put(file)
    },
      () => {
        this.state.uploadTask.on("state_changed", snap => {
          const percentUploaded = (snap.bytesTransferred / snap.totalBytes) * 100
          this.props.isProgressBarVisible(percentUploaded)
          this.setState({
            percentUploaded
          })
        },
          err => {
            console.error(err)
            this.setState({
              errors: this.state.errors.concat(err),
              uploadState: 'error',
              uploadTask: null
            })
          },
          () => {
            this.state.uploadTask.snapshot.ref.getDownloadURL().then(downloadUrl => {
              this.sendFileMessage(downloadUrl, ref, pathToUpload)
            }).catch(err => {
              console.error(err)
              this.setState({
                errors: this.state.errors.concat(err),
                uploadState: 'error',
                uploadTask: null
              })
            })
          }
        )
      })

  }
  sendFileMessage = (fileUrl,ref,pathToUpload, ) => {
    ref.child(pathToUpload).push().set(this.createMessage(fileUrl)).then(()=>{
      this.setState({uploadState:"done"})
    }).catch((e)=>{
      console.warn(e)
      this.setState({
        errors:this.state.errors.concat(e)
      })
    })

  }
  render() {
   
    const { errors, message, loading, modal,percentUploaded,uploadState , emojiPicker } = this.state;

    return (
      <Segment className="message__form">
        {emojiPicker && <Picker 
        set="apple"
        onSelect={this.handleAddEmoji}
        className="emojipicker"
        title="Pick Your emoji"
        emoji="point_up"
        />}
        <Input
          fluid
          name="message"
          value={message}
          onChange={this.handleChange}
          onKeyDown={(e) => this.handleKeyDown(e)}
          style={{ marginBottom: "0.7em" }}
          
          content={emojiPicker  ? 'Close' : null}
          label={<Button onClick={this.handleTogglePicker} icon={emojiPicker  ? "close" : "add"}
           />}
          labelPosition="left"
          className={
            errors.some(error => error.message.includes("message"))
              ? "error"
              : ""
          }
          placeholder="Write your message"
        />
        <Button.Group icon widths="2">
          <Button
            icon="edit"
            color="orange"
            disabled={loading}
            content="Add Reply"
            labelPosition="left"
            onClick={this.sendMessage}
          />
          <Button
            color="teal"
            icon="cloud upload"
            labelPosition="right"
            content="Upload Media"
            onClick={this.openModal}
            disabled={uploadState === "uploading"}
          />
        </Button.Group>
          <FileModal modal={modal} closeModal={this.closeModal} uploadFile={this.uploadFile} />
          <ProgressBar 
          uploadState={uploadState}
          percentUploaded={percentUploaded}
          />

      </Segment>
    );
  }
}

export default MessageForm;
