requirejs.config({
  baseURL: 'js/lib',
  paths: {
    app: './app',
    'victor': './lib/victor',
    'matter': './lib/matter'
  },
  packages: [
    {
      name:'physicsjs',
      location: './lib/physicsjs/dist',
      main: 'physicsjs-full.min'
    }
  ]
});

requirejs(['app/main']);
