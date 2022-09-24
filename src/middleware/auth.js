import JWT from "jsonwebtoken";

const authenticationMiddleware = async (req, res, next) => {
  const authHeaders = req.headers.authorization;

  let token = "";

  if (!authHeaders || !authHeaders.startsWith("Bearer ")) {
    return res.status(400).json({ message: "Invalid authorization" });
  }

  if (req.cookies.jwt) {
    token = req.cookies.jwt;
  } else {
    token = authHeaders.split(" ")[1];
  }

  try {
    const decode = JWT.verify(token, process.env.JWT_SECRET);
    const { id } = decode;
    req.user = { id };
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid authorization" });
  }
};

export default authenticationMiddleware;
