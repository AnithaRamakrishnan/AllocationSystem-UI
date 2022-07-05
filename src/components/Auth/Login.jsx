import React from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { Formik } from "formik";
import {
  Box,
  Button,
  Container,
  Card,
  TextField,
  Link,
  Typography,
  Grid,
  Paper,
} from "@mui/material";
import { AuthContext } from "../../App";
import { login } from "../../app/api/backendApi";
import LoginIcon from "@mui/icons-material/Login";
import { blue } from "@mui/material/colors";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createStyles, makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) =>
  createStyles({
    gridbg: {
      backgroundPosition: "center",
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat",
    },
  })
);
function Login() {
  const navigate = useNavigate();
  const { dispatch } = React.useContext(AuthContext);
  const initialValues = {
    email: "",
    password: "",
  };

  const classes = useStyles();
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Must be a valid email")
      .max(255)
      .required("Email is required"),
    password: Yup.string().max(255).required("Password is required"),
  });

  const onSubmit = async (values) => {
    login(values.email, values.password)
      .then((response) => {
        dispatch({
          type: "LOGIN",
          payload: response,
        });
        if (response.isAdmin) {
          navigate("/dashboard", { replace: true });
        } else {
          if (response.userType === "Student") {
            navigate("/student", { replace: true });
          } else {
            navigate("/supervisor", { replace: true });
          }
        }
      })
      .catch((error) => {
        toast.error("Login failed. Invalid Username or Password!", {
          position: "bottom-center",
          autoClose: 3000,
        });
      });
  };

  return (
    <Grid container component="main" sx={{ height: "100%" }}>
      <Grid
        item
        sm={4}
        md={7}
        className={classes.gridbg}
        display={{ xs: "none", md: "block", lg: "block" }}
      >
        <img
          src={require("../../assets/images/Allocation.jpg")}
          height="592px"
          width="100%"
          alt="Welcome to Preference Allocation System"
        />
      </Grid>
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <Box
          sx={{
            my: 14,
            mx: 2,
            display: "flex",
            flexDirection: "column",
            backgroundColor: "background.default",
            justifyContent: "center",
          }}
        >
          <Container maxWidth="sm" sx={{ justifyContent: "canter" }}>
            <Card
              sx={{
                backgroundColor: "background.default",
                boxShadow: 3,
                p: 5,
              }}
            >
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
              >
                {({
                  errors,
                  handleBlur,
                  handleChange,
                  handleSubmit,
                  isSubmitting,
                  touched,
                  values,
                }) => (
                  <form onSubmit={handleSubmit}>
                    <Typography
                      component="div"
                      variant="h4"
                      color="textSecondary"
                    >
                      <Box sx={{ fontStyle: "italic" }}>
                        {" "}
                        Allocation System{" "}
                        <LoginIcon fontSize="large" sx={{ color: blue[400] }} />
                      </Box>
                    </Typography>
                    <TextField
                      error={Boolean(touched.email && errors.email)}
                      fullWidth
                      helperText={touched.email && errors.email}
                      label="Email"
                      margin="normal"
                      name="email"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      type="email"
                      value={values.email}
                      variant="standard"
                    />
                    <TextField
                      error={Boolean(touched.password && errors.password)}
                      fullWidth
                      helperText={touched.password && errors.password}
                      label="Password"
                      margin="normal"
                      name="password"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      type="password"
                      value={values.password}
                      variant="standard"
                    />
                    <Box sx={{ py: 2 }}>
                      <Button
                        color="primary"
                        disabled={isSubmitting}
                        fullWidth
                        size="large"
                        type="submit"
                        variant="contained"
                      >
                        Login
                      </Button>
                    </Box>
                  </form>
                )}
              </Formik>
              <Grid container justifyContent="flex-end">
                Don't have an account? &nbsp;
                <Link
                  sx={{ fontSize: 16 }}
                  component="button"
                  variant="body2"
                  onClick={() => {
                    navigate("/register", { replace: true });
                  }}
                >
                  Sign Up
                </Link>
              </Grid>
            </Card>
          </Container>
        </Box>
      </Grid>
      <ToastContainer style={{ width: "400px" }} />
    </Grid>
  );
}

export default Login;
