import { Button, Box, Checkbox, Table,
  TableBody,
  Typography,
  TableHead,
  TableRow, 
  Container
  } from "@mui/material";  
import { styled } from "@mui/material/styles";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import React from "react";
import MUIDataTable from "mui-datatables";
import {
  getChoiceById,
  postChoiceById,
  getAdminConfig,
  getSupervisorResult
} from "../app/api/backendApi";
import { AuthContext } from "../App";
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

const Supervisor = () => {
  const [topics, setTopics] = React.useState([]);
  const [submit, setSubmit] = React.useState("Save Changes");
  const [list, setList] = React.useState([]);
  const [isresult, setisresult] = React.useState(false);
  const [suplist, setsuplist] = React.useState({});

  const { state } = React.useContext(AuthContext);

  React.useEffect(() => {
    getAdminConfig().then((response) => {
      setisresult(response.isAllocationDone);
    });
    getChoiceById(state?.user?.supervisor?.id)
      .then((response) => {
        setTopics(response);
        setList(response);
        if (response.filter((item) => item.isSelected === true));
        setSubmit("Update Changes");
      })
      .catch((error) => {
        toast.error("Cannot load data from server!", {
          position: "bottom-center",
          autoClose: 3000,
        });
      });      
      getSupervisorResult(state?.user?.supervisor?.id).then((response) => {
        setsuplist(response);
      });
  }, [state]);
  // // eslint-disable-next-line react-hooks/exhaustive-deps

  const columns = [
    {
      name: "name",
      label: "Name",
      options: {
        filter: true,
        filterOptions: { fullWidth: true },
      },
    },
    {
      name: "Select",
      label: "Select",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value) => {
          const isUsed = isSelected(value);
          return (
            <Checkbox
              checked={isUsed}
              color="primary"
              onChange={(e) => {
                updateTopics(value, e.target.checked);
              }}
            />
          );
        },
      },
    },
  ];

  const data = topics.map((topic) => [topic.text, topic.id]);

  const isSelected = (id) => {
    return topics.find((qx) => qx.id === id).isSelected;
  };

  const updateTopics = (id, isChecked) => {
    const newList = topics.map((item) => {
      if (item.id === id) {
        const updatedItem = {
          ...item,
          isSelected: isChecked,
        };
        return updatedItem;
      }
      return item;
    });
    setTopics(newList);
  };

  const options = {
    filterType: "dropdown",
    responsive: "vertical",
    tableBodyHeight: "410px",
    tableBodyMaxHeight: "",
    selectableRows: "none",
    textLabels: {
      body: {
        noMatch: "No items to display",
      },
    },
  };

  const handleSubmit = () => {
    var count = topics.filter((c) => c.isSelected === true);
    if (count.length === 0) {
      toast.info("Please select any topics", {
        position: "bottom-center",
        autoClose: 1000,
      });
    } else if (JSON.stringify(list) === JSON.stringify(topics)) {
      toast.info(
        "No Changes to " + (submit === "Save Changes" ? "Save" : "Update"),
        { position: "bottom-center", autoClose: 1000 }
      );
    } else {
      postChoiceById(state?.user?.supervisor?.id, topics)
        .then((response) => {
          setTopics(response);
          setList(response);
          toast.success(
            "Selected Topics " +
              (submit === "Save Changes" ? "Saved" : "Updated") +
              " successfully!",
            { position: "bottom-center", autoClose: 1000 }
          );
          if (response.filter((item) => item.isSelected === true)) {
            setSubmit("Update Changes");
          } else {
            setSubmit("Save Changes");
          }
        })
        .catch((error) => {
          setTopics(list);
          toast.error(
            "Error Occcured! Failed to" +
              (submit === "Save Changes" ? "Save" : "Update"),
            { position: "bottom-center", autoClose: 2000 }
          );
        });
    }
  };

  const handleReset = () => {
    setTopics(list);
  };

  return (
    <>
      {" "}
      {isresult ? 
          (suplist?.length>0 ?(
            <Container maxWidth="sm">
            <Box
              sx={{
                backgroundColor: "background.default",
                display: "flex",
                flexDirection: "column",
                height: "100%",
                alignItems: "center",
                marginTop: 8,
              }}
            >
            <Typography variant="h6" sx={{ style: { fontSize: 25 } }}>
            Your final supervising list is as follows.
            </Typography>
            <Table stickyHeader aria-label="Supervisor table">
              <TableHead>
                <StyledTableRow>
                  <StyledTableCell>Sno</StyledTableCell>
                  <StyledTableCell>Group</StyledTableCell>
                  <StyledTableCell>Topic</StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {suplist.map((stu, index) => (
                  <StyledTableRow key={index}>
                    <StyledTableCell>{index + 1}</StyledTableCell>
                    <StyledTableCell>{stu.groupname}</StyledTableCell>
                    <StyledTableCell>{stu.topicname}</StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
          </Container>
          ) :(
          <Typography variant="h6" sx={{ style: { fontSize: 25 } }}>
            Allocation done. Please contact admin for your topic.
          </Typography>
          )
        
      ) : (
        <>
          <div>
            <MUIDataTable
              title={"Select Topics you wish to supervise"}
              data={data}
              columns={columns}
              options={options}
            />
          </div>

          <div sx={{ pl: 5 }}>
            <Box sx={{ py: 1, pl: 2 }}>
              <Button
                color="primary"
                variant="contained"
                onClick={handleSubmit}
                sx={{ mr: 2 }}
              >
                {submit}
              </Button>
              <Button
                color="secondary"
                variant="contained"
                onClick={handleReset}
                sx={{ mr: 2 }}
              >
                Reset
              </Button>
            </Box>
          </div>
        </>
      )}
      <ToastContainer style={{ width: "400px" }} />
    </>
  );
};
export default Supervisor;
