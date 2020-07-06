import buildClient from '../api/buildClient';

const LandingPage = ({ currentUser }) => {
    console.log(currentUser);
    return (
        <div>
            <h1> Landing page </h1>
        </div>
    );
};
/***************************************************************************
 getInitialProps() runs on server : 
 > on hard refresh
 > if addres bar is re-entered
 > if domain is changed 
 So we are okay to make the request internally to the ingress-nginx
 to reach out to auth service!
 BUT, getInitialProps() gets rendered in the browser when the user navigates 
 from within the website!!!!! This means we can't make the internal 
 req (because this is run in the browser), so it needs to be an external 
 request to the domain!!!!! How will we fix this !? 
 ****************************************************************************
 * Solution : We will write a code that will check if the code is being
 * run from the browser or the server and will make the req accordingly.
 *****************************************************************************/
LandingPage.getInitialProps = async (context) => {
    /**********************
     * READ readme file!
     * ********************/
    // instance of buildClient (re-configured-axios-function)
    const client = buildClient(context);
    const { data } = await client.get('/api/users/currentuser');
    return data;
}

export default LandingPage;