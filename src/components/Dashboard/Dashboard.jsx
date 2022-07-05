import * as React from "react";
import { Box, Container, Grid, Paper, Typography } from "@mui/material";
import {
  getSubmission,
  getLikedTopics,
  getFinalPreference,
  getTotal,
} from "../../app/api/backendApi";
import StudentChart from "./StudentChart";
import DonughtChart from "./SubmissionChart";
import StudentCard from "./StudentCard";
import TopicCard from "./TopicCard";
import PreferenceCard from "./GroupCard";
import TopicChart from "./TopicChart";

function Dashboard() {
  const [piechartData, setPieChartData] = React.useState([]);
  const [piechartlabels, setPiechartlabels] = React.useState([]);
  const [piechartcount, setpiechartcount] = React.useState(0);

  const [stupiechartData, setstuPieChartData] = React.useState([]);
  const [stupiechartlabels, setstuPiechartlabels] = React.useState([]);
  const [stupiechartcount, setstupiechartcount] = React.useState(0);

  const [preferenceData, setPreferenceData] = React.useState([]);
  const [preferencelabels, setPreferencelabels] = React.useState([]);
  const [preferencecount, setpreferencecount] = React.useState(0);

  const [stucount, setstucount] = React.useState(0);
  const [topiccount, settopiccount] = React.useState(0);
  const [groupcount, setgroupcount] = React.useState(0);

  React.useEffect(() => {
    getSubmission().then((response) => {
      setstupiechartcount(2);
      setstuPieChartData([response.notSubmitted, response.submitted]);
      setstuPiechartlabels(["Non-Submission", "Submitted"]);
    });

    getLikedTopics().then((response) => {
      if (response.length > 0) {
        setpiechartcount(response.length);
        setPiechartlabels(
          Object.keys(response).map((key) => response[key].topicName)
        );
        setPieChartData(
          Object.keys(response).map((key) => response[key].percentage)
        );
      }
    });

    getFinalPreference().then((response) => {
      if (response.length > 0) {
        setpreferencecount(response.length);
        setPreferencelabels(
          Object.keys(response).map((key) => response[key].preference)
        );
        setPreferenceData(
          Object.keys(response).map((key) => response[key].count)
        );
      }
    });
    getTotal().then((response) => {
      setgroupcount(response.groups);
      setstucount(response.students);
      settopiccount(response.topics);
    });
  }, []);

  return (
    <Box
      component="main"
      sx={{
        backgroundColor: (theme) =>
          theme.palette.mode === "light"
            ? theme.palette.grey[100]
            : theme.palette.grey[900],
        flexGrow: 1,
        height: "80vh",
        overflow: "auto",
      }}
    >
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} xl={5} lg={5}>
            <Paper
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                height: 400,
              }}
            >
              % of Students Interested in Each Topic
              <StudentChart
                piechartData={piechartData}
                piechartlabels={piechartlabels}
                piechartcount={piechartcount}
              />
            </Paper>
          </Grid>
          <Grid item xl={3} lg={2}>
            <Grid item sx={{ pb: 2 }}>
              <StudentCard stucount={stucount} />
            </Grid>
            <Grid item sx={{ pb: 3 }}>
              <TopicCard topiccount={topiccount} />
            </Grid>
            <Grid item>
              <PreferenceCard groupcount={groupcount} />
            </Grid>
          </Grid>
          <Grid item xl={4} lg={5}>
            <Paper
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                height: 400,
              }}
            >
              <Typography>Preference Submission Vs Non-Submission</Typography>
              <DonughtChart
                stupiechartData={stupiechartData}
                stupiechartlabels={stupiechartlabels}
                stupiechartcount={stupiechartcount}
              />
            </Paper>
          </Grid>
          <Grid item xs={12} xl={12} md={12} lg={12}>
            <Paper
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                height: 400,
              }}
            >
              Students who got Final Topic with Preference Order
              <TopicChart
                preferenceData={preferenceData}
                preferencelabels={preferencelabels}
                preferencecount={preferencecount}
              />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default Dashboard;
