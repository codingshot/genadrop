import React from "react";
import classes from "./error.module.css";

class ErrorBoundary extends React.Component {
  constructor() {
    super();

    this.state = {
      hasErrored: false,
    };
  }

  static getDerivedStateFromError(error) {
    // process the error

    return { hasErrored: true };
  }

  componentDidCatch(error, info) {
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
