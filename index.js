const fs = require('fs')
const path = require('path')
const recursive = require('recursive-readdir')
// const searchIndex = require('search-index')
const jsonFile = require('jsonfile')
const config = require('./config.js')

const myPath = config.filePath
const indexFile = './fileIndex.json'

const fileData = { files: [] }

fs.exists(indexFile, (exists) => {
  if (exists) fs.unlink(indexFile)
})

recursive(myPath, (err, files) => {
  if (err) throw err
  files.forEach(file => {
    const formattedPath = file.toString().split('\\').join('/')
    fileData.files.push({
      fileName: path.basename(file),
      filePath: formattedPath
    })
  })
})


const filterFileList = (list, query) => {
  return list.filter(file => {
    return file.fileName.indexOf(query) >= 0
  })
}

const searchFile = (query, file) => {
  jsonFile.readFile(file, (err, list) => {
    if (err) throw err

    console.log(filterFileList(list.files, query))
  })
}

jsonFile.writeFile(indexFile, fileData, (error) => {
  if (error) throw error
  console.log('written')
  searchFile('sql', indexFile)
})

// function addToIndex(filePath) {
//   searchIndex(filePath, (err, si) => {
//     // si.search(q, (error, results) => {
//     //   if (error) console.log(error)
//     //   // console.log(results)
//     // })
//     console.log(si)
//   })
// }

// const q = {
//   query: { '*': ['sql'] },
//   facets:
// }
