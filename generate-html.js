'use strict'
const fs = require('fs')
const path = require('path')
const shell = require('shelljs')
const MarkdownIt = require('markdown-it')
const Mustache = require('mustache')

let default_template = path.join(__dirname, 'default_template.html')

function generateHtml(
    outputPath,
    searchPath,
    fileMask,
    templateFile,
    markdownItOptions,
    markdownItPlugins
) {
    if (!fileMask) {
        fileMask = /\.md$/
    }

    let files = shell.find(searchPath).filter(file => {
        return file.match(fileMask)
    })

    let templateContent = ''
    if (templateFile) {
        templateContent = fs.readFileSync(templateFile, { encoding: 'utf8' })
    } else {
        templateContent = fs.readFileSync(default_template, { encoding: 'utf8' })
    }

    if (!markdownItOptions) {
        markdownItOptions = {
            html: true,
            linkify: true,
            typographer: true,
        }
    }

    const md = new MarkdownIt(markdownItOptions)

    if (markdownItPlugins & Array.isArray(markdownItPlugins)) {
        markdownItPlugins.forEach(plugin => {
            if (typeof plugin === 'string') {
                md.use(plugin)
            } else {
                md.use(plugin.name, plugin.options)
            }
        })
    }

    files.forEach(file => {
        let markdown = fs.readFileSync(file, { encoding: 'utf8' })
        let rendered_markdown = md.render(markdown)

        let view = {
            htmlContent: rendered_markdown,
        }

        let html_result = Mustache.render(templateContent, view)

        let path_parsed = path.parse(file)
        let relative_part = path_parsed.dir.replace(searchPath, '')
        let output_path = path.join(outputPath, relative_part)
        let output_file = path.join(output_path, `${path_parsed.name}.html`)

        shell.mkdir('-p', output_path)

        fs.writeFileSync(output_file, html_result, {
            encoding: 'utf8',
        })
    })
}

module.exports = generateHtml
