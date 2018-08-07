import React, { PureComponent } from 'react';

import { getDataOrCallFunction, getDisplayName } from './helpers';

/**
 * apply the _mapSnapshot function to get the desired data but also include
 * the snapshot so more api calls can be made
 * @param  {[type]} handleSnapshot [description]
 * @param  {[type]} snapshot       [description]
 * @return {[type]}                     [description]
 */
const assignSnapshot = (snapshot, data) =>
  ({ snapshot, ...getDataOrCallFunction(data) });

/**
 * map a document's snapshot and data to a single object
 * @param  {[type]} snapshot [description]
 * @return {[type]}               [description]
 */
export const mapDoc = (snapshot) =>
  assignSnapshot(snapshot, { data: snapshot.data() })

/**
 * map a query's snapshot and the array of documents found.
 * @param  {[type]} snapshot [description]
 * @return {[type]}               [description]
 */
 export const mapDocs = (snapshot) => assignSnapshot(snapshot, () => {
   const data = [];
   snapshot.forEach((docSnapshot) => data.push(mapDoc(docSnapshot)));

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
export const snapshotContainer = (query, options) => (Component) =>
  React.cloneElement(class Snapshot extends PureComponent {
    // displayName = getDisplayName('snapshotContainer', Component);
    // static propTypes = {}

    static defaultProps = {
      propKey: 'firebase',
      /**
       * check if the snapshot contains multiple documents or a single document
       * and map the snapshot apropriatly.
       * this function is used as the default mapper if nothing is passed to the
       * snapshotContainer
       * @param  {[type]} snapshot [description]
       * @return {[Object, Array]}      [description]
       */
      mapSnapshot: (snapshot) =>
        !snapshot.empty && (
          snapshot.size > 1  // check if the snapshot contains multiple documents
            ? mapDocs(snapshot)
            : mapDoc(snapshot)
        ),
      /**
       * [LoadingComponent description]
       */
      LoadingComponent: () => <div>loading...</div>,
    }

    constructor(props) {
      super(props);
      this.state = {};
    }

    componentDidMount() {
      this.subscribe();
    }

    componentWillUnmount() {
      /**
       * remove the listener along with the component
       */
      this.unsubscribe();
    }

    subscribe = ({ props } = this) => {
      this.unsubscribe = this.listener({ props });
    }
    /**
     *
     * @param  {Object} [props = this.props] this component's props
     * @return {[type]}                      [description]
     */
    getDocumentQuery = ({ props } = this) =>
      getDataOrCallFunction(query, props) // allow query to access props

    /**
     * build the initialize the firebase listener
     * @param  {Object} [props = this.props] this component's props
     * @return {[type]}                      [description]
     */
    listener = ({ props } = this) =>
      this.getDocumentQuery({ props }).onSnapshot(this.onSnapshot)

    /**
     * handle the update of the snapshot by mapping the data to this
     * component's state.
     * @param  {[type]} snapshot [description]
     * @return {[type]}               [description]
     */
    onSnapshot = (snapshot) =>
      this.setState(this.props.mapSnapshot(snapshot))

    marshalProps = ({ props, state } = this) => ({
      ...props, [props.propKey]: state,
    })

    render() {
      return this.state !== {}
        ? <Component {...this.marshalProps(this)} />
        : <this.props.LoadingComponent />;
    }
  }, options);

export default snapshotContainer;
