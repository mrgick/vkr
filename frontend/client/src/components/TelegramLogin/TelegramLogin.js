import React from "react";

class TelegramLoginButton extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    const {
      botName,
      buttonSize,
      requestAccess,
      dataOnauth,
      widgetVersion,
    } = this.props;
    window.TelegramLoginWidget = {
      dataOnauth: (user) => dataOnauth(user),
    };

    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?" + widgetVersion;
    script.setAttribute("data-telegram-login", botName);
    script.setAttribute("data-size", buttonSize);
    script.setAttribute("data-request-access", requestAccess);
    script.setAttribute("data-onauth", "TelegramLoginWidget.dataOnauth(user)");
    script.async = true;
    this.instance.appendChild(script);
  }

  render() {
    return (
      <div
        className={this.props.className}
        ref={(component) => {
          this.instance = component;
        }}
      >
        {this.props.children}
      </div>
    );
  }
}

export default TelegramLoginButton;
