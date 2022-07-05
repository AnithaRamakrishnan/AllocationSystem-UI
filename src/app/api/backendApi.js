import axios from "axios";

const getToken = () => {
  const token = JSON.parse(localStorage.getItem("token"));
  return {
    headers: {
      Authorization: `Bearer ${token}`      
    },
  };
};

export const login = async (email, password) => {
  const response = await axios.post(
    `${process.env.REACT_APP_BASE_URL}auth/login`,
    {
      email,
      password,
    }
  );
  return response.data;
};

export const register = async (user) => {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_BASE_URL}auth/register`,
      user
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

export const getAllTopics = async () => {
  const response = await axios.get(
    `${process.env.REACT_APP_BASE_URL}Topic`,
    getToken()
  );
  return response.data;
};

export const deleteTopic = async (id) => {
  const response = await axios.delete(
    `${process.env.REACT_APP_BASE_URL}Topic/${id}`,
    getToken()
  );
  return response.data;
};

export const saveTopic = async (topic) => {
  const response = await axios.post(
    `${process.env.REACT_APP_BASE_URL}Topic`,
    topic,
    getToken()
  );
  return response.data;
};

export const updateTopic = async (id, topic) => {
  const response = await axios.put(
    `${process.env.REACT_APP_BASE_URL}Topic/${id}`,
    topic,
    getToken()
  );
  return response.data;
};

export const getChoiceById = async (id) => {
  const response = await axios.get(
    `${process.env.REACT_APP_BASE_URL}Supervisor/${id}`,
    getToken()
  );
  return response.data;
};

export const postChoiceById = async (id, listitem) => {
  const response = await axios.put(
    `${process.env.REACT_APP_BASE_URL}Supervisor/${id}`,
    listitem,
    getToken()
  );
  return response.data;
};
export const getSupervisorResult = async (id) => {
  const response = await axios.get(
    `${process.env.REACT_APP_BASE_URL}Supervisor/SupervisorResult/${id}`,
    getToken()
  );
  return response.data;
};

export const AutoAllocation = async (toa) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_BASE_URL}Admin/Allocation`,
      getToken(),
      toa
    );
    return response;
  } catch (error) {
  }
};
export const postAdminConfig = async (config) => {
  const response = await axios.post(
    `${process.env.REACT_APP_BASE_URL}Admin`,
    config,
    getToken()
  );
  return response.data;
};

export const getAdminSettings = async () => {
  const response = await axios.get(
    `${process.env.REACT_APP_BASE_URL}Admin`,
    getToken()
  );
  return response.data;
};

export const getResult = async () => {
  const response = await axios.get(
    `${process.env.REACT_APP_BASE_URL}Dashboard/Result`,
    getToken()
  );
  return response.data;
};

export const getSubmission = async () => {
  const response = await axios.get(
    `${process.env.REACT_APP_BASE_URL}Dashboard/Submission`,
    getToken()
  );
  return response.data;
};

export const getLikedTopics = async () => {
  const response = await axios.get(
    `${process.env.REACT_APP_BASE_URL}Dashboard/LikedTopics`,
    getToken()
  );
  return response.data;
};

export const getFinalPreference = async () => {
  const response = await axios.get(
    `${process.env.REACT_APP_BASE_URL}Dashboard/FinalPreference`,
    getToken()
  );
  return response.data;
};

export const getTotal = async () => {
  const response = await axios.get(
    `${process.env.REACT_APP_BASE_URL}Dashboard/Total`,
    getToken()
  );
  return response.data;
};

export const searchStudents = async () => {
  const response = await axios.get(
    `${process.env.REACT_APP_BASE_URL}Admin/StudentSearch`,
    getToken()
  );
  return response.data;
};

export const getPreferencesByStudentId = async (id) => {
  const response = await axios.get(
    `${process.env.REACT_APP_BASE_URL}Preference/${id}`,
    getToken()
  );
  return response.data;
};

export const SavePreferences = async (stupreflst) => {
  const response = await axios.post(
    `${process.env.REACT_APP_BASE_URL}Preference`,
    stupreflst,
    getToken()
  );
  return response.data;
};

export const getAdminConfig = async () => {
  const response = await axios.get(
    `${process.env.REACT_APP_BASE_URL}Preference`,
    getToken()
  );
  return response.data;
};
export const getStudentResult = async (id) => {
  const response = await axios.get(
    `${process.env.REACT_APP_BASE_URL}Preference/StudentResult/${id}`,
    getToken()
  );
  return response.data;
};
export const getNotify = async () => {
  const response = await axios.get(
    `${process.env.REACT_APP_BASE_URL}Admin/Notify`,
    getToken()
  );
  return response.data;
};

export const sleep=(ms) =>{
  return new Promise((resolve) => setTimeout(resolve, ms));
}