import React, { PureComponent } from 'react';

import { getDataOrCallFunction, getDisplayName } from './helpers';

export const referenceContainer = (
  reference,
  { // options object
    mapData = (snapshot) => ({ snapshot }),
    once = false,
  } = {},
) => (
  Component,
  LoadingComponent = () => <div>loading...</div>,
) =>
  class ReferenceContainer extends PureComponent {
    displayName = getDisplayName('referenceContainer', Component);

    constructor(props) {
      super(props);
      this.state = { prop: false };
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
      this.reference = this.getReference();

      const functionKey = `on${once ? 'ce' : ''}`;
      this.reference[functionKey]('value', this.onValue);
    }
    unsubscribe = () => {
      this.reference && this.reference.off();
    }
    /**
     * [getQuery description]
     * @return {[type]} [description]
     */
    getReference = (props = this.props) =>
      getDataOrCallFunction(reference, props) // allow reference to access props
    /**
     * handle the update of the snapshot by mapping the data to this
     * component's state.
     * @param  {[type]} snapshot [description]
     * @return {[type]}          [description]
     */
    onValue = (snapshot) =>
      this.setState({ prop: mapData(snapshot) })
    /**
     * build the props that will be injected into the sub-component
     * @return {[Object]} prop object
     */
    marshalProps = () => ({ ...this.props, ...this.state.prop })

    render() {
      return this.state.prop
        ? <Component {...this.marshalProps()} />
        : <LoadingComponent {...this.marshalProps()} />;
    }
  };

export default referenceContainer;
