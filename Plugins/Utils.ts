export function isEmpty(value: unknown): boolean {
	if (Array.isArray(value)) {
		return value.length === 0 ||
			value.some((item) => item === undefined || isEmpty(item));
	} else if (typeof value === 'object') {
		return Object.keys(value!).length === 0;
		//|| Object.values(value!).some((item) => item === undefined || isEmpty(item));
	}

	return true;
}
