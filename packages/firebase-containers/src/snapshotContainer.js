// DOCS: https://firebase.google.com/docs/firestore/query-data/listen

import React, { PureComponent } from 'react';

import { getDataOrCallFunction, getDisplayName } from './helpers';

/**
* This container take a firebase document query and injects the snapshot
* and data into the component it wraps. If the snapshot data needs to be
* manipulated in any way a custom mapper function can be passed as the second
* param.
* @param  {[type]} query   [description]
* @param  {Object} options [description]
* @return {Class}          [description]
*/
export const snapshotContainer = (query, {
  /**
   * check if the snapshot contains multiple documents or a single document
   * and map the snapshot apropriatly.
   * this function is used as the default mapper if nothing is passed to the
   * snapshotContainer
   * @param  {[type]} snapshot [description]
   * @return {[Object, Array]} [description]
   */
  mapSnapshot = (snapshot) => ({ snapshot }),
} = {}) => (
  /**
   * [Component description]
   * @type {Component}
   */
  Component,
  /**
   * [LoadingComponent description]
   * @type {Component}
   */
  LoadingComponent = () => <div>loading...</div>,
) => class SnapshotContainer extends PureComponent {
  displayName = getDisplayName('snapshotContainer', Component);

  constructor(props) {
    super(props);
    this.state = { snapshot: false };
  }

  componentDidMount() {
    this.subscribe(); // attach the listener
  }

  componentWillUnmount() {
    this.unsubscribe(); // remove the listener
  }
  /**
   * build and initialize the listener
   */
  subscribe = () => {
    this.unsubscribe = this.getQuery().onSnapshot(this.onSnapshot);
  }
  /**
   * [getQuery description]
   * @return {[type]} [description]
   */
  getQuery = () => getDataOrCallFunction(query, this.props) // allow query to access props
  /**
   * handle the update of the snapshot by mapping the data to this
   * component's state.
   * @param  {[type]} snapshot [description]
   * @return {[type]}          [description]
   */
  onSnapshot = (snapshot) =>
    this.setState({ snapshot: mapSnapshot(snapshot) })
  /**
   * build the props that will be injected into the sub-component
   * @return {[Object]} prop object
   */
  marshalProps = () => ({ ...this.props, ...this.state.snapshot })

  render() {
    return this.state.snapshot
      ? <Component {...this.marshalProps()} />
      : <LoadingComponent {...this.marshalProps()} />;
  }
};

export default snapshotContainer;
