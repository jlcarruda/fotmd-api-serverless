# Fall of the Men's Days API
`Fall of the Men's Days` (or FotMD for short) is a homebrew RPG System of a dystopian Steam/Desert punk apocalyptic world, where humans don't exist anymore due to catastrophic climatic changes. The players are advanced artificial inteligence beings.

This project was born with the goal to create an API to handle the requests made by an Android APP and a Web System, which will incorporate the game assets to play remotely.

## Roadmap
#### Features
* Payload validation
* Response validation
* Models
  * User Model <u>*(DONE)*</u>
  * Character Model <u>*(DONE)*</u>
  * Table Model
  * Components Model
  * Character Creation models
    * System Model <u>*(DONE)*</u>
    * Machine Type Model
    * Machine Model
* Error Handler <u>*(DONE)*</u>
* Custom Errors <u>*(DONE)*</u>

<!-- * Database Connection setup function <u>*(DONE)*</u>
* Decorators <u>*(1/2)*</u>
  * Authentication Decorator for rules access <u>*(DONE)*</u>
  * Authorization Decorator, for features who need only specific roles and users to access
* Payload validation for sanitizing and validate user input
* Implement User roles
* Custom Types enum  <u>*(DONE. Its not an Enum, but a module)*</u>
* Custom errors lib <u>*(DONE)*</u>
* Models<u>*(2/7)*</u>
  * User Model <u>*(DONE)*</u>
  * Character Model <u>*(DONE)*</u>
  * Table Model
  * System Model
  * Machine Type Model
  * Machine Model Model
  * Components Model
* 'Mongoose' Like Schema validator for models <u>*(3/3)*</u>
  * schemaToObject <u>*(DONE. Implemented into the Model class. Later will be isolated)*</u>
  * validate schema on saving <u>*(DONE)*</u>
  * populate <u>*(DONE)*</u> -->


## Lambdas & Routes
* user-credentials
  * POST /user/auth <u>*(DONE)*</u>
  * POST /user/signup <u>*(DONE)*</u>
  * POST /user/logout
* user-info
  * GET /user/profile
  * GET /user/tables/owned
  * GET /user/tables/joined
* characters
  * GET /user/characters
  * GET /user/characters/:id
* tables (possible Amazon SQS)
  * POST /table/join/:id
  * POST /table/leave/:id
  * GET /table/:id/characters
  * GET /table/:id/info
* fotmd
  * GET /fotmd/machine_types
  * GET /fotmd/machine_types/:id
  * GET /fotmd/machine_models
  * GET /fotmd/machine_models/:id
  * GET /fotmd/systems <u>*(DONE)*</u>
  * GET /fotmd/systems/:id <u>*(DONE)*</u>
  * GET /fotmd/components
  * GET /fotmd/components/:id
* dm
  * POST /dm/auth
  * POST /dm/logout
  * GET /dm/tables
  * GET /dm/tables/:id
