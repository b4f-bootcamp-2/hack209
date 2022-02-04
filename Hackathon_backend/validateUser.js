const { findUserByEmail } = require("./db")

async function validateNewUser(data) {
    const errors = {}

    if (data.email === undefined || data.email.length === 0) {
        errors.email = "Please enter your email."
    } else if (!validateEmail(data.email)) {
        errors.email = "Email address must be valid."
    } else if (Boolean(await findUserByEmail(data.email))) {
        errors.email = "This email already exists."
    }

    if (data.password === undefined) {
        errors.password = "Enter your password."
    } else {
        const passwordStrength = checkPasswordStrength(data.password)
        if (data.password.length === 0) {
            errors.password = "Enter your password."
        } else if (passwordStrength === 0) {
            errors.password = "Password must contain at least 8 characters."
        } else if (passwordStrength < 4) {
            errors.password = "Password must contain at least a number, lowercase and uppercase letters and a special symbol."
        }
    }

    if (data.passwordConfirmation === undefined || data.passwordConfirmation.length === 0) {
        errors.passwordConfirmation = "Please enter your password again."
    } else if (data.password !== data.passwordConfirmation) {
        errors.passwordConfirmation = "Passwords do not match."
    }

    if (!data.acceptsTerms) {
        errors.acceptsTerms = "You must accept terms and conditions."
    }

    return errors
}

function validateEmail(email) {
    const EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return EMAIL_REGEX.test(email)
}

function checkPasswordStrength(password) {
    if (password.length < 8) return 0;
    const regexes = [
        /[a-z]/,
        /[A-Z]/,
        /[0-9]/,
        /[~!@#$%^&*)(+=._-]/
    ]
    return regexes
        .map(re => re.test(password))
        .reduce((score, t) => t ? score + 1 : score, 0)
}

module.exports = { validateNewUser }