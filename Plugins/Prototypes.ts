import { colors, logSpin } from "../Deps.ts";

window.services = {};

export default () => {
    colors // Isso é uma função auto-executável, não mexa nisso
    const spin = logSpin('main', 'Configurando prototypes...');
    /* Number Prototypes */

    //      num.toMB ==> Byte to MB
    Object.defineProperty(Number.prototype, 'toMB', {
        value: function () {
            return (this / 1024 / 1024).toFixed(2) + 'MB'
        }
    })


    /* String Prototypes */

    //      'deeno forever'.toPascalCase() === 'Deeno Forever'
    Object.defineProperties(String.prototype, {
        'toPascalCase': {
            value: function () { // 'deeno forever'
                return this.split(' ').map((word: string) => // ['deeno', 'forever]
                    word.slice(0, 1).toUpperCase() + word.slice(1).toLowerCase() // ['Deeno', 'Forever']
                ).join(' '); // 'Deeno Forever'
            }
        },
        'toSector': {
            value: function (separator: string) {
                return this.split(separator || '.')[0].toUpperCase()
            }
        }
    })

    //      console.error()
    // maneira mais simples e prática de criar bons logs de erros
    console.error = function () {
        const error = String(arguments[0]?.stack || arguments[0]);
        const spin = logSpin((arguments[1] || 'ERROR').red, 'erro')

        spin.fail(error.slice(0, 512).red)
    }

    spin.end('Prototypes configurados.');
}