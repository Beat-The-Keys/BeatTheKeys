# Beat the Keys (CS490 Group 4 Project)

## Overview
Beat the Keys is a browser-based multiplayer typeracing game. To play the current version, view our Heroku app [here](https://beat-the-keys.herokuapp.com/). If you would like to run the app locally, follow the steps below.

## Setup
1. `npm install`
2. `pip install -r requirements.txt`
3. If you're using AWS C9, run `echo "DANGEROUSLY_DISABLE_HOST_CHECK=true" > .env.development.local` in the project directory

## Start the App
1. Run command in terminal (in your project directory): `python app.py`
2. Run command in another terminal, `cd` into the project directory, and run `npm run start`. 
3. The app will open automatically if you're running it locally. If you're using AWS C9. preview the web page in browser with '/'.

## Heroku Setup
Beat the Keys requires a database so that it can save player stats and info. Follow either the [official docs](https://devcenter.heroku.com/articles/heroku-postgresql#local-setup) or [this tutorial](https://gist.github.com/naman-njit/a49260e02cd67ea87148e98f79c687fd#create-a-new-database-on-heroku-and-connect-to-our-code) to setup a Heroku database.

## Sprint 1 Specs
We completed all of the required specs for sprint 1:
1. [Kanban Board](https://github.com/Beat-The-Keys/BeatTheKeys/projects/1)
2. Deployment: Heroku link [here](https://beat-the-keys.herokuapp.com/) 
3. Client-server architecture: Flask for backend and React for frontend
4. User login: all players are required to login with Google
5. Persisted data via database: player icons are persisted using our Heroku database
6. 2 mocked server tests: 
    * [add_to_db_test.py](server/add_to_db_test.py)
    * [get_users_from_db_test.py](server/get_users_from_db_test.py)
7. 2 unmocked server tests:
    * [finished_test.py](server/finished_test.py)
    * [update_player_test.py](server/update_player_test.py)
9. 2 client tests:
    * [App.test.js](src/App.test.js)
10. Linting and formatting: Pylint for Python and ESLint (default) for JS. View disabled linting rules [below](#linting).
11. Continuous integration:
    * [client_ci.yml](.github/workflows/client_ci.yml)
    * [server_ci.yml](.github/workflows/server_ci.yml)

## Sprint 2 Specs
We completed all of the required specs for sprint 2:
1. Deployment: Heroku link [here](https://beat-the-keys-v2.herokuapp.com) 
1. Beautification: React-Bootstrap as well as styled-components
1. Landing Page: 
    * [What the functionality is](https://beat-the-keys-v2.herokuapp.com/#Guide)
    * [Why it matters](https://beat-the-keys-v2.herokuapp.com/#Why)
    * [Who made it](https://beat-the-keys-v2.herokuapp.com/#AboutUs)

1. Continuous integration:
    * [client_ci.yml](.github/workflows/client_ci.yml)
    * [server_ci.yml](.github/workflows/server_ci.yml)

We implemented several features during sprint 2:
* Private lobbies
* Ready-up system
* More text prompts
* Player icons will be displayed to everyone in the lobby
* A live graph/chart that shows all WPMs
* An updated and polished UI
* Unlock-able achivements
 
## Linting
Disabled lint rules below:
  * wrong-import-position: disabled in app.py for the `import models` statement
  * invalid-envvar-default: disabled in app.py to avoid errors for `int(os.getenv('PORT', 8081)`
  * ignored-classes=scoped_session,SQLAlchemy: added `scoped_session` and `SQLAlchemy` to avoid `no-member` errors
  * consider-using-enumerate: disabled in app.py in order to `walk 2 lists at the same time`
  * too-many-arguments: disabled in app.py to `pass all the DB information`
