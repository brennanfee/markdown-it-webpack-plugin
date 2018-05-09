'use strict'
const path = require('path')
const generateHtml = require('generate-html.js')

let rootPath = path.resolve(__dirname, '..')

class MarkdownItWebpackPlugin {
    constructor(options) {
        this.options = options
    }

    apply(compiler) {
        compiler.hooks.emit.tap('MarkdownItWebpackPlugin', compilation => {
            generateHtml(
                options.outputPath,
                options.searchPath,
                options.fileMask,
                options.template,
                options.markdownItOptions,
                options.markdownItPlugins
            )
        })
    }
}

module.exports = MarkdownItWebpackPlugin
