var marked = require("marked");
var highLighter = require("highlight.js");

module.exports = function Marked(file, options) {

    // 设置默认值。
    options = Object.assign({
        tpl: '<!DOCTYPE html>\n\
<html>\n\
<head>\n\
	<meta charset="utf-8" />\n\
    <meta name="viewport" content="width=device-width,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no" />\n\
	<title></title>\n\
</head>\n\
<body>\n\
</body>\n\
</html>',
        title: true,
        highlight: true
    }, options);

    // 支持语法高亮。
    if (options.highlight && typeof options.highlight !== "function") {
        if (options.highlight !== true) {
            highLighter.configure(options.highlight);
        }
        options.highlight = function (code, lang) {
            return (lang ?
                highLighter.highlight(lang, code, true) :
                highLighter.highlightAuto(code)).value;
        };
    }

    // 更改扩展名。
    file.ext = ".html";

    // 生成。
    var content = marked(file.content, options);

    // 插入模板。
    if (options.tpl) {
        content = /<\/body[^>]*>/i.test(options.tpl) ? options.tpl.replace(/<\/body[^>]*>/i, content + '\n$&') : options.tpl + content;
    }

    // 插入标题。
    if (options.title === true) options.title = (/<h1[^>]*>(.*?)<\/h1[^>]*>/i.exec(content) || [])[1];
    if (options.title) {
        content = /<title[^>]*>(.*)<\/title[^>]*>/i.test(content) ? content.replace(/(<title[^>]*>)(.*)(<\/title[^>]*>)/i, "$1" + options.title + "$3") :
            /<head[^>]*>/i.test(content) ? content.replace(/<head[^>]*>/i, "$&<title>" + options.title + "</title>") :
                "<title>" + options.title + "</title>" + content;
    }

    // 保存。
    file.content = content;
};
