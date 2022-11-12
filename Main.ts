console.clear();
import { loadServices } from "./Plugins/Workers.ts";
import Prototypes from "@prototypes";
import { config } from "@dotenv";

config({ export: true }); // Configurando variáveis de ambiente
Prototypes();
await loadServices(`${Deno.cwd()}/Services`);