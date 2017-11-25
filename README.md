# mobile-number-verification-using-nodejs
`Nodejs` app connected with `mysql` database which uses
`Nexmo` For sending <strong>Messages to mobile </strong> with the self generated verification code. <br>

`Nexmo` is a messaging app which helps us to send msgs from web apps.
https://www.nexmo.com/

download this file<br>
unzip it<br>
Run `npm install` and all the dependencies will be installed into the project<br>
To run the project type `node index`. application will be live on port 3000<br>

Regiser the details in the firs form<br>
Then it will take you to verification form which it asks your phone number and security code(received in mobile number)<br>
Afte giving the correct input it will akeyou to the sucess page<br>
and in daabase `users table` the ` user_status` field will be updated to `1` which means user is updated
