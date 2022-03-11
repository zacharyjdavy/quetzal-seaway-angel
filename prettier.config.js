module.exports = {
  singleQuote: true, // https://prettier.io/docs/en/options.html#quotes
  overrides: [
    {
      files: '*.html',
      options: {
        parser: 'html',
      },
    },
  ],
};
