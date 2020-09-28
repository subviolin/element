// 根据components.json 将组件的样式文件导入到index.scss，新增组件时，无需手动引入新增组件的样式。
var fs = require('fs');
var path = require('path');
var Components = require('../../components.json');
var themes = [
  'theme-chalk'
];
Components = Object.keys(Components);
var basepath = path.resolve(__dirname, '../../packages/');

function fileExists(filePath) { // 判断文件是否存在
  try {
    return fs.statSync(filePath).isFile(); // isFile()：fs.statSync()描述普通的文件，则返回true。
  } catch (err) {
    return false;
  }
}

themes.forEach((theme) => {
  var isSCSS = theme !== 'theme-default'; // theme : 'theme-chalk'
  var indexContent = isSCSS ? '@import "./base.scss";\n' : '@import "./base.css";\n'; // 单独引入
  Components.forEach(function(key) {
    if (['icon', 'option', 'option-group'].indexOf(key) > -1) return;
    var fileName = key + (isSCSS ? '.scss' : '.css');
    indexContent += '@import "./' + fileName + '";\n'; // 导入组件的样式文件.scss或.css
    var filePath = path.resolve(basepath, theme, 'src', fileName);
    if (!fileExists(filePath)) {
      fs.writeFileSync(filePath, '', 'utf8');
      console.log(theme, ' 创建遗漏的 ', fileName, ' 文件');
    }
  });
  fs.writeFileSync(path.resolve(basepath, theme, 'src', isSCSS ? 'index.scss' : 'index.css'), indexContent); // 将组件的样式文件自动导入到 ../../packages/theme-chalk/src/index.scss 中
});
