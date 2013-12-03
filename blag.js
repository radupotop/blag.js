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
 * Read content dir
 */
function readDir() {
    fs.readdir(contentDir, function(err, files) {
        files.forEach(parseFile);
    });
}

/**
 * Parse each Markdown file
 */
function parseFile(filename) {
    
    if((/\.md$/).test(filename) === false) {
        return;
    }
    
    var htmlFilename = filename.replace('.md', '.html');
    
    fs.readFile(contentDir + filename, 'utf8', function(err, fileContent) {
        var htmlBody = renderHtml(fileContent);
        var htmlContent = header + htmlBody + footer;
        fs.writeFile(outputDir + htmlFilename, htmlContent);
    });
    
}

/**
 * Render MD as HTML
 */
function renderHtml(mdContent) {
   return markdown.toHTML(mdContent);
}


readDir();
