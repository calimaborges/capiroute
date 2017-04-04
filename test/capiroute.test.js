import { createRouter } from '../src';
import { setCurrentUrl } from './helper.lib';

let router = createRouter();

describe('subscription', () => {
    it('should trigger listeners on location change', () => {
        let called = 0;
        router.subscribe(() => {
            called++;
        });

        window.onpopstate();
        expect(called).toBe(1);
    });

    it('should unsubscribe listener', () => {
        let called = 0;
        const unsubscribe = router.subscribe(() => {
            called++;
        });
        unsubscribe();

        window.onpopstate();
        expect(called).toBe(0);
    });
});

describe('routing management', () => {
    it('should go to specified route', () => {
        const oldPushState = window.history.pushState;
        const oldOnPopState = window.onpopstate;
        window.history.pushState = jest.fn();
        window.onpopstate = jest.fn();
        router.goto('/tasks');

        // FIXME: should try to test without mocks
        expect(window.history.pushState.mock.calls.length).toBe(1);
        expect(window.history.pushState.mock.calls[0][2]).toBe('/tasks');
        expect(window.onpopstate.mock.calls.length).toBe(1);

        window.history.pushState = oldPushState;
        window.onpopstate = oldOnPopState;
    });

    it('should go back', () => {
        const oldBack = window.history.pushState;
        window.history.back = jest.fn();
        router.back();
        expect(window.history.back.mock.calls.length).toBe(1);
        window.history.back = oldBack;
    });

    it('should match current route', () => {
        setCurrentUrl('http://www.example.com/tasks');
        expect(router.match(/\/tasks/)).toBe(true);
        expect(router.match(/\/tosko/)).toBe(false);
    });

    it('should identify root path without /', () => {
        setCurrentUrl('http://www.example.com');
        expect(router.isRoot()).toBe(true);
    });

    it('should identify root path with /', () => {
        setCurrentUrl('http://www.example.com/');
        expect(router.isRoot()).toBe(true);
    });

    it('should identify bizarre root path', () => {
        setCurrentUrl('http://www.example.com////');
        expect(router.isRoot()).toBe(true);
    });

    it('should return matched params after match', () => {
        setCurrentUrl('http://www.example.com/tasks/34');
        router.match(/^\/tasks\/(\d+)/);
        expect(router.matchedParams()[1]).toBe('34');
    });

    it('should return query string', () => {
        setCurrentUrl('http://www.example.com/tasks?type=completed&box=archive');
        expect(router.queryString()).toEqual({ type: 'completed', box: 'archive' });
    });

    it('should check for query string', () => {
        setCurrentUrl('http://www.example.com/tasks?type=completed&box=archive');
        expect(router.hasQuery()).toBe(true);

        setCurrentUrl('http://www.example.com/tasks');
        expect(router.hasQuery()).toBe(false);
    });

    it('should define query string', () => {
        setCurrentUrl('http://www.example.com/tasks');
        const oldPushState = window.history.pushState;
        const oldOnPopState = window.onpopstate;
        window.history.pushState = jest.fn();
        window.onpopstate = jest.fn();

        router.setQueryString({ type: 'test' });

        // FIXME: should try to test without mocks
        expect(window.history.pushState.mock.calls.length).toBe(1);
        expect(window.history.pushState.mock.calls[0][2]).toBe('/tasks?type=test');
        expect(window.onpopstate.mock.calls.length).toBe(1);

        window.history.pushState = oldPushState;
        window.onpopstate = oldOnPopState;
    });

    it('should force route update', () => {
        let calls = 0;
        router.subscribe( () => {
            calls++;
        });
        router.dispatch();
        expect(calls).toBe(1);
    });

});
