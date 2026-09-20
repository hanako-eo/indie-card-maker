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

interface ContentType {
	text: string,
	data_url: string,
	bytes: ArrayBuffer,
}
export function file_content<K extends keyof ContentType>(key: K, file: File): Promise<ContentType[K]> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.addEventListener("load", async () => resolve(reader.result as ContentType[K]));
		reader.addEventListener("error", reject);
		switch (key) {
			case "text":
				reader.readAsText(file);
				break;
			case "data_url":
				reader.readAsDataURL(file);
				break;
			case "bytes":
				reader.readAsArrayBuffer(file);
				break;
		}
	});
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
