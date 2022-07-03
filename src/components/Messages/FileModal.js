import React from "react";
// import mime from 'mine-types'
import { Modal, Input, Button, Icon } from "semantic-ui-react";

class FileModal extends React.Component {
  state = {
    file: null,
    authorize: ['images/jpeg', 'images/png']
  }
  addFile = event => {
    const file = event.target.files[0]
    console.log("file", file)
    if (file) {
      this.setState({ file })
    }
  }
  clearFile = () => {
    this.setState({ file: null })
  }
  authorized = filename => this.state.authorize.includes(filename)
  sendFile = () => {
    const { file } = this.state
    if (file) {
      let { uploadFile, closeModal } = this.props
      if (this.authorized(file.name)) {
        uploadFile(file)
        this.clearFile()
        closeModal()
      }
    }
  }
  render() {
    const { modal, closeModal } = this.props;

    return (
      <Modal basic open={modal} onClose={closeModal}>
        <Modal.Header>Select an Image File</Modal.Header>
        <Modal.Content>
          <Input onChange={this.addFile} fluid label="File types: jpg, png" name="file" type="file" />
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={this.sendFile} color="green" inverted>
            <Icon name="checkmark" /> Send
          </Button>
          <Button color="red" inverted onClick={closeModal}>
            <Icon name="remove" /> Cancel
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

export default FileModal;
