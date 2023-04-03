import { terser } from 'rollup-plugin-terser'
import filesize from 'rollup-plugin-filesize'

export default [
  {
    input: 'src/index.js',
    plugins: [terser(), filesize()],
    output: {
      sourcemap: true, //can pass 'inline' for inline source maps
      file: 'dist/shopify-rich-text-renderer.min.js',
      format: 'umd',
      name: 'convertSchemaToHtml',
    },
  },
  {
    input: 'src/index.js',
    plugins: [terser(), filesize()],
    output: {
      sourcemap: true, //can pass 'inline' for inline source maps
      file: 'dist/shopify-rich-text-renderer.esm.min.js',
      format: 'es',
    },
  },
]
