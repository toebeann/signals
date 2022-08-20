# signals
A collection of wrappers and utility functions for working with AbortSignals.

[![npm package version](https://img.shields.io/npm/v/@procedure-rpc/signals.svg)](https://npmjs.org/package/@procedure-rpc/signals "View signals on npm") [![npm package downloads](https://img.shields.io/npm/dw/@procedure-rpc/signals.svg)](https://npmjs.org/package/@procedure-rpc/signals.js "View signals on npm") [![API docs](https://img.shields.io/badge/docs-v0.1-informational.svg)](https://procedure-rpc.github.io/signals "Read the documentation on Github Pages") [![Code coverage](https://img.shields.io/codecov/c/github/procedure-rpc/signals?label=code%20coverage)](https://codecov.io/gh/procedure-rpc/signals "View code coverage on Codecov") [![code quality](https://img.shields.io/codefactor/grade/github/procedure-rpc/signals.svg)](https://www.codefactor.io/repository/github/procedure-rpc/signals "Check code quality on CodeFactor")

[![npm test](https://github.com/Procedure-RPC/signals/actions/workflows/npm-test.yml/badge.svg)](https://github.com/Procedure-RPC/signals/actions/workflows/npm-test.yml "View npm test on GitHub Actions") [![publish package](https://github.com/Procedure-RPC/signals/actions/workflows/publish-package.yml/badge.svg)](https://github.com/Procedure-RPC/signals/actions/workflows/publish-package.yml "View publish package on GitHub Actions") [![publish docs](https://github.com/Procedure-RPC/signals/actions/workflows/publish-docs.yml/badge.svg)](https://github.com/Procedure-RPC/signals/actions/workflows/publish-docs.yml "View publish docks on GitHub Actions")

[![GitHub stars](https://img.shields.io/github/stars/procedure-rpc/signals.svg?style=social)](https://github.com/procedure-rpc/signals "Star signals on GitHub") [![Twitter Follow](https://img.shields.io/twitter/follow/toebean__.svg?style=social)](https://twitter.com/toebean__ "Follow @toebean__ on Twitter") [![GitHub Sponsors donation button](https://img.shields.io/badge/github-sponsor-yellow.svg)](https://github.com/sponsors/toebeann "Sponsor signals on GitHub") [![PayPal donation button](https://img.shields.io/badge/paypal-donate-yellow.svg)](https://paypal.me/tobeyblaber "Donate to signals with PayPal")

## Table of contents
- [signals](#signals)
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

### [npm](https://www.npmjs.com/package/@procedure-rpc/signals "npm is a package manager for JavaScript")
`npm install --save @procedure-rpc/signals`

## Usage

### AggregateSignal
Combines several `AbortSignal` instances into a signal which will be aborted as soon as any of the underlying signals are.

```js
const { AggregateSignal } = require('@procedure-rpc/signals');

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
Creates an `AbortSignal` which will automatically timeout after a given number of milliseconds. Based on native `timeout`.

```js
const { TimeoutSignal } = require('@procedure-rpc/signals');

const timeoutSignal = new TimeoutSignal(200); // creates an AbortSignal which will abort in 200ms

// passing a timeout signal into an awaitable, abortable call:
await doSomeAbortableAction({ signal: timeoutSignal.signal });

// If for whatever reason you need to clear the underlying timeout of the TimeoutSignal, you can:
clearTimeout(timeoutSignal.timeout);
```

### isAbortSignal
A TypeScript type guard for checking whether a given object is an `AbortSignal`.

```ts
import { isAbortSignal } from '@procedure-rpc/signals';

if (isAbortSignal(someObject)) {
    // within this block, someObject is typed as an AbortSignal
    console.log(someObejct.aborted);
}
```

### isSignal
A TypeScript type guard for checking whether a given object is an `AbortSignal` *and* conforms to a minimal `EventTarget` interface. Useful for when TypeScript hates us (i.e. does not yet have support for `AbortSignal`'s `EventTarget` interface).

```ts
import { isSignal } from '@procedure-rpc/signals';

if (isSignal(someObject)) {
    // within this block, someObject is typed as a Signal (which extends AbortSignal)
    someObject.addEventListener('abort', () => {
        // ...
    });
}
```

## API reference
The full API reference for signals is [available on GitHub Pages](https://procedure-rpc.github.io/signals).

### Quick links
- [AggregateSignal](https://procedure-rpc.github.io/signals/classes/AggregateSignal.html)
- [TimeoutSignal](https://procedure-rpc.github.io/signals/classes/TimeoutSignal.html)
- [isAbortSignal](https://procedure-rpc.github.io/signals/functions/isAbortSignal.html)
- [isSignal](https://procedure-rpc.github.io/signals/functions/isSignal.html)
- [Signal](https://procedure-rpc.github.io/signals/interfaces/Signal.html)

## License
signals is licensed under [MIT](https://github.com/procedure-rpc/signals/blob/HEAD/LICENSE) © 2022 Tobey Blaber.
