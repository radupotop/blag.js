var markdown = require('markdown').markdown;
var fs = require('fs');

var contentDir = 'content/';
var outputDir = 'output/';
var templateDir = 'template/';
var header, footer;
var pages = [];
var mdFiles = [];

/**
 * Read header and footer
 */
var header = fs.readFileSync(templateDir + 'header.html', 'utf8');
var footer = fs.readFileSync(templateDir + 'footer.html', 'utf8');

/**
 * Read content dir
 */
function readDir() {
    fs.readdir(contentDir, function(err, allFiles) {
        
        mdFiles = allFiles.filter(function(filename){
            return (/\.md$/).test(filename);
        });
        
        mdFiles.forEach(parseFile);
        
    });
}

/**
 * Parse each Markdown file
 */
function parseFile(filename, i, array) {
    
    var htmlFilename = filename.replace('.md', '.html');
    
    fs.readFile(contentDir + filename, 'utf8', function(err, fileContent) {
        
        var content = parseContent(fileContent);
        
        if(content.meta.draft || content.meta.type != 'post') {
            return;
        }
        
        pages.push({
            'meta': content.meta,
            'filename': htmlFilename
        });
        
        var htmlBody = renderHtml(content.body);
        var htmlContent = header + htmlBody + footer;
        fs.writeFile(outputDir + htmlFilename, htmlContent);
        
        generateIndex();
        
    });
    
}

/**
 * Parse content into meta
 */
function parseContent(content) {
    var nlIndex = content.indexOf('\n');
    return {
        'meta': JSON.parse(content.substring(0, nlIndex)),
        'body': content.substring(nlIndex)
    }
}

/**
 * Render MD as HTML
 */
function renderHtml(mdContent) {
   return markdown.toHTML(mdContent);
}

/**
 * Generate index.html
 */
function generateIndex() {
    var body = '';
    pages.forEach(function(page) {
        body += '<a href="'+page.filename+'">'+page.meta.title+'</a> <em class="date">'+page.meta.date+'</em><br>';
    });
    fs.writeFile(outputDir + 'index.html', header + body + footer);
}


readDir();
