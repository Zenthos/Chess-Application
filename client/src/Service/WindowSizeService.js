import React, { Component } from 'react';

export default function withWindowDimensions(WrappedComponent) {
  return class extends Component {
    constructor() {
      super();
      this.state = {
        width: 800,
        height: 182
      }
    }

    updateDimensions() {
      if (window.innerWidth < 500) {
        this.setState({ width: 450, height: 102 });
      } else {
        let update_width = window.innerWidth - 100;
        let update_height = Math.round(update_width / 4.4);
        this.setState({ width: update_width, height: update_height });
      }
    }

    componentDidMount() {
      this.updateDimensions();
      window.addEventListener("resize", this.updateDimensions.bind(this));
    }

    componentWillUnmount() {
      window.removeEventListener("resize", this.updateDimensions.bind(this));
    }

    render() {
      return (
        <WrappedComponent 
          {...this.props}
          windowWidth={this.state.width}
          windowHeight={this.state.height}
        />
      );
    }
  }
}