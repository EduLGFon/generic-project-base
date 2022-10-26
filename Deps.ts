// dedico este arquivo para importar todos os módulos na nuvem
// e exporta-los com nomes mais agradáveis. Convenhamos
// não seria legal repetir URLs de repositórios em cada arquivo
import { TerminalSpinner, SpinnerTypes } from 'https://deno.land/x/spinners@v1.1.2/mod.ts';
import { DateTime } from "https://moment.github.io/luxon/es6/luxon.min.js";
import { Client } from "https://deno.land/x/postgres@v0.17.0/mod.ts";
import { config } from "https://deno.land/x/dotenv@v3.2.0/mod.ts";
import colors from "https://deno.land/x/console_colors@v0.0.2/mod.ts";
import type * as _Types from "./@types/index.d.ts";
import { delay } from "https://deno.land/std@0.136.0/async/mod.ts";

import set from "./JSON/Settings.json" assert { type: 'json' }

export { colors, delay, dotenv, Client, DateTime, formatLog, logSpin, now };

declare global { // criando variável global 'services'
    const services: Services;
    interface Window { services: unknown }
}

function logSpin(sector: string, text: string) {
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

function dotenv() {
    config({
        export: true
    })
}

function formatLog(sector: string, text: string) {
    return [ // isso pode parecer meio confuso
        '[', sector.toUpperCase().blue, '|', now().toFormat('T').yellow, '|', // mas é só a configuração
        ((Deno.memoryUsage().rss / 1048576).toFixed(2) + 'MB').green, '] -', text // do console.log
    ].join(' ');  // [ SETOR | 18:04 | 69MB ]
}

function now() {
    return DateTime.now()
        .setZone(set.date.timezone) // hora com o fuso-horário corrigido
        .setLocale(set.date.locale); //definindo o idioma da formatação de datas
}