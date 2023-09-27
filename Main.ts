import Prototypes from '@Plugins/Prototypes.ts';
import pg from '@Plugins/Postgres.ts';
import CLI from '@Plugins/CLI.ts';

// Load prototypes
Prototypes();

// Connect to PostgreSQL
await pg.connect();

// Start Command Line Interface
if (!Deno.args.includes('--no-cli')) CLI();
