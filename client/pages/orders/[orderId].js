import { useEffect, useState } from 'react';
// 454
import StripeCheckout from 'react-stripe-checkout';

const OrderShow = ({ order, email }) => {
    const [timeLeft, setTimeLeft] = useState(0);

    useEffect(() => {
        const findTimeLeft = () => {
            const msLeft = new Date(order.expiresAt) - new Date();
            setTimeLeft(Math.round(msLeft / 1000));
        };
        findTimeLeft();
        const id = setInterval(findTimeLeft, 1000);
        return () => {
            clearInterval(id);
        };
    }, [order]);

    if (timeLeft < 0) {
        return <div>
            Order Expired
        </div>;
    }

    return (
        <div>
            <h1>Order</h1>
            <p>Time Left : {timeLeft} seconds...</p>
            <StripeCheckout
                token={(token) => console.log(token)}
                stripeKey='pk_test_51HBfOiAwrVXa1QJ5ED5kIeyZC8Z2e7GgoquBXQqV1GajtsJVe2uAB3Q7znlJAsoMHGTIsuUylMORiAcTk1Zyzc2300vhfVGPMH'
                amount={order.ticket.price * 100}
                email={email}
            />
            <h1>Test</h1>
        </div>
    )
};

OrderShow.getInitialProps = async (context, { currentUser }, client) => {
    // orderId named as name of the file 
    const { orderId } = context.query;
    const { data } = await client.get(`/api/orders/${orderId}`);
    return { order: data }
};

export default OrderShow;   