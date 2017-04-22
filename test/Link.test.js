import React from "react";
import Link from "../src/Link";
import renderer from "react-test-renderer";
import { shallow } from "enzyme";

import { setCurrentUrl } from "./helper.lib";

test("should be rendered correctly", () => {
  const component = renderer.create(<Link to="/about">About</Link>);
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

test('should call goto if prop "to" is set', () => {
  const component = shallow(<Link to="/about">About</Link>);

  const oldPushState = window.history.pushState;
  const oldOnPopState = window.onpopstate;
  window.history.pushState = jest.fn();
  window.onpopstate = jest.fn();

  component.find("a").simulate("click", { preventDefault() {} });

  // FIXME: should mock router
  expect(window.history.pushState.mock.calls.length).toBe(1);
  expect(window.history.pushState.mock.calls[0][2]).toBe("/about");
  expect(window.onpopstate.mock.calls.length).toBe(1);

  window.history.pushState = oldPushState;
  window.onpopstate = oldOnPopState;
});

test("should call onClick if it is set", () => {
  let counter = 0;
  const component = shallow(<Link onClick={() => counter++}>About</Link>);

  component.find("a").simulate("click", { preventDefault() {} });

  expect(counter).toBe(1);
});

test('should set queryString if prop "queryTo" is set', () => {
  const component = shallow(<Link queryTo={{ type: "test" }}>About</Link>);

  setCurrentUrl("http://www.example.com/tasks");
  const oldPushState = window.history.pushState;
  const oldOnPopState = window.onpopstate;
  window.history.pushState = jest.fn();
  window.onpopstate = jest.fn();

  component.find("a").simulate("click", { preventDefault() {} });

  // FIXME: should mock router
  expect(window.history.pushState.mock.calls.length).toBe(1);
  expect(window.history.pushState.mock.calls[0][2]).toBe("/tasks?type=test");
  expect(window.onpopstate.mock.calls.length).toBe(1);

  window.history.pushState = oldPushState;
  window.onpopstate = oldOnPopState;
});

test('should set keep query if prop "keepQuery" is set', () => {
  const component = shallow(<Link to="/tasks" keepQuery>About</Link>);

  setCurrentUrl("http://www.example.com/?type=test");
  const oldPushState = window.history.pushState;
  const oldOnPopState = window.onpopstate;
  window.history.pushState = jest.fn();
  window.onpopstate = jest.fn();

  component.find("a").simulate("click", { preventDefault() {} });

  // FIXME: should mock router
  expect(window.history.pushState.mock.calls.length).toBe(1);
  expect(window.history.pushState.mock.calls[0][2]).toBe("/tasks?type=test");
  expect(window.onpopstate.mock.calls.length).toBe(1);

  window.history.pushState = oldPushState;
  window.onpopstate = oldOnPopState;
});
