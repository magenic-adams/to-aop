import aopForStatic from '../aopForStatic';
import { hookName } from '../hook';
import createClasses from './createClasses';
import createPattern from './createPattern';

describe('aopForStatic method', () => {
  let pattern = null;
  let pattern2 = null;

  let beforeMethod = null;
  let afterMethod = null;
  let beforeGetter = null;
  let afterGetter = null;
  let beforeSetter = null;
  let afterSetter = null;

  beforeEach(() => {
    beforeMethod = jest.fn();
    afterMethod = jest.fn();
    beforeGetter = jest.fn();
    afterGetter = jest.fn();
    beforeSetter = jest.fn();
    afterSetter = jest.fn();

    pattern = createPattern(undefined, {
      [hookName.beforeMethod]: beforeMethod,
      [hookName.afterMethod]: afterMethod,
      [hookName.beforeGetter]: beforeGetter,
      [hookName.afterGetter]: afterGetter,
      [hookName.beforeSetter]: beforeSetter,
      [hookName.afterSetter]: afterSetter
    });
    pattern2 = createPattern(undefined, {
      [hookName.beforeMethod]: beforeMethod,
      [hookName.afterMethod]: afterMethod,
      [hookName.beforeGetter]: beforeGetter,
      [hookName.afterGetter]: afterGetter,
      [hookName.beforeSetter]: beforeSetter,
      [hookName.afterSetter]: afterSetter
    });
  });

  it('should call pattern.beforeMethod and pattern.afterMethod with multiple aspect', () => {
    let { C } = createClasses();

    aopForStatic(C, pattern);
    aopForStatic(C, pattern2);
    const staticResult1 = C.staticMethod();
    const staticResult2 = C.staticMethod2();

    expect(beforeMethod.mock.calls.length).toEqual(4);
    expect(beforeMethod.mock.calls[0]).toMatchSnapshot();
    expect(afterMethod.mock.calls.length).toEqual(4);
    expect(afterMethod.mock.calls[0]).toMatchSnapshot();

    expect(staticResult1).toMatchInlineSnapshot(`"static method"`);
    expect(staticResult2).toMatchInlineSnapshot(`"static method 2"`);
  });

  it('should call pattern.beforeMethod and pattern.afterMethod for own static method with multiple aspect', () => {
    let { C, A } = createClasses();

    aopForStatic(A, pattern);
    aopForStatic(C, pattern);
    const staticResult2 = C.staticMethod2();

    expect(beforeMethod.mock.calls.length).toEqual(1);
    expect(beforeMethod.mock.calls[0]).toMatchSnapshot();
    expect(afterMethod.mock.calls.length).toEqual(1);
    expect(afterMethod.mock.calls[0]).toMatchSnapshot();

    expect(staticResult2).toMatchInlineSnapshot(`"static method 2"`);
  });

  it('should call pattern.beforeMethod and pattern.afterMethod for inhereted static method with multiple aspect', () => {
    let { C, A } = createClasses();

    aopForStatic(A, pattern);
    aopForStatic(C, pattern);

    const staticResult = C.staticMethod();

    expect(beforeMethod.mock.calls.length).toEqual(2);
    expect(beforeMethod.mock.calls[0]).toMatchSnapshot();
    expect(afterMethod.mock.calls.length).toEqual(2);
    expect(afterMethod.mock.calls[0]).toMatchSnapshot();

    expect(staticResult).toMatchInlineSnapshot(`"static method"`);
  });

  it('should call pattern.beforeGetter and pattern.afterGetter for inhereted static getter', () => {
    let { C } = createClasses();

    aopForStatic(C, pattern);

    const staticResult1 = C.staticGetter;

    expect(staticResult1).toMatchInlineSnapshot(`"static getter"`);

    expect(beforeGetter.mock.calls.length).toEqual(1);
    expect(beforeGetter.mock.calls[0]).toMatchSnapshot();
    expect(afterGetter.mock.calls.length).toEqual(1);
    expect(afterGetter.mock.calls[0]).toMatchSnapshot();
  });

  it('should not throw error after call aopForStatic', () => {
    let { D } = createClasses();

    expect(() => {
      aopForStatic(D, pattern);
    }).not.toThrow();
  });

  it('should call pattern.beforeGetter and pattern.afterGetter for inhereted static getter with multiple aspect', () => {
    let { A, C } = createClasses();

    aopForStatic(A, pattern);
    aopForStatic(C, pattern);

    const staticResult1 = C.staticGetter;

    expect(staticResult1).toMatchInlineSnapshot(`"static getter"`);

    expect(beforeGetter.mock.calls.length).toEqual(2);
    expect(beforeGetter.mock.calls[0]).toMatchSnapshot();
    expect(afterGetter.mock.calls.length).toEqual(2);
    expect(afterGetter.mock.calls[0]).toMatchSnapshot();
  });

  it('should call pattern.beforeSetter and pattern.afterSetter for inhereted static setter', () => {
    let { C } = createClasses();

    aopForStatic(C, pattern);

    C.staticSetter = 'static setter';

    expect(C.staticSetter).toMatchInlineSnapshot(`"static setter"`);

    expect(beforeSetter.mock.calls.length).toEqual(1);
    expect(beforeSetter.mock.calls[0]).toMatchSnapshot();
    expect(afterSetter.mock.calls.length).toEqual(1);
    expect(afterSetter.mock.calls[0]).toMatchSnapshot();
  });

  it('should not call pattern.afterMethod for static getter which return constructable function', () => {
    let { C, A } = createClasses();

    C.A = A;

    aopForStatic(C, pattern);

    const a = Reflect.construct(C.A, []);

    expect(a instanceof A).toBeTruthy();

    expect(afterMethod.mock.calls.length).toEqual(0);
    expect(afterMethod.mock.calls[0]).toMatchSnapshot();
  });
});
