# React ES6 Webpack Boilerplate

Boilerplate for kick starting a project with the following technologies:
* [React](https://github.com/facebook/react)
* [Babel 6](http://babeljs.io)
* [Webpack](http://webpack.github.io) for bundling
* [Webpack Dev Server](http://webpack.github.io/docs/webpack-dev-server.html)
* [React Transform](https://github.com/gaearon/react-transform-hmr) for hot reloading React components in real time.

The various webpack options used have been explained in detailed as comments in the config file. Should help with understanding the nitty-gritty :)


# Usage

## Frontend

```
npm install
npm start
Open http://localhost:5000
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
python server/app.py
```
