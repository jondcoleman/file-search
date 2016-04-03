/* eslint strict:0 */
'use strict'

const Promise = require('bluebird')
const inquirer = Promise.promisifyAll(require('inquirer'))
const open = require('open')
const fileIndex = require('./modules/fileIndex')
const fileSearch = require('./modules/fileSearch')

const initialQuestion = [{
  name: 'action',
  message: 'What would you like to do?',
  type: 'rawlist',
  choices: [{
    name: 'Make a Query',
    value: 1
  }, {
    name: 'Rebuild Index',
    value: 2
  }, {
    name: 'Quit',
    value: 3
  }]
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

const fileResultQuestion = [{
  name: 'fileSelection',
  message: 'Which file do you want? (Type "cancel" to start over)'
}]

function queryPrompt() {
  inquirer.promptAsync(queryQuestion)
    .then((answers) => {
      fileSearch.search(answers.query, (fileList) => {
        let fileNumber = 0
        fileList.forEach((file) => {
          console.log(`${fileNumber}) ${file.filePath}`)
          fileNumber++
        })

        inquirer.promptAsync(fileResultQuestion)
          .then((selection) => {
            if (selection.fileSelection >= 0 && selection.fileSelection < fileNumber && typeof Number(selection.fileSelection) === 'number') {
              const file = fileList[selection.fileSelection].filePath.replace(/\//g, '\\\\')
              open(file)
            } else if (selection.fileSelection.toLowerCase() === 'cancel') {
              console.log('Query cancelled.')
            } else {
              console.log('Invalid selection.')
            }
            initialPrompt()
          })
      })
    })
}

function initialPrompt() {
  console.log(inquirer.prompt.toString())
  console.log(inquirer.promptAsync.toString())
  inquirer.promptAsync(initialQuestion,(a) => console.log(a))
    .then((answer) => {
      if (answer.action === 3) {
        return
      } else if (answer.action === 2) {
        console.log('Rebuilding.  Please wait...')
        fileIndex.create(() => {
          console.log('Done rebuilding')
          initialPrompt()
        })
      } else if (answer.action === 1) {
        queryPrompt()
      } else {
        console.log('invalid command')
        initialPrompt()
      }
    })
    .catch((err) => {
      throw err
    })
}

initialPrompt()
