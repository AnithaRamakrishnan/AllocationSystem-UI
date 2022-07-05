import * as React from "react";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Outlet } from "react-router-dom";
import { useTheme, experimentalStyled } from "@mui/material/styles";
import userAvatar from "../assets/images/avatar_1.png";
import LogoutIcon from "@mui/icons-material/Logout";
import { AuthContext } from "../App";
import {
  NavLink as RouterLink,
  matchPath,
  useLocation,
} from "react-router-dom";
import { Button, ListItem } from "@mui/material";
import GroupsIcon from "@mui/icons-material/Groups";

const drawerWidth = 240;
const items = [
  {
    href: "/dashboard",
    title: "Dashboard",
    isAdmin: true,
  },
  {
    href: "/topic",
    title: "Add Topics",
    isAdmin: true,
  },
  {
    href: "/adminconfig",
    title: "Configuration",
    isAdmin: true,
  },
  {
    href: "/supervisor",
    title: "Select Topics To Supervise",
    isAdmin: false,
  },
  {
    href: "/allocation",
    title: "Run Allocation Algorithm",
    isAdmin: true,
  },
  {
    href: "/editstuchoice",
    title: "Modify Student Preferences",
    isAdmin: true,
  },
];

const DashboardLayoutRoot = experimentalStyled("div")(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  display: "flex",
  height: "100%",
  overflow: "hidden",
  width: "100%",
}));

function MainLayout(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const { state, dispatch } = React.useContext(AuthContext);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const theme = useTheme();

  const user = state.isAuthenticated ? state.user : { fullName: "" };

  const location = useLocation();

  const menuToRender =
    state.isAuthenticated && state.user.isAdmin
      ? items
      : items.filter((x) => x.href === "Supervisor" || x.href === "Student");
  const drawer = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        bgcolor: "background.default",
      }}
    >
      <Box
        sx={{
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
          p: 2,
        }}
      >
        <Avatar
          src={userAvatar}
          sx={{
            cursor: "pointer",
            width: 64,
            height: 64,
          }}
          to="/app/account"
        />
        <Typography color="textPrimary" variant="h5" sx={{ mt: 1 }}>
          {user.userType === "Supervisor"
            ? (user.supervisor?.title === null
                ? ""
                : user.supervisor?.title + " ") +
              (user.supervisor?.firstName === null
                ? ""
                : user.supervisor?.firstName + " ") +
              (user.supervisor?.lastName === null
                ? ""
                : user.supervisor?.lastName + " ")
            : (user.student?.title === null ? "" : user.student?.title + " ") +
              (user.student?.firstName === null
                ? ""
                : user.student?.firstName + " ") +
              (user.student?.lastName === null
                ? ""
                : user.student?.lastName + " ")}
        </Typography>
        <Typography color="textSecondary" variant="body2">
          {user.userType}
        </Typography>
      </Box>
      <Divider />
      <Box
        sx={{
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
          p: 2,
          flexGrow: 1,
        }}
      >
        {menuToRender.map((item) => (
          <ListItem
            disableGutters
            key={item.href}
            sx={{
              display: "flex",
              borderRadius: "5px",
              ...((item.href
                ? !!matchPath(
                    {
                      path: item.href,
                      end: false,
                    },
                    location.pathname
                  )
                : false) && {
                bgcolor: "primary.main",
              }),
              ...(!(item.href
                ? !!matchPath(
                    {
                      path: item.href,
                      end: false,
                    },
                    location.pathname
                  )
                : false) && {
                bgcolor: "unset",
              }),
              py: 0,
            }}
          >
            <Button
              component={RouterLink}
              sx={{
                color: "text.primary",
                fontWeight: "medium",
                justifyContent: "flex-start",
                letterSpacing: 0,
                py: 1.25,
                textTransform: "none",
                width: "100%",
                ...((item.href
                  ? !!matchPath(
                      {
                        path: item.href,
                        end: false,
                      },
                      location.pathname
                    )
                  : false) && {
                  color: "#fff",
                }),
                "& svg": {
                  mr: 1,
                },
              }}
              to={item.href}
            >
              <span>{item.title}</span>
            </Button>
          </ListItem>
        ))}
      </Box>
    </Box>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <DashboardLayoutRoot>
      <Box sx={{ display: "flex" }}>
        <AppBar
          elevation={3}
          enableColorOnDark
          position="fixed"
          sx={{
            borderTop: `3px solid ${theme.palette.progress.main}`,
            background:
              "linear-gradient(90deg, rgba(69,69,161,1) 0%, rgba(6,75,164,1) 0%)",
          }}
        >
          <Toolbar
            sx={{
              width: "100%",
              justifyContent: "space-between",
            }}
          >
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: "none" } }}
            >
              <MenuIcon />
            </IconButton>
            <GroupsIcon sx={{ fontSize: 50 }} /> 
            <Typography variant="h5" noWrap component="div" fontWeight="bold">
              Allocation System
            </Typography>
            <Box
              sx={{
                display: "flex",
                border: "1px solid #ed6c02",
                borderRadius: "5px",
              }}
            >
              <IconButton
                color="warning"
                size="small"
                sx={{ mt: 0.75, alignSelf: "center" }}
                variant="contained"
                onClick={() =>
                  dispatch({
                    type: "LOGOUT",
                  })
                }
              >
                <LogoutIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>
        <Box
          component="nav"
          sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
          aria-label="mailbox folders"
        >
          <Drawer
            container={container}
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true,
            }}
            sx={{
              display: { xs: "block", sm: "none" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
              },
            }}
          >
            {drawer}
          </Drawer>
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: "none", sm: "block" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
                top: 67,
                height: "calc(100% - 67px)",
              },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: "100%",
          }}
        >
          <Toolbar />
          <Outlet />
        </Box>
      </Box>
    </DashboardLayoutRoot>
  );
}

MainLayout.propTypes = {
  window: PropTypes.func,
};

export default MainLayout;
