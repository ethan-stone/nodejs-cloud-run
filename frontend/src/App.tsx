import SuperTokens, {
  getSuperTokensRoutesForReactRouterDom
} from "supertokens-auth-react";
import ThirdPartyEmailPassword, {
  Google,
  ThirdPartyEmailPasswordAuth
} from "supertokens-auth-react/recipe/thirdpartyemailpassword";
import Session from "supertokens-auth-react/recipe/session";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import * as reactRouterDom from "react-router-dom";
import Home from "./Home";

SuperTokens.init({
  appInfo: {
    appName: "nodejs-cloud-run",
    apiDomain: "https://api-service-d6297ef-m2nntdyxma-uc.a.run.app",
    websiteDomain: "http://localhost:3000",
    apiBasePath: "/v1/auth",
    websiteBasePath: "/auth"
  },
  recipeList: [
    ThirdPartyEmailPassword.init({
      signInAndUpFeature: {
        providers: [Google.init()]
      }
    }),
    Session.init()
  ]
});

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ThirdPartyEmailPasswordAuth>
              <Home />
            </ThirdPartyEmailPasswordAuth>
          }
        />
        {getSuperTokensRoutesForReactRouterDom(reactRouterDom)}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
