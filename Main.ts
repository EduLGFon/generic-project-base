console.clear();
import loadServices from "./Plugins/Workers.ts";
import Prototypes from "@prototypes";
import CLI from "./Plugins/CLI.ts";
import { config } from "@dotenv";

// Configurando variáveis de ambiente
config({ export: true });

// Carregando prototypes de objetos e bibliotecas
Prototypes();

// Iniciando serviços em Workers separados
await loadServices(`${Deno.cwd()}/Services`);

// Iniciando interface de linha de comando
CLI();
