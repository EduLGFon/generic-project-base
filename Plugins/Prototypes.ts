import { SpinnerTypes, TerminalSpinner } from "@spinners";
import config from "Settings" assert { type: "json" };
import type * as _Types from "../@types/index.d.ts";
import { DateTime } from "@luxon";
import colors from "@colors";

declare global { // declarando variáveis globais
    const services: Services;

    interface Window {
        services: unknown;
    }
}

export default () => {
    colors; // Carregando o arquivo da lib (essa função é executada sozinha)
    const spin = log("main", "Configurando prototypes...");

    // Eu criei essa variável pra facilitar o
    // gerenciamento de threads/workers
    window.services = {};

    /* String Prototypes */

    //      'deeno forever'.toPascalCase() === 'Deeno Forever'
    Object.defineProperties(String.prototype, {
        "toPascalCase": {
            value: function () { // 'deeno forever'
                return this.split(" ") // ['deeno', 'forever]
                    .map((word: string) =>
                        word.slice(0, 1).toUpperCase() + // D
                        word.slice(1).toLowerCase() // eeno
                    ).join(" "); // 'Deeno Forever'
            },
        },
        "toSector": {
            value: function (separator: string) {
                return this.split(separator || ".")[0].toUpperCase();
            },
        },
    });

    /* Number Prototypes */

    //      num.toMB ==> Byte to MB
    Object.defineProperty(Number.prototype, "toMB", {
        value: function () {
            return (this / 1024 / 1024).toFixed(2) + "MB";
        },
    });

    /*      console.error        */

    // maneira mais simples e prática de criar bons logs de erros
    console.error = (error: { stack: string }, title: string) => {
        const msg = String(error?.stack || error)
            .slice(0, 512).red;

        log((title || "ERROR").red, msg)
            .fail(msg);
    };

    spin.end("Prototypes configurados.");
};

export { log, now };

const log = (sector: string, text: string) => {
    const spinner = new TerminalSpinner({
        text: formatLog(sector, text),
        spinner: SpinnerTypes.arc,
        color: "red",
    }).start();

    return {
        end: (msg: string) => spinner.succeed(formatLog(sector, msg)),
        fail: (msg: string) => spinner.fail(formatLog(sector, msg)),
    };
};

const formatLog = (sector: string, text: string) =>
    [ // isso pode parecer meio confuso
        "[",
        sector.toUpperCase().blue, // [ SECTOR
        "|",
        now().toFormat("T").yellow, // [ SECTOR | 18:04
        "|",
        ((Deno.memoryUsage().rss / 1024 / 1024).toFixed(2) + "MB").green, // [ SECTOR | 18:04 | 69MB
        "] -",
        text,
    ].join(" "); // [ SETOR | 18:04 | 69MB ]

const now = () =>
    DateTime.now()
        .setZone(config.date.timezone) // horário com o fuso-horário corrigido
        .setLocale(config.date.locale); //definindo o idioma da formatação de datas
