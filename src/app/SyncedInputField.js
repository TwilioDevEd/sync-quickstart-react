import React from 'react';

class SyncedInputField extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isFocused: false
    };
  }

  render() {
    return (
      <input onFocus={(e) => {
        console.log('onFocus');
        this.setState({isFocused: true})
      }}
      onBlur={(e) => {
        console.log('onBlur');
        this.setState({isFocused: false})
        this.props.setFormValue(this.props.formDataKey,e.target.value);
      }}
      id={this.props.formDataKey} 
      type="text" 
      defaultValue={this.props.formDataValue}
      className="form-control cb-input" 
      placeholder={this.props.placeholder}/>
    )
  }
}

export default SyncedInputField;