import jwt from "jsonwebtoken";

// type-1
// export const verifyToken = (req, res, next) => {
//   try {
//     const token = req.cookies?.token;
//     if (!token) return res.status(401).json({ message: "Not Authenticated!" });

//     const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
//     // console.log("decodedToken:: ", decodedToken);

//     req.userId = decodedToken.id;
//     next();
//   } catch (error) {
//     return res.status(403).json({ message: "Token is not Valid!" });
//   }
// };

// type-2
export const verifyToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) return res.status(401).json({ message: "Not Authenticated!" });

  jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
    if (err) return res.status(403).json({ message: "Token is not Valid!" });
    req.userId = payload.id;
    console.log("req.userId::", req.userId);
    next();
  });
};
