import Threads from "../JSON/Threads.json" assert { type: "json" };
import { logSpin } from "@prototypes";
import { delay } from "@std";

async function loadServices(dir: string) {
    for (const s of Deno.readDirSync(dir)) {
        if (s.isDirectory) {
            loadServices(`${dir}/${s.name}`);
            continue;
        }

        const sector = s.name.toSector() as threadFiles;
        const name = Threads[sector]?.name as threadNames;
        if (services[name]?.ready) continue;

        const spin = logSpin(sector, "Carregando o serviço...");

        const worker = new Worker(import.meta.resolve(`${dir}/${s.name}`), {
            type: "module",
            deno: {
                permissions: Threads[sector].perms || "none",
            },
        });

        await new Promise((res) => {
            worker.onmessage = async (event: MessageEvent) => {
                const { id, msg, src } = event.data;

                if (id === 1) {
                    spin.end(msg);
                    services[name] = src;
                    res(true);
                } else {
                    spin.fail(msg);
                    await delay(5_000);
                    services[name].ready = false;
                    loadServices(dir);
                }
            };
        });
    }
}

export { loadServices };
