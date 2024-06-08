# Resources Used

- [Angular RealWorld Example App](https://github.com/gothinkster/angular-realworld-example-app/tree/main)
- [YouTube Playlist on Angular](https://www.youtube.com/playlist?list=PL1w1q3fL4pmj9k1FrJ3Pe91EPub2_h4jF)
- [Visual Studio Code Copilot Overview](https://code.visualstudio.com/docs/copilot/overview)
- [Exporting JSON Data to PDF in Angular using PDFMake](https://medium.com/@rijuldahiya/exporting-json-data-to-pdf-in-angular-using-pdfmake-aef64dbd1606)
- [PDFMake GitHub Issue #2018](https://github.com/bpampuch/pdfmake/issues/2018)
- [Accessing Data with MySQL Guide](https://spring.io/guides/gs/accessing-data-mysql)

## Setting Up MySQL

1. **Install MySQL Server**

2. **Create Database and User**
   Open the MySQL terminal and run the following commands:

   ```sql
   create database db_example; -- Creates the new database
   create user 'springuser'@'%' identified by 'ThePassword'; -- Creates the user
   grant all on db_example.* to 'springuser'@'%'; -- Gives all privileges to the new user on the newly created database
   ```

## Running the Server

Navigate to `/server/src/AccessingDataMysqlApplication.java`, then use the dropdown menu on the run button of Visual Studio Code and select "Run Java".

## Running the Front-End

Open the terminal, navigate to the front-end directory, and run the following command:

```bash
npm install
ng serve
```

## Adding Materials Using Postman

To add materials, follow these steps:

1. Open Postman.

2. Create a new POST request with the URL: `http://localhost:8080/materials/add`.

3. In the Params section, add the following parameters:

   - `name` (e.g., "Steel")
   - `price` (e.g., "100")
   - `unit` (e.g., "kg")
   - `unit_sign` (e.g., "kg")

4. Click "Send" to add the material.

Your request should look like this:

```
POST http://localhost:8080/materials/add

Params:
- name: Steel
- price: 100
- unit: kg
- unit_sign: kg
```

Repeat the process to add more materials as needed.
