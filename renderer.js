// constants for this... constants for that... 
// someone come hit me in the head with a wiffle all bat...
const electron = require('electron');
const {ipcRenderer} = electron;
const ul = document.getElementById("toDo");

var app = require('electron').remote
var dialog = app.dialog
var fs = require('fs')

const ipc = electron.ipcRenderer

// const to make pop up add window
const BrowserWindow = electron.BrowserWindow
const Menu = electron.Menu

var toDoList = []

//to add your items on the to do list
//the guy wrote html elements in a really weird way
ipcRenderer.on('item:add', function(e, item){
    
    var toDo = item;
    toDoList.push(toDo)

    var abstract1 = document.getElementById('toDo');
    abstract1.innerHTML = "";

    for(i=0, j=toDoList.length; i<j; i++) {
        listItem = toDoList[i];
        abstract1.innerHTML +='<li>' + listItem + '</li>'
    }
    });

//to clear your entire list
ipcRenderer.on('item:clear', function(){
    ul.innerHTML='';
    if(ul.children.length == 0){
        ul.className = '';
    }
});

//to remove each item individually
ul.addEventListener('click', removeItem);

function removeItem(e){
    e.target.remove();
    if(ul.children.length == 0){
        ul.className = '';
    }
}

// ~~~~~~~~~~~~~~~for opening filewriter window ***SAVE***
document.getElementById('save').addEventListener("click", saveFile)
 
function saveFile(){
    dialog.showSaveDialog((filename)=>{
        if (filename === undefined){
            alert("Enter a file name")
            return;
        }

        var saveContent = toDoList;
        var myJSON = JSON.stringify(saveContent);

        fs.writeFile(filename, saveContent, (err)=>{
            if (err) console.log(err)
            alert("The file has been saved successfully\nOr potentially eaten by the dog.")
        })
    })

}

// for opening filestream window ***OPEN***
document.getElementById('open').addEventListener("click", openFile);

function openFile(){
    dialog.showOpenDialog((filenames) =>{
        if(filenames === undefined){
            alert("You forgot to select a file!")
            return;
        }
        readFile(filenames[0]);
        console.log("the file name is: " + openFile);
    });
}
// for reading info from file back into list
function readFile(filepath){
    fs.readFile(filepath, 'utf-8', (err, data) =>{
        if(err){
            alert("error!\nDANGER WILL ROBINSON!!\nDANGER!!!!");
            return;
        }
        var savedList = JSON.parse(data);
        for(i=0, j = savedList.length; i<j; i++){
            ipcRenderer.send('item:add', savedList);
        }
        

        console.log("the file content is: " + data); 
    })
}

document.getElementById('newItem').addEventListener("click", _=>{
    ipc.send('newWindow')
});
