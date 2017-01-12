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
		'add a new product'
		]
	}).then(function(decision){
		switch(decision.request){
			case 'view products for sale':
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
				break;
			case 'view low inventory':
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
				break;
			case 'add to inventory':
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
						//console.log(choice.addMore);
						//console.log(choice.addMore.indexOf(' |'));
						//this space will be at position 13 of the string if 1 digit number
						//index 14 if 2 digit number
						//index 15 if 3 digit number
						//create variable parseInt from string splice to represent item_id
						var itemNumber = parseInt(choice.addMore.slice(12,choice.addMore.indexOf(' |')));
						console.log('item number: ' + itemNumber);
						console.log(typeof itemNumber);
						//UPDATE database_name SET specific_column_name = valueToSet WHERE primarykey_column_name = particularValue
						searchAgain();
					});
				});				
				break;
			case 'add a new product':
				// If a manager selects Add New Product, it should allow the manager to add a completely new product to the store.
				break;
			default:
				console.log('unknown request. try again.');
				break;
		}
	});
}


// If you finished Challenge #2 and put in all the hours you were willing to spend on this activity, then rest easy! Otherwise continue to the next and final challenge.
// 	connection.query('SELECT * FROM products', function(err, response){
// 		if(err) throw err;
// 		for(var i = 0; i<response.length; i++){
// 			var twoDigitID = '0';
// 			if(response[i].item_id<10){
// 				twoDigitID += response[i].item_id;
// 			}else{
// 				twoDigitID = response[i].item_id;
// 			}
// 			// console.log(response[i].item_id + ' | dept: ' + response[i].department_name + ' | product: ' + response[i].product_name + ' | qty avail: ' + response[i].stock_quantity + ' | price: $' + response[i].price);
// 			console.log('product ID: ' + twoDigitID + ' | product: ' + response[i].product_name + ' | qty avail: ' + response[i].stock_quantity + ' | price: $' + response[i].price);
// 		}
// 		inquirer.prompt([
// 		{
// 			type: 'input',
// 			name: 'productID',
// 			message: 'Please specify the product ID of the item you wish to purchase: '
// 		},
// 		{
// 			type: 'input',
// 			name: 'units',
// 			message: 'How many units do you wish to purchase?'
// 		}]).then(function(answers){
// 			connection.query('SELECT * FROM products WHERE item_id = ?', [answers.productID], function(err, response){
// 				if(err) throw err;
// 				//remember: even if response.length === 1, you must still specify you want array[0]
// 				if(answers.units > response[0].stock_quantity){
// 					console.log('Apologies. We currently have only ' + response[0].stock_quantity + ' units of: ' + response[0].product_name + '.');
// 					console.log('You requested ' + answers.units + ' items.');
// 					searchAgain();
// 				}else{
// 					var updatedQuantity = response[0].stock_quantity - answers.units;
// 					var totalCost = answers.units * response[0].price;
// 					connection.query('UPDATE products SET stock_quantity = ? WHERE item_id = ?', [updatedQuantity, answers.productID], function(err, response){
// 						if(err) throw err;
// 						console.log('We have enough items to fulfill your order. Here\'s your total: $' + totalCost);
// 						searchAgain();
// 					});
// 				}
// 			});
// 		});
// 	});
// }

// function searchSongs(){
// inquirer.prompt({
// 	type: 'list',
// 	name: 'userRequest',
// 	message: 'Welcome. What brings you to searchSongs today?',
// 	choices: [
// 	'search an artist',
// 	'search for multiple winning artists',
// 	'search songs within a range',
// 	'search for a specific song'
// 	]
// }).then(function(decision){
// 	if(decision.userRequest === 'search an artist'){
// 		//A query which returns all data for songs sung by a specific artist
// 		inquirer.prompt([
// 		{
// 			type: 'input',
// 			name: 'artist',
// 			message: 'search for songs by which artist?',
// 		}]).then(function(answer){
// 			//var query = 'SELECT position song year FROM top5000 WHERE artist ?'
// 			//connection.query(query, {artist: answer.artist}, function(err, response){
// 			connection.query('SELECT * FROM top5000 WHERE artist = ?', [answer.artist], function(err, response){
// 				if(err) throw err;
// 				var artists = [];
// 				console.log('results for ' + answer.artist + ':');
// 				for(var i = 0; i<response.length; i++){
// 					//individualResult.concat('', response[i].song, ' | year: ', response[i].year, ' | millions of albums: ', response[i].raw_total);
// 					console.log(response[i].song + ' | year: ' + response[i].year + ' | millions of albums: ' + response[i].raw_total);
// 					// artists.push(individualResult);
// 				}
// 				// console.log('results for ' + answer.artist + ':');
// 				//console.log(artists);
// 				searchAgain();
// 			});
// 		});
// 	}else if(decision.userRequest === 'search for multiple winning artists'){
// 		//returns all artists who appear within the top 5000 more than once
// 		//remember: the results are returned as an array of RowDataPacket objects
// 		inquirer.prompt([
// 		{
// 			type: 'input',
// 			name: 'artistsMultiple',
// 			message: 'do you have a minimum number of appearances?',
// 			default: 10
// 		}]).then(function(answer){
// 			connection.query('SELECT * FROM top5000 GROUP BY artist HAVING count(*) >= ?', [answer.artistsMultiple], function(err, response){
// 				if(err) throw err;
// 				console.log('these artists appeared more than ' + answer.artistsMultiple + ' times:');
// 				for(var i = 0; i<response.length; i++){
// 					console.log('artist: ' + response[i].artist + ' | position: '+ response[i].position + ' | year: ' + response[i].year + ' | millions of albums: ' + response[i].raw_total);
// 				}
// 				searchAgain();
// 			});
// 		});
// 	}else if(decision.userRequest === 'search songs within a range'){
// 		//returns all data contained within a specific range
// 		inquirer.prompt([
// 		{
// 			type: 'input',
// 			name: 'rangeLower',
// 			message: 'what is the beginning position?'
// 		},
// 		{
// 			type: 'input',
// 			name: 'rangeUpper',
// 			message: 'what is the end position?'
// 		}]).then(function(answers){
// 			connection.query('SELECT * FROM top5000 WHERE position BETWEEN ? AND ?', [answers.rangeLower, answers.rangeUpper], function(err, response){
// 				if(err) throw err;
// 				console.log('here are the entries between position ' + answers.rangeLower + ' and ' + answers.rangeUpper);
// 				for(var i = 0; i<response.length; i++){
// 					console.log(response[i].position + ' | artist: ' + response[i].artist + ' | ' + response[i].song + ' | year: ' + response[i].year + ' | millions of albums: ' + response[i].raw_total);
// 				}
// 				searchAgain();
// 			});
// 		});
// 	}else if(decision.userRequest === 'search for a specific song'){
// 		//A query which searches for a specific song in the top 5000 and
// 		//returns the data for it
// 		inquirer.prompt([
// 		{
// 			type: 'input',
// 			name: 'song',
// 			message: 'which song would you like to search?',
// 		}]).then(function(answer){
// 			connection.query('SELECT * FROM top5000 WHERE song = ?', [answer.song], function(err, response){
// 				if(err) throw err;
// 				console.log('results for ' + answer.song + ':');
// 				if(response.length === 0){
// 					console.log('sorry, ' + answer.song + ' not found :(');
// 				}else{
// 					for(var i = 0; i<response.length; i++){
// 						console.log('song title: ' + response[i].song + ' | artist: ' + response[i].artist + ' | position: '+ response[i].position + ' | year: ' + response[i].year + ' | millions of albums: ' + response[i].raw_total);
// 					}
// 				}
// 				searchAgain();
// 			});
// 		});
// 	}
// });
// }

function searchAgain(){
	inquirer.prompt([
	{
		type: 'confirm',
		name: 'searchAgain',
		message: 'would you like to conduct another search?',
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
// Instructions:

// Create a new Node application called bamazonManager.js. Running
//this application will:
// List a set of menu options:
// View Products for Sale
// View Low Inventory
// Add to Inventory
// Add New Product
// If a manager selects View Products for Sale, the app should list every available item: the item IDs, names, prices, and quantities.
// If a manager selects View Low Inventory, then it should list all items with a inventory count lower than five.
// If a manager selects Add to Inventory, your app should display a prompt that will let the manager "add more" of any item currently in the store.
// If a manager selects Add New Product, it should allow the manager to add a completely new product to the store.
// If you finished Challenge #2 and put in all the hours you were willing to spend on this activity, then rest easy! Otherwise continue to the next and final challenge.
// Challenge #3: Supervisor View (Final Level)

// Create a new MySQL table called departments. Your table should include the following columns:
// * department_id

// * department_name

// * over_head_costs (A dummy number you set for each department)

// * total_sales
// Modify the products table so that theres a product_sales column and modify the bamazonCustomer.js app so that this value is updated with each individual products total revenue from each sale.
// Modify your bamazonCustomer.js app so that when a customer purchases anything from the store, the program will calculate the total sales from each transaction.
// Add the revenue from each transaction to the total_sales column for the related department.
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
// One More Thing