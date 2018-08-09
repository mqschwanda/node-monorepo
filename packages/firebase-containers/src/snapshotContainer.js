// DOCS: https://firebase.google.com/docs/firestore/query-data/listen

import React, { PureComponent } from 'react';

import { getDataOrCallFunction, getDisplayName } from './helpers';

/**
 * apply the _mapSnapshot function to get the desired data but also include
 * the snapshot so more api calls can be made
 * @param  {[type]} snapshot [description]
 * @param  {[type]} data     [description]
 * @return {[type]}                [description]
 */
const assignSnapshot = (snapshot, data) =>
  ({ snapshot, ...getDataOrCallFunction(data) });

/**
 * map a document's snapshot and data to a single object
 * @param  {[type]} docSnapshot [description]
 * @return {[type]}             [description]
 */
export const mapDocSnapshot = (docSnapshot) =>
  assignSnapshot(docSnapshot, { data: docSnapshot.data() })

/**
 * map a query's snapshot and the array of documents found.
 * @param  {[type]} querySnapshot [description]
 * @return {[type]}               [description]
 */
export const mapQuerySnapshot = (querySnapshot) =>
  assignSnapshot(querySnapshot, () => {
    const data = [];

    querySnapshot.forEach((docSnapshot) => {
      data.push(mapDocSnapshot(docSnapshot))
    });

    return { data };
  });

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
  mapSnapshot = (snapshot) =>
    ({ snapshot }),
    // !snapshot.empty && ( // exit if empty
    //   snapshot.size > 1  // check if the snapshot contains multiple documents
    //     ? mapQuerySnapshot(snapshot) // handle a multiple document snapshot
    //     : mapDocSnapshot(snapshot) // handle a single document snapshot
    // ),
}) => (
  /**
   * [LoadingComponent description]
   * @type {Component}
   */
  Component,
  /**
   * [LoadingComponent description]
   * @type {Component}
   */
  LoadingComponent = () => <div>loading...</div>,
) => class SnapshotContainer extends PureComponent {
    // displayName = getDisplayName('snapshotContainer', Component);
    //
    constructor(props) {
      super(props);
      this.state = {};
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
    onSnapshot = (snapshot) => this.setState(mapSnapshot(snapshot))

    /**
     * build the props that will be injected into the sub-component
     * @return {[Object]} prop object
     */
    marshalProps = () => ({ ...this.props, ...this.state })

    render() {
      return this.state !== {}
        ? <Component {...this.marshalProps()} />
        : <LoadingComponent />;
    }
  };

export default snapshotContainer;
