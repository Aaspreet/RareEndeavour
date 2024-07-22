
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization.split("Bearer ")[1];
    console.log(token);
}