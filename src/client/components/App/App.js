import React from "react";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import PollList from "../PollList/PollList"
import Poll from "../Poll/Poll";
import Register from "../Register/Register";
import Login from "../Login/Login";
import Profile from "../Profile/Profile";
import UserPolls from "../UserPolls/UserPolls";
import CreatePollForm from "../CreatePollForm/CreatePollForm";

class App extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <Router>
                <Route path="/" component={Header} />
                <Switch>
                    <Route path="/user/create-poll" component={CreatePollForm} />
                    <Route path="/user/register" component={Register} />
                    <Route path="/user/login" component={Login} />
                    <Route path="/user/profile" component={Profile} />
                    <Route path="/user/polls" component={UserPolls} />
                    <Route path="/polls/:id" component={Poll} />
                    <Route path="/" component={PollList} />
                </Switch>
                <Route path="/" component={Footer} />
            </Router>
        )
    }
}

export default App;