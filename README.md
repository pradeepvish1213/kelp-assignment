
# Kelp Assignment

### JSOB Object Representation

You need to take a csv file from a configurable location(define an env config) in a node
application (ExpressJs or NestJs) and upload the data into a postgres DB table with following
structure
Please note that we expect that the candidate uses custom logic to parse csv file and covert
the data to JSON rather than using publicly available NPM packages (For eg: csv-to-json)

https://www.kelpglobal.com/

```
CREATE TABLE public.users (
"name" varchar NOT NULL, (name = firstName + lastName)
age int4 NOT NULL, address
jsonb NULL,
additional_info jsonb NULL, id
serial4 NOT NULL
); 
```
Map mandatory property to designated fields of the table and put the remaining ones to
additional_info filed as a JSON object.

Once the records are uploaded to the DB the application should calculate the age distribution of all users and print following report on console.
Age-Group % Distribution
```
< 20 20
20 to 40 45
40 to 60 25
> 60 10
```
# Please note
##### • First line in the csv file will always be labels for the properties
##### • Number of records in the file can go beyond 50000
##### • You can have properties with infinite depth. (a.b.c.d........z.a1.b1.c1.....)
##### • All sub-properties of a complex property will be placed next to each other in the file.

# Submission Details:
Please share with us a working version of the application via Github. Also, let us know your
assumptions if you have taken any.

# What Next?
Once you submit your solution/code to us, Our team would review your code and schedule a
technical interview within the next 2 to 3 days. The interview would be beyond this challenge.

We would use this interview to understand your overall technical skills.


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

```
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=root
DB_NAME=kelp
```


## Installation

Take pull from github kelp-assignment

```bash
  cd kelp-assignment
  npm install
  npm run start / pm2 start
```

    
## API Reference

#### Upload file

```http
  POST /http://localhost:3000/upload
```

| Body | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `file` | `file` |  By postman select file |

#### Get item

```http
  GET http://localhost:3000/report
```
