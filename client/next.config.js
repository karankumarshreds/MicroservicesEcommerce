/** This is loaded up automatically. This will tell nextJS
 *  to look for file change detection every 300ms *******/
module.exports = {
    webpackDevMiddleware: config => {
        config.watchOptions.poll = 300;
        return config;
    }
}