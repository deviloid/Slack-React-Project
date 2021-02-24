import React, {useState} from 'react';
import {Form, Grid, Icon, Segment, Header, Button, Message} from 'semantic-ui-react'
import { Link } from 'react-router-dom';
import "../Auth.css"
import firebase from "../../../server/firebase";

const Login = () => {

    let user = {
        email           : '',
        password        : ''
    }

    let errors = [];
    
    const [userState, setuserState] = useState(user);
    const [errorState, seterrorState] = useState(errors);
    const [isLoading, setIsLoading] = useState(false);
    // const [isSuccess, setIsSuccess] = useState(false);
    
    const handleInput = (event) => {
        let target = event.target;
        setuserState((currentState) => {
            let currentuser = {...currentState};
            currentuser[target.name] = target.value;
            return currentuser;
        })
    }

    const onSubmit = (event) => {
        seterrorState(() => []);
        if(checkForm()){
            setIsLoading(true);
            firebase.auth()
            .signInWithEmailAndPassword(userState.email, userState.password)
            .then(user => {
                setIsLoading(false);
                console.log(user);
            })
            .catch(serverError => {
                setIsLoading(false);
                seterrorState((error) => error.concat(serverError));
            })
        }
    }

    const checkForm = () => {
        if(isFormEmpty()) {
            seterrorState((error) => error.concat({message : "Please fill in all the fields."}));
            return false;
        }
        // else if(!checkPassword()) {
        //     // seterrorState((error) => error.concat({message : "Given password is not valid."}));
        //     return false;
        // }
        return true;
    }

    const isFormEmpty = () => {
        return  !userState.password.length ||
                !userState.email.length;
    }

    const formaterrors = () => {
        return errorState.map((error,index) => <p key={index}>{error.message}</p>)
    }

    return(
        
        <Grid verticalAlign='middle' textAlign='center' className='grid-form'>
            <Grid.Column style={{maxWidth : '500px'}}>
                <Header icon as="h2">
                    <Icon name="slack" />
                    Login
                </Header>
                <Form onSubmit={onSubmit} >
                    <Segment stacked>
                        <Form.Input 
                        name            = "email"
                        value           = {userState.email}
                        icon            = "mail"
                        iconPosition    = "left"
                        onChange        = {handleInput}
                        type            = "email"
                        placeholder     = "Email"
                        />
                        <Form.Input 
                        name            = "password"
                        value           = {userState.password}
                        icon            = "lock"
                        iconPosition    = "left"
                        onChange        = {handleInput}
                        type            = "password"
                        placeholder     = "Password"
                        />
                    </Segment>
                    <Button disabled={isLoading} loading={isLoading}>Submit</Button>
                </Form>
                {errorState.length > 0 && <Message error>
                    <h3>Error</h3>
                    {formaterrors()}
                </Message>}
                <Message>
                    <h3>Not yet Registered? <Link to="/register">Login</Link></h3>
                </Message>
            </Grid.Column>
        </Grid>
    )
}

export default Login;