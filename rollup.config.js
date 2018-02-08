import babel from 'rollup-plugin-babel'
import nodeResolve from 'rollup-plugin-node-resolve'
import replace from 'rollup-plugin-replace'
import uglify from 'rollup-plugin-uglify'

export default {
  external: ['infestines', 'partial.lenses'],
  output: {
    globals: {
      infestines: 'I',
      'partial.lenses': 'L'
    }
  },
  plugins: [
    process.env.NODE_ENV &&
      replace({'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)}),
    nodeResolve({modulesOnly: true}),
    babel(),
    process.env.NODE_ENV === 'production' &&
      uglify({
        compress: {
          hoist_funs: true,
          passes: 3,
          pure_getters: true,
          pure_funcs: ['require']
        }
      })
  ].filter(x => x)
}
