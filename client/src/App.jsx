import { useState } from "react";
import { FacebookLoginButton } from "react-social-login-buttons";
import { LoginSocialFacebook } from "reactjs-social-login";

function App() {
  const [profile, setProfile] = useState(null);
  const [accessToken,setAccessToken]=useState("");
  return (
    <div>
      {!profile ? (
        <LoginSocialFacebook
          appId="379145715183940"
          onResolve={(response) => {
            console.log(response);
            setProfile(response.data);
            setAccessToken(response.data.accessToken)
            console.log(accessToken)
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
          <p>{accessToken}</p>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default App;