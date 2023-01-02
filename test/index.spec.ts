import {
    afterEach,
    beforeEach,
    describe,
    expect,
    it,
    jest,
} from '@jest/globals';

import {
    AggregateSignal,
    TimeoutSignal,
    Signal,
    isSignal,
    isAbortSignal,
} from '../src/index';

describe('AggregateSignal', () => {
    describe('when no signals passed', () => {
        const instance = new AggregateSignal();
        describe('signal', () =>
            it('should be: undefined', () => {
                expect(instance.signal).toBeUndefined();
            }));

        describe('abortedSignal', () =>
            it('should be: undefined', () => {
                expect(instance.abortedSignal).toBeUndefined();
            }));
    });

    describe('when only undefined values are passed', () => {
        const instance = new AggregateSignal(undefined, undefined, undefined);
        describe('signal', () =>
            it('should be: undefined', () => {
                expect(instance.signal).toBeUndefined();
            }));

        describe('abortedSignal', () =>
            it('should be: undefined', () => {
                expect(instance.abortedSignal).toBeUndefined();
            }));
    });

    describe('when one valid AbortSignal is passed', () => {
        const ac = new AbortController();
        const instance = new AggregateSignal(ac.signal);
        const abort = jest.fn();

        beforeEach(() => {
            instance.signal?.addEventListener('abort', abort);
            ac.abort();
        });

        afterEach(() => {
            instance.signal?.removeEventListener('abort', abort);
        });

        describe('signal', () => {
            it('should be the valid AbortSignal', () => {
                expect(instance.signal).not.toBeUndefined();
                expect(instance.signal).toBe(ac.signal);
            });

            it('should implement the EventTarget interface', () => {
                expect(isSignal(instance.signal)).toEqual(true);
            });

            it('should be aborted when the input AbortSignal aborts', () => {
                expect(abort).toBeCalledTimes(1);
                expect(instance.signal?.aborted).toEqual(true);
            });
        });

        describe('abortedSignal', () =>
            it('should be the original AbortSignal', () => {
                expect(instance.abortedSignal).toBe(ac.signal);
            }));
    });

    describe('when multiple valid AbortSignals are passed', () => {
        const ac = new AbortController();
        const timeout = new TimeoutSignal(1000);
        const instance = new AggregateSignal(
            undefined,
            ac.signal,
            undefined,
            timeout.signal,
            undefined
        );
        const abort = jest.fn();

        beforeEach(() => {
            instance.signal?.addEventListener('abort', abort);
            ac.abort();
        });

        afterEach(() => {
            instance.signal?.removeEventListener('abort', abort);
        });

        describe('signal', () => {
            it('should not equal either of the original AbortSignals', () => {
                expect(instance.signal).not.toBe(ac.signal);
                expect(instance.signal).not.toBe(timeout.signal);
                expect(instance.signal).not.toBeUndefined();
            });

            it('should implement the EventTarget interface', () => {
                expect(isSignal(instance.signal)).toEqual(true);
            });

            it('should be aborted when either AbortSignals abort', () => {
                expect(abort).toHaveBeenCalledTimes(1);
                expect(instance.signal?.aborted).toEqual(true);
            });
        });

        describe('abortedSignal', () =>
            it('should be the first aborted signal (ac.signal)', () => {
                expect(instance.abortedSignal).toBe(ac.signal);
            }));
    });

    describe('when multiple valid AbortSignals are passed, but one of them is already aborted', () => {
        const ac = new AbortController();
        ac.abort();
        const timeout = new TimeoutSignal(1000);
        const instance = new AggregateSignal(
            undefined,
            ac.signal,
            undefined,
            timeout.signal,
            undefined
        );
        const abort = jest.fn();

        beforeEach(() => {
            instance.signal?.addEventListener('abort', abort);
        });

        afterEach(() => {
            instance.signal?.removeEventListener('abort', abort);
        });

        describe('signal', () => {
            it('should equal the already aborted AbortSignal', () => {
                expect(instance.signal).toBe(ac.signal);
                expect(instance.signal).not.toBe(timeout.signal);
                expect(instance.signal).not.toBeUndefined();
            });

            it('should implement the EventTarget interface', () => {
                expect(isSignal(instance.signal)).toEqual(true);
            });

            it('should immediately register as aborted', () => {
                expect(abort).not.toHaveBeenCalled();
                expect(instance.signal?.aborted).toEqual(true);
            });
        });

        describe('abortedSignal', () =>
            it('should be the first aborted signal (ac.signal)', () => {
                expect(instance.abortedSignal).toBe(ac.signal);
            }));
    });
});

describe('TimeoutSignal', () => {
    describe('when timeout: undefined', () => {
        const instance = new TimeoutSignal();
        describe('signal', () =>
            it('should be: undefined', () => {
                expect(instance.signal).toBeUndefined();
            }));
        describe('timeout', () =>
            it('should be: undefined', () => {
                expect(instance.timeout).toBeUndefined();
            }));
    });

    describe('when timeout: NaN', () => {
        const instance = new TimeoutSignal(NaN);
        describe('signal', () =>
            it('should be: undefined', () => {
                expect(instance.signal).toBeUndefined();
            }));
        describe('timeout', () =>
            it('should be: undefined', () => {
                expect(instance.timeout).toBeUndefined();
            }));
    });

    describe('when timeout: Infinity', () => {
        const instance = new TimeoutSignal(Infinity);
        describe('signal', () =>
            it('should be: undefined', () => {
                expect(instance.signal).toBeUndefined();
            }));
        describe('timeout', () =>
            it('should be: undefined', () => {
                expect(instance.timeout).toBeUndefined();
            }));
    });

    describe('when timeout: < 0', () => {
        const instance = new TimeoutSignal(-1);
        describe('signal', () =>
            it('should not be: undefined', () => {
                expect(instance.signal).not.toBeUndefined();
            }));
        describe('timeout', () =>
            it('should not be: undefined', () => {
                expect(instance.timeout).not.toBeUndefined();
            }));
    });

    describe('when timeout: 1000', () => {
        const abort = jest.fn();
        let instance: TimeoutSignal;

        beforeEach(() => {
            jest.useFakeTimers();
            instance = new TimeoutSignal(1000);
            instance.signal?.addEventListener('abort', abort);
        });

        afterEach(() => {
            instance.signal?.removeEventListener('abort', abort);
        });

        describe('signal', () => {
            it('should not be: undefined', () => {
                expect(instance.signal).not.toBeUndefined();
            });
            it('should call abort after 1s', () => {
                expect(abort).not.toHaveBeenCalled();
                jest.runAllTimers();
                expect(abort).toHaveBeenCalledTimes(1);
            });
        });
        describe('timeout', () =>
            it('should not be: undefined', () => {
                expect(instance.timeout).not.toBeUndefined();
            }));

        describe('signal.aborted', () => {
            it('should start: false', () => {
                expect(instance.signal?.aborted).toEqual(false);
            });
            it('should end: true', () => {
                jest.runAllTimers();
                expect(instance.signal?.aborted).toEqual(true);
            });
        });

        afterEach(() => {
            ((<unknown>instance.signal) as Signal)?.removeEventListener(
                'abort'
            );
            jest.useRealTimers();
        });
    });
});

describe('isSignal(object: unknown): object is Signal', () => {
    let object: unknown;

    describe('when object: instanceof AbortSignal', () => {
        beforeEach(() => {
            object = new AbortController().signal;
        });
        it('should return: true', () => {
            expect(isSignal(object)).toEqual(true);
        });
    });

    describe('when object: undefined', () => {
        beforeEach(() => (object = undefined));
        it('should return: false', () => {
            expect(isSignal(object)).toEqual(false);
        });
    });

    describe('when object: null', () => {
        beforeEach(() => {
            object = null;
        });
        it('should return: false', () => {
            expect(isSignal(object)).toEqual(false);
        });
    });

    describe('when object: instanceof TypeError', () => {
        beforeEach(() => {
            object = new TypeError();
        });
        it('should return: true', () => {
            expect(isSignal(object)).toEqual(false);
        });
    });

    describe("when object: { name: 'Foo', message: 'Bar' }", () => {
        beforeEach(() => {
            object = { name: 'Foo', message: 'Bar' };
        });
        it('should return: false', () => {
            expect(isSignal(object)).toEqual(false);
        });
    });
});

describe('isAbortSignal(object: unknown): object is AbortSignal', () => {
    let object: unknown;

    describe('when object: instanceof AbortSignal', () => {
        beforeEach(() => {
            object = new AbortController().signal;
        });
        it('should return: true', () => {
            expect(isAbortSignal(object)).toEqual(true);
        });
    });

    describe('when object: undefined', () => {
        beforeEach(() => {
            object = undefined;
        });
        it('should return: false', () => {
            expect(isAbortSignal(object)).toEqual(false);
        });
    });

    describe('when object: null', () => {
        beforeEach(() => {
            object = null;
        });
        it('should return: false', () => {
            expect(isAbortSignal(object)).toEqual(false);
        });
    });

    describe('when object: instanceof TypeError', () => {
        beforeEach(() => {
            object = new TypeError();
        });
        it('should return: true', () => {
            expect(isAbortSignal(object)).toEqual(false);
        });
    });

    describe("when object: { name: 'Foo', message: 'Bar' }", () => {
        beforeEach(() => {
            object = { name: 'Foo', message: 'Bar' };
        });
        it('should return: false', () => {
            expect(isAbortSignal(object)).toEqual(false);
        });
    });
});
