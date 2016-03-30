/* eslint strict:0 */
'use strict'

const jsonFile = require('jsonfile')
const inquirer = require('inquirer')
const fileIndex = require('./modules/fileIndex')
//const indexFile = './data/files.json'
const initialQuestion = [{
  name: 'action',
  message: 'What would you like to do?',
  type: 'rawlist',
  choices: [
    { name: 'Rebuild Index', value: '1', short: '1' },
    { name: 'Make a Query', value: '2', short: '2' },
  ]
}]
const queryQuestion = [{
  name: 'query',
  message: 'What\'s your query?',
  validate: (input) => {
    if (input.length < 1) {
      return false
    }
    return true
  }
}]

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
  inquirer.prompt(initialQuestion, (answer) => {
    if (answer.action === '1') {
      console.log('Rebuilding.  Please wait...')
      fileIndex.create(() => {
        console.log('Done rebuilding')
        initialPrompt()
      })
    } else if (answer.action === '2') {
      inquirer.prompt(queryQuestion, (answers) => {
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
