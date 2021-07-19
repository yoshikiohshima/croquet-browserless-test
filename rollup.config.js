import { terser } from 'rollup-plugin-terser';

const config = {
    plugins: [
        terser({
            mangle: {
                module: true
            },
            format: {quote_style: 3}
        }),
    ]
};

export default config;
