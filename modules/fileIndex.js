/* eslint strict:0 */
'use strict'

const fs = require('fs')
const nodepath = require('path')
const recursive = require('recursive-readdir')
const jsonFile = require('jsonfile')
const config = require('../config.js')
const myPaths = config.filePaths
const indexFile = './data/files.json'

const fileData = {
  files: []
}

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
  let pathCounter = 0
  let fileCounter = 0
  const filteredPaths = filterPaths(paths)
  filteredPaths.forEach((path) => {
    console.log(`Indexing path: ${path}`)
    recursive(path, (err, files) => {
      if (err) throw err
      files.forEach(file => {
        const fileName = nodepath.basename(file)
        const formattedPath = file.toString().split('\\').join('/')
        fileData.files.push({
          fileName,
          filePath: formattedPath
        })
        fileCounter++
        process.stdout.write(`Files Indexed: ${fileCounter}\r`)
      })
      pathCounter++
      if (pathCounter === filteredPaths.length) {
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

module.exports = {
  delete: (file) => {
    fs.exists(file, (exists) => {
      if (exists) fs.unlink(file)
    })
  },
  create: (callback) => {
    deleteIndexFile(indexFile)
    createIndexData(myPaths, () => {
      createIndexFile(indexFile, fileData, () => {
        callback()
      })
    })
  }
}
