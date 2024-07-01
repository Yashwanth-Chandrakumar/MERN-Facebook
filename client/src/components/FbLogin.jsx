import React, { useEffect } from 'react';

const FacebookLogin = () => {
  useEffect(() => {
    // Define the checkLoginState function globally
    window.checkLoginState = function () {
      window.FB.getLoginStatus(function (response) {
        statusChangeCallback(response);
      });
    };

    // Initialize the Facebook SDK
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: '998365155205042',
        cookie: true, // Enable cookies to allow the server to access the session.
        xfbml: true, // Parse social plugins on this webpage.
        version: 'v20.0', // Use this Graph API version for this call.
      });

      // Check login status after initialization
      window.FB.getLoginStatus(function (response) {
        statusChangeCallback(response); // Returns the login status.
      });
    };

    // Load the Facebook SDK asynchronously
    (function (d, s, id) {
      var js,
        fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {
        return;
      }
      js = d.createElement(s);
      js.id = id;
      js.src = 'https://connect.facebook.net/en_US/sdk.js';
      fjs.parentNode.insertBefore(js, fjs);
    })(document, 'script', 'facebook-jssdk');
  }, []);

  // Called with the results from FB.getLoginStatus().
  function statusChangeCallback(response) {
    console.log('statusChangeCallback');
    console.log(response); // The current login status of the person.
    if (response.status === 'connected') {
      // Logged into your webpage and Facebook.
      testAPI();
    } else {
      // Not logged into your webpage or we are unable to tell.
      document.getElementById('status').innerHTML = 'Please log into this webpage.';
    }
  }

  // Testing Graph API after login.
  function testAPI() {
    console.log('Welcome!  Fetching your information.... ');
    window.FB.api('/me', function (response) {
      console.log('Successful login for: ' + response.name);
      document.getElementById('status').innerHTML = 'Thanks for logging in, ' + response.name + '!';
    });
  }

  useEffect(() => {
    // Ensure the Facebook button is configured correctly after the SDK is loaded
    if (!document.getElementById('fb-login-button')) {
      const fbButton = document.createElement('div');
      fbButton.id = 'fb-login-button'; // Added id to check if button already exists
      fbButton.className = 'fb-login-button';
      fbButton.setAttribute('data-width', '');
      fbButton.setAttribute('data-size', 'large');
      fbButton.setAttribute('data-button-type', 'continue_with');
      fbButton.setAttribute('data-layout', 'default');
      fbButton.setAttribute('data-auto-logout-link', 'false');
      fbButton.setAttribute('data-use-continue-as', 'true');
      fbButton.setAttribute('data-config_id', '1014988872852851');
      fbButton.setAttribute('onlogin', 'checkLoginState();');
      document.getElementById('fb-button-container').appendChild(fbButton);

      // Re-parse XFBML to ensure the button is rendered
      if (window.FB) {
        window.FB.XFBML.parse();
      }
    }
  }, []);

  return (
    <div>
      {/* The JS SDK Login Button Container */}
      <div id="fb-button-container"></div>

      <div id="status"></div>
    </div>
  );
};

export default FacebookLogin;
