var markdown = require('markdown').markdown;
var fs = require('fs');

var contentDir = 'content/';
var outputDir = 'output/';
var templateDir = 'template/';

var mdFiles = [];
var posts = [];

/**
 * Read template
 */
var template = fs.readFile(templateDir + 'index.html', 'utf8', readDir);

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
    
    fs.readFile(contentDir + 'sidebar.md', 'utf8', function(err, fileContents) {
        var sidebar = parseContent(fileContent);
    });
    
    fs.readFile(contentDir + filename + '.md', 'utf8', function(err, fileContent) {
        
        var content = parseContent(fileContent);
        
        if(!content.meta.draft && content.meta.type == 'post') {
            
            posts.push({
                'meta': content.meta,
                'filename': filename
            });
            
            
            var htmlContent = renderTpl([
                {
                    'key': 'title',
                    'value': content.meta.title
                },
                {
                    'key': 'content',
                    'value': content.body
                }
            ]);
            writeFile(filename + '.html', htmlContent);
            
            generatePostList();
            
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
        'body': markdown.toHTML(content.substring(nlIndex))
    };
}

/**
 * Render template
 */
function renderTpl(blocks) {
    var tpl = '';
    blocks.forEach(function(content, key) {
        tpl += template.replace('{{'+key+'}}', content);
    });
    return tpl;
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
function generatePostList() {
    var body = '';
    posts.forEach(function(page) {
        body += '<a href="'+page.filename+'.html">'+page.meta.title+'</a> <em class="date">'+page.meta.date+'</em><br>';
    });
    return body;
}
