# teknikioChallenge2
API spec for a car sharing/rental app


# Database 

## Design

The relationship of cars to users is many to many as users can own multiple cars, and a car can be owned by multiple users. An efficient and extensible way to design a database with this relationship is with join tables. Rather than updating the state of cars and users individually, changes in ownership and rental status are reflected in the tables `ownership` and `rentals`. This design pattern is most effectively implemented with a relational database, in this case mySQL. Join tables allow for more purity in the system data and as a consequence allow for more features and relationships to be added easily and cleanly with an additional join table.

## Tables

values in parenthesis are the columns of the respective table

### cars 
   (`VIN`,`name`)
   keying by VIN enforces no duplicate VIN in the system

### users 
   (`id`,`username`,`password`) 
   password is hashed and salted (not plain-text)

### ownership 
   (`id`,`user_id`,`VIN`)
   must key by id because a user can have own multiple cars 

### rentals 
   (`VIN`,`user_id`)
   keying by VIN enforces that a car cannot be rented to two people at once
   
# API

This API accepts POST (x-www-formurlencoded) requests to the following routes

The possible fields accepted are `username`,`password`,`carname`, and `VIN`

The values in brackets indicate that the corresponding values are required to be set upon a `POST` request to that route

## Routes

Routes fall into one of two categories, user and admin. This is because we do not want a user to have access to routes that can alter another user's profile. 
Users are scoped to only be able to rent/delete/return cars that they own.  However there must be a way for an admin to remove users and cars and return cars to their respective owners.

### user routes

**/register** 

requires {`username`,`password`} ex.`username=ryrr` `password=hunter1`

- Registers a new user and stores login information in the db. 
- Password is hashed and salted before insertion


**/login** 

requires {`username`,`password`} ex.`username=ryrr` `password=hunter1`

- Logs a user in and gives access to routes in the user's scope


**/add_car** 

requires {`VIN`,`carname`} ex.`VIN=5YJSA1DG9DFP14705` `carname=grease_lightning`

- Adds a new car to the requesting user's account. 


**/add_owner** 

requires {`username`,`VIN`} ex.`username=ryrr` `VIN=5YJSA1DG9DFP14705`

- Adds ownership of a given car to the given user's account


**/remove_owner** 

requires {`username`,`VIN`} ex.`username=ryrr` `VIN=5YJSA1DG9DFP14705`

- Revokes ownership of a car (owned by the requesting user) from a given user (that is not the requesting user)


**/rent_car** 

requires {`username`(renter),`VIN`} ex. `username=rivera_racing` `VIN=5YJSA1DG9DFP14705`

- Assigns a rental of a given car (owned by the requesting user) to a different given user


**/return_car** 

requires {`VIN`} ex. `VIN=5YJSA1DG9DFP14705`

- Removes rental status of a car being rented by the requesting user


**/delete_account**

- Deletes the account and associated cars if none of their cars are currently being rented. 
- Car is not deleted if owned by another user.
- All active rentals are returned


**/remove_car** 

requires {`VIN`} ex.  `VIN=5YJSA1DG9DFP14705`

- Removes a car (owned by the requesting user) from the system provided it is not being rented


### admin routes

**/remove_user** 

requires {`username`} ex. `username=rivera_racing`

- Deletes the account and associated cars of a user if none of their cars are currently being rented.
- Car is not deleted if jointly owned by another user.
- All the users rentals are returned


**/remove_car** 

requires {`VIN`} ex.  `VIN=5YJSA1DG9DFP14705`

- Removes a given car from the system provided it is not being rented


**/return_car** 

requires {`VIN`} ex. `VIN=5YJSA1DG9DFP14705`

- Forcefully removes rental status of a given car being rented by a particular user


# Considerations

- Each VIN stored in the system must be unique 
- Each VIN must be validated
- Each username in the system must be unique
- `username`,`VIN`,`password` and `carname` all must be sanitized before input into the DB to prevent SQL injection
- Users may not alter the information of other users, except for granting/removing ownership of an owned car
- Admins exist as super users that can forefully alter system infomration, use with care
- Renting a car to another user does not tranfer ownership, it is merely reflected as rented in the `rentals` table 
- Returning a rental merely removes the rental from the `rentals` table, there is no change of ownership
- The only action a user that is renting a car can take on it is return it to it's owner, since there is no ownership they are not scoped to make changes to it
- Removing a user is tricky because it will potentially result in changes to `Users`,`Ownership`,`Cars` and `Rentals` tables and there are multiple factors to consider when issuing this action. A car cant be removed if its being rented and shouldn't be if it has an owner other than the account staged for deletion. So all owned cars must be returned before deletion and cars with another owner will not be deleted. Additionally all active rentals will be returned upon deletion
- using `VIN` rather than `carname` to target specific cars would be clunky if routes were being used directly by users. In theory there would be a frontend that would abstract away entering the VIN each time you want to take action on a car. I'm envisioning that the user would select their car from a frontend list with included car names, and behind the scenes the request would be made with the `VIN` which is unique and very specific unlike `carname`.
- A case exists where a user adds an owner to a car, who already owns a car with the same name (VIN should still be unique). I chose to delegate the distinction of the two cars to the imaginary frontend that will tell the user that the cars are different and perhaps add a (1) or (2)... next to the name in the UI. I'd rather do this because I don't want to mess with renaming existing cars in the db (big no no and headache)
- A case also exists where a user is renting a car and is then given ownership of it while renting it. Although its weird scenario it is possible and I think its ok? The renting user will eventually just return the car to themselves which is possible despite the inability to rent a car to yourself.
- There should be no possible scenario where a car exists in the system without an owner 
- A car cannot be rented to multiple people at once



# Technologies

- Node.js as it is easy to build prototypes with and works relatively seamlessly across platforms
- Express for routing because It seems like the most popular and lightweight way to route in Node
- MySQL because it is easier to set up quickly and prototype with than postgrSQL (I'd use postgreSQL in production)
- node-bcrypt to hash passwords for security purposes
- sanitize to sanitize DB input


# Running 

## Database Initialization

In a secure app you obviously do not want to leak the structure of your db to the public!! This is just for convenience

create the 4 tables with these queries

-  CREATE TABLE users (id INT(11) UNSIGNED NOT NULL AUTO_INCREMENT, username VARCHAR(30) NOT NULL, password VARCHAR(70) NOT NULL, PRIMARY KEY (user_id));

-  CREATE TABLE cars (VIN VARCHAR(17) NOT NULL, name VARCHAR(30) NOT NULL, PRIMARY KEY(VIN));

-  CREATE TABLE rentals (VIN VARCHAR(17) NOT NULL, user_id INT(11) UNSIGNED NOT NULL, PRIMARY KEY(VIN));

-  CREATE TABLE ownership (id INT(11) UNSIGNED NOT NULL AUTO_INCREMENT, VIN VARCHAR(17) NOT NULL, user_id INT(11) UNSIGNED NOT NULL, PRIMARY KEY(id));

## Start the server
- `git clone` the repository
- navigate into it and run `npm install`
- provide valid database credentials and specify port in the config.js file (`host`,`port`,`user`,`password`,`database`) `port`)
- ex. db:{ host: "localhost", port:'3306', user: "root", password: "awesomepassword", database:'carshare'}, app{port:3000},
- navigate into the src folder and run `node app.js`
- Server should now be running and open to requests on the configured port 



