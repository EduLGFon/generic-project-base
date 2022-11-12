import { TerminalSpinner, SpinnerTypes } from "@spinners";
import config from "Settings" assert { type: 'json' };
import type * as _Types from "../@types/index.d.ts";
import { DateTime } from "@luxon";
import colors from "@colors";

declare global { // criando variável global 'services'
    const services: Services;
    interface Window { services: unknown }
}

window.services = {};

export default () => {
    colors; // Carregando o arquivo da lib (essa função é executada sozinha)
    const spin = logSpin("main", "Configurando prototypes...");
    /* Number Prototypes */

    //      num.toMB ==> Byte to MB
    Object.defineProperty(Number.prototype, "toMB", {
        value: function () {
            return (this / 1024 / 1024).toFixed(2) + "MB";
        },
    });

    /* String Prototypes */

    //      'deeno forever'.toPascalCase() === 'Deeno Forever'
    Object.defineProperties(String.prototype, {
        "toPascalCase": {
            value: function () { // 'deeno forever'
                return this.split(" ").map((word: string) =>
                    // ['deeno', 'forever]
                    word.slice(0, 1).toUpperCase() + word.slice(1).toLowerCase() // ['Deeno', 'Forever']
                ).join(" "); // 'Deeno Forever'
            },
        },
        "toSector": {
            value: function (separator: string) {
                return this.split(separator || ".")[0].toUpperCase();
            },
        },
    });

    //      console.error()
    // maneira mais simples e prática de criar bons logs de erros
    console.error = (error: { stack: string }, title: string) => {
        const msg = String(error?.stack || error);
        const spin = logSpin((title || "ERROR").red, msg);

        spin.fail(msg.slice(0, 512).red);
    };

    spin.end("Prototypes configurados.");
};
export { now, logSpin };

const logSpin = (sector: string, text: string) => {
    const sp = new TerminalSpinner({
        text: formatLog(sector, text),
        spinner: SpinnerTypes.arc,
        color: 'red'
    })
        .start()

    return {
        end: (msg: string) => sp.succeed(formatLog(sector, msg)),
        fail: (msg: string) => sp.fail(formatLog(sector, msg))
    }
}

function formatLog(sector: string, text: string) {
    return [ // isso pode parecer meio confuso
        '[', sector.toUpperCase().blue, '|', now().toFormat('T').yellow, '|', // mas é só a configuração
        ((Deno.memoryUsage().rss / 1048576).toFixed(2) + 'MB').green, '] -', text // do console.log
    ].join(' ');  // [ SETOR | 18:04 | 69MB ]
}

const now = () => DateTime.now()
    .setZone(config.date.timezone) // hora com o fuso-horário corrigido
    .setLocale(config.date.locale); //definindo o idioma da formatação de datas
