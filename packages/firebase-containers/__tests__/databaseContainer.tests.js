import './helpers/firebase';
import './helpers/enzyme';
import { databaseContainer } from '../dist';

const _key = (object, key = 0) => Object.keys(object)[key];

describe('databaseContainer', () => {
  let app, seeder, databaseContainerFactory;

  beforeAll(() => {
    ({ app, seeder } = initFirebase());

    databaseContainerFactory = containerFactory({
      container: databaseContainer,
      collection: _key(seeder),
      doc: _key(seeder[_key(seeder)]),
      query: ({ collection, doc }) =>
        firebase.database().ref(`${collection}/${doc}`),
    });
  });

  afterAll(() => {
    killFirebase(app);
  });

  it('should render it\'s sub-component', (done) => {
    const { WrappedComponent, SubComponent } = databaseContainerFactory();
    const TestComponent = mount(<WrappedComponent />);

    handleAsyncComponent(function () {
      expect(TestComponent.contains(SubComponent)).toEqual(true);

      done();
    });
  });


  it('should inject snapshot into props', (done) => {
    const { collection, doc, WrappedComponent } = databaseContainerFactory();
    const TestComponent = shallow(<WrappedComponent />);

    handleAsyncComponent(function () {
      const snapshot = TestComponent.prop('snapshot');

      expect(snapshot).toBeDefined();
      expect(snapshot.key).toEqual(doc);
      expect(snapshot.val()).toEqual(seeder[collection][doc]);

      done();
    });
  });

  it('should inject snapshot with dynamic name into props', (done) => {
    const name = 'name';
    const options = { mapData: (snapshot) => ({ [name]: snapshot }) };
    const { collection, doc, WrappedComponent } = databaseContainerFactory({ options });
    const TestComponent = shallow(<WrappedComponent />);

    handleAsyncComponent(function () {
      const snapshot = TestComponent.prop(name);

      expect(snapshot).toBeDefined();
      expect(snapshot.key).toEqual(doc);
      expect(snapshot.val()).toEqual(seeder[collection][doc]);

      done();
    });
  });
});
