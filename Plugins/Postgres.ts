import config from '@Settings' assert { type: 'json' };
import { Postgres } from '@Types/schema.d.ts';
import table from '@Classes/Table.ts';
import { Client } from 'postgres';

console.log(Deno.env.get('DATABASE_URL'));
const postgres: Client = new Client(Deno.env.get('DATABASE_URL'));

// @ts-ignore Stil did not complete the obj
const pg: Postgres = {
	connect: async () => {
		await postgres.connect();
		console.log('[POSTGRES', 'Database is operational.', 'green');
	},
	end: async () => {
		await postgres.end();
		console.log('[POSTGRES', 'Database is offline.', 'red');
	},
	isConnected: () => postgres.connected,
	query: async <T>(sql: string) => await postgres.queryObject<T>(sql),
};

for (const [name, key] of config.schema) {
	pg[name as 'users'] = new table(name, key, postgres);
}

export default pg;
