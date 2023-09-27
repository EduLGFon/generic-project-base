import s from '@Settings' assert { type: 'json' };
import { DateTime } from 'luxon';
import { config } from 'dotenv';

// Setup environment variables
config({ export: true });

const now = () =>
	DateTime.now()
		.setZone(s.date.timezone)
		.setLocale(s.date.locale)
		.toFormat('T');

const getRAM = (backAsNumber?: boolean) => {
	const ram = (Deno.memoryUsage().rss / 1024 / 1024).toFixed(2);

	if (backAsNumber) return Number(ram);
	else return ram + 'MB';
};

export { getRAM, now };

export default () => {
	/* String Prototypes */

	//      'deeno forever'.toPascalCase() === 'Deeno Forever'
	Object.defineProperties(String.prototype, {
		'toPascalCase': {
			value: function () { // 'deeno forever'
				return this.split(' ') // ['deeno', 'forever]
					.map((l: string) =>
						l.slice(0, 1).toUpperCase() + // D
						l.slice(1).toLowerCase() // eeno
					).join(' '); // 'Deeno Forever'
			},
		},
		'toCSS': {
			get() {
				return `color: ${this};`;
			},
		},
	});

	/*      console.error        */
	// easier way to print error messages
	console.error = (error: { stack: string }) => {
		const msg = String(error?.stack || error)
			.slice(0, 512);

		console.log('[ERROR', msg, 'red');
	};

	/*      console.log        */
	// The same console.log but styled differently
	console.log = (...args) => {
		if (typeof args[0] !== 'string' || !args[2] || !args[0].startsWith('[')) {
			return console.info(...args);
		}

		const [title, msg, color] = [...args];

		const str = `%c${title} | ${now()} | ${getRAM()}] - ${msg}`;

		return console.info(
			str,
			color.toCSS,
		); // [ TITLE | 18:04 | 69MB ] - msg
	};

	console.log('[PROTOTYPES', 'All set.', 'yellow');
};
