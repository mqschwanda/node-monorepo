import '@mqschwanda/enzyme';

import './helpers/firebase';
import { userContainer } from '../dist';

describe('userContainer', () => {
  let app, seeder, email, password, userContainerFactory;

  beforeAll(() => {
    ({ app, seeder } = initFirebase());

    userContainerFactory = containerFactory({ container: userContainer });

    ({ email, password } = seeder.users[0]);
    // firebase.auth().onAuthStateChanged(user => { console.log({ user }); });
    firebase.auth().signInWithEmailAndPassword(email, password).catch(console.log);
  });

  afterAll(() => {
    killFirebase(app);
  });

  it('should render it\'s sub-component', (done) => {
    const { WrappedComponent, SubComponent } = userContainerFactory();
    const TestComponent = mount(<WrappedComponent />);

    handleAsyncComponent(() => {
      expect(TestComponent.contains(SubComponent)).toEqual(true);

      done();
    });
  });

  it('should inject user into props', (done) => {
    const { collection, doc, WrappedComponent } = userContainerFactory();
    const TestComponent = shallow(<WrappedComponent />);

    let user = TestComponent.prop('user');
    expect(user).toEqual(undefined);

    handleAsyncComponent(() => {
      user = TestComponent.prop('user');
      expect(user).toBeDefined();
      expect(user.email).toEqual(email);

      done();
    });
  });

  it('should inject mapped user into props', (done) => {
    const name = 'name';
    const options = { mapData: (user) => ({ [name]: user }) };
    const { collection, doc, WrappedComponent } = userContainerFactory({ options });
    const TestComponent = shallow(<WrappedComponent />);

    let user = TestComponent.prop(name)
    expect(user).toEqual(undefined);

    handleAsyncComponent(() => {
      user = TestComponent.prop(name);
      expect(user).toBeDefined();
      expect(user.email).toEqual(email);

      done();
    });
  });
});
