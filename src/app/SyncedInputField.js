import React from "react";

class SyncedInputField extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isFocused: false,
    };
  }

  render() {
    return (
      <input
        onFocus={(e) => {
          this.setState({ isFocused: true });
        }}
        onBlur={(e) => {
          this.setState({ isFocused: false });
          this.props.setFormValue(this.props.formDataKey, e.target.value);
        }}
        id={this.props.formDataKey}
        type="text"
        onChange={(e) => {
          this.props.setFormValue(this.props.formDataKey, e.target.value);
        }}
        value={this.props.formDataValue}
        className="form-control cb-input"
        placeholder={this.props.placeholder}
      />
    );
  }
}

export default SyncedInputField;
