# teknikioChallenge2
backend challenege for teknikio


# Database 


## Tables

### cars 
  #### columns (`id`,`vin`,`name`)

### users 
  #### columns (`id`,`username`,`password`) 

### ownership 
  #### columns (`id`,`user_id`,`car_id`)

### rentals 
  #### columns (`id`,`user_id`,`car_id`)

# Routes

This API accepts POST (x-www-formurlencoded) requests to the following routes

The possible fields accepted are `username`,`password`,`carname`, and `VIN`

The values in brackets indicate that the corresponding values are required to be set upon a `POST` request to that route

user routes

#### /register {`username`,`password`} ex.`username=ryrr password=hunter1`

#### /login {`username`,`password`} ex.`username=ryrr password=hunter1`

#### /add_car {`VIN`,`carname`} ex.`VIN=5YJSA1DG9DFP14705 carname=grease_lightning`

#### /rent_car {`username`(renter),`carname`}

#### /return_car {`username`(renter),`carname`}

#### /delete_account

#### /remove_car {`carname`}

admin routes

#### /remove_user {`username`}

#### /remove_car {`username`,`carname`}
