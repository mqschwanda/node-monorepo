import enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

enzyme.configure({ adapter: new Adapter() });

export { shallow, configure } from 'enzyme';
export default enzyme
