# rddiscoverer
JSONAPI mapper to RDBMS backend
# Specification
## URL
| Request | URL | Description | parameters |
| --- | --- | --- | --- |
| *GET* | /objects | Just list of "objects" | |
| *GET* | /objects/2 | "Object" with id=2| |
| *GET* | /objects/2?include=i18n_data | "Object" with id=2| ```{ include = [{model : Models.I18nData] } ``` |
| POST  |  /objects |   |  |
| PUT  | /objects/2  |   |  |
| DELETE  | /objects/2 |   |  |
| UPDATE  | /objects/2  |   |  |

## Naming convention
URL requests - plural
table names - singular

# The Plan
## Repository
### Included objects select strategy
* making list of referenced IDs
* retrieving entities
* recursive behavior

## Serializer
## Deserializer
## App Server
## Optimistic lock with VERSION field
WHERE clause with VERSION check
OptimisticLockError
