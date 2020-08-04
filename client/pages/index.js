const { default: Link } = require("next/link");

const LandingPage = ({ currentUser, tickets }) => {

    const ticketList = tickets.map(ticket => (
        <tr key={ticket.id}>
            <td>{ticket.title}</td>
            <td>{ticket.price}</td>
            <td><Link href='/tickets/[ticketId]' as={`tickets/${ticket.id}`}>
                <a>View</a>
            </Link></td>
        </tr>
    ))
    return (
        <div>
            <h1>Tickets</h1>
            <table className="table">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Price</th>
                        <th>View</th>
                    </tr>
                </thead>
                <tbody>
                    {ticketList}
                </tbody>
            </table>
        </div>
    );
};

LandingPage.getInitialProps = async (context, { currentUser }, client) => {
    const { data } = await client.get('/api/tickets');
    // // instance of buildClient (re-configured-axios-function)
    // const client = buildClient(context);
    // const { data } = await client.get('/api/users/currentuser');
    // return data;
    return { tickets: data };
}

export default LandingPage;

/**********************
 * READ readme file!
 * ********************/

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