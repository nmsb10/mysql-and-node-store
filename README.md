# mysql-and-node-store
Homework Ten: This project involved "creating an Amazon-like storefront with the MySQL skills you learned this week. The app will take in orders from customers and deplete stock from the store's inventory. As a bonus task, program your app to track product sales across your store's departments and then provide a summary of the highest-grossing departments in the store."


## Technologies Used
This project involved the following technologies
- node.js
- javascript
- MySQL
- node libraries including inquirer, mysql, and cli-table

## Getting Started

If you want to try out the application for yourself:

### Prerequisities (to try this locally)

What to install and how

```
- pull this repository to your computer
- because I created the package.json file, in your bash simply navigate to where you pulled the repository and type: npm install
- this will install the node_modules required
```

## Review of the code
A few items for your consideration.

### initial mySQL code
```
CREATE database Bamazon;

USE Bamazon;

CREATE TABLE products (
  item_id INT(9) AUTO_INCREMENT NOT NULL,
  product_name VARCHAR(100) NOT NULL,
  department_name VARCHAR(100) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock_quantity INT(10) NOT NULL,
  PRIMARY KEY (item_id)
);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ('rock', 'pets', 5.95, 15),
('pomegranate', 'fruits', 1.99, 10),
('kiwi', 'fruits', 0.75, 25),
('broccoli', 'vegetables', 2.99, 12),
(etc);
```

### customer

First create a mysql connection, and use the Bamazon database you just created (above):
```
var connection = mysql.createConnection({
	host: 'localhost',
	port: 3306,
	user: 'yourUsername',
	password: 'yourPassword',
	database: 'Bamazon'
});
```

Then connect to the mySQL database we created:
```
connection.connect(function(err){
	if(err) throw err;
	customerView();
});
```

Then display all items from the products table:
```
function customerView(){
	connection.query('SELECT * FROM products', function(err, response){
	...
	console.log('product ID: ' + response[i].item_id + ' | product: ' + response[i].product_name + ' | qty avail: ' + response[i].stock_quantity + ' | price: $' + response[i].price);
```

Use inquirer to allow the user to submit their requested product ID and amount they wish to purchase:
```
inquirer.prompt([
{
	type: 'input',
	name: 'productID',
	message: 'Please specify the product ID of the item you wish to purchase: ',
	validate: function(requestedID){
		for(var i = 0; i<response.length; i++){
			if(parseInt(requestedID) === parseInt(response[i].item_id)){
				return true;
			}
		}
		return 'Please enter a valid product ID.';
	}
},
{
	type: 'input',
	name: 'units',
	message: 'How many units do you wish to purchase?',
	validate: function(requestedUnits){
		return parseInt(requestedUnits) >= 0 ? true : 'Please enter a valid number of units.';
	}
}]).then(function(answers){
```

Then pull the data from the products table associated with the requested item ID:
```
connection.query('SELECT * FROM products WHERE item_id = ?', [answers.productID], function(err, response){
```

After the customer's purchase transaction is complete, update the products table. For the same item id, update the depleted stock quantity, and update the product sales for that item.
```
connection.query('UPDATE products SET stock_quantity = ?, product_sales = ? WHERE item_id = ?', [updatedQuantity, updatedProductSales, answers.productID], function(err, response){
```

Finally, after a successful customer purchase, update the total sales for the appropriate department in the departments table:
```
connection.query('SELECT total_sales FROM departments WHERE department_name = ?', [departmentSelected], function(error, response){
if (error) throw error;
var updatedDeptSales = response[0].total_sales + totalCost;
connection.query('UPDATE departments SET total_sales = ? WHERE department_name = ?',[updatedDeptSales, departmentSelected], function(error, response){
```







```
function awesomeThing() {
    //...
    // try not to make it too long otherwise, point to filepaths:line numbers
    //...
}
```
Video link to a "light" demonstration of this application available upon request.

## Authors

* **Jonathon Nagatani** - *did everything* - [Jonathon Nagatani](https://github.com/nmsb10)

## Acknowledgments

* the class examples helped immensely as always
* [inquirer](https://github.com/SBoudrias/Inquirer.js/tree/master/examples)
* [cli-table](https://github.com/Automattic/cli-table/blob/master/README.md)
* [README.md inspiration](https://gist.github.com/ntuvera/7b72eb92c33ed423155f7bf31443a439)