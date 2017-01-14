//https://github.com/SBoudrias/Inquirer.js/tree/master/examples
var inquirer = require('inquirer');

var mysql = require('mysql');
//https://github.com/Automattic/cli-table/blob/master/README.md
var Table = require('cli-table');
// var table = new Table({
// 	chars: { 'top': '═' , 'top-mid': '╤' , 'top-left': '╔' , 'top-right': '╗',
// 	'bottom': '═' , 'bottom-mid': '╧' , 'bottom-left': '╚' , 'bottom-right': '╝',
// 	'left': '║' , 'left-mid': '╟' , 'mid': '─' , 'mid-mid': '┼',
// 	'right': '║' , 'right-mid': '╢' , 'middle': '│' }
// });

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
	superView();
});

function superView(){
	inquirer.prompt({
		type: 'list',
		name: 'request',
		message: 'Welcome. What brings you to bSupervisor today?',
		choices: [
		'View Product Sales by Department',
		'Create New Department',
		'list all departments'
		]
	}).then(function(decision){
		switch(decision.request){
			case 'View Product Sales by Department':
				viewDeptSales();
				break;
			case 'Create New Department':
				createNewDept();
				break;
			case 'list all departments':
				listAllDepartments();
				break;
			default:
				console.log('unknown request. try again.');
				break;
		}
	});
}

function viewDeptSales(){
	var table = new Table({
		chars: { 'top': '═' , 'top-mid': '╤' , 'top-left': '╔' , 'top-right': '╗',
		'bottom': '═' , 'bottom-mid': '╧' , 'bottom-left': '╚' , 'bottom-right': '╝',
		'left': '║' , 'left-mid': '╟' , 'mid': '─' , 'mid-mid': '┼',
		'right': '║' , 'right-mid': '╢' , 'middle': '│' }
	});
	connection.query('SELECT * FROM departments', function(error, response){
		if(error) throw error;
		table.push(['dept. ID', 'dept. name', 'overhead costs', 'total sales', 'profit']);
		for (var i = 0; i< response.length; i++){
			var profit = response[i].total_sales - response[i].over_head_costs;
			table.push([response[i].department_id, response[i].department_name, response[i].over_head_costs, response[i].total_sales, profit]);
		}
		console.log(table.toString());
		searchAgain();
	});
}

function createNewDept(){
	inquirer.prompt(
	{
		type: 'input',
		name: 'name',
		message: 'department name: ',
		// validate: function(name){
		// 	return deptNameExists(name) ? 'that department already exists. add a different department?' : true;
		// }
	}).then(function(dept){
		connection.query('SELECT * FROM products GROUP BY department_name HAVING count(*) >= 1', function(err, response){
			if(err) throw err;
			var deptNames = [];
			for(var i = 0; i<response.length; i++){
				deptNames.push(response[i].department_name);
			}
			//there is a better way than this!!!
			var exists = false;
			for(var j = 0; j<deptNames.length; j++){
				if(dept.name === deptNames[j]){
					exists = true;
				}
				//return proposedName === deptNames[j] ? true : false;
			}
			if(exists){
				inquirer.prompt([
				{
					type: 'confirm',
					name: 'tryAgain',
					message: 'the department "' + dept.name + '" already exists. Try adding a different department?',
				}]).then(function(answer){
					if(answer.tryAgain){
						createNewDept();
					}else{
						searchAgain();
					}
				});
			}else{
				inquirer.prompt(
				{
					type: 'input',
					name: 'overheadcosts',
					message: 'please enter the overhead costs related to department ' + dept.name + '.',
					default: 5000,
					validate: function(value) {
					//http://stackoverflow.com/questions/175739/is-there-a-built-in-way-in-javascript-to-check-if-a-string-is-a-valid-number
					return isNaN(value) ? 'Please enter a valid quantity.' : true;
					}
				}).then(function(complete){
					connection.query('INSERT INTO departments (department_name, over_head_costs) VALUES (?, ?)', [dept.name, complete.overheadcosts], function(error, response){
						if(error) throw error;
						console.log('Thank you. New department: ' + dept.name + ' with overhead costs of $' + complete.overheadcosts + ' added.');
						searchAgain();
					});
				});
			}
		});
		
	});
}

function listAllDepartments(){
	inquirer.prompt([
		{
			type: 'input',
			name: 'departmentsMultiple',
			message: 'View only departments with a minimum number of different products? If yes, enter here:',
			default: 1
		}]).then(function(answer){
			connection.query('SELECT * FROM products GROUP BY department_name HAVING count(*) >= ?', [answer.departmentsMultiple], function(err, response){
				if(err) throw err;
				console.log('these departments have ' + answer.departmentsMultiple + ' or more different products:');
				for(var i = 0; i<response.length; i++){
					console.log('department: ' + response[i].department_name);
				}
				searchAgain();
			});
		});
}

function deptNameExists(proposedName){
	connection.query('SELECT * FROM products GROUP BY department_name HAVING count(*) >= 1', function(err, response){
		if(err) throw err;
		var deptNames = [];
		console.log(deptNames);
		for(var i = 0; i<response.length; i++){
			deptNames.push(response[i].department_name);
		}
		//there is a better way than this!!!
		console.log(deptNames);
		console.log(proposedName);
		var exists = false;
		for(var j = 0; j<deptNames.length; j++){
			if(proposedName === deptNames[j]){
				console.log('got it !!!!!!');
				exists = true;
			}
			//return proposedName === deptNames[j] ? true : false;
		}
		console.log(exists);
		return exists;
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
			superView();
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


// Add the revenue from each transaction to the total_sales column for
//the related department.

// Make sure your app still updates the inventory listed in the products column.

// Create another Node app called bamazonSupervisor.js. Running this application will list a set of menu options:
// View Product Sales by Department
// Create New Department
// When a supervisor selects View Product Sales by Department, the app
//should display a summarized table in their terminal/bash window. Use
//the table below as a guide.
// department_id	department_name	over_head_costs	product_sales	total_profit
// 01	Electronics	10000	20000	10000
// 02	Clothing	60000	100000	40000
// The total_profit should be calculated on the fly using the
//difference between over_head_costs and total_sales. total_profit should
//not be stored in any database. You should use a custom alias.
// If you can't get the table to display properly after a few hours,
//then feel free to go back and just add total_profit to the departments
//table.
// * Hint: You may need to look into aliases in MySQL.

// * **HINT**: There may be an NPM package that can log the table to
//the console. What's is it? Good question :)