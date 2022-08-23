/**
 * A helper class to create an [AbortSignal](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) which will abort when any of the signals passed to its constructor do.
 */
export class AggregateSignal {
    /**
     * The aggregate [AbortSignal](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal).
     *
     * @remarks
     * If only a single valid [AbortSignal](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) was passed, it will be that signal.
     * If any of the signals passed was already aborted, it will be the first match in the array.
     * If no valid [AbortSignals](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) were passed,
     * it will be [undefined](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/undefined).
     */
    readonly signal?: AbortSignal;

    /** The first [AbortSignal](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) of those passed in to have aborted. */
    abortedSignal?: AbortSignal;

    /**
     * Initializes a new {@link AggregateSignal}.
     * @param {(AbortSignal | undefined)[]} abortSignals The [AbortSignals](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) to aggregate.
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
 * A helper class to create an [AbortSignal](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) based on a timeout.
 */
export class TimeoutSignal {
    /** The underlying [AbortSignal](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal). */
    public readonly signal?: AbortSignal;
    /** If defined, the ID of a timeout which will signal abortion. */
    public readonly timeout?: ReturnType<typeof setTimeout>;

    /**
     * Initializes a new {@link TimeoutSignal}.
     * @param {number} [timeout] The number of milliseconds after which the {@link TimeoutSignal.signal signal} should be aborted.
     * [undefined](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/undefined),
     * [infinite](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Infinity)
     * or [NaN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NaN) values
     * will result in {@link TimeoutSignal.signal signal} being undefined.
     * Finite values will be clamped between `0` and
     * [Number.MAX_SAFE_INTEGER](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER) inclusive.
     */
    constructor(timeout?: number) {
        if (timeout !== undefined && isFinite(timeout) && !isNaN(timeout)) {
            timeout = Math.min(Math.max(timeout, 0), Number.MAX_SAFE_INTEGER); // clamp the timeout to a sensible range

            const ac = new AbortController();
            this.signal = ac.signal; // wrap the AbortController's signal
            this.timeout = setTimeout(() => ac.abort(), timeout); // abort after the given number of milliseconds
        }
    }
}

/**
 * Type guard for determining whether a given object is an [AbortSignal](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) instance.
 * @param {unknown} object The object.
 * @returns {object is AbortSignal} `true` if the object is determined to be an [AbortSignal](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal), otherwise `false`.
 */
export function isAbortSignal(object: unknown): object is AbortSignal {
    return object instanceof AbortSignal;
}

/**
 * A helpful interface to allow use of [AbortSignal's](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal)
 * [EventTarget](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget) interface when TypeScript hates us.
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
