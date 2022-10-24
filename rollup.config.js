import typescript from 'rollup-plugin-ts';
import resolve from '@rollup/plugin-node-resolve';
import externals from '@yelo/rollup-node-external';

export default {
    input: './src/index.ts',
    output: [
        {
            sourcemap: true,
            format: 'esm',
            file: './dist/index.mjs',
        },
        {
            sourcemap: true,
            format: 'cjs',
            file: './dist/index.cjs',
        },
    ],
    external: externals(),
    plugins: [
        typescript({
            browserslist: ['> 0.25%', 'not dead'],
        }),
        resolve({
            modulesOnly: true,
            browser: true,
        }),
    ],
};
