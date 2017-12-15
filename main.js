const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const Menu = electron.Menu
const ipc = electron.ipcMain
const ipcMain = electron.ipcMain

// var dialog = app.dialog
// var fs = require('fs')

app.on('ready', function(){
    //create the main window
    mainWindow = new BrowserWindow({
        height : 420,
        width : 420
    })

    mainWindow.loadURL(`file://${__dirname}/index.html`);
    mainWindow.on('closed', function(){
        app.quit();
    })

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu)

    //ensures that when you close the main window, even the child windows close
    mainWindow.on('closed', _=>{
        console.log('closed');
        mainWindow = null
    })


})


//make new window for input (smaller than default)
//document.getElementById('create').addEventListener("click", createAddWindow)
function createAddWindow(){
addWindow = new BrowserWindow({
    height: 200,
    width: 350
})
//load new window that was just created
    addWindow.loadURL(`file://${__dirname}/formGUI.html`);
}


const template = [
    {
        label: "Add",
        submenu: [
            {
                label: 'Open',
                click(){
                    createAddWindow()
                }
            },{type : 'separator'},
            {
                label: 'Add Item',
                click(){
                    createAddWindow()
                }
            },{type : 'separator'},
            {
                label: 'Clear Items',
                click(){
                    mainWindow.webContents.send('item:clear');
                }
            },{type : 'separator'},
            {
                label: 'Quit',
                click: _=>{
                    app.quit()
                },
                accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q'
            }
        ]
    },
    {
        label: "Dev Tools",
        click: function(item, focusedWindow){
            focusedWindow.toggleDevTools()
        },
        accelerator: process.platform == 'darwin' ? 'Command+I' : "Ctrl+I",
    },{role: 'reload'}
]

//to catch item:add from microWindow
ipcMain.on('item:add', function(e, item){
    mainWindow.webContents.send('item:add', item)
    // addWindow.close()
});

// to catch the event sent from renderer.js to fire the createAddWindow function.
// ipcMain.on('newWindow', (evt, arg), _=>{
//     createAddWindow();
// });

//for those peaky mac users!
if(process.platform == 'darwin'){
    mainMenuTemplate.unshift({});
}