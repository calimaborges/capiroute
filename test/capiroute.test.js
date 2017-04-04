import { createRouter } from '../src';
import { setCurrentUrl, prepareMocks } from './helper.lib';

let router = createRouter();

prepareMocks();

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
        window.history.pushState = jest.fn();
        window.onpopstate = jest.fn();
        router.goto('/tasks');
        expect(window.history.pushState.mock.calls.length).toBe(1);
        expect(window.history.pushState.mock.calls[0][2]).toBe('/tasks');
        expect(window.onpopstate.mock.calls.length).toBe(1);
    });

    it('should go back', () => {
        window.history.back = jest.fn();
        router.back();
        expect(window.history.back.mock.calls.length).toBe(1);
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

    xit('should define query string', () => {
        setCurrentUrl('http://www.example.com/tasks');
        router.setQueryString({ type: 'test' });
        expect(router.queryString()).toEqual({ type: 'test' });
        console.log(router.queryString());
        // expect(router.match(/tasks/)).toBe(true);

    });


});
