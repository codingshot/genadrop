import React from 'react';
import classes from './userInput.module.css';

class UserInput extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <input className={classes.input} placeholder="" onChange={(e) => this.props.update(e)} />
      </div>
    );
  }
}

export default UserInput;
