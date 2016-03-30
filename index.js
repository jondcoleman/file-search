'use strict'

const fs = require('fs')
const nodepath = require('path')
const recursive = require('recursive-readdir')
const jsonFile = require('jsonfile')
const inquirer = require('inquirer')

const config = require('./config.js')

const myPaths = config.filePaths
const indexFile = './fileIndex.json'

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
        console.log(fileName)
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
    console.log('written')
    callback()
  })
}

function filterFileList(list, query) {
  return list.filter(file => {
    return file.fileName.indexOf(query) >= 0
  })
}

function searchFile(query, file) {
  jsonFile.readFile(file, (err, list) => {
    if (err) throw err
    console.log(filterFileList(list.files, query))
      // console.log(list)
  })
}

// application
deleteIndexFile(indexFile)
createIndexData(myPaths, function() {
  createIndexFile(indexFile, fileData, function() {
    inquirer.prompt(questions, (answers) => {
      searchFile(answers.query, indexFile)
    })
  })
})
