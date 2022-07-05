import React from "react";

const defaultUser = {
  id: -1,
  isActive: undefined,
  email: "",
  fullName: "",
  isAdmin: undefined,
  token: "",
};

export const UserContext = React.createContext({ user: defaultUser });