var fs = require('fs');
var save = require('file-save'); // Streaming data to file and save it using Stream.(the module will make directory itself if the directory is not exist).
var resolve = require('path').resolve; // 解析为绝对路径，给定的路径序列从右往左被处理。
var basename = require('path').basename; // 提取出用 ‘/' 隔开的path的最后一部分
var localePath = resolve(__dirname, '../../src/locale/lang'); // 转换成目录在当前环境中的绝对路径
var fileList = fs.readdirSync(localePath); // 读取目录：src/locale/lang

var transform = function(filename, name, cb) {
  require('babel-core').transformFile(resolve(localePath, filename), {
    plugins: [
      'add-module-exports',
      ['transform-es2015-modules-umd', {loose: true}]
    ],
    moduleId: name // 指定模块ID的自定义名称
  }, cb);
}; // babel.transformFile(filename: string, options?: Object, callback: Function) 异步转译文件中的全部内容。

fileList
  .filter(function(file) {
    return /\.js$/.test(file);
  })
  .forEach(function(file) {
    var name = basename(file, '.js');

    transform(file, name, function(err, result) { // babel转码所有src/locale/lang的js文件。
      if (err) {
        console.error(err);
      } else {
        var code = result.code;

        code = code
          .replace('define(\'', 'define(\'element/locale/')
          .replace('global.', 'global.ELEMENT.lang = global.ELEMENT.lang || {}; \n    global.ELEMENT.lang.');
        save(resolve(__dirname, '../../lib/umd/locale', file)).write(code); // 存放在lib/umd/locale目录下

        console.log(file);
      }
    });
  });
