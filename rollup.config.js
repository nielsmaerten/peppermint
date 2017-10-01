import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import sourceMaps from 'rollup-plugin-sourcemaps'
const pkg = require('./package.json')
const camelCase = require('lodash.camelcase')

const libraryName = 'peppermint'

export default {
  input: `compiled/${libraryName}.js`,
  output: [{
      file: pkg.main,
      name: camelCase(libraryName),
      format: 'umd'
    },
    {
      file: pkg.module,
      format: 'es'
    }
  ],
  sourcemapFile: true,
  // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
  external: [],
  plugins: [
    // Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
    commonjs(),

    // Resolve source maps to the original source
    sourceMaps()
  ]
}
