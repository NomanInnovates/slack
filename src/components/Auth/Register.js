import React from "react";
import {database,auth} from "../../firebase";
import md5 from 'md5'
import {
  Grid,
  Form,
  Segment,
  Button,
  Header,
  Message,
  Icon
} from "semantic-ui-react";
import { Link } from "react-router-dom";

class Register extends React.Component {
  state = {
    email: "",
    errors:[],
    password: "",
    username: "",
    loading: false,
    usersRef:database.ref('users'),
    passwordConfirmation: ""
  };

  isFormEmpty = ({username,email,password,passwordConfirmation}) => {
    return !username.length || !email.length || !password.length || !passwordConfirmation.length
  }
  isPasswordValid = ({password,passwordConfirmation}) =>{
    if(password.length < 6 || passwordConfirmation.length < 6){
     
      return false
    }else if( password !== passwordConfirmation){
      return false
    }else{
      return true
    }
  }
  isFormValid = () =>{
    let errors = []
    let error 
    
    if(this.isFormEmpty(this.state)){
      // throw error
      error = {message : " Fill All fields"}
      this.setState({errors:errors.concat(error)})
    }
    else if(!this.isPasswordValid(this.state)){
      // throw error
      error = {message : "Password is invalid"}
      this.setState({errors:errors.concat(error)})

    }
    else{
      return true
    }
  }

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  saveUser = createdUser =>{
    return this.state.usersRef.child(createdUser.user.uid).set({
      name:createdUser.user.displayName,
      avatar:createdUser.user.avatar
    })
  }
  handleSubmit = event => {
    event.preventDefault();
    if(this.isFormValid()){
      this.setState({loading:true})
      auth
      .createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then(createdUser => {
        createdUser.user.updateProfile({
          displayName:this.state.username,
          photoURL:`http://gravatar.com/avatar/${md5(createdUser.user.email)}?d=identicon`
        }).then(()=>{
          this.saveUser(createdUser).then(()=>{
            this.setState({loading:false})
          })

        }).catch(err=>{
          console.log(err)
          this.setState({errors : this.state.errors.concat(err),loading:false})
        })
      
    })
    .catch(err => {
        this.setState({errors : this.state.errors.concat(err),loading:false})
      });
    }else{
      alert("form is not valid")
    }
  };
  displayErrors = errors => errors.map((error,i) => <p key={i}>{error.message}</p>)
  handleInputError = (errors,inputName) => {
    return errors.some(error => 
      error.message.toLowerCase().includes(inputName)
      ) ? "error" : ""
  }
  render() {
    const { username, email, password, passwordConfirmation ,loading , errors} = this.state;

    return (
      <Grid textAlign="center" verticalAlign="middle" className="app">
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h2" icon color="orange" textAlign="center">
            <Icon name="puzzle piece" color="orange" />
            Register for DevChat
          </Header>
          <Form onSubmit={this.handleSubmit} size="large">
            <Segment stacked>
              <Form.Input
                fluid
                name="username"
                icon="user"
                iconPosition="left"
                placeholder="Username"
                onChange={this.handleChange}
                value={username}
                type="text"
                className={this.handleInputError(errors , "username")}
              />

              <Form.Input
                fluid
                name="email"
                icon="mail"
                iconPosition="left"
                placeholder="Email Address"
                onChange={this.handleChange}
                value={email}
                type="email"
                className={this.handleInputError(errors , "email")}

              />

              <Form.Input
                fluid
                name="password"
                icon="lock"
                iconPosition="left"
                placeholder="Password"
                onChange={this.handleChange}
                value={password}
                type="password"
                className={this.handleInputError(errors , "password")}

              />

              <Form.Input
                fluid
                name="passwordConfirmation"
                icon="repeat"
                iconPosition="left"
                placeholder="Password Confirmation"
                onChange={this.handleChange}
                value={passwordConfirmation}
                type="password"
                className={this.handleInputError(errors , "password")}

              />

              <Button disabled={loading} className={loading? "loading": ""} color="orange" fluid size="large">
                Submit
              </Button>
            </Segment>
          </Form>
          <Message>
            Already a user? <Link to="/login">Login</Link>
          </Message>
          {this.state.errors.length > 0 && (
            <Message error>
              <h3>Error</h3>
              {this.displayErrors(this.state.errors)}
            </Message>
          )}
        </Grid.Column>
      </Grid>
    );
  }
}

export default Register;
