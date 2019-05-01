// http://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    node: true,
    es6: true
  },
  // https://github.com/standard/standard/blob/master/docs/RULES-en.md
  extends: 'airbnb-base', // eslint-config-airbnb-base
  // 规则 在这里您可以配置规则，让哪些规则进行校验，哪些不进行校验，哪些显示错误级别，哪些显示警告级别等等
  rules: {
    // error
    'func-style': ['error', 'declaration', { allowArrowFunctions: true }],
    quotes: ['error', 'single', { allowTemplateLiterals: true }],
    // warn
    'import/first': 'warn', // import 放在文件头
    'spaced-comment': 'warn', // 注释要含有空格
    camelcase: 'warn', // 驼峰命名
    'max-len': ['warn', { code: 150 }],
    'operator-assignment': 'warn',
    'prefer-destructuring': 'warn',
    'prefer-template': 'warn',
    'eol-last': 'warn',
    'object-curly-spacing': 'warn',
    'no-return-assign': 'warn',
    // off
    'no-underscore-dangle': 'off',
    'object-curly-newline': 'off',
    'comma-dangle': 'off',
    'linebreak-style': 'off',
    'no-restricted-syntax': 'off',
    radix: 'off',
    'consistent-return': 'off',
    'no-plusplus': 'off',
    'import/prefer-default-export': 'off',
    'arrow-parens': 'off',
    "indent": ["error", 4]
  }
}
