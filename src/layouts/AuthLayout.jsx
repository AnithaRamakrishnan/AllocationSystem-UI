import { Outlet } from "react-router-dom";
import { experimentalStyled } from "@mui/material/styles";

const AuthLayoutRoot = experimentalStyled("div")(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  display: "flex",
  height: "100%",
  overflow: "hidden",
  width: "100%",
  flexDirection: "column",
}));

const AuthLayoutWrapper = experimentalStyled("div")({
  display: "flex",
  flex: "1 1 auto",
  overflow: "hidden",
  paddingTop: 64,
});

const AuthLayoutContainer = experimentalStyled("div")({
  display: "flex",
  flex: "1 1 auto",
  overflow: "hidden",
});

const AuthLayoutContent = experimentalStyled("div")({
  flex: "1 1 auto",
  height: "100%",
  overflow: "auto",
});

function AuthLayout() {
  return (
    <AuthLayoutRoot>
      <AuthLayoutWrapper>
        <AuthLayoutContainer>
          <AuthLayoutContent>
            <Outlet />
          </AuthLayoutContent>
        </AuthLayoutContainer>
      </AuthLayoutWrapper>
    </AuthLayoutRoot>
  );
}

export default AuthLayout;
