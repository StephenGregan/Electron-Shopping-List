	const electron = require('electron');
	const path = require('path');
	const url = require('url');

	// Set enviorment
	process.env.NODE_ENV = 'development';

	const {app, BrowserWindow, Menu, ipcMain} = electron;

	let mainWindow;
	let addWindow;

	// Listen for app to be ready
	app.on('ready', function(){
		mainWindow = new BrowserWindow({});
		// Load HTML in window
		mainWindow.loadURL(url.format({
			pathname: path.join(__dirname, 'mainWindow.html'),
			protocol: 'file',
			slashes: true
		}));

		// Quit app when closed
		mainWindow.on('closed', function({
			app.quit();
		});
		// Build menu from template
		const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
		// Insert menu
		Menu.setApplicationMenu(mainMenu);
	});

	// Handle add item window
	function createAddWindow(){
		addWindow = new BrowserWindow({
			width: 300,
			height: 200,
			title: 'Add shopping to list'
		});
		addWindow.loadURL(url.format({
			pathname: path.join(__dirname, 'addWindow.html'),
			protocol: '',
			slashes: true
		}));
		// Handle garbage collection
		addWindow.on('close', function(){
			addWindow = null;
		});

		const mainMenuTemplate = [
		// Each object is a dropdown
			{
				label: 'File',
				submenu: [
					{
						label: 'Add Item',
						click(){
							createAddWindow();
						}
					},
					{
						label: 'Clear Items',
						click(){
							mainWindow.webContents.send('item:clear');
						}
					},
					{
						label: 'Quit',
						accelerator:process.platfrom == 'darwin' ? 'Command+Q' : 'CTRL+Q',
						click(){
							app.quit();
						}
					}
				]
			}
		];

		// Add developer tools option if in developer mode
		if(process.env.NODE_ENV !== 'production'){
			mainMenuTemplate.push({
				label: 'Developer Tools',
				submenu: [
					{
						role: 'reload'
					},
					{
						label: 'Toggle Developer Tools',
						accelerator:process.platfrom == 'darwin' ? 'Command+I' : 'CRTL+I',
						click(item, focusedWindow){
							focusedWindow.toggleDevTools();
						};
					}
				]
			});
		}
	}


