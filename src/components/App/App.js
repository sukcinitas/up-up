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
    render (){
        return (
            <Router>
                <Route path="/" component={Header} />
                <Route path="/polls" component={PollList} />
                <Route path="/polls/:id" component={Poll} />
                <Route path="/polls/add" component={CreatePollForm} />
                <Route path="/users/signup" component={SignUpForm} />
                <Route path="/" component={Footer} />
            </Router>
        )
    }
}

export default App;