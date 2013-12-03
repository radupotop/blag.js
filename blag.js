var markdown = require('markdown').markdown;
var fs = require('fs');

var contentDir = 'content/';
var outputDir = 'output/';

/**
 * Read content filed
 */
fs.readdir(contentDir, function(err, files) {
    files.forEach(function(filename) {
        if((/\.md$/).test(filename)) {
            fs.readFile(contentDir + filename, 'utf8', function(err, fileContent) {
                //~console.log(fileContent);
                var htmlContent = renderHtml(fileContent);
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
