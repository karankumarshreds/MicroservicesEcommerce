### STRIPE 

- Install stripe SDK 

> npm install stripe 

##### Use the secret key inside of your project 
Don't use the secret as hard coded text. 

> kubectl create secret generic stripe-secret --from-literal STRIPE_KEY=**secret_key**
Then set the environment variable in your kubernetes file for payments service.

##### docs: 
*stripe.com/docs/api*