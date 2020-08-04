import Router from 'next/router';

export default (ctx, target) => {
    if (ctx.res) {
        // server 
        ctx.res.writeHead(303, { Location: target });
        ctx.res.end();
    } else {
        // client
        Router.push(target);
    }
}
