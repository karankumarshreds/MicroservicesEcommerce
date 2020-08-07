const Orders = ({ orders }) => {
    const orderList = orders.map(order => (
        <li key={order.id}>
            <h5>{order.ticket.title}</h5> - <p>{order.status}</p>
        </li>
    ))
    return (
        <div>
            <h1>Orders</h1>
            <ul>
                {orderList}
            </ul>
        </div>
    )
};

Orders.getInitialProps = async (ctx, user, client) => {
    const { data } = await client.get('/api/orders');
    return { orders: data }
};

export default Orders;