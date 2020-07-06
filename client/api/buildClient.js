import axios from 'axios';

export default ({ req }) => {
    if (typeof window === 'undefined') {
        // we are on the server 
        return axios.create({
            baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
            headers: req.headers // to pass on cookies & !hostname! that is needed by ingress-nginx
        })
    } else {
        // we are on the browser
        return axios.create({
            baseURL: '/'
        }); // no headers required // the browser sends cookies automatically
    }
}

/**
 * THIS JUST RETURNS AXIOS INSTANCE // use instance.get/post on that instance!
 * We are re-configuring axios so that :
 * 1. We don't have to check everytime if we're on browser or server
 * 2. We don't have to type in that ingress-nginx address with our <endpoint>
 * to connect amongst services internally
 * We will obviously pass in the <endpoint> while using this middleware
 */