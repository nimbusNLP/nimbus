"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cached = cached;
exports.cachedAsync = cachedAsync;
/**
 * Cache the result of a function on an object
 *
 * We could have used @decorators to make this nicer but we don't use them anywhere yet,
 * so let's keep it simple and readable.
 */
function cached(obj, sym, fn) {
    if (!(sym in obj)) {
        obj[sym] = fn();
    }
    return obj[sym];
}
/**
 * Like 'cached', but async
 */
async function cachedAsync(obj, sym, fn) {
    if (!(sym in obj)) {
        obj[sym] = await fn();
    }
    return obj[sym];
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FjaGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY2FjaGVkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBTUEsd0JBS0M7QUFLRCxrQ0FLQztBQXJCRDs7Ozs7R0FLRztBQUNILFNBQWdCLE1BQU0sQ0FBc0IsR0FBTSxFQUFFLEdBQVcsRUFBRSxFQUFXO0lBQzFFLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsRUFBRSxDQUFDO1FBQ2pCLEdBQVcsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQztJQUMzQixDQUFDO0lBQ0QsT0FBUSxHQUFXLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDM0IsQ0FBQztBQUVEOztHQUVHO0FBQ0ksS0FBSyxVQUFVLFdBQVcsQ0FBc0IsR0FBTSxFQUFFLEdBQVcsRUFBRSxFQUFvQjtJQUM5RixJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLEVBQUUsQ0FBQztRQUNqQixHQUFXLENBQUMsR0FBRyxDQUFDLEdBQUcsTUFBTSxFQUFFLEVBQUUsQ0FBQztJQUNqQyxDQUFDO0lBQ0QsT0FBUSxHQUFXLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDM0IsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ2FjaGUgdGhlIHJlc3VsdCBvZiBhIGZ1bmN0aW9uIG9uIGFuIG9iamVjdFxuICpcbiAqIFdlIGNvdWxkIGhhdmUgdXNlZCBAZGVjb3JhdG9ycyB0byBtYWtlIHRoaXMgbmljZXIgYnV0IHdlIGRvbid0IHVzZSB0aGVtIGFueXdoZXJlIHlldCxcbiAqIHNvIGxldCdzIGtlZXAgaXQgc2ltcGxlIGFuZCByZWFkYWJsZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNhY2hlZDxBIGV4dGVuZHMgb2JqZWN0LCBCPihvYmo6IEEsIHN5bTogc3ltYm9sLCBmbjogKCkgPT4gQik6IEIge1xuICBpZiAoIShzeW0gaW4gb2JqKSkge1xuICAgIChvYmogYXMgYW55KVtzeW1dID0gZm4oKTtcbiAgfVxuICByZXR1cm4gKG9iaiBhcyBhbnkpW3N5bV07XG59XG5cbi8qKlxuICogTGlrZSAnY2FjaGVkJywgYnV0IGFzeW5jXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjYWNoZWRBc3luYzxBIGV4dGVuZHMgb2JqZWN0LCBCPihvYmo6IEEsIHN5bTogc3ltYm9sLCBmbjogKCkgPT4gUHJvbWlzZTxCPik6IFByb21pc2U8Qj4ge1xuICBpZiAoIShzeW0gaW4gb2JqKSkge1xuICAgIChvYmogYXMgYW55KVtzeW1dID0gYXdhaXQgZm4oKTtcbiAgfVxuICByZXR1cm4gKG9iaiBhcyBhbnkpW3N5bV07XG59XG4iXX0=