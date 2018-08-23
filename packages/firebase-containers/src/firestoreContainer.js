import React, { PureComponent } from 'react';
import { getDataOrCallFunction, getDisplayName } from './helpers';

/**
* @name firestoreContainer
* @type {Function}
* @description This container take a firebase query and injects the snapshot
* into the sub-component.
* @since 0.0.1
* @param  {firebase.firestore.Query} query firestore Query which we can read or listen to
* @param  {Object} options options object
* @return {Function} composable function that accepts react components as params
* @returns container(Component, Loading)
*/
export const firestoreContainer = (query, {
  /**
   * @name mapData
   * @type {Function}
   * @description access the snapshot to map the prop injected into the sub-component
   * @since 0.0.1
   * @param {[firebase.firestore.QuerySnapshot, firebase.firestore.QueryDocumentSnapshot]} firebase snapshot
   * @see {@link https://firebase.google.com/docs/reference/js/firebase.firestore.QuerySnapshot}
   * @see {@link https://firebase.google.com/docs/reference/js/firebase.firestore.QueryDocumentSnapshotshot}
   * @return {Object} prop that is merged into sub-component's props
   * @default (snapshot) => ({ snapshot })
   */
  mapData = (snapshot) => ({ snapshot }),
  // or, lets say you want to map the data to a different name...
  // mapData: (labledSnapshot) => ({ labledSnapshot }),
  /**
   * @name once
   * @type {Boolean}
   * @description if you only want the first value and dont want reactive updates
   * @since 0.0.11
   * @default false
   */
  once = false,
} = {}) => (
  /**
   * @name Component
   * @type {[React.Component, function]}
   * @description sub-component we are injecting the snapshot into
   * @since 0.0.1
   * @param {Object} props react props
   * @returns {React.Element}
   */
  Component,
  /**
   * @name Loading
   * @type {[React.Component, function]}
   * @description component displayed while loading the query snapshot
   * @since 0.0.1
   * @param {Object} props react props
   * @returns {React.Element}
   * @default (props) => <div>loading...</div>
   */
  Loading = () => <div>loading...</div>,
) => class FirestoreContainer extends PureComponent {
  // build display name using the sub-component's name
  displayName = getDisplayName('firestoreContainer', Component);

  constructor(props) {
    super(props);
    // initialize the snapshot as false so we can override it later
    this.state = { snapshot: false };
  }

  componentDidMount() {
    // attach the listener
    this.subscribe();
  }

  componentWillUnmount() {
    // remove the listener if it still exists
    this.unsubscribe();
  }

  /**
   * @name getQuery
   * @description build the query by returning the variable directly or calling
   * as a function with props as a param.
   * @type {Function}
   * @since 0.0.1
   * @return {firebase.firestore.Query} firestore query
   */
  getQuery = () => getDataOrCallFunction(query, this.props)

  /**
   * @name marshalProps
   * @description build the props that will be injected into the sub-component
   * @type {Function}
   * @since 0.0.1
   * @return {Object} props object
   */
  marshalProps = () => ({ ...this.props, ...this.state.snapshot })

  /**
   * @name onSnapshot
   * @description handle the update of the snapshot by mapping the data to this
   * component's state. If we only need to call the update once the listener
   * will also be unsubscribed on first callback.
   * @type {Function}
   * @since 0.0.1
   * @param {[firebase.firestore.QuerySnapshot, firebase.firestore.QueryDocumentSnapshot]} firestore snapshot
   * @see {@link https://firebase.google.com/docs/reference/js/firebase.firestore.QuerySnapshot}
   * @see {@link https://firebase.google.com/docs/reference/js/firebase.firestore.QueryDocumentSnapshotshot}
   */
  onSnapshot = (snapshot) => {
    this.setState({ snapshot: mapData(snapshot) });
    if (once) this.unsubscribe();
  }

  /**
   * @name subscribe
   * @description build and initialize the listener
   * @type {Function}
   * @since 0.0.1
   */
  subscribe = () => {
    this._unsubscribe = this.getQuery().onSnapshot(this.onSnapshot);
  }

  /**
   * @name unsubscribe
   * @description remove the listener if it still exists
   * @type {Function}
   * @since 0.0.15
   */
  unsubscribe = () => {
    this._unsubscribe && typeof this._unsubscribe === 'function' && this._unsubscribe();
  }

  render() {
    return this.state.snapshot
      ? <Component {...this.marshalProps()} /> // render sub-component after snapshot is retrieved
      : <Loading {...this.marshalProps()} />; // render loading component until snapshot is ready
  }
};

export default firestoreContainer;
