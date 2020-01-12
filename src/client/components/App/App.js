import React from "react";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import PollList from "../PollList/PollList"
import Poll from "../Poll/Poll";
import SignUpForm from "../SignUpForm/SignUpForm";
import SignInForm from "../SignInForm/SignInForm";
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
                    <Route path="/create-poll" component={CreatePollForm} />
                    <Route path="/poll/:id" component={Poll} />
                    <Route path="/sign-up" component={SignUpForm} />
                    <Route path="/sign-in" component={SignInForm} />
                    <Route path="/" component={PollList} />
                </Switch>
                <Route path="/" component={Footer} />
            </Router>
        )
    }
}

export default App;