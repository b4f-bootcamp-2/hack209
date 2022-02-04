const express = require("express")
const app = express()
const port = process.env.PORT ?? 3000
const { insertUser, findUserByEmail, insertSession, getStudentInfo, getEmailByToken, getTop, getAwardsByEmail, getPhotosByEmail, insertMessages, getTips, getRewarsByEmail } = require("./db")
const { validateNewUser } = require("./validateUser")
const bcrypt = require("bcrypt")

app.use(express.json())

// const hashPassword = async (pw) => {
//     const salt = await bcrypt.genSalt(12)
//     const hash = await bcrypt.hash(pw, salt)
//     return hash
// }

// const comparePasswords = async (pw, hashedPassword) => {
//     let result = await bcrypt.compare(pw, hashedPassword)
//     return result
// }

app.post("/signup", async (req, res) => {

    const errors = await validateNewUser(req.body)

    if (Object.keys(errors).length === 0) {
        const { email, password, acceptsTerms } = req.body

        const pw = await hashPassword(password)

        const newUser = await insertUser({
            email: email,
            password: pw,
            acceptsTerms: acceptsTerms,
        })

        const token = await insertSession({
            email: email,
            id: newUser.insertedId
        })

        return res.status(201).json({
            "message": "User created successfully!",
            "token": token
        })
    } else {
        res.status(400).json({
            errors
        })
    }
})

app.post("/login", async (req, res) => {
    const { email, password } = req.body

    const user = await findUserByEmail(email)

    if (!user)
        return res
            .status(404)
            .json({ "message": "User not found!" })

    // let comparison = await comparePasswords(password, user.password)

    if (password != user.password)
        return res
            .status(401)
            .json({ "message": "Invalid Password!" })

    const token = await insertSession({
        email: email,
        id: user._id
    })

    res.status(200).json({ token })
})

app.get("/students", async (req, res) => {
    const token = req.header("authorization")

    let email = await getEmailByToken(token)
    let userInfo = await getStudentInfo(email)
    res.status(200).json(userInfo)
})

app.get("/top", async (req, res) => {
    let top = await getTop()
    console.log(top)
    res.status(200).json(top)
})

app.get("/awards", async (req, res) => {
    const token = req.header("authorization")
    let email = await getEmailByToken(token)
    let userAwards = await getAwardsByEmail(email)
    res.status(200).json(userAwards)
})

app.get("/photos", async (req, res) => {
    const token = req.header("authorization")
    let email = await getEmailByToken(token)
    let userPhotos = await getPhotosByEmail(email)
    console.log(userPhotos)
    res.status(200).json(userPhotos)
})

app.post("/messages", async (req, res) => {
    let message = await insertMessages(req.body)
    res.status(200).json({ message: "Message inserted with success!" })
})

app.get("/tips", async (req, res) => {
    let tips = await getTips()
    res.status(200).json(tips)
})

app.get("/rewards", async (req, res) => {
    const token = req.header("authorization")
    let email = await getEmailByToken(token)
    let userRewards = await getRewarsByEmail(email)
    res.status(200).json(userRewards)
})

app.listen(port, () => console.log(`À escuta em http://localhost:${port}`))

