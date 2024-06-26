import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import React, { ReactNode, Suspense, lazy } from "react";
import "./App.css";
// import Home from "./Pages/Home";
// import Analytics from "./Pages/Analytics";
// import Create from "./Pages/Create";
// import Login from "./Pages/Login";
// import Signup from "./Pages/Signup";
// import History from "./Pages/History";
import Loading from "./components/Loading";
import ForgetPassword from "./Pages/ForgetPassword";
import UpdatePassword from "./Pages/UpdatePassword";

let Home = lazy(() => import("./Pages/Home"));
let Analytics = lazy(() => import("./Pages/Analytics"));
let History = lazy(() => import("./Pages/History"));
let Create = lazy(() => import("./Pages/Create"));
let Login = lazy(() => import("./Pages/Login"));
let Signup = lazy(() => import("./Pages/Signup"));
interface RequireAuthProps {
  children: ReactNode;
}
function App() {
  let theToken = localStorage.getItem("gbQrId");
  let theSessionToken = sessionStorage.getItem("gbQrId");
  let isSigned = localStorage.getItem("gqrSigned");
  const RequireAuth: React.FC<RequireAuthProps> = ({ children }) => {
    if (isSigned === "true") {
      return theToken ? children : <Navigate to="/" />;
    } else if (isSigned === "false") {
      return theSessionToken ? children : <Navigate to="/" />;
    } else {
      return <Navigate to="/" />;
    }
  };
  return (
    <>
      {" "}
      <Suspense fallback={<Loading />}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard">
              <Route
                path=""
                element={
                  <RequireAuth>
                    <Analytics />
                  </RequireAuth>
                }
              />
              <Route
                path="history"
                element={
                  <RequireAuth>
                    <History />
                  </RequireAuth>
                }
              />
              <Route
                path="create"
                element={
                  <RequireAuth>
                    <Create />
                  </RequireAuth>
                }
              />
              <Route path="create">
                <Route
                  path=":id"
                  element={
                    <RequireAuth>
                      <Create />
                    </RequireAuth>
                  }
                />
                <Route
                  path=""
                  element={
                    <RequireAuth>
                      <Create />
                    </RequireAuth>
                  }
                />
              </Route>
              <Route path="signin" element={<Login />} />
              <Route path="forget" element={<ForgetPassword />} />
              <Route path="updatePassword/:id" element={<UpdatePassword />} />
              <Route path="signup" element={<Signup />} />
            </Route>
            {/* <Route path="*" element={<Navigate to="/" />} /> */}
          </Routes>
        </BrowserRouter>
      </Suspense>
    </>
  );
}

export default App;
