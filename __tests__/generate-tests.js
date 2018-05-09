'use strict'
const fs = require('fs')
const path = require('path')
const shell = require('shelljs')
const generateHtml = require('../generate-html.js')

const test_input_path = path.join(__dirname, 'test_files')
const test_output_path = path.join(__dirname, 'output')

describe('Generate html tests', () => {
    beforeAll(() => {
        shell.rm('-rf', test_output_path)
        shell.mkdir('-p', test_output_path)
    })

    test('default filemask processes correct # of files', () => {
        generateHtml(test_output_path, test_input_path)

        let output_files = shell.ls(path.join(test_output_path, '*.html'))
        expect(output_files.length).toBe(2)
    })
})
