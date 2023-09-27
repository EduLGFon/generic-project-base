import { QueryObjectResult } from 'postgres/query';
import table from '@Classes/Table.ts';

interface User {
	id: string;
}

interface Postgres {
	connect(): Promise<void>;
	end(): Promise<void>;
	isConnected(): boolean;
	query<T>(sql: string): Promise<QueryObjectResult<T>>;
	users: table<User>;
}
