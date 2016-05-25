## File Search Utility

### Set Up

Download or clone the repo, then, in your terminal, run `npm install` to install the required modules.

In order to use this project you must create a `config.json` file.  A sample is included in the project.

`directoryPaths` should be the paths that you want to index. You can index mapped drives too but the mapped drive must be connected at the time that you index or it will be skipped.

`ignoredFiles` are specific file names that you want to exclude from being indexed.  You can use wildcard character `*` in the file name to exclude various files that match.

`ignoredDirectories` are names of directories (not the path) that you want to exclude.

### Use

To run the application open a console in the project directory and run `node main.js`

You must first rebuild your index.

Then you can run queries on the indexed files.  Currently, it does a simple exact match for your query within the file name.
