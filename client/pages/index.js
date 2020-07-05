import axios from 'axios';

const LandingPage = ({ currentUser }) => {
    console.log(currentUser);
    return (
        <div>
            <h1> Landing page </h1>
        </div>
    );
};

LandingPage.getInitialProps = async () => {
    /*****************************************************************
     * This axios call is being called "internally" unlike when
     * requested via 'Components' which calls axios "externally"
     * via browser.
     * For << axios.get('/api/users/currentuser') >>
     * the Node's http network would assume that you're  trying 
     * to make request to "localhost:80/api/users/currentuser".
     * Here, localhost would mean client's pod & not the auth's pod.
     * Hence, we need to make request to auth-srv instead!
     * ***************************************************************
     * SOLUTION? 
     * 1.) We could either use 'http://auth-srv/api/users/currentuser'
     * This would work but it could get complicated very quickly and 
     * we would have to remember srv-names for ALL the services!
     * 2.) We could rather reach out to ingress-nginx with the path
     * of '/api/users/currentuser and let ingress-nginx figure out 
     * to which service in our cluster this request would belong to
     * ***************************************************************
     * NOTE : 
     * >> We need to figure out a way to get to the domain on which 
     * the ingress-nginx is listening for 
     * >> We also need to figure out a way to send along the cookies 
     * to all these internal follow up requests !
     ******************************************************************/
    const response = await axios.get('/api/users/currentuser');
    return response.data;
}

export default LandingPage;