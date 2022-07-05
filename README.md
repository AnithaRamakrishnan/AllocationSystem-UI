Allocation System
Front End - UI
IDE : Visual Studio Code
Javascript framework : React JS
To Run the application - Execute below commands
"npm install && npm start"

** Admin Login**:
1.Register as Supervisor from UI 
2.Go to database and Update below command to enable admin.
    Update [User] set IsAdmin=1 where ID={user id} 
3.Now Login.

Note:{user id} should be updated with id from user table