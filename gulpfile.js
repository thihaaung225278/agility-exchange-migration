'use strict';

const build = require('@microsoft/sp-build-web');

build.addSuppression(`Warning - [sass] The local CSS class 'ms-Grid' is not camelCase and will not be type-safe.`);

var getTasks = build.rig.getTasks;
build.rig.getTasks = function () {
  var result = getTasks.call(build.rig);

  result.set('serve', result.get('serve-deprecated'));

  return result;
};

build.initialize(require('gulp'));

// gulp FILE_LOADER_EXTENSIONS omits webp; copy src assets into lib for webpack
const { FILE_LOADER_EXTENSIONS } = require('@microsoft/sp-build-core-tasks/lib/webpack/ConfigureWebpackTask');
build.copyStaticAssets.setConfig({
  includeExtensions: [...FILE_LOADER_EXTENSIONS, 'resx', 'webp']
});
