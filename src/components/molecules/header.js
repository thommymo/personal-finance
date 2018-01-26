import React, { Component } from "react"
import { connect } from "react-redux"

class Header extends Component {
  loginLogout(status) {
    switch (status) {
      case "loggedin":
        return <a href="api/logout">logout</a>
      case "loggedout":
        return <a href="auth/google">Login with Google</a>
      default:
        return
    }
  }
  render() {
    const { status } = this.props.authentication
    return <header>{this.loginLogout(status)}</header>
  }
}

const mapStateToProps = ({ authentication }) => {
  return { authentication }
}

export default connect(mapStateToProps)(Header)
