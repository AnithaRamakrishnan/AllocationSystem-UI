import React, { useEffect } from "react";
import {
  Button,
  Box,
  Typography,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { createStyles, makeStyles } from "@mui/styles";
import { styled } from "@mui/material/styles";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import {
  sleep,
  AutoAllocation,
  getResult,
  getNotify,
} from "../../app/api/backendApi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
      height: 500,
      width: "100%",
      marginTop: theme.spacing.unit * 3,
      overflowX: "auto",
    },
  })
);

const Allocation = () => {
  const [result, setResult] = React.useState([]);
  const [isexceed, setisexceed] = React.useState(false);
  const classes = useStyles();

  useEffect(() => {
    getResult().then((response) => {
      setResult(response);
    });
    getNotify().then((response) => {
      setisexceed(response);
    });
  }, []);

  const handleSubmit = async () => {
    if (isexceed) {
      toast.warn("Less Topics!!! students may be left unassigned.Please add topics or change admin config!", {
        position: "top-center",
        autoClose: 4000,
        width:"700px",
      });
    } else {
      const id = toast.loading("Running Algorithm.Please wait...", {
        position: "top-center",
        autoClose: 1000,
        closeOnClick: true,
        className: "primaryColor",
      });
      await sleep(3000);
      AutoAllocation()
        .then((response) => {
          toast.update(id, {
            render:
              response.data === "Success"
                ? "Allocation Process Completed successfully!"
                : response.data,
            type:
              response.data === "Success"
                ? "success"
                : response.data.includes("Allocation Process Failed")
                ? "error"
                : "warn",
            isLoading: false,
            position: "top-center",
            autoClose: 1000,
          });
        })
        .catch(function (error) {
          if (error.response) {
            toast.update(id, {
              render: "Error occured during allocation process!",
              type: "error",
              isLoading: false,
              position: "top-center",
              autoClose: 1000,
            });
          }
        })
        .finally(() => {
          getResult().then((response) => {
            setResult(response);
          });
        });
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        boxShadow:
          "0px 2px 4px -1px rgb(0 0 0 / 12%), 0px 4px 5px 0px rgb(0 0 0 / 12%), 0px 1px 10px 0px rgb(0 0 0 / 12%)",
        borderRadius: "4px",
      }}
    >
      <Box
        sx={{
          py: 1,
          display: "flex",
          mr: 1,
          justifyContent: "center",
        }}
      >
        <Button
          color="primary"
          variant="contained"
          onClick={handleSubmit}
          sx={{ mr: 2 }}
        >
          Run Allocation Process
        </Button>
        <ToastContainer style={{ width: "500px", padding: "50px" }} />
      </Box>
      <Box
        sx={{
          py: 1,
          display: "flex",
          mr: 1,
          justifyContent: "center",
        }}
      >
        <TableContainer component={Paper} className={classes.paper}>
          <Table stickyHeader
            sx={{ minWidth: 700 }}
            aria-label="allocation result table"
          >
            <TableHead>
              <StyledTableRow>
                <StyledTableCell />
                <StyledTableCell>Group</StyledTableCell>
                <StyledTableCell>Topic</StyledTableCell>
                <StyledTableCell>Supervisor</StyledTableCell>
                <StyledTableCell align="right">No Of Students</StyledTableCell>
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {result.map((row) => (
                <Row key={row.group} row={row} />
              ))}             
            </TableBody>            
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};
export default Allocation;

function Row(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <StyledTableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <StyledTableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </StyledTableCell>
        <StyledTableCell component="th" scope="row">
          {row.groupName}
        </StyledTableCell>
        <StyledTableCell>{row.topicName}</StyledTableCell>
        <StyledTableCell>{row.supervisorName}</StyledTableCell>
        <StyledTableCell align="right">{row.students.length}</StyledTableCell>
      </StyledTableRow>
      <StyledTableRow>
        <StyledTableCell padding={"none"} colSpan={6}>
          <Collapse hidden={!open} in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Student List
              </Typography>
              <Table size="small" aria-label="studentlist">
                <TableHead>
                  <StyledTableRow>
                    <StyledTableCell>Student Name ( User Name )</StyledTableCell>
                    <StyledTableCell align="right">
                      Final Topic from Selected Preference
                    </StyledTableCell>
                  </StyledTableRow>
                </TableHead>
                <TableBody>
                  {row.students.map((stu) => (
                    <StyledTableRow key={stu.studentName}>
                      <StyledTableCell component="th" scope="row">
                        {stu.studentName}
                      </StyledTableCell>
                      <StyledTableCell key={stu.matchedPreferenceOrder} align="right">
                        {stu.matchedPreferenceOrder}
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </StyledTableCell>
      </StyledTableRow>
    </React.Fragment>
  );
}