import React from 'react';

import AlertBox from '@department-of-veterans-affairs/formation/AlertBox';
import LoadingIndicator from '@department-of-veterans-affairs/formation/LoadingIndicator';

import siteName from '../../../platform/brand-consolidation/site-name';
import SubmitSignInForm from '../../../platform/brand-consolidation/components/SubmitSignInForm';
import { isFullScreenLoginEnabled } from '../../../platform/user/authentication/utilities';
import { setupProfileSession } from '../../../platform/user/profile/utilities';
import { apiRequest } from '../../../platform/utilities/api';
import environment from '../../../platform/utilities/environment';

import facilityLocator from '../../facility-locator/manifest';

export class AuthApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: props.location.query.auth === 'fail' };
  }

  componentDidMount() {
    if (!this.state.error) this.validateSession();
  }

  handleAuthError = () => {
    this.setState({ error: true });
  };

  handleAuthSuccess = payload => {
    setupProfileSession(payload);

    if (isFullScreenLoginEnabled()) {
      const returnUrl = sessionStorage.getItem('authReturnUrl');
      sessionStorage.removeItem('authReturnUrl');
      window.location = returnUrl || '/';
    } else {
      const parent = window.opener;
      parent.postMessage('loggedIn', environment.BASE_URL);

      // Internet Explorer 6-11
      const isIE = /*@cc_on!@*/ false || !!document.documentMode; // eslint-disable-line spaced-comment
      // Edge 20+
      const isEdge = !isIE && !!window.StyleMedia;

      // Reload the parent window if the user is using IE or Edge,
      // due to unreliable support for postMessage.
      if (isIE || isEdge) parent.location.reload();

      window.close();
    }
  };

  // Fetch the user to get the login policy and validate the session.
  validateSession = () => {
    apiRequest('/user', null, this.handleAuthSuccess, this.handleAuthError);
  };

  renderError = () => {
    const { code } = this.props.location.query;
    let alertProps;

    switch (code) {
      case '001':
        alertProps = {
          headline: 'We couldn’t complete the sign-in process',
          content: (
            <div>
              <p>
                We’re sorry. It looks like you selected "Deny" on the last page
                when asked for your permission to share information with
                {siteName}, so we couldn’t complete the process. To give you
                full access to the tools on {siteName}, we need to be able to
                share your information with the site.
              </p>
              <p>
                Please try again and click “Accept” on the final page. Or, you
                can try signing in with your premium DS Logon or premium My
                HealtheVet account instead of identity proofing with ID.me.
              </p>
            </div>
          ),
        };
        break;

      case '002':
      case '003':
        alertProps = {
          headline: 'Please update your computer’s time settings',
          content: (
            <p>
              We’re sorry. It looks like your computer’s clock isn’t showing the
              right time, and that’s causing a problem in how it communicates
              with our system. Please update your computer’s settings to the
              current date and time, and then try again.
            </p>
          ),
        };
        break;

      case '004':
        alertProps = {
          headline: 'We can’t match your information to our Veteran records',
          content: (
            <div>
              <p>
                We’re sorry. We can’t verify your identity because we can’t
                match your information to our Veteran records.
              </p>
              <p>
                Please check the information you entered and make sure it
                matches the information in your records. If you feel you’ve
                entered your information correctly, and it’s still not matching,
                please contact your nearest VA medical center. Let them know you
                need to verify the information in your records, and update it as
                needed. The operator, or a patient advocate, can connect with
                you with the right person who can help.
              </p>
              <p>
                <a
                  href={`${
                    facilityLocator.rootUrl
                  }/?facilityType=health&page=1&zoomLevel=7`}
                >
                  Find your nearest VA medical center.
                </a>
              </p>
            </div>
          ),
        };
        break;

      case '005':
      default:
        alertProps = {
          headline: 'We couldn’t sign you in',
          content: (
            <div>
              <p>We’re sorry. Something went wrong on our end.</p>
              <p>
                Please{' '}
                <SubmitSignInForm>
                  call the {siteName} Help Desk at{' '}
                  <a href="tel:855-574-7286">1-855-574-7286</a>, TTY:{' '}
                  <a href="tel:18008778339">1-800-877-8339</a>. We’re open
                  Monday &#8211; Friday, 8:00 a.m. &#8211; 8:00 p.m. (ET).
                </SubmitSignInForm>
              </p>
            </div>
          ),
        };
    }

    return (
      <AlertBox
        {...alertProps}
        isVisible
        status="error"
        onCloseAlert={window.close}
      />
    );
  };

  render() {
    const view = this.state.error ? (
      this.renderError()
    ) : (
      <LoadingIndicator message={`Signing in to ${siteName}...`} />
    );

    return (
      <div className="row">
        <div className="small-12 columns">{view}</div>
      </div>
    );
  }
}

export default AuthApp;
