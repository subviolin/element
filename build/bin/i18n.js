// 官网首页的国际化：遍历examples/i18n/page.json，根据数据结构匹配tpl文件的标志位，如：examples/pages/template/x.tpl 模板文件，生成各种语言的.vue文件。
'use strict';

var fs = require('fs');
var path = require('path');
var langConfig = require('../../examples/i18n/page.json');

langConfig.forEach(lang => {
  try {
    fs.statSync(path.resolve(__dirname, `../../examples/pages/${ lang.lang }`)); // 判断目录是否存在
  } catch (e) {
    fs.mkdirSync(path.resolve(__dirname, `../../examples/pages/${ lang.lang }`)); // 创建目录
  }

  Object.keys(lang.pages).forEach(page => {
    var templatePath = path.resolve(__dirname, `../../examples/pages/template/${ page }.tpl`); // 模板文件.tpl
    var outputPath = path.resolve(__dirname, `../../examples/pages/${ lang.lang }/${ page }.vue`); // 创建国际化文件
    var content = fs.readFileSync(templatePath, 'utf8');
    var pairs = lang.pages[page]; // i18n/page.json文件中的'1':xxx

    Object.keys(pairs).forEach(key => {
      content = content.replace(new RegExp(`<%=\\s*${ key }\\s*>`, 'g'), pairs[key]); // 匹配并替换模板中相应位置文字
    });

    fs.writeFileSync(outputPath, content); // 生成examples/pages/en-US/根据${page}.tpl生成的.vue文件。
  });
});
