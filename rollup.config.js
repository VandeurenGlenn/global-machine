import cleanup from 'rollup-plugin-cleanup';
import {terser} from 'rollup-plugin-terser';

export default [{
  input: 'index.js',
  output: {
    file: './dist/index.js',
    format: 'cjs',
  	experimentalCodeSplitting: true
  },
  treeshake: true,
  plugins: [
    cleanup(),
    terser()
  ]
}]
