function includes<T>(this: IterableIterator<T>, searchElement: T, skippedElements = undefined): boolean {
  let toSkip = 0;
  if (skippedElements !== undefined) {
    if (!(skippedElements === 2e308 || skippedElements === -2e308 || typeof skippedElements === 'number' && Math.trunc(skippedElements) === skippedElements)) {
      try { this.return?.(); } catch {}
      throw new TypeError;
    }
    toSkip = skippedElements as number;
  }
  if (toSkip < 0) {
    try { this.return?.(); } catch {}
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
      try { this.return?.(); } catch {}
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
