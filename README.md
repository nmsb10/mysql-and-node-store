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

First create a mysql connection:
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
```










```
function awesomeThing() {
    //...
    // try not to make it too long otherwise, point to filepaths:line numbers
    //...
}
```
Video link of a "light" demonstration of this application available upon request.

## Authors

* **Jonathon Nagatani** - *did everything* - [Jonathon Nagatani](https://github.com/nmsb10)

## Acknowledgments

* the class examples helped immensely as always
* [inquirer](https://github.com/SBoudrias/Inquirer.js/tree/master/examples)
* [cli-table](https://github.com/Automattic/cli-table/blob/master/README.md)
* [README.md inspiration](https://gist.github.com/ntuvera/7b72eb92c33ed423155f7bf31443a439)