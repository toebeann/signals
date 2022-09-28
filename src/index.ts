/**
 * A helper class to create an {@link !AbortSignal AbortSignal} which will abort when any of the signals passed to its constructor do.
 */
export class AggregateSignal {
    /**
     * The aggregate {@link !AbortSignal AbortSignal}.
     *
     * @remarks
     * If only a single valid {@link !AbortSignal AbortSignal} was passed, it will be that signal.
     * If any of the signals passed was already aborted, it will be the first match in the array.
     * If no valid {@link !AbortSignal AbortSignals} were passed,
     * it will be {@link !undefined `undefined`}.
     */
    readonly signal?: AbortSignal;

    /** The first {@link !AbortSignal AbortSignal} of those passed in to have aborted. */
    abortedSignal?: AbortSignal;

    /**
     * Initializes a new {@link AggregateSignal}.
     * @param {(AbortSignal | undefined)[]} abortSignals The {@link !AbortSignal AbortSignals} to aggregate.
     */
    constructor(...abortSignals: (AbortSignal | undefined)[]) {
        const signals = abortSignals.filter(isSignal);

        if (signals.length === 1) {
            this.abortedSignal = this.signal = signals[0];
        } else if (signals.some((s) => s.aborted)) {
            this.abortedSignal = this.signal = signals.filter(
                (s) => s.aborted
            )[0];
        } else if (signals.length > 1) {
            const ac = new AbortController();
            this.signal = ac.signal;

            for (const signal of signals) {
                signal.addEventListener('abort', () => {
                    for (const signal of signals) {
                        signal.removeEventListener('abort');
                    }

                    this.abortedSignal = signal;
                    ac.abort();
                });
            }
        }
    }
}

/**
 * A helper class to create an {@link !AbortSignal AbortSignal} based on {@link !setTimeout setTimeout}.
 */
export class TimeoutSignal {
    /** The underlying {@link !AbortSignal AbortSignal}. */
    public readonly signal?: AbortSignal;
    /** If defined, the {@link https://developer.mozilla.org/en-US/docs/Web/API/setTimeout#return_value timeoutID} of a timer which will signal abortion. */
    public readonly timeout?: ReturnType<typeof setTimeout>;

    /**
     * Initializes a new {@link TimeoutSignal}.
     * @param {number} [timeout] The number of milliseconds after which the {@link TimeoutSignal.signal signal} should be aborted.
     * {@link !undefined `undefined`}, {@link !Infinity infinite} or {@link !NaN `NaN`} values will result in {@link TimeoutSignal.signal signal}
     * being {@link !undefined `undefined`}.
     * Finite values will be clamped between `0` and {@link !Number.MAX_SAFE_INTEGER `Number.MAX_SAFE_INTEGER`} inclusive.
     */
    constructor(timeout?: number) {
        if (timeout && isFinite(timeout) && !isNaN(timeout)) {
            timeout = Math.min(Math.max(timeout, 0), Number.MAX_SAFE_INTEGER); // clamp the timeout to a sensible range

            const ac = new AbortController();
            this.signal = ac.signal; // wrap the AbortController's signal
            this.timeout = setTimeout(() => ac.abort(), timeout); // abort after the given number of milliseconds
        }
    }
}

/**
 * Type guard for determining whether a given object is an {@link !AbortSignal AbortSignal} instance.
 * @param {unknown} object The object.
 * @returns {object is AbortSignal} `true` if the object is determined to be an {@link !AbortSignal AbortSignal},
 * otherwise `false`.
 */
export function isAbortSignal(object: unknown): object is AbortSignal {
    return object instanceof AbortSignal;
}

/**
 * A helpful interface to allow use of {@link !AbortSignal AbortSignal's} {@link !EventTarget EventTarget} interface when TypeScript hates us.
 */
export interface Signal extends AbortSignal {
    /**
     * Adds a listener to a named event.
     * @param {'abort'} event Name of the event.
     * @param {() => void} listener The listener.
     */
    addEventListener: (event: 'abort', listener: () => void) => void;
    /** Removes a listener from a named event.
     * @param {'abort'} event Name of the event.
     */
    removeEventListener: (event: 'abort') => void;
}

/**
 * Type guard for determining whether a given object conforms to the {@link Signal} interface.
 * @param {unknown} object The object.
 * @returns {object is Signal} `true` if the object conforms to the {@link Signal} interface, otherwise `false`.
 */
export function isSignal(object: unknown): object is Signal {
    return (
        isAbortSignal(object) &&
        'addEventListener' in object &&
        'removeEventListener' in object &&
        typeof (<Signal>object).addEventListener === 'function' &&
        typeof (<Signal>object).removeEventListener === 'function'
    );
}
