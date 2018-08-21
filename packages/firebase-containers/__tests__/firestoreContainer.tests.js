import './helpers/firebase';
import './helpers/enzyme';
import { firestoreContainer } from '../dist';

const _key = (object, key = 0) => Object.keys(object)[key];

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

    handleAsyncComponent(function () {
      expect(TestComponent.contains(SubComponent)).toEqual(true);

      done();
    });
  });

  it('should inject snapshot into props', (done) => {
    const { collection, doc, WrappedComponent } = firestoreContainerFactory();
    const TestComponent = shallow(<WrappedComponent />);

    handleAsyncComponent(function () {
      const snapshot = TestComponent.prop('snapshot');

      expect(snapshot).toBeDefined();
      expect(snapshot.id).toEqual(doc);
      expect(snapshot.data()).toEqual(seeder[collection][doc]);

      done();
    });
  });

  it('should inject snapshot with dynamic name into props', (done) => {
    const name = 'name';
    const options = { mapData: (snapshot) => ({ [name]: snapshot }) };
    const { collection, doc, WrappedComponent } = firestoreContainerFactory({ options });
    const TestComponent = shallow(<WrappedComponent />);

    handleAsyncComponent(function () {
      const snapshot = TestComponent.prop(name);

      expect(snapshot).toBeDefined();
      expect(snapshot.id).toEqual(doc);
      expect(snapshot.data()).toEqual(seeder[collection][doc]);

      done();
    });
  });
});
