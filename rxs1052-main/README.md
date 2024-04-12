Steps to Get Started, please follow the steps below

1) Download the code as a zip file to your computer

Setup the Django backend

Before continuing, please make sure python is installed. This is essential for the backend.

2) Please cd to the backend folder and run the following command "pip install -r requirements.txt"

Setup the database

3) Download postgresql onto your computer - https://www.enterprisedb.com/downloads/postgres-postgresql-downloads 

4) During the installation of postgres, password for superuser "postgres" is "78masser"

5) Please create a database called "real"

6) Please cd to the backend folder 

7) Once database is created please apply the migrations by running "py manage.py migrate" in the command line

Run "python manage.py loaddata full_initial_exercise_data" after migrate

Run the server using the following command "python manage.py runserver"

Setup react fontend

8) Make sure you have Node.js and npm installed on your computer 

9) You can check if you have Node.js and npm installed on your computer - run "node -v" and "npm -v"

10) Install the libraries required by running "npm install" in the command line

11) Use "npm start" to start the server

