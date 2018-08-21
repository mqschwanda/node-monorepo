import React, { PureComponent } from 'react';

import { getDataOrCallFunction, getDisplayName } from './helpers';

/**
  * @name databaseContainer
  * @type {Function}
  * @description This container listens to a database reference and injects the
  * snapshot into the sub-component.
  * @since 0.0.1
  * @param  {firebase.database.Reference} reference database reference which we can read or listen to
  * @see {@link https://firebase.google.com/docs/reference/js/firebase.database.Reference}
  * @param  {Object} options options object
  * @return {Function} composable function that accepts react components as params
  * @returns container(Component, Loading)
  */
export const databaseContainer = (reference, {
  /**
   * @name mapData
   * @type {Function}
   * @description access the snapshot to map the prop injected into the sub-component
   * @since 0.0.1
   * @param {firebase.database.DataSnapshot} snapshot database snapshot
   * @see {@link https://firebase.google.com/docs/reference/js/firebase.database.DataSnapshot}
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
} = {},
) => (
  /**
   * @name Component
   * @type {React.Component}
   * @description sub-component we are injecting the snapshot into
   * @since 0.0.1
   * @param {Object} props react props
   */
  Component,
  /**
   * @name Loading
   * @type {React.Component}
   * @description component displayed while loading the query snapshot
   * @since 0.0.1
   * @param {Object} props react props
   * @default (props) => <div>loading...</div>
   */
  Loading = (props) => <div>loading...</div>,
) =>
  class DatabaseContainer extends PureComponent {
    // build display name using the sub-component's name
    displayName = getDisplayName('databaseContainer', Component);

    constructor(props) {
      super(props);
      // initialize the snapshot as false so we can override it later
      this.state = { prop: false };
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
     * @name subscribe
     * @description build and initialize the listener
     * @type {Function}
     * @since 0.0.1
     */
    subscribe = () => {
      this.reference = this.getReference();

      const functionKey = `on${once ? 'ce' : ''}`;
      this.reference[functionKey]('value', this.onValue);
    }

    /**
     * @name unsubscribe
     * @description remove the listener if it still exists
     * @type {Function}
     * @since 0.0.1
     */
    unsubscribe = () => {
      this.reference && this.reference.off();
    }

    /**
     * @name getReference
     * @description build the reference by returning the variable directly or calling
     * as a function with props as a param.
     * @type {Function}
     * @since 0.0.1
     * @return {firebase.database.Reference} database reference
     * @see {@link https://firebase.google.com/docs/reference/js/firebase.database.Reference}
     */
    getReference = (props = this.props) =>
      getDataOrCallFunction(reference, props) // allow reference to access props

    /**
     * @name onValue
     * @description handle the update of the snapshot by mapping the data to this
     * component's state.
     * @type {Function}
     * @since 0.0.1
     * @param {firebase.database.DataSnapshot} snapshot database snapshot
     * @see {@link https://firebase.google.com/docs/reference/js/firebase.database.DataSnapshot}
     */
    onValue = (snapshot) =>
      this.setState({ prop: mapData(snapshot) })

    /**
     * @name marshalProps
     * @description build the props that will be injected into the sub-component
     * @type {Function}
     * @since 0.0.1
     * @return {Object} props object
     */
    marshalProps = () => ({ ...this.props, ...this.state.prop })

    render() {
      return this.state.prop
        ? <Component {...this.marshalProps()} />
        : <Loading {...this.marshalProps()} />;
    }
  };

export default databaseContainer;
