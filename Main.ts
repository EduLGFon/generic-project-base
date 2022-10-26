console.clear();
import { loadServices } from "./Plugins/Workers.ts";
import Prototypes from "./Plugins/Prototypes.ts"
import { dotenv } from './Deps.ts';

dotenv() // Configurando variáveis de ambiente
Prototypes();
await loadServices(`${Deno.cwd()}/Services`);