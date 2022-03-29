import React from 'react';
import classes from './error.module.css';

class ErrorBoundary extends React.Component {
  constructor() {
    super();

    this.state = {
      hasErrored: false,
    };
  }

  static getDerivedStateFromError() {
    // process the error

    return { hasErrored: true };
  }

  componentDidCatch(error) {
    console.log(error);
  }

  render() {
    if (this.state.hasErrored) {
      return <div className={classes.container}>Something went wrong</div>;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
