const htmlMinifier = require('@node-minify/html-minifier');

const html = `
<!doctype html>
<html>
    <head>
        <meta charset="utf-8">
    </head>
</html>`;

minify({
  compressor: htmlMinifier,
  content: html
}).then(function(min) {
  console.log('html min');
  console.log(min);
});
