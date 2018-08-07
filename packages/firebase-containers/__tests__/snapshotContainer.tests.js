// import React from 'react';
// import { configure, shallow, mount, render } from 'enzyme';
// import Adapter from 'enzyme-adapter-react-16';

import { snapshotContainer, mapDoc, mapDocs } from '../dist';


/**
 * reverse engineer a snapshot object from test data
 * @param  {[Object, Array]} test [description]
 * @return {[type]}               [description]
 */
const snapshotFactory = (test) => {
  const buildDoc = (data) => ({ data: () => data });

  const empty = !test;
  const size = test ? (test.length || 1) : 0;
  const buildSnapshot = (obj = {}) => ({ empty, size, ...obj });

  return size > 1
    ? buildSnapshot({ forEach: (...a) => test.map(buildDoc).forEach(...a) })
    : buildSnapshot(buildDoc(test));
}

describe('mapDoc', function() {
  it('should map a docSnapshot to a document', function() {
    const test = { test: 'data' };
    const { snapshot, data } = mapDoc(snapshotFactory(test));

    expect(snapshot).toBeDefined();
    expect(test).toEqual(data);
  });
});

describe('mapDocs', function() {
  it('should map a snapshot to an array of documents', function() {
    const test = [{ test: 'data' }, { test: 'data' }];
    const { snapshot, data } = mapDocs(snapshotFactory(test));

    expect(snapshot).toBeDefined();
    expect(test).toEqual(data.map(doc => doc.data));
  });
});

// configure({ adapter: new Adapter() });
//
// describe('querySnapshotContainer', function() {
//   it('should render without throwing an error', function() {
//     const Component = () => <div>test</div>;
//     const Test = querySnapshotContainer(mockQuery)(Component);
//     expect(mount(Test).contains(<Component />)).toBe(true);
//       // expect(true).toBe(true);
//   });
//
//   // it('should be selectable by class "foo"', function() {
//   //   expect(shallow(<Foo />).is('.foo')).toBe(true);
//   // });
//   //
//   // it('should mount in a full DOM', function() {
//   //   expect(mount(<Foo />).find('.foo').length).toBe(1);
//   // });
//   //
//   // it('should render to static HTML', function() {
//   //   expect(render(<Foo />).text()).toEqual('Bar');
//   // });
// });
//
// // import React, { PureComponent } from 'react';
// //
// // import { getDataOrCallFunction, getDisplayName } from './helpers';
// //
// // /**
// //  * apply the _mapQuerySnapshot function to get the desired data but also include
// //  * the querySnapshot so more api calls can be made
// //  * @param  {[type]} handleQuerySnapshot [description]
// //  * @param  {[type]} querySnapshot       [description]
// //  * @return {[type]}                     [description]
// //  */
// // const assignQuerySnapshot = (querySnapshot, data) =>
// //   ({ querySnapshot, ...getDataOrCallFunction(data) });
// //
// // /**
// //  * map a document's querySnapshot and data to a single object
// //  * @param  {[type]} querySnapshot [description]
// //  * @return {[type]}               [description]
// //  */
// // const mapDoc = (querySnapshot) =>
// //   assignQuerySnapshot(querySnapshot, { data: querySnapshot.data() })
// //
// // /**
// //  * map a query's querySnapshot and the array of documents found.
// //  * @param  {[type]} querySnapshot [description]
// //  * @return {[type]}               [description]
// //  */
// //  const mapDocs = (querySnapshot) => assignQuerySnapshot(querySnapshot, () => {
// //    const data = [];
// //    querySnapshot.forEach((docSnapshot) => data.push(mapDoc(docSnapshot)));
// //
// //    return { data };
// //  });
// //
// // /**
// //  * This container take a firebase document query and injects the querySnapshot
// //  * and data into the component it wraps. If the querySnapshot data needs to be
// //  * manipulated in any way a custom mapper function can be passed as the second
// //  * param.
// //  * @param  {[type]} query   [description]
// //  * @param  {Object} options [description]
// //  * @return {Class}          [description]
// //  */
// // export const querySnapshotContainer = (query, options) => (Component) =>
// //   React.cloneElement(
// //     class QuerySnapshot extends PureComponent {
// //        displayName = getDisplayName('querySnapshotContainer', Component);
// //
// //       // static propTypes = {}
// //
// //       static defaultProps = {
// //         propKey: 'firebase',
// //         /**
// //          * check if the querySnapshot contains multiple documents or a single document
// //          * and map the querySnapshot apropriatly.
// //          * this function is used as the default mapper if nothing is passed to the
// //          * querySnapshotContainer
// //          * @param  {[type]} querySnapshot [description]
// //          * @return {[Object, Array]}      [description]
// //          */
// //         mapQuerySnapshot: (querySnapshot) =>
// //           !querySnapshot.empty && (
// //             querySnapshot.size > 1  // check if the querySnapshot contains multiple documents
// //               ? mapDocs(querySnapshot)
// //               : mapDoc(querySnapshot)
// //           ),
// //         LoadingComponent: () => null,
// //       }
// //
// //       constructor(props) {
// //         super(props);
// //         this.state = {};
// //       }
// //
// //       componentDidMount() {
// //         this.subscribe();
// //       }
// //
// //       componentWillUnmount() {
// //         /**
// //          * remove the listener along with the component
// //          */
// //         this.unsubscribe();
// //       }
// //
// //       subscribe = (props = this.props) => {
// //         this.unsubscribe = this.listener(props);
// //       }
// //       /**
// //        *
// //        * @param  {Object} [props = this.props] this component's props
// //        * @return {[type]}                      [description]
// //        */
// //       getDocumentQuery = (props = this.props) =>
// //         getDataOrCallFunction(query, props) // allow query to access props
// //
// //       /**
// //        * build the initialize the firebase listener
// //        * @param  {Object} [props = this.props] this component's props
// //        * @return {[type]}                      [description]
// //        */
// //       listener = (props = this.props) =>
// //         this.getDocumentQuery(props).onSnapshot(this.onSnapshot)
// //
// //       /**
// //        * handle the update of the querySnapshot by mapping the data to this
// //        * component's state.
// //        * @param  {[type]} querySnapshot [description]
// //        * @return {[type]}               [description]
// //        */
// //       onSnapshot = (querySnapshot) =>
// //         this.setState(this.props.mapQuerySnapshot(querySnapshot))
// //
// //       marshalProps = (props = this.props) => ({
// //         ...props, [props.propKey]: this.state,
// //       })
// //
// //       render() {
// //         return this.state !== {}
// //           ? <Component {...this.marshalProps(this.props)} />
// //           : <this.props.LoadingComponent />;
// //       }
// //     },
// //     options,
// //   )
