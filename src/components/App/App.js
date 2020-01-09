import React from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import PollList from "../PollList/PollList"
import SignUpForm from "../SignUpForm/SignUpForm";
import SignInForm from "../SignInForm/SignInForm";
import CreatePollForm from "../CreatePollForm/CreatePollForm";

class App extends React.Component {
    constructor(props) {
        super(props);
    }
    render (){
        return (
            <>
                <Header />
                {/* <PollList list={[{question: "Kas tu?", votes: 100}, {question: "Kas tu esi?", votes: 120}]}/> */}
                <SignUpForm />
                {/* <SignInForm /> */}
                <CreatePollForm />
                <Footer />
            </>
        )
    }
}

export default App;