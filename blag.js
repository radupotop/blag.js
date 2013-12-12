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
        
        allFiles.forEach(function(filename) {
            if((/\.md$/).test(filename)) {
                mdFiles.push(filename.replace('.md', ''));
            }
        });
        
        mdFiles.forEach(parseFile);
        
    });
}

/**
 * Parse each Markdown file
 */
function parseFile(filename, i, array) {
    
    fs.readFile(contentDir + filename + '.md', 'utf8', function(err, fileContent) {
        
        var content = parseContent(fileContent);
        
        if(!content.meta.draft && content.meta.type == 'post') {
            
            pages.push({
                'meta': content.meta,
                'filename': filename
            });
            
            var htmlContent = renderHtml(content.body);
            writeFile(filename + '.html', htmlContent);
            
            generateIndex();
            
        }
        
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
    };
}

/**
 * Render MD as HTML
 */
function renderHtml(mdContent) {
    return header + markdown.toHTML(mdContent) + footer;
}

/**
 * Write output file
 */
function writeFile(htmlFilename, htmlContent) {
    fs.writeFile(outputDir + htmlFilename, htmlContent);
}

/**
 * Generate index markdown
 */
function generateIndex() {
    var body = '';
    pages.forEach(function(page) {
        body += '<a href="'+page.filename+'.html">'+page.meta.title+'</a> <em class="date">'+page.meta.date+'</em><br>';
    });
    writeFile('index.html', header + body + footer);
}


readDir();
