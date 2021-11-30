module.exports = {
  'env': {
    'browser': true,
    'es2021': true,
    'node': true
  },
  'extends': [
    'eslint:recommended',
  ],
  'parser': '@typescript-eslint/parser',
  'parserOptions': {
    'ecmaVersion': 'latest',
    'sourceType': 'module'
  },
  'plugins': [
    '@typescript-eslint'
  ],
  'rules': {
    'indent': ['error', 2, { 'SwitchCase': 1 }],
    'linebreak-style': ['error', 'windows'],
    'quotes': ['error', 'single'],
    'semi': ['error', 'always'],
    'no-unused-vars': 'off',
    'object-curly-spacing': ['error', 'always'],
    'eol-last': ['error', 'always'],
    'prefer-const': 2,
    'no-use-before-define': 0,
    'no-useless-catch': 0,
    'import/no-unresolved': 0,
    'space-infix-ops': ['error'],
    'space-before-function-paren': ['error', 'never'],
    'spaced-comment': ['error', 'always'],
    'space-before-blocks': 'error',
    'padded-blocks': ['error', 'never'],
    'rest-spread-spacing': ['error', 'never'],
    'keyword-spacing': 'error',
    'no-trailing-spaces': 'error',
    'no-unneeded-ternary': 'error',
    'no-whitespace-before-property': 'error',
    'no-lone-blocks': 'error',
    'no-multi-spaces': 'error',
    'no-mixed-spaces-and-tabs': ['error', 'smart-tabs'],
    'no-multi-str': 'error',
    'no-floating-decimal': 'error',
    'comma-style': ['error', 'last'],
    'dot-location': ['error', 'property'],
    'func-call-spacing': ['error', 'never'],
    'key-spacing': 'off',
    'new-parens': 'error',
    'no-class-assign': 'error',
    'no-const-assign': 'error',
    'no-duplicate-imports': 'error',
    'array-element-newline': ['error', 'consistent'],
    'array-bracket-newline': ['error', 'consistent'],
    'object-curly-newline': ['error', { 'consistent': true }],
    'object-property-newline': [
      'error',
      {
        allowAllPropertiesOnSameLine: true,
      },
    ],
    'semi-spacing': [
      'error',
      {
        before: false,
        after: true,
      },
    ],
  }
};

