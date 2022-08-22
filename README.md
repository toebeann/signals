<center>

# signals 🚥
A collection of wrappers and utility functions for working with AbortSignals.

[![npm package version](https://img.shields.io/npm/v/@toebean/signals.svg?logo=npm&label&labelColor=222&style=flat-square)](https://npmjs.org/package/@toebean/signals "View signals on npm") [![npm package downloads](https://img.shields.io/npm/dw/@toebean/signals.svg?logo=npm&labelColor=222&style=flat-square)](https://npmjs.org/package/@toebean/signals "View signals on npm") [![typedocs](https://img.shields.io/badge/docs-informational.svg?logo=typescript&labelColor=222&style=flat-square)](https://toebeann.github.io/signals "Read the documentation on Github Pages") [![license](https://img.shields.io/github/license/toebeann/signals.svg?color=informational&labelColor=222&style=flat-square)](https://github.com/toebeann/signals/blob/main/LICENSE "View the license on GitHub")

[![coverage](https://img.shields.io/codecov/c/github/toebeann/signals.svg?logo=codecov&labelColor=222&style=flat-square)](https://codecov.io/gh/toebeann/signals "View code coverage on Codecov") [![code quality](https://img.shields.io/codefactor/grade/github/toebeann/signals.svg?logo=codefactor&labelColor=222&style=flat-square)](https://www.codefactor.io/repository/github/toebeann/signals "View code quality on CodeFactor") [![minzip](https://img.shields.io/bundlephobia/minzip/@toebean/signals.svg?labelColor=222&style=flat-square)](https://bundlephobia.com/package/@toebean/signals "View signals on Bundlephobia") [![tree-shaking](https://flat.badgen.net/bundlephobia/tree-shaking/@toebean/signals?labelColor=222)](https://bundlephobia.com/package/@toebean/signals "View signals on Bundlephobia")

[![npm test](https://img.shields.io/github/workflow/status/toebeann/signals/npm%20test.svg?logo=github&logoColor=aaa&label=npm%20test&labelColor=222&style=flat-square)](https://github.com/toebeann/signals/actions/workflows/npm-test.yml "View npm test on GitHub Actions") [![publish code coverage](https://img.shields.io/github/workflow/status/toebeann/signals/publish%20code%20coverage.svg?logo=github&logoColor=aaa&label=publish%20code%20coverage&labelColor=222&style=flat-square)](https://github.com/toebeann/signals/actions/workflows/publish-code-coverage.yml "View publish code coverage on GitHub Actions") [![publish package](https://img.shields.io/github/workflow/status/toebeann/signals/publish%20package.svg?logo=github&logoColor=aaa&label=publish%20package&labelColor=222&style=flat-square)](https://github.com/toebeann/signals/actions/workflows/publish-package.yml "View publish package on GitHub Actions") [![publish docs](https://img.shields.io/github/workflow/status/toebeann/signals/publish%20docs.svg?logo=github&logoColor=aaa&label=publish%20docs&labelColor=222&style=flat-square)](https://github.com/toebeann/signals/actions/workflows/publish-docs.yml "View publish docs on GitHub Actions")

[![github](https://img.shields.io/badge/source-informational.svg?logo=github&labelColor=222&style=flat-square)](https://github.com/toebeann/signals "View signals on GitHub") [![twitter](https://img.shields.io/badge/follow-blue.svg?logo=twitter&label&labelColor=222&style=flat-square)](https://twitter.com/toebean__ "Follow @toebean__ on Twitter") [![GitHub Sponsors donation button](https://img.shields.io/badge/sponsor-e5b.svg?logo=github%20sponsors&labelColor=222&style=flat-square)](https://github.com/sponsors/toebeann "Sponsor signals on GitHub") [![PayPal donation button](https://img.shields.io/badge/donate-e5b.svg?logo=paypal&labelColor=222&style=flat-square)](https://paypal.me/tobeyblaber "Donate to signals with PayPal")

</center>

## Table of contents
- [signals 🚥](#signals-)
  - [Table of contents](#table-of-contents)
  - [Install](#install)
    - [npm](#npm)
  - [Usage](#usage)
    - [AggregateSignal](#aggregatesignal)
    - [TimeoutSignal](#timeoutsignal)
    - [isAbortSignal](#isabortsignal)
    - [isSignal](#issignal)
  - [API reference](#api-reference)
    - [Quick links](#quick-links)
  - [License](#license)

## Install

### [npm](https://www.npmjs.com/package/@toebean/signals "npm is a package manager for JavaScript")
`npm i @toebean/signals`

## Usage

### AggregateSignal
Combines several `AbortSignal` instances into a signal which will be aborted as soon as any of the given signals are.

```js
import { AggregateSignal } from '@toebean/signals';

const ac = new AbortController();
const aggregateSignal = new AggregateSignal(ac.signal, someOtherSignal);

// passing an aggregate signal into an awaitable, abortable call:
await doSomeAbortableAction({ signal: aggregateSignal.signal });

// determining which of the original signals was aborted first:
switch (aggregateSignal.abortedSignal) {
    case ac.signal:
        // do stuff
        break;
    // etc...
}
```

### TimeoutSignal
Creates an `AbortSignal` which will timeout after a given number of milliseconds. Based on native `timeout`.

```js
import { AggregateSignal } from '@toebean/signals';

const timeoutSignal = new TimeoutSignal(200); // creates an AbortSignal which will abort in 200ms

// passing a timeout signal into an awaitable, abortable call:
await doSomeAbortableAction({ signal: timeoutSignal.signal });

// If for whatever reason you need to clear the underlying timeout of the TimeoutSignal, you can:
clearTimeout(timeoutSignal.timeout);
```

### isAbortSignal
A TypeScript type guard for checking whether a given object is an `AbortSignal`.

```ts
import { isAbortSignal } from '@toebean/signals';

if (isAbortSignal(someObject)) {
    // within this block, someObject is typed as an AbortSignal
    console.log(someObejct.aborted);
}
```

### isSignal
A TypeScript type guard for checking whether a given object is an `AbortSignal` *and* conforms to a minimal `EventTarget` interface. Useful for when TypeScript hates us (i.e. does not yet have support for `AbortSignal`'s `EventTarget` interface).

```ts
import { isSignal } from '@toebean/signals';

if (isSignal(someObject)) {
    // within this block, someObject is typed as a Signal (which extends AbortSignal)
    someObject.addEventListener('abort', () => {
        // ...
    });
}
```

## API reference
The full API reference for signals is [available on GitHub Pages](https://toebeann.github.io/signals).

### Quick links
- [AggregateSignal](https://toebeann.github.io/signals/classes/AggregateSignal.html)
- [TimeoutSignal](https://toebeann.github.io/signals/classes/TimeoutSignal.html)
- [isAbortSignal](https://toebeann.github.io/signals/functions/isAbortSignal.html)
- [isSignal](https://toebeann.github.io/signals/functions/isSignal.html)
- [Signal](https://toebeann.github.io/signals/interfaces/Signal.html)

## License
signals is licensed under [MIT](https://github.com/toebeann/signals/blob/main/LICENSE) © 2022 Tobey Blaber.
