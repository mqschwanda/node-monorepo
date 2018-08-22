import React from 'react';
import enzyme, { shallow, render, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
global.React = React;

// React 16 Enzyme adapter
enzyme.configure({ adapter: new Adapter() });
// Make Enzyme functions available in all test files without importing
global.shallow = shallow;
global.render = render;
global.mount = mount;

export const handleAsyncComponent = (func) => setTimeout(func, 1000);
global.handleAsyncComponent = handleAsyncComponent;

export { shallow, mount } from 'enzyme';
export default enzyme;
global.enzyme = enzyme;
