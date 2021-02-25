import React, {useState} from 'react';
import {Form, Grid, Icon, Segment, Header, Button, Message} from 'semantic-ui-react'
import { Link } from 'react-router-dom';
import "../Auth.css"
import firebase from "../../../server/firebase";

const Register = () => {

    let user = {
        userName        : '',
        email           : '',
        password        : '',
        confirmpassword : ''
    }

    let errors = [];

    let userCollectionRef = firebase.database().ref('users');

    const [userState, setuserState] = useState(user);
    const [errorState, seterrorState] = useState(errors);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleInput = (event) => {
        let target = event.target;
        setuserState((currentState) => {
            let currentuser = {...currentState};
            currentuser[target.name] = target.value;
            return currentuser;
        })
    }

    const checkForm = () => {
        if(isFormEmpty()) {
            seterrorState((error) => error.concat({message : "Please fill in all the fields."}));
            return false;
        }
        else if(!checkPassword()) {
            return false;
        }
        return true;
    }

    const isFormEmpty = () => {
        return  !userState.userName.length ||
                !userState.password.length ||
                !userState.email.length ||
                !userState.confirmpassword.length;
    }
    
    const checkPassword = () => {
        if(userState.password.length < 8) {
            seterrorState((error) => error.concat({message : "Password must have at least 8 characters."}));
            return false;
        }
        else if(userState.password !== userState.confirmpassword) {
            seterrorState((error) => error.concat({message : "Passwords do not match."}));
            return false;
        }
        return true;
    }

    const onSubmit = (event) => {
        setIsSuccess(false);
        seterrorState(() => []);
        if(checkForm()){
            setIsLoading(true);
            firebase.auth()
            .createUserWithEmailAndPassword(userState.email, userState.password)
            .then(createdUser => {
                setIsLoading(false);
                updateUserDetails(createdUser);
            })
            .catch(serverError => {
                setIsLoading(false);
                seterrorState((error) => error.concat(serverError));
            })
        }
    }

    const updateUserDetails = (createdUser) => {
        if (createdUser) {
            setIsLoading(true);
            createdUser.user
            .updateProfile({
                displayName : userState.userName,
                photoURL : `https://avatars.dicebear.com/4.5/api/avataaars/${userState.userName}.png?topChance=100&clothes[]=blazer&eyes[]=surprised&eyebrow[]=up&eyebrow[]=default&mouth[]=twinkle&skin[]=yellow`
            })
            .then(() => {
                setIsLoading(false);
                saveUserInDB(createdUser);
            })
            .catch((serverError) => {
                setIsLoading(false);
                seterrorState((error) => error.concat(serverError));
            })
        }
    }

    const saveUserInDB = (createdUser) => {
        setIsLoading(true);
        userCollectionRef.child(createdUser.user.uid).set({
            displayName : createdUser.user.displayName,
            photoURL : createdUser.user.photoURL,
        })
        .then(() => {
            setIsLoading(false);
            setIsSuccess(true);
        })
        .catch((serverError) => {
            setIsLoading(false);
            seterrorState((error) => error.concat(serverError)); 
        })
    }

    const formaterrors = () => {
        return errorState.map((error,index) => <p key={index}>{error.message}</p>)
    }

    return (
        <Grid verticalAlign='middle' textAlign='center' className='grid-form'>
            <Grid.Column style={{maxWidth : '500px'}}>
                <Header icon as="h2">
                    <Icon name="slack" />
                    Register
                </Header>
                <Form onSubmit={onSubmit} >
                    <Segment stacked>
                        <Form.Input 
                        name            = "userName"
                        value           = {userState.userName}
                        icon            = "user"
                        iconPosition    = "left"
                        onChange        = {handleInput}
                        type            = "text"
                        placeholder     = "User Name"
                        />
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
                        <Form.Input 
                        name            = "confirmpassword"
                        value           = {userState.confirmpassword}
                        icon            = "lock"
                        iconPosition    = "left"
                        onChange        = {handleInput}
                        type            = "password"
                        placeholder     = "Confirm Password"
                        />
                    </Segment>
                    <Button disabled={isLoading} loading={isLoading}>Submit</Button>
                </Form>
                {errorState.length > 0 && <Message error>
                    <h3>Error</h3>
                    {formaterrors()}
                </Message>}
                {isSuccess && <Message success>
                    <h3>Successfully Registered</h3>
                </Message>}
                <Message>
                    <h3>Already an User? <Link to="/login">Login</Link></h3>
                </Message>
            </Grid.Column>
        </Grid>

    )
}

export default Register;