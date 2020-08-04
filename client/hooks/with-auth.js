import React from 'react';
import redirect from './redirect';

export const withAuth = (Component) => {
    return class AuthComponent extends React.Component {
        static async getInitialProps(ctx, { currentUser }) {
            if (currentUser) {
                return redirect(ctx, "/");
            }
        }
        render() {
            return <Component {...this.props} />
        }
    }

}