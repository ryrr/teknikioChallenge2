# teknikioChallenge2
backend challenege for teknikio


# Database 

## Design

The relationship of cars to users is many to many as users can own multiple cars, and a car can be owned by multiple users. An efficient and extensible way to design a database with this relationship is with join tables. Rather than updating the state of cars and users individually, changes in ownership and rental status are reflected in the tables `ownership` and `rentals`. This design pattern is most effectively implemented with a relational database, in this case mySQL. Join tables allow for more purity in the system data and as a consequence allow for more features and relationships to be added easily and cleanly with an additional join table.

## Tables

values in parenthesis are the columns of the respective table

### cars 
   (`id`,`vin`,`name`)

### users 
   (`id`,`username`,`password`) 

### ownership 
   (`id`,`user_id`,`car_id`)

### rentals 
   (`id`,`user_id`,`car_id`)
   
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

Registers a new user and stores login information in the db. Password is hashed and salted before insertion


**/login** 

requires {`username`,`password`} ex.`username=ryrr` `password=hunter1`

Logs a user in and gives access to routes in the user's scope


**/add_car** 

requires {`VIN`,`carname`} ex.`VIN=5YJSA1DG9DFP14705` `carname=grease_lightning`

Adds a new car to the requesting user's account. 


**/add_owner** 

requires {`username`,`carname`} ex.`VIN=5YJSA1DG9DFP14705` `carname=grease_lightning`

Adds ownership of a given car to the given user's account


**/rent_car** 

requires {`username`(renter),`carname`} ex. `username=rivera_racing` `carname=grease_lightning`

Assigns a rental of a given car (owned by the requesting user) to a different given user


**/return_car** 

requires {`carname`} ex. `carname=grease_lightning`

Removes rental status of a given car being rented by the requesting user


**/delete_account**

deletes the account and associated cars if no cars are currently being rented. Car is not deleted if owned by another user


**/remove_car** 

requires {`carname`} ex. `carname=audi_r8`

Removes given car from the system provided it is not being rented


### admin routes

**/remove_user** 

requires {`username`} ex. `username=rivera_racing`

Deletes the account and associated cars of a user if no cars are currently being rented. Car is not deleted if owned by another user


**/remove_car** 

requires {`username`,`carname`} ex. `username=rivera_racing` `carname=audi_r8`

Removes a given car from the system provided it is not being rented


**/return_car** 

requires {`username`,`carname`} ex. `username=rivera_racing` `carname=grease_lightning`

Forcefully removes rental status of a given car being rented by a particular user


# Considerations

# Technologies


