import ts from 'rollup-plugin-ts';
import { terser } from 'rollup-plugin-terser';

export default {
    plugins: [
        ts({
            "browserslist": ["> 0.25%", "not dead"]
        }),
        terser({
            format: {
                comments: false
            },
            compress: false
        })
    ]
};
