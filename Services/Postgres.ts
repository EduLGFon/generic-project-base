import { Client } from "@postgres";

try {
    const client = new Client({ tls: { enabled: false } });
    await client.connect();
    if (!client.connected) throw new Error("Client not connected");

    const pg = new class Postgres {
        ready: boolean;

        constructor() {
            this.ready = client.connected;
        }
        end() {
        }
    }();

    self.postMessage({ id: 1, msg: "Banco de dados operante", service: pg });
} catch (e) {
    self.postMessage({ id: 0, msg: e.stack });
    self.close();
}
