import { useEffect } from 'react';
import useRequest from '../../hooks/use-request';
import Router from 'next/router';

export default () => {
    // request from the browser
    const { doRequest } = useRequest({
        url: '/api/users/signout',
        method: 'post',
        body: {},
        onSuccess: () => {
            Router.push('/');
        }
    });
    useEffect(() => {
        doRequest();
    }, [])

    return <h1>Signing you out</h1>
}

