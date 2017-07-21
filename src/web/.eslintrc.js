// http://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module'
  },
  env: {
    browser: true,
  },
  // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
  extends: 'eslint:recommended',
  // required to lint *.vue files
  plugins: [
    "standard",
    "promise",
    'html'
  ],
  // add your custom rules here
  'rules': {
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow semi colons
    'semi': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-console': process.env.NODE_ENV === 'production' ? 2 : 0,
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    // disable no unused vars
    "no-unused-vars": 0,
    // allow any indent
    "indent": 0,
    // allow function parenthesis to have no space
    "space-before-function-paren": 0
  }
}
