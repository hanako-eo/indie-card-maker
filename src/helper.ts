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
