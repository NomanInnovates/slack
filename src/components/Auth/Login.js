import React from "react";
import {auth} from "../../firebase";
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

class Login extends React.Component {
  state = {
    email: "",
    errors: [],
    password: "",
    loading: false,
  };

  isFormEmpty = ({ email, password }) => {
    return  !email.length || !password.length 
  }
  isPasswordValid = ({ password }) => {
    if (password.length < 6 ) {
      return false
    }  else {
      return true
    }
  }
  isFormValid = () => {
    let errors = []
    let error

    if (this.isFormEmpty(this.state)) {
      // throw error
      console.log("if")
      error = { message: " Fill All fields" }
      this.setState({ errors: errors.concat(error) })
    }
    else if (!this.isPasswordValid(this.state)) {
      // throw error
      console.log("else if")
      error = { message: "Password is invalid" }
      this.setState({ errors: errors.concat(error) })
    }
    else {
      console.log("else ")
      return true
    }
  }

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSubmit = event => {
    event.preventDefault();
    if (this.isFormValid()) {
      this.setState({ loading: true })
      auth.signInWithEmailAndPassword(this.state.email, this.state.password)
        .then((user) => {
          console.log("user", user)
          this.setState({ loading: true })
        }).catch(err => {
          console.log(err)
          this.setState({
            errors: this.state.errors.concat(err),
            loading: false
          })
        })
    } else {
      alert("form is not valid")
    }
  };
  displayErrors = errors => errors.map((error, i) => <p key={i}>{error.message}</p>)
  handleInputError = (errors, inputName) => {
    return errors.some(error =>
      error.message.toLowerCase().includes(inputName)
    ) ? "error" : ""
  }
  render() {
    const { email, password, loading, errors } = this.state;

    return (
      <Grid textAlign="center" verticalAlign="middle" className="app">
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h1" icon color="violet" textAlign="center">
            <Icon name="puzzle piece" color="violet" />
            Login for DevChat
          </Header>
          <Form onSubmit={this.handleSubmit} size="large">
            <Segment stacked>
              <Form.Input
                fluid
                name="email"
                icon="mail"
                iconPosition="left"
                placeholder="Email Address"
                onChange={this.handleChange}
                value={email}
                type="email"
                className={this.handleInputError(errors, "email")}

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
                className={this.handleInputError(errors, "password")}

              />



              <Button disabled={loading} className={loading ? "loading" : ""} color="violet" fluid size="large">
                Submit
              </Button>
            </Segment>
          </Form>
          <Message>
            Not have an account? <Link to="/register">Register</Link>
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


export default Login;
