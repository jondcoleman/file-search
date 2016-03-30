/* eslint strict:0 */

'use strict'

const fs = require('fs')
const nodepath = require('path')
const recursive = require('recursive-readdir')
const jsonFile = require('jsonfile')
const inquirer = require('inquirer')

const config = require('./config.js')

const myPaths = config.filePaths
const indexFile = './fileIndex.json'

const initialQuestions = [{
  name: 'action',
  message: 'What would you like to do?',
  type: 'rawlist',
  choices: [
    { name: 'Rebuild Index', value: '1', short: '1' },
    { name: 'Make a Query', value: '2', short: '2' },
  ]
}]

const questions = [{
  name: 'query',
  message: 'What\'s your query?',
  validate: (input) => {
    if (input.length < 1) {
      return false
    }
    return true
  }
}]

const fileData = {
  files: []
}

// functions

function deleteIndexFile(file) {
  fs.exists(file, (exists) => {
    if (exists) fs.unlink(file)
  })
}

function filterPaths(paths) {
  return paths.filter((path) => {
    try {
      fs.accessSync(path, fs.R_OK)
      return true
    } catch (e) {
      return false
    }
  })
}

function createIndexData(paths, callback) {
  let counter = 0
  const filteredPaths = filterPaths(paths)
  filteredPaths.forEach((path) => {
    recursive(path, (err, files) => {
      if (err) throw err
      files.forEach(file => {
        const fileName = nodepath.basename(file)
        process.stdout.write(`${fileName}\r`)
        const formattedPath = file.toString().split('\\').join('/')
        fileData.files.push({
          fileName,
          filePath: formattedPath
        })
      })
      counter++
      if (counter === filteredPaths.length) {
        callback()
      }
    })
  })
}

function createIndexFile(filePath, data, callback) {
  jsonFile.writeFile(filePath, data, (error) => {
    if (error) throw error
    console.log('\nwritten')
    callback()
  })
}

function filterFileList(list, query) {
  return list.filter(file => {
    return file.fileName.toLowerCase().indexOf(query.toLowerCase()) >= 0
  })
}

function searchFile(query, file, callback) {
  jsonFile.readFile(file, (err, list) => {
    if (err) throw err
    const filteredFileList = filterFileList(list.files, query)
    callback(filteredFileList)
  })
}

function initialPrompt() {
  inquirer.prompt(initialQuestions, (answer) => {
    if (answer.action === '1') {
      console.log('Rebuilding.  Please wait...')
      deleteIndexFile(indexFile)
      createIndexData(myPaths, () => {
        createIndexFile(indexFile, fileData, () => {
          console.log('Index rebuilt.')
          initialPrompt()
        })
      })
    } else if (answer.action === '2') {
      inquirer.prompt(questions, (answers) => {
        searchFile(answers.query, indexFile, (fileList) => {
          console.log(fileList)
          initialPrompt()
        })
      })
    } else {
      console.log('invalid command')
      initialPrompt()
    }
  })
}

// application
initialPrompt()
