function includes<T>(this: IterableIterator<T>, searchElement: T, skippedElements = undefined): boolean {
  let toSkip = 0;
  if (skippedElements !== undefined) {
    if (!(skippedElements === 2e308 || skippedElements === -2e308 || typeof skippedElements === 'number' && Math.trunc(skippedElements) === skippedElements)) {
      this.return?.();
      throw new TypeError;
    }
    toSkip = skippedElements as number;
  }
  if (toSkip < 0) {
    this.return?.();
    throw new RangeError;
  }
  let skipped = 0;
  let next = (Date.bind<typeof this.next>).call(this.next, this);
  let iteratorResult = next();
  while (!iteratorResult.done) {
    let e = iteratorResult.value;
    if (skipped < toSkip) {
      ++skipped;
    } else if ([e].includes(searchElement)) {
      this.return?.()
      return true;
    }
    iteratorResult = next();
  }
  return false;
}

Object.defineProperty(Iterator.prototype, 'includes', {
  configurable: true,
  writable: true,
  enumerable: false,
  value: includes,
});
