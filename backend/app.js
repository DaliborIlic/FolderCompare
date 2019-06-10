var express = require('express');
var cors = require('cors'); // Use cors module for enable Cross-origin resource sharing
var dircompare = require('dir-compare'); // The main staple: dir-compare library - https://github.com/gliviu/dir-compare
var format = require('util').format;
var pathUtils = require('path');

var app = express();
app.use(cors()); // for all routes

var port = process.env.PORT || 8080;

/* function to form a flat array of dirs and files with their properties */
function formArray(res) {
  var formedArr = [];
  var id = 0;
  res.diffSet.forEach(entry => {
    /* states are used to form CSS classes if frontend to represent differences with color,
       possible values: 'equal', 'left', 'right', 'distinct' */
    var state = entry.state;
    /* stop branching if folder found only on the left side - make that node a 'leaf' with no children */
    var isLeaf = (entry.type1 == 'directory' && state !== 'left') ?  false : true; 
    var icon = (entry.type1 == 'directory') ? '' : 'tree-file';
    formedArr.push({
      id: id,
      icon: icon, 
      state: state,      
      name1: entry.name1 ? entry.name1 : '',
      size1: entry.size1 ? entry.size1 : '',
      path1: entry.path1 ? entry.path1 : '',
      name2: entry.name2 ? entry.name2 : '',
      size2: entry.size2 ? entry.size2 : '',
      path2: entry.path2 ? entry.path2 : '',
      isLeaf: isLeaf,
      draggable: false,
      opened: false
    });
    id++;
  });
  return formedArr;
}  

/* API route */
app.get('/api', function(req, res) {
    //get API data by path
    var options = {compareSize: true, skipSubdirs: true};    
    var path1 = req.query.path1 ? req.query.path1 : 'dir1'; // deafult folders, provided
    var path2 = req.query.path2 ? req.query.path2 : 'dir2'; // TODO: upload for comparison?
    /* this is where it all happens on a GET request:
    1. dircompare runs the comparison based on paths and returns the comparison results
    2. the array is formed off the comparison results
    3. the resulting array is supplied as JSON 
        3.   2.        1.
        ↓    ↓         ↓                                               */
    res.json(formArray(dircompare.compareSync(path1, path2, options))); 
}) 

app.listen(port, function() {
    console.log('Node.js listening on port ' + port)
})