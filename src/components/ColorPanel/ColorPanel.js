import React from "react";
import {
    Sidebar,
    Menu,
    Divider,
    Button,
    Modal,
    Icon,
    Label,
    Segment
} from "semantic-ui-react";
import { SliderPicker } from "react-color";
import firebase from "../../firebase";
import { setColors } from "../../actions";
import { connect } from "react-redux";


class ColorPanel extends React.Component {
    state = {
        modal: false,
        primary: "",
        secondary: "",
        userColors: [],
        user: this.props.currentUser,
        userRef: firebase.database().ref('users')
    };
    componentDidMount() {

        setTimeout(() => {

            if (this.state.user) {
                this.addListener(this.state.user.id)
            }
        }, 1000)
    }

    componentWillUnmount() {
        this.removeListener()
    }
    removeListener = () => {
        this.state.userRef.child(`${this.state.user.uid}/color`).off()
    }
    addListener = userId => {
        console.log("addListener")
        let userColors = []
        this.state.userRef.child(userId + "/colors").on("child_added", snap => {
            console.log("snap", snap.val())
            userColors.unshift(snap.val())
        })
        this.setState({
            userColors
        })
        
    }

    openModal = () => this.setState({ modal: true });

    closeModal = () => this.setState({ modal: false });
    handleChangePrimary = color => { this.setState({ primary: color.hex }) }
    handleChangeSecondaryy = color => { this.setState({ secondary: color.hex }) }
    handleSaveColor = () => {
        if (this.state.primary && this.state.secondary) {
            this.saveColors()
        }
    }
    saveColors = () => {
        let { primary, secondary } = this.state
        this.state.userRef.child(this.state.user.uid + "/colors").push().update({ primary, secondary }).then(() => {
            console.log("colors added")
            this.closeModal()
        }).catch(err => console.error(err))
    }
    displayUserColors = colors => {
        return colors.map((color, index) => (
            <div>
                <Divider />
                <div className="color__container"
                    onClick={() => this.props.setColors(color.primary, color.secondary)}
                >
                    <div className="color__square" style={{ color: color.primary }}>
                        <div className="color__overlay" style={{ color: color.secondary }}>

                        </div>
                    </div>
                </div>
            </div>)
        )

    }

    render() {
        const { modal, primary, secondary, userColors, user } = this.state;
      
        return (
            <Sidebar
                as={Menu}
                icon="labeled"
                inverted
                vertical
                visible
                width="very thin"
            >
                <Divider />
                <Button icon="add" size="small" color="blue" onClick={this.openModal} />
                {userColors && this.displayUserColors(userColors)}

                {/* Color Picker Modal */}
                <Modal basic open={modal} onClose={this.closeModal}>
                    <Modal.Header>Choose App Colors</Modal.Header>
                    <Modal.Content>
                        <Segment inverted>

                            <Label content="Primary Color" />
                            <SliderPicker color={primary} onChange={this.handleChangePrimary} />
                        </Segment>
                        <Segment inverted>

                            <Label content="Secondary Color" />
                            <SliderPicker color={secondary} onChange={this.handleChangeSecondaryy} />
                        </Segment>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color="green" inverted onClick={this.handleSaveColor}>
                            <Icon name="checkmark" /> Save Colors
                        </Button>
                        <Button color="red" inverted onClick={this.closeModal}>
                            <Icon name="remove" /> Cancel
                        </Button>
                    </Modal.Actions>
                </Modal>
            </Sidebar>
        );
    }
}

export default connect(null, { setColors })(ColorPanel);