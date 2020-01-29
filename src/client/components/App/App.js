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
import { AuthRoute, ProtectedRoute } from "../../util/route";

class App extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <Router>
                <Route component={Header} />
                <Switch>
                    <ProtectedRoute path="/user/create-poll" component={CreatePollForm} />
                    <AuthRoute path="/user/register" component={Register} />
                    <AuthRoute path="/user/login" component={Login} />
                    <ProtectedRoute path="/user/profile" component={Profile} />
                    <ProtectedRoute path="/user/polls" component={UserPolls} />
                    <Route path="/polls/:id" component={Poll} />
                    <Route exact path="/" component={PollList} />
                </Switch>
                <Route component={Footer} />
            </Router>
        )
    }
}

export default App;