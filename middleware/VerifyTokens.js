import jwt from "jsonwebtoken";

export const authenticateToken = (
  req,
  res,
  next
) => {
  const token =
    req.headers["authorization"];

  if (!token) {
    return res
      .status(401)
      .send("Access Denied");
  }

  try {
    const verified = jwt.verify(
      token,
      "kasir_secret_key"
    );

    req.user = verified;

    next();
  } catch (err) {
    res.status(400).send("Invalid Token");
  }
};