import React from 'react';
import redirect from './redirect';

const withAuth = (Component) => {
    return class AuthComponent extends React.Component {
        static async getInitialProps(ctx, { currentUser }) {
            if (!currentUser) {
                return redirect(ctx, "/");
            }
        }
        render() {
            return <Component {...this.props} />
        }
    }
}

export default withAuth;