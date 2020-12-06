# teknikioChallenge2
backend challenege for teknikio


# Database 


## Tables

### cars 
  #### (`id`,`vin`,`name`)

### users 
  #### (`id`,`username`,`password`) 

### ownership 
  #### (`id`,`user_id`,`car_id`)

### rentals 
  #### (`id`,`user_id`,`car_id`)

# Routes

This API accepts POST (x-www-formurlencoded) requests to the following routes

The possible fields accepted are `username`,`password`,`carname`, and `VIN`

The values in brackets indicate that the corresponding values are required to be set upon a `POST` request to that route

## user routes

**/register** {`username`,`password`} ex.`username=ryrr password=hunter1`

**/login** {`username`,`password`} ex.`username=ryrr password=hunter1`

**/add_car** {`VIN`,`carname`} ex.`VIN=5YJSA1DG9DFP14705 carname=grease_lightning`

**/rent_car** {`username`(renter),`carname`} ex. `username=rivera_racing carname=grease_lightning`

**/return_car** {`carname`} ex. `carname=grease_lightning`

**/delete_account**

**/delete_car** {`carname`}

## admin routes

**/remove_user** {`username`}

**/remove_car** {`username`,`carname`}
