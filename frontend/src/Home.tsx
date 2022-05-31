import { useEffect } from "react";
import {
  signOut,
  redirectToAuth
} from "supertokens-auth-react/lib/build/recipe/thirdpartyemailpassword";
import { useSessionContext } from "supertokens-auth-react/recipe/session";

const Home: React.FC = () => {
  const user = useSessionContext();

  const testFunction = async () => {
    const res = await fetch("http://localhost:8080/v1/test");

    console.log(res);
  };

  const signout = async () => {
    await signOut();
    redirectToAuth();
  };

  useEffect(() => {
    testFunction();
  }, []);
  return (
    <div>
      user id is {user.userId}
      <button onClick={signout}>Signout</button>
    </div>
  );
};

export default Home;
