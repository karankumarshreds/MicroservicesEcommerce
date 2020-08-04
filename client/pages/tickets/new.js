import { useState } from 'react';
import useRequest from '../../hooks/use-request';
import withAuth from '../../hooks/with-auth';
import Router from 'next/router';

const NewTicket = () => {
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const { doRequest, errors } = useRequest({
        url: '/api/tickets',
        method: 'post',
        body: {
            title, price
        },
        onSuccess: () => Router.push('/')
    });

    const onSubmit = (e) => {
        e.preventDefault();
        doRequest();
    };

    // if user clicks anywhere outside the input field 
    const onBlur = () => {
        const value = parseFloat(price);
        if (isNaN(value)) {
            return;
        }
        setPrice(value.toFixed(2));
    }
    return (
        <div>
            <h1>Create a ticket</h1>
            <form onSubmit={onSubmit}>
                <div className="form-group">
                    <label>Title</label>
                    <input className="form-control"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>Price</label>
                    <input className="form-control"
                        value={price}
                        onBlur={onBlur}
                        onChange={e => setPrice(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    {errors}
                    <button className="btn btn-primary">Submit</button>
                </div>
            </form>
        </div>
    )
};

export default withAuth(NewTicket);