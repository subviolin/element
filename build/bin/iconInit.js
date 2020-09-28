'use strict';

var postcss = require('postcss');
var fs = require('fs');
var path = require('path');
var fontFile = fs.readFileSync(path.resolve(__dirname, '../../packages/theme-chalk/src/icon.scss'), 'utf8');
// path.resolve() 将参数从右往左执行，直到解析出一个绝对路径。直到某一参数根路径/，没有，加上当前工作目录。
// __dirname 当前模块的目录名。
// 准确找到icon.scss文件。然后读取文件。
var nodes = postcss.parse(fontFile).nodes;
var classList = [];

nodes.forEach((node) => {
  var selector = node.selector || '';
  var reg = new RegExp(/\.el-icon-([^:]+):before/); // 匹配icon.scss文件中 el-icon-xxx 的这个xxx，即图标的名称。
  var arr = selector.match(reg);

  if (arr && arr[1]) {
    classList.push(arr[1]); // 名称存入classList
  }
});

classList.reverse(); // 希望按 css 文件顺序倒序排列

fs.writeFile(path.resolve(__dirname, '../../examples/icon.json'), JSON.stringify(classList), () => {});
// 写入 icon.json文件。