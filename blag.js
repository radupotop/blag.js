var markdown = require('markdown').markdown;
var fs = require('fs');

var contentDir = 'content/';
var outputDir = 'output/';
var templateDir = 'template/';
var header, footer;

/**
 * Read header and footer
 */
fs.readFile(templateDir + 'header.html', 'utf8', function(err, data) {
    header = data;
});

fs.readFile(templateDir + 'footer.html', 'utf8', function(err, data) {
    footer = data;
});

/**
 * Read content filed
 */
fs.readdir(contentDir, function(err, files) {
    files.forEach(function(filename) {
        if((/\.md$/).test(filename)) {
            fs.readFile(contentDir + filename, 'utf8', function(err, fileContent) {
                //~console.log(fileContent);
                var htmlBody = renderHtml(fileContent);
                var htmlContent = header + htmlBody + footer;
                fs.writeFile(outputDir + filename.replace('.md', '.html'), htmlContent);
            });
        }
    });
});

/**
 * Render MD as HTML
 */
function renderHtml(mdContent) {
   return markdown.toHTML(mdContent);
}
