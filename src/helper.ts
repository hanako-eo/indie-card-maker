// Source - https://stackoverflow.com/q/52963900
// Posted by dragi, modified by community. See post 'Timeline' for change history
// Retrieved 2026-09-14, License - CC BY-SA 4.0
export function snake_case(str: string): string {
	str = str.replace(/\W+/g, " ").toLowerCase().split(' ').join('_');

	if (str.charAt(str.length - 1) === '_') {
		return str.substr(0, str.length - 1);
	}

	return str;
}

export function prebind<A extends any[], B extends any[], R>(f: (...args: [...A, ...B]) => R, ...args1: A): (...args2: B) => R {
	return (...args2: B) => f(...args1, ...args2);
}

export function download<S extends object>(filename: string, data: S) {
	const blob = new Blob([JSON.stringify(data)], { type: "text/json" });
	const url = URL.createObjectURL(blob);

	const a = document.createElement("a");
	a.href = url;
	a.download = filename;

	// Append to the DOM (required for older browsers)
	document.body.appendChild(a);
	a.click();

	// Cleanup: Revoke the temporary URL and remove the element
	URL.revokeObjectURL(url);
	document.body.removeChild(a);
}
