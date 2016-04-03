/* eslint strict:0 */
'use strict'
const Promise = require('bluebird')
const jsonFile = Promise.promisifyAll(require('jsonfile'))
const indexFile = './data/files.json'

function filterFileList(list, query) {
  return list.filter(file => {
    return file.fileName.toLowerCase().indexOf(query.toLowerCase()) >= 0
  })
}

module.exports = {
  search: (query, callback) => {
    console.log(jsonFile.readFileAsync)
    jsonFile.readFileAsync(indexFile)
    .then((list) => {
      const filteredFileList = filterFileList(list.files, query)
      callback(filteredFileList)
    })
    .error((err) => {
      throw err
    })
  }
}
