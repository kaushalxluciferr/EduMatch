import jwt from 'jsonwebtoken'

const studentAuth = async (req, res, next) => {
    try {
        const { token } = req.headers;
        if (!token) {
            return res.json({ success: false, message: "token not found" })
        }
        const ismatch = jwt.verify(token, process.env.JWT_SECRET)
        if (!ismatch) {
            return res.json({
                success: false,
                message: " Token not matched . try again "
            })
        }
        req.userid = token._id
        next()

    } catch (error) {

    }
}


export default studentAuth