import React, { Component } from 'react';
import {API_PATH} from "../Api";
import './Login.css';

export default class Register extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: ''
        }
    }

    handleUsernameInput(event) {
        const input = event.target.value;
        this.setState({
            username: input
        })
    }

    handlePasswordInput(event) {
        const input = event.target.value;
        this.setState({
            password: input
        })
    }

    handleSubmit(event) {
        event.preventDefault();

        fetch(API_PATH + '/users', {
            method: 'POST',
            body: JSON.stringify({
                username: this.state.username,
                password: this.state.password
            }),
            headers: {
                'Content-Type' : 'application/json'
            }

        }).then(results => {
            return results.json()
        }).then(data => {
            const token = data.accessToken;
            localStorage.setItem('access_token', token);
            window.location.href='/posts'
        }).catch(reason => {
            console.error(reason)
        })
    }

    render() {
        return (
            <div className="container login-container">
                <div className="row">
                    <div className="col-md-6 login-form-1">
                        <h3>Registration</h3>
                        <form onSubmit={this.handleSubmit.bind(this)}>
                            <div className="form-group">
                                <input onChange={this.handleUsernameInput.bind(this)} type="text" className="form-control" placeholder="Your Username *"/>
                            </div>
                            <div className="form-group">
                                <input onChange={this.handlePasswordInput.bind(this)} type="password" className="form-control" placeholder="Your Password *"/>
                            </div>
                            <div className="form-group">
                                <input type="submit" className="btnSubmit" value="Sign-Up"/>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}