import react from '@vitejs/plugin-react';
import { transformWithEsbuild } from 'vite';
import { terser } from "rollup-plugin-terser";
import restart from 'vite-plugin-restart';
import glsl from 'vite-plugin-glsl';


export default {
    root: 'src/',
    publicDir: '../public/',
    base: './',
    define: {
        "process.env.NODE_ENV": '"production"'
      },
    resolve: {
        alias: {
            'lottie.js': '/node_modules/three-stdlib/libs/lottie.js' // Asegura que no haya cambios inesperados
        }
    },
    plugins:
    [
        // Restart server on static/public file change
        restart({ restart: [ '../public/**', ] }),

        // React support
        react(),

        // GLSL support
        glsl(),

        // .js file support as if it was JSX
        {
            name: 'load+transform-js-files-as-jsx',
            async transform(code, id)
            {
                if (!id.match(/src\/.*\.js$/))
                    return null

                return transformWithEsbuild(code, id, {
                    loader: 'jsx',
                    jsx: 'automatic',
                });
            },
        },
        terser({
            compress: {
              unsafe: true,
              drop_debugger: true,
              drop_console: true,
              evaluate: false // Desactiva la evaluación de `eval()`
            }
          })
    ],

    server:
    {
        host: true, // Open to local network and display URL
        open: !('SANDBOX_URL' in process.env || 'CODESANDBOX_HOST' in process.env) // Open if it's not a CodeSandbox
    },
    build:
    {
        outDir: '../dist', // Output in the dist/ folder
        emptyOutDir: true, // Empty the folder first
        sourcemap: true, // Add sourcemap
        chunkSizeWarningLimit: 1500, // Aumentar el límite del aviso (opcional)
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        if (id.includes('react')) return 'vendor-react';
                        if (id.includes('lodash')) return 'vendor-lodash';
                        if (id.includes('three')) return 'vendor-three';
                        return 'vendor';
                    }
                },
            },
        },
    },
};