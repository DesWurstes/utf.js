/**
 * UTF.js
 * https://github.com/DesWurstes/utf.js
 * Copyright (c) 2018 DesWurstes MIT License
 */

function FromString(str) {
	const len = str.length;
	var ret = new Uint32Array(len);
	var a = 0;
	for (var i = 0; i < len; i++, a++) {
		const c = str.charCodeAt(i);
		if ((c < 0xd800) || (c >= 0xe000)) {
	 		ret[a] = c;
			continue;
		}
		i++;
		const d = str.charCodeAt(i);
		if ((c >= 0xdc00) || (d < 0xdc00)) {
			return [];
		}
		// ret[a] = ((c - 0xD800) << 10) + d - 0xDC00 + 0x1000
		ret[a] = (c - 0xD800 << 10) + d + 0x2400;
	}
	return ret.slice(0, a);
}

function FromUTF8(str) {
	const len = str.length;
	var ret = new Uint32Array(len);
	var a = 0;
	for (var i = 0; i < len; i++, a++) {
		const c = str[i];
		if ((c & 128) == 0) {
			ret[a] = c;
			continue;
		}
		if ((c & 64) == 0) {
			return [];
		}
		i++;
		const d = str[i];
		if ((c & 32) == 0) {
			ret[a] = ((c & 31) << 6) | (d & 63);
			if ((d & 192) == 128) {
				continue;
			}
			return [];
		}
		i++;
		const e = str[i];
		if ((c & 16) == 0) {
			ret[a] = ((c & 15) << 12) | ((d & 63) << 6) | ((e & 63));
			if (((d & 192) == 128) && ((e & 192) == 128)) {
				continue;
			}
			return [];
		}
		i++;
		const f = str[i];
		if ((c & 8) == 0) {
			ret[a] = ((c & 7) << 18) | ((d & 63) << 12) | ((e & 63) << 6) | ((f & 63));
			if (((d & 192) == 128) && ((e & 192) == 128) && ((f & 192) == 128)) {
				continue;
			}
			return [];
		}
		return [];
	}
	return ret.slice(0, a);
}

function FromUTF16(str) {
	const len = str.length;
	var ret = new Uint32Array(len);
	var a = 0;
	for (var i = 0; i < len; i++, a++) {
		const c = str[i];
		if ((c < 0xd800) || (c >= 0xe000)) {
			ret[a] = c;
			continue;
		}
		i++;
		const d = str[i];
		if ((c >= 0xdc00) || (d < 0xdc00)) {
			return [];
		}
		ret[a] = ((c - 0xD800) << 10) + d + 0x2400;
	}
	return ret.slice(0, a);
}

function ToString(str) {
	const len = str.length;
	var ret = "";
	for (var i = 0; i < len; i++) {
		let c = str[i];
		if ((c < 0xd800) || ((c >= 0xe000) && (c < 0x10000))) {
			ret.push(c);
			continue;
		}
		if ((c >= 0xd800) && (c < 0xe000)) {
			// "This character can't be encoded using UTF-16!"
			return "";
		}
		c -= 0x10000;
		ret.push((c >>> 10) + 0xD800);
		ret.push((c & 1023) + 0xDC00);
	}
	return ret;
}

function ToUTF8(str) {
	const len = str.length;
	var ret = new Uint8Array(len << 2);
	var a = 0;
	for (var i = 0; i < len; i++, a++) {
		const c = str[i];
		if (c < 0x80) {
			ret[a] = c;
			continue;
		}
		if (c < 0x800) {
			ret[a] = c >>> 6 | 192;
			a++;
			ret[a] = c & 63 | 128;
			continue;
		}
		if (c < 0x10000) {
			ret[a] = c >>> 12 | 224;
			a++;
			ret[a] = c >>> 6 & 63 | 128;
			a++;
			ret[a] = c & 63 | 128;
			continue;
		}
		if (c < 0x110000) {
			ret[a] = c >>> 18 | 240;
			a++;
			ret[a] = c >>> 12 & 63 | 128;
			a++;
			ret[a] = c >>> 6 & 63 | 128;
			a++;
			ret[a] = c & 63 | 128;
			continue;
		}
		return [];
	}
	return ret.slice(0, a);
}

function ToUTF16(str) {
	const len = str.length;
	var ret = new Uint16Array(len << 1);
	var a = 0;
	for (var i = 0; i < len; i++, a++) {
		let c = str[i];
		if ((c < 0xd800) || ((c >= 0xe000) && (c < 0x10000))) {
			ret[a] = c;
			continue;
		}
		if ((c >= 0xd800) && (c < 0xe000)) {
			// This character can't be encoded using UTF-16!
			return [];
		}
		c -= 0x10000;
		ret[a] = (c >>> 10) + 0xD800;
		a++;
		ret[a] = (c & 1023) + 0xDC00;
	}
	return ret.slice(0, a);
}
