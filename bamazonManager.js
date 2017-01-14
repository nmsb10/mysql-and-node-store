//https://github.com/SBoudrias/Inquirer.js/tree/master/examples
var inquirer = require('inquirer');

var mysql = require('mysql');

var connection = mysql.createConnection({
	host: 'localhost',//if not working locally, could be eg google.com
	port: 3306,//the port
	user: 'root',//your username
	password: 'mG7xoj44S8f0mv3IC;',
	database: 'Bamazon'
});

//first connect to your database:
connection.connect(function(err){
	if(err) throw err;
	//console.log('\nconnected as id ' + connection.threadId);
	managerView();
});

function managerView(){
	inquirer.prompt({
		type: 'list',
		name: 'request',
		message: 'Welcome. What brings you to bManager today?',
		choices: [
		'view products for sale',
		'view low inventory',
		'add to inventory',
		'add a new product',
		'delete a product'
		]
	}).then(function(decision){
		switch(decision.request){
			case 'view products for sale':
				viewProducts();
				break;
			case 'view low inventory':
				viewLowInventory();
				break;
			case 'add to inventory':
				addToInventory();
				break;
			case 'add a new product':
				addANewProduct();
				break;
			case 'delete a product':
				deleteProduct();
				break;
			default:
				console.log('unknown request. try again.');
				break;
		}
	});
}

function viewProducts(){
	// If a manager selects View Products for Sale, the app should list every available item: the item IDs, names, prices, and quantities.
	connection.query('SELECT * FROM products', function(err, response){
		if(err) throw err;
		for(var i = 0; i<response.length; i++){
			var twoDigitID = '0';
			if(response[i].item_id<10){
				twoDigitID += response[i].item_id;
			}else{
				twoDigitID = response[i].item_id;
			}
			console.log('product ID: ' + twoDigitID + ' | product: ' + response[i].product_name + ' | qty avail: ' + response[i].stock_quantity + ' | price: $' + response[i].price);
		}
		searchAgain();
	});
}

function viewLowInventory(){
	// If a manager selects View Low Inventory, then it should list all items with a inventory count lower than five.
	inquirer.prompt([
	{
		type: 'input',
		name: 'maxQuantity',
		message: 'Please specify the maximum inventory quantity to search: ',
		default: 5,
		validate: function(value) {
			//http://stackoverflow.com/questions/175739/is-there-a-built-in-way-in-javascript-to-check-if-a-string-is-a-valid-number
			return isNaN(value) ? 'Please enter a valid quantity.' : true;
		}
	}]).then(function(inventory){
		connection.query('SELECT * FROM products WHERE stock_quantity <= ?', [inventory.maxQuantity], function(error, response){
			if(error) throw error;
			console.log('Here are the products currently with stock quantity of ' + inventory.maxQuantity + ' or lower:');
			for(var i = 0; i < response.length; i++){
				var twoDigitID = '0';
				if(response[i].item_id<10){
					twoDigitID += response[i].item_id;
				}else{
					twoDigitID = response[i].item_id;
				}
				console.log('product ID: ' + twoDigitID + ' | qty avail: ' + response[i].stock_quantity + ' | product: ' + response[i].product_name  + ' | price: $' + response[i].price);
			}
			searchAgain();
		});
	});
}

function addToInventory(){
	// If a manager selects Add to Inventory, your app should display a prompt that will let the manager "add more" of any item currently in the store.
	connection.query('SELECT * FROM products', function(err, response){
		if(err) throw err;
		//create an array with all items in inventory
		var inventoryArray = [];
		for(var i = 0; i<response.length; i++){
			var item = 'product ID: ' + response[i].item_id + ' | product: ' + response[i].product_name + ' | qty avail: ' + response[i].stock_quantity + ' | price: $' + response[i].price;
			inventoryArray.push(item);
		}
		inquirer.prompt([
		{
			type: 'list',
			name: 'addMore',
			message: 'Please select the item for which you will increase inventory:',
			choices: inventoryArray
		},
		{
			type: 'input',
			name: 'quantity',
			message: 'Please specify the quantity to increase inventory for this item: ',
			validate: function(value) {
				//http://stackoverflow.com/questions/175739/is-there-a-built-in-way-in-javascript-to-check-if-a-string-is-a-valid-number
				return isNaN(value) ? 'Please enter a valid quantity.' : true;
			}	
		}]).then(function(choice){
			//console.log(choice.addMore.indexOf(' |'));
			//this space will be at index 13 of the string if 1 digit number
			//index 14 if 2 digit number
			//index 15 if 3 digit number
			//create variable parseInt from string splice to represent item_id
			var itemNumber = parseInt(choice.addMore.slice(12,choice.addMore.indexOf(' |')));
			//console.log('item number: ' + itemNumber);
			connection.query('SELECT * FROM products WHERE item_id = ?', [itemNumber], function(err, response){
				if(err) throw err;
				var updatedQuantity = parseInt(response[0].stock_quantity) + parseInt(choice.quantity);
				connection.query('UPDATE products SET stock_quantity = ? WHERE item_id = ?', [updatedQuantity, itemNumber], function(error, response){
					if(error) throw error;
					console.log('confirm quantity updated:');
					connection.query('SELECT * FROM products WHERE item_id = ?', [itemNumber], function(err, response){
						if(err) throw error;
						console.log('product ID: ' + response[0].item_id + ' | product: ' + response[0].product_name + ' | QTY AVAIL: ' + response[0].stock_quantity + ' | price: $' + response[0].price);
						searchAgain();
					});
				});
			});
		});
	});			
}

function addANewProduct(){
	//first create array of all department names
	var deptNames = [];
	connection.query('SELECT * FROM products GROUP BY department_name HAVING count(*) >= 0', function(err, response){
		if(err) throw err;
		for(var i = 0; i<response.length; i++){
			deptNames.push(response[i].department_name);
		}
		deptNames.push('NEW DEPARTMENT');	
		// If a manager selects Add New Product, it should allow the manager to add a completely new product to the store.
		inquirer.prompt([
		{
			type: 'input',
			name: 'name',
			message: 'product name: '
		},
		{
			type: 'input',
			name: 'stockQuantity',
			message: 'initial stock quantity: ',
			validate: function(value) {
				//http://stackoverflow.com/questions/175739/is-there-a-built-in-way-in-javascript-to-check-if-a-string-is-a-valid-number
				//return isNaN(value) ? 'Please enter a valid quantity.' : true;
				if(value > 0 && parseInt(value)){
					return true;
				}else{
					return 'Please enter a valid quantity.';
				}
			}
		},
		{
			type: 'input',
			name: 'price',
			message: 'product price (no commas): ',
			//should validate price is a float
			validate: function(value) {
				return parseFloat(value) && value > 0 ? true : 'Please enter a valid price.';
			}
		},
		{
			type: 'list',
			name: 'department',
			message: 'select the department name: ',
			choices: deptNames
		},
		{
			type: 'confirm',
			name: 'enterProduct',
			message: 'create a new product with the information you entered?'
		},
		{
			type: 'confirm',
			name: 'addAnotherProduct',
			message: 'would you like to add another product?'
		}]).then(function(input){
			if(input.enterProduct && input.addAnotherProduct){
				//manager may NOT add the product if they selected department 'new department'
				if(input.department === 'NEW DEPARTMENT'){
					console.log('Please ask the Supervisor to add your department.\nThen you may add the new product.');
					addANewProduct();
				}else{//otherwise, manager selected an existing department
					connection.query('INSERT INTO products (product_name, stock_quantity, price, department_name) VALUES (?, ?, ?, ?)', [input.name, input.stockQuantity, input.price, input.department], function(err, response){
						if(err) throw err;
						console.log('confirm product added: ' + input.name + ' | ' + input.stockQuantity + ' units | $' +  input.price + ' | department: ' +  input.department);
						addANewProduct();
					});
				}
			}else if(input.enterProduct && !input.addAnotherProduct){
				if(input.department === 'NEW DEPARTMENT'){
					console.log('Please ask the Supervisor to add your department.\nThen you may add the new product.');
					searchAgain();
				}else{//otherwise, manager selected an existing department
					connection.query('INSERT INTO products (product_name, stock_quantity, price, department_name) VALUES (?, ?, ?, ?)', [input.name, input.stockQuantity, input.price, input.department], function(err, response){
						if(err) throw err;
						console.log('confirm product added: ' + input.name + ' | ' + input.stockQuantity + ' units | $' +  input.price + ' | department: ' +  input.department);
						searchAgain();
					});
				}
			}else if(!input.enterProduct && input.addAnotherProduct){
				addANewProduct();
			}else if(!input.enterProduct && !input.addAnotherProduct){
				searchAgain();
			}
		});
	});
}

function deleteProduct(){
	connection.query('SELECT * FROM products', function(err, response){
		if(err) throw err;
		//create an array with all items in inventory
		var inventoryArray = [];
		for(var i = 0; i<response.length; i++){
			var item = 'product ID: ' + response[i].item_id + ' | product: ' + response[i].product_name + ' | qty avail: ' + response[i].stock_quantity + ' | price: $' + response[i].price;
			inventoryArray.push(item);
		}
		inquirer.prompt(
		{
			type: 'list',
			name: 'delete',
			message: 'Please select the item you wish to delete:',
			choices: inventoryArray
		}).then(function(choice){
			//console.log(choice.addMore.indexOf(' |'));
			//this space will be at index 13 of the string if 1 digit number
			//index 14 if 2 digit number
			//index 15 if 3 digit number
			//create variable parseInt from string splice to represent item_id
			var itemNumber = parseInt(choice.delete.slice(12,choice.delete.indexOf(' |')));
			//console.log('item number: ' + itemNumber);
			connection.query('DELETE FROM products WHERE item_id = ?', [itemNumber], function(err, response){
				if(err) throw err;
				console.log('Success. You deleted product ' + itemNumber + '.');
				searchAgain();
			});
		});
	});
}

function searchAgain(){
	inquirer.prompt([
	{
		type: 'confirm',
		name: 'searchAgain',
		message: 'would you like to conduct another task?',
	}]).then(function(answer){
		if(answer.searchAgain){
			managerView();
		}else{
			connection.end();
		}
	});
}

// #Week of 12 HW: Node.js & MySQL
// Overview

// In this activity, you'll be creating an Amazon-like storefront with
//the MySQL skills you learned this week. The app will take in orders
//from customers and deplete stock from the store's inventory. As a
//bonus task, you can program your app to track product sales across
//your store's departments and then provide a summary of the
//highest-grossing departments in the store.
// Make sure you save and require the MySQL and Prompt npm packages
//in your homework files--your app will need them for data input and
//storage.
// Submission Guide

// Make sure you use the normal GitHub and Heroku process. This time,
//though, you need to include screenshots and/or a video showing us
//that you got the app working with no bugs. You can include these
//screenshots or a link to a video in a README.md file.
// If you haven't written a markdown file yet, click here for a
//rundown, or just take a look at the raw file of these instructions.


// Challenge #3: Supervisor View (Final Level)

// Create a new MySQL table called departments. Your table should include the following columns:
// * department_id

// * department_name

// * over_head_costs (A dummy number you set for each department)

// * total_sales
// Modify the products table so that theres a product_sales column and
//modify the bamazonCustomer.js app so that this value is updated with
//each individual products total revenue from each sale.
// Modify your bamazonCustomer.js app so that when a customer purchases
//anything from the store, the program will calculate the total sales
//from each transaction.
// Add the revenue from each transaction to the total_sales column for
//the related department.
// Make sure your app still updates the inventory listed in the products column.
// Create another Node app called bamazonSupervisor.js. Running this application will list a set of menu options:
// View Product Sales by Department
// Create New Department
// When a supervisor selects View Product Sales by Department, the app should display a summarized table in their terminal/bash window. Use the table below as a guide.
// department_id	department_name	over_head_costs	product_sales	total_profit
// 01	Electronics	10000	20000	10000
// 02	Clothing	60000	100000	40000
// The total_profit should be calculated on the fly using the difference between over_head_costs and total_sales. total_profit should not be stored in any database. You should use a custom alias.
// If you can't get the table to display properly after a few hours, then feel free to go back and just add total_profit to the departments table.
// * Hint: You may need to look into aliases in MySQL.

// * **HINT**: There may be an NPM package that can log the table to the console. What's is it? Good question :)