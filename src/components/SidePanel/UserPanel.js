

import React, { Component } from 'react'
import AvatarEditor from 'react-avatar-editor'
import { Dropdown, Grid, Header, Icon, Modal, Input, Button, Image } from 'semantic-ui-react'
import firebase, { auth, storage } from '../../firebase'


export class UserPanel extends Component {
    state = {
        user: this.props.currentUser,
        blob: "",
        modal: false,
        croppedImage: "",
        previewImage: "",
        uploadedCroppedImage: "",
        storageRef: storage.ref(),
        userRef: firebase.auth().currentUser,
        usersRef: firebase.database().ref("users"),
        metadata: {
            contentType: 'image/jpeg'
        }
    }
    openModal = () => {
        this.setState({ modal: true })
    }
    closeModal = () => {
        this.setState({ modal: false })
    }
    handleChange = event => {
        const file = event.target.files[0]
        const reader = new FileReader()
        if (file) {
            reader.readAsDataURL(file);
            reader.addEventListener("load", () => {
                this.setState({ previewImage: reader.result })
            })
        }
    }

    handleCropImage = () => {
        if (this.avatarEditor) {
            this.avatarEditor.getImageScaledToCanvas().toBlob(blob => {
                let imageUrl = URL.createObjectURL(blob)
                this.setState({
                    croppedImage: imageUrl,
                    blob
                })
            })
        }
    }
    uploadCroppedImage = () => {

        let { storageRef, metadata, user, blob } = this.state
        storageRef.child(`avatars/user-${user.uid}`).put(blob, metadata).then((snap) => {
            snap.ref.getDownloadURL().then((downloadedUrl => {
                this.setState({ uploadedCroppedImage: downloadedUrl }, () => { this.changeAvatar() })
            }))
        })
    }
    changeAvatar = () => {
        this.state.userRef.updateProfile({
            photoURL: this.state.uploadedCroppedImage
        }).then(() => {
            console.log("Photourl updated")
        }).catch(e => {
            console.error(e)
        })
        this.state.usersRef.child(this.state.user.uid).update({ avatar: this.state.uploadedCroppedImage }).then(() => {
           
            this.setState({ modal: false })
        }).catch((err) => console.error(err))
    }
    hangleSignout = () => {
        auth.signOut().then(() => console.log("signout"))
    }

    dropdownOptions = () => [
        {
            key: "user",
            text: <span>Signed in as <b>{this.state.user.email.slice(0, 5) + "..." || "user"}</b></span>,
            disabled: true
        },
        {
            key: "avatar",
            text: <span onClick={this.openModal}>Change Avatar</span>
        },
        {
            key: "signout",
            text: <span onClick={this.hangleSignout}>Sign out </span>
        }
    ]

    render() {
        //   let {primaryColor} =this.props
        let { modal, user, previewImage, croppedImage } = this.state
        
        return (
            <Grid style={{ background: "#4c3c4c", }}>
                <Grid.Column>
                    <Grid.Row style={{ padding: '1.2em', margin: "0" }}>
                        {/* app header */}
                        <Header inverted floated="left" as="h2">
                            <Icon name="code" />
                            <Header.Content>
                                DevChat
                            </Header.Content>
                        </Header>

                        {/* user dropdown */}
                        <Header as="h4" inverted >
                            <Dropdown trigger={<span>
                                {user && user.photoURL && <Image src={user.photoURL} spaced="right" avatar />}
                                {this.state.user.email.slice(0, 5) + "..." || "user"}</span>

                            } options={this.dropdownOptions()}></Dropdown>
                        </Header>
                    </Grid.Row>
                    {/* change user avatar modal */}
                    <Modal basic open={modal} onClose={this.closeModal}>
                        <Modal.Header>
                            Change avatar
                        </Modal.Header>
                        <Modal.Content>
                            <Input
                                fluid
                                type="file"
                                label="New Avatar"
                                name="previewImage"
                                onChange={this.handleChange}
                            />
                            <Grid centered stackable columns={2}>
                                <Grid.Row centered>
                                    <Grid.Column className="ui center aligned grid">
                                        {/* image preview */}
                                        {
                                            previewImage && <AvatarEditor
                                                ref={node => this.avatarEditor = node}
                                                image={previewImage}
                                                width={120}
                                                height={120}
                                                border={50}
                                                scale={1.2} />
                                        }
                                    </Grid.Column>
                                    <Grid.Column>
                                        {/* croped preview */}
                                        {
                                            croppedImage && <Image
                                                style={{ margin: '3.5em auto' }}
                                                width={100}
                                                height={100}
                                                src={croppedImage}
                                            />
                                        }
                                    </Grid.Column>
                                </Grid.Row>

                            </Grid>
                        </Modal.Content>
                        <Modal.Actions>
                            {croppedImage && (
                                <Button color="green" inverted onClick={this.uploadCroppedImage} >
                                    <Icon name="save" /> Change Avatar
                                </Button>)}
                            <Button color="green" inverted onClick={this.handleCropImage}>
                                <Icon name="image" /> Preview Avatar
                            </Button>
                            <Button color="green" inverted onClick={this.closeModal}>
                                <Icon name="remove" /> Cancel
                            </Button>
                        </Modal.Actions>
                    </Modal>
                </Grid.Column>

            </Grid>
        )
    }
}

export default UserPanel