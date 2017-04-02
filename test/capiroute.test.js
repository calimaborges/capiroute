import { createRouter } from '../src';

let router = createRouter();

describe('routing', () => {
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
