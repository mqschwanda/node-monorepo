import React, { PureComponent } from 'react';

const mapDoc = (querySnapshot) => ({ querySnapshot, data: querySnapshot.data() });

const mapDocs = (querySnapshot) => {
  const data = [];

  querySnapshot.forEach((doc) => data.push(mapDoc(doc)));

  return { querySnapshot, data };
};

const mapData = (querySnapshot) =>
  querySnapshot.docs && querySnapshot.docs.length
    ? mapDocs(querySnapshot)
    : mapDoc(querySnapshot);

const assignQuerySnapshot = (handleQuerySnapshot) => (querySnapshot) =>
  ({ querySnapshot, ...handleQuerySnapshot(querySnapshot) });

const defaultMapQuerySnapshot = assignQuerySnapshot(mapData);

export const firestoreContainer = (doc, mapQuerySnapshot = defaultMapQuerySnapshot) => (Component, LoadingComponent = () => null) =>
  class FirestoreContainer extends PureComponent {
    constructor(props) {
      super(props);
      this.state = {};
      this.unsubscribe = this.getSnapshot(props);
    }

    componentWillUnmount() {
      this.unsubscribe();
    }

    getDoc = (props = this.props) =>
      typeof doc === 'function' ? doc(props) : doc

    getSnapshot = (props = this.props) =>
      this.getDoc(props).onSnapshot(this.onSnapshot)

    onSnapshot = (querySnapshot) =>
      this.setState(mapQuerySnapshot(querySnapshot))

    render() {
      return this.state !== {}
        ? <Component firestore={this.state} {...this.props} />
        : <LoadingComponent />;
    }
  }
