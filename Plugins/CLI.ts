import { Input } from "@cliffy";

const lastCode: string[] = [];

export default async function CLI() {
    const code: string = await Input.prompt({
        message: "Run",
        suggestions: lastCode,
    });

    lastCode.unshift(code);

    try {
        // if (code.startsWith('.')) {

        // }

        const res = await eval(code);

        console.log(`%cSaída:`, "color: green", res);
    } catch (err) {
        console.log(`%cErro:`, "color: red", err);
    } finally {
        CLI();
    }
}
