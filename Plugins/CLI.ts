import postgres from '@Plugins/Postgres.ts';
import { inspect } from 'node:util';

export default async function CLI() {
	// deno-lint-ignore no-unused-vars
	const pg = postgres;
	const code = prompt('$ Run:', '')!;

	try {
		// if (code.startsWith('.')) {

		// }

		const output = await eval(code);

		if (typeof output === 'string') console.log(`[OUTPUT`, output, 'green');
		else console.log(inspect(output, { depth: null }));
	} catch (e) {
		console.log('[ERROR', e, 'red');
	} finally {
		CLI();
	}
}
