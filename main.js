/* eslint strict:0 */
'use strict'

const inquirer = require('inquirer')
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

function initialPrompt() {
  inquirer.prompt(initialQuestion, (answer) => {
    if (answer.action === 3) return
    else if (answer.action === 2) {
      console.log('Rebuilding.  Please wait...')
      fileIndex.create(() => {
        console.log('Done rebuilding')
        initialPrompt()
      })
    } else if (answer.action === 1) {
      inquirer.prompt(queryQuestion, (answers) => {
        fileSearch.search(answers.query, (fileList) => {
          let fileNumber = 0
          fileList.forEach((file) => {
            console.log(`${fileNumber}) ${file.filePath}`)
            fileNumber++
          })

          inquirer.prompt(fileResultQuestion, (selection) => {
            if (selection.fileSelection >= 0
                && selection.fileSelection < fileNumber
                && typeof Number(selection.fileSelection) === 'number') {
              const file = fileList[selection.fileSelection].filePath.replace(/\//g, '\\\\')
              console.log('Opening...')
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
    } else {
      console.log('invalid command')
      initialPrompt()
    }
  })
}

initialPrompt()
