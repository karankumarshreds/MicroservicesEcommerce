import useRequest from "../../hooks/use-request";
import Router from 'next/router';

const TicketShow = ({ ticket }) => {
    const { doRequest, errors } = useRequest({
        url: '/api/orders',
        method: 'post',
        body: {
            ticketId: ticket.id
        },
        onSuccess: ({ id }) => {
            Router.push('/orders/orderId', `/orders/${id}`);
        }
    })
    return (
        <div>
            <h1>Ticket details</h1>
            <h5>{ticket.title}</h5>
            <p>Price: {ticket.price}</p>
            {errors}
            <button className="btn btn-primary" onClick={doRequest}>
                Purchase
                </button>
        </div>
    )
};

export default TicketShow;

TicketShow.getInitialProps = async (context, { currentUser }, client) => {
    // property name matches the file name 
    const { ticketId } = context.query;
    const { data } = await client.get(`/api/tickets/${ticketId}`);
    return { ticket: data };
}