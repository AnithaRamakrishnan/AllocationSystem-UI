import * as React from "react";

import {
  Box,
  Button,
  Container,
  Grid,
  FormControl,
  MenuItem,
  OutlinedInput,
  InputLabel,
  Typography,
  IconButton,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  ListItemText, 
  Select 
} from "@mui/material";
import { createStyles, makeStyles } from "@mui/styles";
import { styled } from "@mui/material/styles";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import {
  getAllTopics,
  getPreferencesByStudentId,
  SavePreferences,
  getAdminConfig,
  getStudentResult
} from "../app/api/backendApi";
import { AuthContext } from "../App";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Chip from "@mui/material/Chip";
import clsx from "clsx";
import { Close } from "@mui/icons-material";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.info.dark, 
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const useStyles = makeStyles((theme) =>
  createStyles({
    paper: {
      maxHeight: 450,
      marginTop: theme.spacing.unit * 3,
      overflowX: "auto",
    },
  })
);

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function Student() {
  const [pref, setPref] = React.useState(0);
  const [topics, setTopics] = React.useState([]);
  const [selectedPref, setselectedPref] = React.useState([]);
  const { state } = React.useContext(AuthContext);
  const [isPassed, setisPassed] = React.useState(false);
  const [isresult, setisresult] = React.useState(false);
  const [studentlist, setstudentlist] = React.useState({});

  const classes = useStyles();

  React.useEffect(() => {
    const id = toast.loading("Please wait...", {
      position: "top-center",
      autoClose: 1000,
      closeOnClick: true,
      className: "primaryColor",
    });
    getAllTopics()
      .then((response) => {
        setTopics(response);
      })
      .catch((error) => {
      });

      getAdminConfig().then((response) => {
      setPref(response.noOfPreferences);
      setisPassed(response.lastSubmissionDate);
      setisresult(response.isAllocationDone); 
    });

    if (state) {
      getPreferencesByStudentId(state.user.student.id).then((response) => {
        setselectedPref(response);
      });
      getStudentResult(state.user.student.id).then((response) => {
        setstudentlist(response);
      });
    }
    toast.update(id, { autoClose: 100, isLoading: false });   
  }, [state]);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;

    setselectedPref(value);
  };

  const onClear = () => {
    if (state) {
      getPreferencesByStudentId(state.user.student.id)
        .then((response) => {
          setselectedPref(response);
        })
        .catch();
    }
  };

  const onSubmit = () => {
    let stuid;
    if (state) {
      stuid = state.user.student.id;
    }
    if (selectedPref.length === pref) {
      SavePreferences({ id: stuid, topicPriorities: selectedPref })
        .then((response) => {
          toast.success("Preferences Saved Successfully!", {
            position: "bottom-center",
            autoClose: 1000,
          });
        })
        .catch((error) => {
          toast.error("Unable to save preferences!", {
            position: "bottom-center",
            autoClose: 3000,
          });
        })
        .finally(() => {
          getAllTopics().then((response) => {
            setTopics(response);
          });
        });
    } else {
      toast.warn("Please select " + pref + " preference(s) to save!", {
        position: "bottom-center",
        autoClose: 3000,
      });
    }
  };

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          backgroundColor: "background.default",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          alignItems: "center",
          py: 3,
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} lg={9}>
            <FormControl sx={{ m: 1, width: "100%" }}>
              <InputLabel id="topic-label">Topics</InputLabel>
              <Select
                labelId="topic-label"
                id="topic"
                multiple
                fullWidth
                value={selectedPref}
                onChange={handleChange}
                input={<OutlinedInput id="select-topic" label="Topics" />}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {topics.length > 0 &&
                      selectedPref.map((value) => (
                        <Chip
                          key={value}
                          label={topics?.find((e) => e.id === value).text}
                          value={value}
                        />
                      ))}
                  </Box>
                )}
                MenuProps={MenuProps}
              >
                {topics.map((name) => (
                  <MenuItem
                    key={name.id}
                    value={name.id}
                    disabled={selectedPref.length >= pref ? true : false}
                  >
                    <Checkbox checked={selectedPref.includes(name.id)} />
                    <ListItemText primary={name.text} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} lg={3}>
            <Button
              id="btn_save"
              color="primary"
              size="large"
              type="submit"
              disabled={isPassed}
              variant="contained"
              sx={{ m: 2 }}
              onClick={onSubmit}
            >
              Save
            </Button>
            <Button
              id="btn_clear"
              color="primary"
              size="large"
              type="submit"
              disabled={isPassed}
              variant="contained"
              sx={{ m: 2 }}
              onClick={onClear}
            >
              Reset
            </Button>
          </Grid>
          <Grid item xs={12} lg={isresult ?8:10}>
            <TableContainer component={Paper} className={classes.paper}>
              {isresult ?  (studentlist.studentlist?.length>0 ?( 
                <>
                <Typography
                variant="h6"
                sx={{ style: { fontSize: 25 } }}
                >
                Your Final Group is "{studentlist.groupname }" and Topic is "{ studentlist.topicname}".
                Your team members are                         
                </Typography>
                <Table
                  stickyHeader
                  aria-label="Student table"
                >
                  <TableHead>
                    <StyledTableRow>
                      <StyledTableCell>Sno</StyledTableCell>
                      <StyledTableCell>
                        Student Name ( user name )
                      </StyledTableCell>
                    </StyledTableRow>
                  </TableHead>
                  <TableBody>
                  {                  
                      studentlist.studentlist.map((stu, index) => (
                        <StyledTableRow key={index}>
                          <StyledTableCell>{index + 1}</StyledTableCell>
                          <StyledTableCell>{stu}</StyledTableCell>
                        </StyledTableRow>
                      ))}
                  </TableBody>
                </Table></>)
:(
<Typography
variant="h6"
sx={{ style: { fontSize: 25 } }}
>
Allocation done. Please contact admin for your topic.                            
</Typography>)
              ) : (
                <Table
                  sx={{ width: "100%" }}
                  stickyHeader
                  aria-label="Student table"
                >
                  <TableHead>
                    <StyledTableRow>
                      <StyledTableCell>Topic Name</StyledTableCell>
                      <StyledTableCell style={{ width: 150 }} align="right">
                        Preference Order
                      </StyledTableCell>
                      <StyledTableCell style={{ width: 100 }}>
                        Remove
                      </StyledTableCell>
                    </StyledTableRow>
                  </TableHead>
                  <TableBody>
                    {selectedPref.length === 0 ? (
                      <StyledTableRow>
                        <StyledTableCell colSpan={12}>
                          <Typography
                            variant="h6"
                            sx={{ style: { fontSize: 25 } }}
                          >
                            There is no data to display. Please add your
                            preferences
                          </Typography>
                        </StyledTableCell>
                      </StyledTableRow>
                    ) : (
                      selectedPref.length > 0 &&
                      topics.length > 0 &&
                      selectedPref.map((stu, index) => (
                        <StyledTableRow key={stu}>
                          <StyledTableCell>
                            {topics?.find((e) => e.id === stu).text}
                          </StyledTableCell>
                          <StyledTableCell align="right">
                            {index + 1}
                          </StyledTableCell>
                          <StyledTableCell key={stu} align="right">
                            <IconButton
                              disabled={isPassed}
                              className={clsx(classes.button, classes.delete)}
                              onClick={() => {
                                setselectedPref(
                                  selectedPref?.filter((a) => a !== stu)
                                );
                              }}
                            >
                              <Close className={classes.icon} />
                            </IconButton>
                          </StyledTableCell>
                        </StyledTableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}
            </TableContainer>
          </Grid>
        </Grid>
      </Box>
      <ToastContainer style={{ width: "400px" }} />
    </Container>
  );
}

export default Student;