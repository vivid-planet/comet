import environment from "./environment";

const config: { [key in typeof environment[number]]: string } = environment.reduce((ret, value) => {
    ret[value] = ((window as unknown) as Record<string, string>)[`EXTERNAL__${value}__`];
    return ret;
}, {} as Record<typeof environment[number], string>);

export default config;
