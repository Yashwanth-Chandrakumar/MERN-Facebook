import { useState } from "react";
import { FacebookLoginButton } from "react-social-login-buttons";
import { LoginSocialFacebook } from "reactjs-social-login";

function App() {
  const [profile, setProfile] = useState(null);

  return (
    <div>
      {!profile ? (
        <LoginSocialFacebook
          appId="374538715737130"
          onResolve={(response) => {
            console.log(response);
            setProfile(response.data);
          }}
          onReject={(error) => {
            console.log(error);
          }}
        >
          <FacebookLoginButton />
        </LoginSocialFacebook>
      ) : (
        ""
      )}

      {profile ? (
        <div>
          <h1>{profile.name}</h1>
          <img src={profile.picture.data.url} />
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default App;