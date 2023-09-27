import { isEmpty } from '@Plugins/Utils.ts';
import { Client } from 'postgres';

export default class Table<T> {
	table: string;
	PK: string;
	pg: Client;

	constructor(name: string, primaryKey: string, postgres: Client) {
		this.table = name;
		this.PK = primaryKey;
		this.pg = postgres;
	}

	async create(
		index: string | string[],
		data?: Partial<T>,
	): Promise<T | T[]> {
		let values: string | string[] = [];
		let keys = '';

		if (data) {
			Object.values(data).forEach((value) => {
				if (typeof value !== 'string') value = String(value);
				else value = `'${value.replace(new RegExp(`'`, 'g'), `''`)}'`;

				return (values as string[]).push(value as string);
			});

			keys = `, "${Object.keys(data).join('", "')}"`;
			values = `, ${values.join(', ')}`;
		}

		const sql = `INSERT INTO "${this.table}" (
            "${this.PK}"${keys})
            VALUES ('${index}'${values});`;

		try {
			if (Array.isArray(index)) {
				for (const i in index) {
					const singleSql = sql.replace(String(index), index[i]);

					await this.pg.queryObject(singleSql);
				}
			} else await this.pg.queryObject(sql);

			return await this.find(index);
		} catch (e) {
			console.log(`[PG/CREATE/${this.table}`, `${sql}\n${e.stack}`);

			return {} as T;
		}
	}

	async update(
		index: string | string[],
		data: Partial<T>,
		createIfNull?: boolean,
	): Promise<T | T[]> {
		const values: string[] = [];

		Object.entries(data)
			.forEach(([key, value]) => {
				if (typeof value !== 'string') value = String(value);
				else value = `'${value.replace(new RegExp(`'`, 'g'), `''`)}'`;

				return values.push(`"${key}" = ${value}`);
			});

		const sql = `UPDATE "${this.table}"
		SET ${values.join(`,\n`)}
		WHERE "${this.PK}" = '${index}';`;

		try {
			if (Array.isArray(index)) {
				for (const i in index) {
					const singleSql = sql.replace(String(index), index[i]);

					await this.pg.queryObject(singleSql);
				}
			} else await this.pg.queryObject(sql);

			return await this.find(index, createIfNull);
		} catch (e) {
			console.log(`[PG/UPDATE/${this.table}`, `${sql}\n${e.stack}`);

			return {} as T;
		}
	}

	async find(
		index: string | string[],
		createIfNull?: boolean,
		key?: string,
	): Promise<T | T[]> {
		const sql = `SELECT * FROM "${this.table}"
        WHERE "${key || this.PK}" = '${index}';`;

		let search: T | T[] = [];

		try {
			if (Array.isArray(index)) {
				for (const i in index) {
					const singleSql = sql.replace(String(index), index[i]);
					const query = await this.pg.queryObject(singleSql);

					search.push((query.rows[0] || {}) as T);
				}
			} else {
				const query = await this.pg.queryObject(sql);

				search = query.rows[0] as T;
			}
		} catch (e) {
			console.log(`[PG/FIND/${this.table}`, `${sql}\n${e.stack}`);

			search = [] as T[];
		}

		if (isEmpty(search) && createIfNull) return await this.create(index);

		return search;
	}

	async delete(index: string | string[]): Promise<boolean> {
		const sql = `DELETE FROM "${this.table}"
        WHERE "${this.PK}" = '${index}';`;

		try {
			if (!Array.isArray(index)) return await this.pg.queryObject(sql) && true;

			for (const i in index) {
				const singleSql = sql.replace(String(index), index[i]);

				await this.pg.queryObject(singleSql);
			}

			return true;
		} catch (e) {
			console.log(`[PG/DELETE/${this.table}`, `${sql}\n${e.stack}`);

			return false;
		}
	}

	async getAll(
		limit?: number,
		orderBy?: { key: string; type: string },
	): Promise<T[]> {
		const sql = `SELECT * FROM "${this.table}"
        ${isEmpty(orderBy) ? '' : `ORDER BY ${orderBy!.key} ${orderBy!.type}`}
        ${limit ? `LIMIT ${limit}` : ''};`;

		try {
			const query = await this.pg.queryObject(sql);

			return query.rows as T[];
		} catch (e) {
			console.log(`[PG/GETALL/${this.table}`, `${sql}\n${e.stack}`);

			return [];
		}
	}

	async count() {
		const sql = `SELECT COUNT (${this.PK}) FROM "${this.table}";`;

		try {
			const query = await this.pg.queryObject(sql);
			return query.rowCount;
		} catch (e) {
			console.log(`[PG/COUNT/${this.table}`, `${sql}\n${e.stack}`);

			return 0;
		}
	}
}
