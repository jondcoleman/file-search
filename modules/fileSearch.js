/* eslint strict:0 */
'use strict'

const jsonFile = require('jsonfile')
const indexFile = './data/files.json'

function filterFileList(list, query) {
  return list.filter(file => {
    return file.fileName.toLowerCase().indexOf(query.toLowerCase()) >= 0
  })
}

module.exports = {
  search: (query, callback) => {
    jsonFile.readFile(indexFile, (err, list) => {
      if (err) throw err
      const filteredFileList = filterFileList(list.files, query)
      callback(filteredFileList)
    })
  }
}
