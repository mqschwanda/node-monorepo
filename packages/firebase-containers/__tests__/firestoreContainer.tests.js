import '@mqschwanda/enzyme';

import './helpers/firebase';
import { firestoreContainer } from '../dist';

const _key = (payload, key = 0) => Object.keys(payload)[key];

describe('firestoreContainer', () => {
  let app, seeder, firestoreContainerFactory;

  beforeAll(() => {
    ({ app, seeder } = initFirebase());

    firestoreContainerFactory = containerFactory({
      container: firestoreContainer,
      collection: _key(seeder),
      doc: _key(seeder[_key(seeder)]),
      query: ({ collection, doc }) =>
        firebase.firestore().collection(collection).doc(doc),
    });
  });

  afterAll(() => {
    killFirebase(app);
  });

  it('should render it\'s sub-component', (done) => {
    const { WrappedComponent, SubComponent } = firestoreContainerFactory();
    const TestComponent = mount(<WrappedComponent />);

    handleAsyncComponent(() => {
      expect(TestComponent.contains(SubComponent)).toEqual(true);

      done();
    });
  });

  it('should inject snapshot into props', (done) => {
    const { collection, doc, WrappedComponent } = firestoreContainerFactory();
    const TestComponent = shallow(<WrappedComponent />);

    handleAsyncComponent(() => {
      const snapshot = TestComponent.prop('snapshot');

      expect(snapshot).toBeDefined();
      expect(snapshot.id).toEqual(doc);
      expect(snapshot.data()).toEqual(seeder[collection][doc]);

      done();
    });
  });

  it('should inject mapped snapshot into props', (done) => {
    const name = 'name';
    const options = { mapData: (snapshot) => ({ [name]: snapshot }) };
    const { collection, doc, WrappedComponent } = firestoreContainerFactory({ options });
    const TestComponent = shallow(<WrappedComponent />);

    handleAsyncComponent(() => {
      const snapshot = TestComponent.prop(name);

      expect(snapshot).toBeDefined();
      expect(snapshot.id).toEqual(doc);
      expect(snapshot.data()).toEqual(seeder[collection][doc]);

      done();
    });
  });
});
