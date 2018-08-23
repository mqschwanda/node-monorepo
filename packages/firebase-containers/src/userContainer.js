import React, { PureComponent } from 'react';

import { getDataOrCallFunction, getDisplayName } from './helpers';

export const userContainer = ({ // options object
    mapData = (user) => ({ user }),
    once = false,
} = {}) => (
  Component,
  Loading = () => <div>loading...</div>,
) => class UserContainer extends PureComponent {
  displayName = getDisplayName('userContainer', Component);

  constructor(props) {
    super(props);
    this.state = { prop: false };
  }
  componentDidMount() {
    this.subscribe();
  }

  componentWillUnmount() {
    this.unsubscribe(); // un-register Firebase observers when the component unmounts
  }

  subscribe = () => {
    this._unsubscribe = firebase.auth().onAuthStateChanged(this.onAuthStateChanged); // Listen to the Firebase Auth state and set the local state.
  }

  unsubscribe = () => {
    this._unsubscribe && typeof this._unsubscribe === 'function' && this._unsubscribe();
  }

  onAuthStateChanged = (user) =>
    this.setState({ prop: mapData(user) })

  /**
   * build the props that will be injected into the sub-component
   * @return {[Object]} prop object
   */
  marshalProps = () => ({ ...this.props, ...this.state.prop })

  render() {
    return this.state.prop
      ? <Component {...this.marshalProps()} />
      : <Loading {...this.marshalProps()} />;
  }
}

export default userContainer;
