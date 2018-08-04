# Utf.js

Simply, it allows you to convert between UTF-8, 16, 32 and String. 1.8 KB when minified.

### Documentation

It has two groups of functions. The first group:

```javascript
// in: String
function FromString(str) {}
// in: Uint8Array/Array
function FromUTF8(str) {}
// in: Uint16Array/Array
function FromUTF16(str) {}
```

They output an `Uint32Array` of UTF-32 for success, and a `[]` for error.

The second group:

```javascript
// out: String
function ToString(str) {}
// out: Uint8Array
function ToUTF8(str) {}
// out: Uint16Array
function ToUTF16(str) {}
```

They are passed an `Uint32Array` of UTF-32. `ToUTF8` and `ToUTF16` return a `[]` for error and `ToString` returns `""`.

### Sample Use

Let's say we want to encode our string "abc" as UTF-8 byte array. How do we do that?

```javascript
ToUTF8(FromString("abc"));
```

How to convert UTF-8 to UTF-32?

```javascript
FromUTF8("abc");
```

Note: This is beta software
