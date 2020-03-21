import React from 'react';
import Posts from './components/Posts'
import Login from "./components/Login";
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";
import Register from "./components/Register";

function App() {
    const loggedIn = localStorage.getItem('access_token') != null;

    return (
        <Router>
            <div>
                <Switch>
                    <Route exact path='/'>{loggedIn ? <Redirect to='/posts'/> : <Redirect to='/sign-in'/>}</Route>
                    <Route path='/posts' component={Posts}/>
                    <Route path='/sign-in' component={Login}/>
                    <Route path='/sign-up' component={Register}/>
                </Switch>
            </div>
        </Router>
    );
}

export default App;
