import React from "react";
import "./App.css";
import AuthLayout from "./layouts/AuthLayout";
import MainLayout from "./layouts/MainLayout";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import { useRoutes, Navigate } from "react-router-dom";
import { experimentalStyled, StyledEngineProvider } from "@mui/material/styles";
import Footer from "./layouts/Footer";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import Supervisor from "./components/Supervisor";
import Student from "./components/Student";
import Dashboard from "./components/Dashboard/Dashboard";
import Topic from "./components/Admin/Topic";
import AddTopic from "./components/Admin/AddTopic";
import AdminConfig from "./components/Admin/AdminConfig";
import Allocation from "./components/Admin/Allocation";
import EditStudentPreference from "./components/Admin/EditStudentPreference";

export const AuthContext = React.createContext();

const initialState = {
  isAuthenticated: false,
  user: null,
  token: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      localStorage.setItem("user", JSON.stringify(action.payload));
      localStorage.setItem("token", JSON.stringify(action.payload.token));
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
        token: action.payload.token,
      };
    case "LOGOUT":
      localStorage.clear();
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      };
    default:
      return state;
  }
};

const WrapperDiv = experimentalStyled("div")({
  height: "94vh",
  "& > div": {
    position: "unset",
    height: "92vh",
    flexDirection: "column",
  },
});

const NotFound = () => (
  <div>
    <h3>404 page not found</h3>
    <p>We are sorry but the page you are looking for does not exist.</p>
  </div>
);

const routes = (userType) => [
  {
    path: "/",
    element: userType ? <MainLayout /> : <Navigate to="/login" />,
    children: [
      { path: "/dashboard", element: <Dashboard /> },
      { path: "/topic", element: <Topic /> },
      { path: "/adminconfig", element: <AdminConfig/> },
      { path: "/supervisor", element: <Supervisor /> },
      { path: "/student", element: <Student /> },
      { path: "/add-topic", element: <AddTopic /> },
      { path: "/allocation", element: <Allocation /> },
      { path: "/editstuchoice", element: <EditStudentPreference /> },
      
    ],
  },
  {
    path: "/",
    element: userType ? <MainLayout /> : <Navigate to="/login" />,
    children: [{ path: "*", element: <NotFound /> }],
  },
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
    ],
  },
];

function App() {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  React.useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || null);
    const token = JSON.parse(localStorage.getItem("token") || null);

    if (user && token) {
      dispatch({
        type: "LOGIN",
        payload: {
          user,
          token,
        },
      });
    }
  }, []);

  const getUserType = () => {
    if (state.isAuthenticated) {
      return state.user.isAdmin ? "Admin" : (state.user.userType?"Student":"Supervisor");
    }
    return undefined;
  };

  const routing = useRoutes(routes(getUserType()));

  return (
    <StyledEngineProvider injectFirst>
      
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <AuthContext.Provider
            value={{
              state,
              dispatch,
            }}
          >
            <WrapperDiv className="div-wrapper">{routing}</WrapperDiv>
            <Footer/>
          </AuthContext.Provider>
        </LocalizationProvider>
    </StyledEngineProvider>
  );
}

export default App;
