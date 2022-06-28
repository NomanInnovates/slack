import React, { Component } from 'react'
import { Dropdown, Grid, Header, Icon } from 'semantic-ui-react'
import {auth} from '../../firebase'
export class UserPanel extends Component {
    state = {
        user:this.props.currentUser
    }
  
    hangleSignout = () =>{
        auth.signOut().then(()=> console.log("signout"))
    }
    dropdownOptions = () => [
        {
            key:"user",
            text:<span>Signed in as <b>{ this.state.user.email.slice(0,5)+"..." || "user"}</b></span>,
            disabled:true
        },
        {
            key:"avatar",
            text:<span>Change Avatar</span>
        },
        {
            key:"signout",
            text:<span onClick={this.hangleSignout}>Sign out </span>
        }
    ]

  render() {
    console.log("this.props.currentUser",this.props.currentUser)
    console.log("this.props.currentUser",this.props.currentUser)
    console.log("this.props.currentUser",this.props.currentUser)
    return (
      <Grid style={{background:"#4c3c4c",}}>
          <Grid.Column>
              <Grid.Row style={{padding:'1.2em',margin:"0"}}>
                {/* app header */}
                  <Header inverted floated="left" as="h2">
                      <Icon name="code" />
                      <Header.Content>
                          DevChat
                      </Header.Content>
                  </Header>

              </Grid.Row>
              {/* user dropdown */}
            <Header style={{padding:"0.25rem"}} as="h4" inverted >
                <Dropdown trigger={<span>User</span>} options={this.dropdownOptions()}></Dropdown>
            </Header>
          </Grid.Column>

      </Grid>
    )
  }
}

export default UserPanel