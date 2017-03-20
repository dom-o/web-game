requirejs.config({
  baseURL: 'js/lib',
  paths: {
    app: './app',
    'victor': './lib/victor'
  }
});

requirejs(['app/main']);
