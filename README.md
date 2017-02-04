# Database Schema Visualizer
A simple React/Flask App to create an Entity-Relationship Diagram for a MySQL database.  

# Usage

## Frontend
To run the React app:
```
npm install
npm start
Open http://localhost:5000
```

To compile styles:
```
gulp

# If modifying sass files, enable a watcher to autocompile to css
gulp watch
```

### Linting

ESLint with React linting options have been enabled.

```
npm run lint
```


## Backend

Create a virtual environment, if required
```
python3 -m venv /path/to/virtualenvs/database-schema-visualizer
```

Activate virtual environment and install the dependencies
```
source /path/to/virtualenvs/database-schema-visualizer/bin/activate
pip install -r requirements.txt
```

Run the server
```
python server/application.py
```

## Test Database
Start the MySQL server
```
sudo mysqld
```

Open a MySQL CLI and create the test database
```
mysql -u <username> -p
> source testDB.sql;
```

Ensure the database was created correctly by using the database
```
> use northwind
```
