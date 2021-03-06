import React, { Component } from "react";
import "./Chat.css";
import firebase from "../../firebase.js"
import $ from 'jquery'

class Chat extends Component {

    constructor(props) {
        super(props);
        this.state = {
            messages: []
        };

    };

    componentWillMount() {
        /* Create reference to messages in Firebase Database */
        let messagesRef = firebase.database().ref("messages").orderByChild("id").limitToLast(25);

        messagesRef.on("child_added", snapshot => {
            /* Update React state when message is added at Firebase Database */
            let message = {
                text: snapshot.val(),
                id: snapshot.key
            };
            this.setState({
                messages: [message].concat(this.state.messages)
            });
            $(".chat-scroll").animate( { scrollTop: $(".chat-scroll").height()+999999999999999999 }, "slow");
        });

    };

    addMessage(event) {
        event.preventDefault(); // <- prevent form submit from reloading the page
        /* Send the message to Firebase */
        firebase.database().ref("messages").push( firebase.auth().currentUser.displayName + " – " + this.input.value );
        this.input.value = ""; // <- clear the input
        console.log(this.state.messages);
    };

    render() {
        return (
                <div>
                    <div className="row no-margins">
                        <div className="col-lg-12 chat-container">
                            {this.state.messages.map( message => <p key={message.id}>{message.text}</p> )}
                        </div>
                    </div>

                    <img className="h1-img-top" alt="breakline" src={require('../../components/Images/h1.png')} />
                   
                   <div>
                    <form className="form-padding" onSubmit={this.addMessage.bind(this)}>
                        <div className="row no-margins">
                            <div className="col-10">
                                <input
                                    className="form-control input-inner-shadow "
                                    type="text"
                                    placeholder="YOUR MESSAGE"
                                    ref={msg => this.input = msg}
                                    required title="Anti-Chris Abuse"
                                    minLength="1"
                                    maxLength="100"
                                />
                            </div>
            
                            <div className="col-2 d-flex justify-content-end">
                                <input className="btn button button-join" type="submit" />
                            </div>
                        </div>
                    </form>
                    </div>
                </div>

        );
    };
};

export default Chat;