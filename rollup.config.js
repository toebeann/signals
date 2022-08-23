import typescript from "rollup-plugin-ts";
import { terser } from "rollup-plugin-terser";
import resolve from "@rollup/plugin-node-resolve";
import nodePolyfills from "rollup-plugin-polyfill-node";
import externals from "@yelo/rollup-node-external";

export default {
    input: "./src/index.ts",
    output: [
        {
            sourcemap: true,
            format: "esm",
            file: "./dist/index.mjs",
        },
        {
            sourcemap: true,
            format: "cjs",
            file: "./dist/index.cjs",
        },
    ],
    external: externals(),
    plugins: [
        typescript({
            browserslist: ["> 0.25%", "not dead"],
        }),
        terser({
            format: {
                comments: false,
            },
            compress: false,
        }),
        resolve({
            modulesOnly: true,
            browser: true,
        }),
        nodePolyfills(),
    ],
};
