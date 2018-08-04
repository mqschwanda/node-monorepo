import React, { PureComponent } from 'react';

/**
 * handle situations in which a function may need to be called with props to get
 * data but at the same time allow a raw data object to be returned directly
 * @param  {[type]} dataOrFunction   [description]
 * @param  {[type]} [params = null]  [description]
 * @return {[type]}                  [description]
 */
const getDataOrCallFunction = (dataOrFunction, params = null) =>
  typeof dataOrFunction === 'function'
    ? dataOrFunction(params)
    : dataOrFunction;

/**
 * apply the _mapQuerySnapshot function to get the desired data but also include
 * the querySnapshot so more api calls can be made
 * @param  {[type]} handleQuerySnapshot [description]
 * @param  {[type]} querySnapshot       [description]
 * @return {[type]}                     [description]
 */
const assignQuerySnapshot = (querySnapshot, data) =>
  ({ querySnapshot, ...getDataOrCallFunction(data) });

/**
 * map a document's querySnapshot and data to a single object
 * @param  {[type]} querySnapshot [description]
 * @return {[type]}               [description]
 */
const mapDoc = (querySnapshot) =>
  assignQuerySnapshot(querySnapshot, { data: querySnapshot.data() })

/**
 * map a query's querySnapshot and the array of documents found.
 * @param  {[type]} querySnapshot [description]
 * @return {[type]}               [description]
 */
 const mapDocs = (querySnapshot) => assignQuerySnapshot(querySnapshot, () => {
   const data = [];
   querySnapshot.forEach((docSnapshot) => data.push(mapDoc(docSnapshot)));

   return { data };
 });

/**
 * check if the querySnapshot contains multiple documents or a single document
 * and map the querySnapshot apropriatly.
 * this function is used as the default mapper if nothing is passed to the
 * querySnapshotContainer
 * @param  {[type]} querySnapshot [description]
 * @return {[type]}               [description]
 */
const mapQuerySnapshotData = (querySnapshot) =>
  (querySnapshot.docs || {}).length // check if the querySnapshot contains multiple documents
    ? mapDocs(querySnapshot)
    : mapDoc(querySnapshot);

/**
 * This container take a firebase document query and injects the querySnapshot
 * and data into the component it wraps. If the querySnapshot data needs to be
 * manipulated in any way a custom mapper function can be passed as the second
 * param.
 * @param  {[type]} documentQuery                                [description]
 * @param  {[type]} [mapQuerySnapshot = defaultMapQuerySnapshot] [description]
 * @return {[type]}                                              [description]
 */
export const querySnapshotContainer = (documentQuery, mapQuerySnapshot = mapQuerySnapshotData) => (Component, LoadingComponent = () => null) =>
  class QuerySnapshot extends PureComponent {
    constructor(props) {
      super(props);
      this.state = {};
      this.unsubscribe = this.listener(props);
    }

    componentWillUnmount() {
      this.unsubscribe(); // remove the listener along with the component
    }
    /**
     *
     * @param  {[type]} [props = this.props] [description]
     * @return {[type]}                      [description]
     */
    getDocumentQuery = (props = this.props) =>
      getDataOrCallFunction(documentQuery, props) // allow documentQuery to access props

    /**
     * build the initialize the firestore listener
     * @param  {[type]} [props = this.props] [description]
     * @return {[type]}                      [description]
     */
    listener = (props = this.props) =>
      this.getDocumentQuery(props).onSnapshot(this.onSnapshot)

    /**
     * handle the update of the querySnapshot by mapping the data to theis
     * component's state.
     * @param  {[type]} querySnapshot [description]
     * @return {[type]}               [description]
     */
    onSnapshot = (querySnapshot) =>
      this.setState(mapQuerySnapshot(querySnapshot))

    render() {
      return this.state !== {}
        ? <Component firestore={this.state} {...this.props} />
        : <LoadingComponent />;
    }
  }
