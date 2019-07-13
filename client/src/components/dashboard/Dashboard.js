import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import io from "socket.io-client";

class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      message: "",
      messages: []
    };

    this.socket = io(`ws://${window.location.hostname}:5000`);

    this.socket.on("RECEIVE_MESSAGE", function(data) {
      addMessage(data);
    });

    const addMessage = data => {
      console.log(data);
      this.setState({ messages: [...this.state.messages, data] });
      console.log(this.state.messages);
    };

    this.sendMessage = ev => {
      ev.preventDefault();
      this.socket.emit("SEND_MESSAGE", {
        author: this.state.username,
        message: this.state.message
      });
      this.setState({ message: "" });
    };
  }

  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }
  }

  render() {
    const { isAuthenticated, user } = this.props.auth;
    return (
      <div className="dashboard">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display-4">Global Chat</h1>

              <div className="container">
                <div className="row">
                  <div className="col-12">
                    <div className="card">
                      <div className="card-body">
                        <div className="card-title">{user.name}</div>
                        <hr />
                        <div className="messages">
                          {this.state.messages.map(message => {
                            return (
                              <div>
                                {message.author}: {message.message}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      <div className="card-footer">
                        <div className="row">
                          <div className="col-md-10">
                            <input
                              type="text"
                              placeholder="Message"
                              className="form-control"
                              value={this.state.message}
                              onChange={ev =>
                                this.setState({ message: ev.target.value })
                              }
                            />
                          </div>
                          <div className="col-md-2">
                            <button
                              onClick={this.sendMessage}
                              className="btn btn-primary form-control"
                            >
                              Send
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Dashboard.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  {}
)(Dashboard);
