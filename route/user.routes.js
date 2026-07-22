import express from "express";

import {
  tambahuser,
  login,
  updateuser,
  getAllusers,
} from "../controllers/user.controllers.js";

import {
  authenticateToken,
} from "../middleware/VerifyTokens.js";

const routerUser = express.Router();

routerUser.post("/", tambahuser);
routerUser.patch("/:id", authenticateToken, updateuser);
routerUser.get("/", authenticateToke
  
  
  n, getAllusers);
routerUser.post("/login", login);

routerUser.get(
  "/dashboard",
  authenticateToken,
  (req, res) => {
    res.send(
      "Welcome to Dashboard"
    );
  }
);

export default routerUser;