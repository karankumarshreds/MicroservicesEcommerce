import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/buildClient';
import Header from '../components/header';

const AppComponent = ({ Component, pageProps, currentUser }) => {
    return (
        <div>
            <Header currentUser={currentUser} />
            <Component {...pageProps} />
        </div>

    )
};

AppComponent.getInitialProps = async (appContext) => {

    // this custom app component (inbuilt) have context inside of props as "ctx"
    const client = buildClient(appContext.ctx);
    // current user info needs to be passed around hence called here
    const { data } = await client.get('/api/users/currentuser');
    // page Components expect a context with (req, res) properties which is appContext.ctx 
    let pageProps;
    // invoke pages gips() only if exist // passed down to page props
    if (appContext.Component.getInitialProps) {
        pageProps = await appContext.Component.getInitialProps(appContext.ctx);
    }
    // recieved above by AppComponent's props and further passed down
    return {
        pageProps,
        ...data // currentUser object will be extracted above for other props
    }
};

export default AppComponent;

// data : 
// {
//     currentUser: {
//       id: '5f03ecf40fe1db0018e67419',
//       email: 'test@test.com',
//       iat: 1594092811
//     }
// }