const e = require('express');
const { MongoClient, ObjectId } = require('mongodb')
const URL = process.env.MONGO_URL ?? "mongodb://localhost:27017"

let client
async function connectToMongo() {
    try {
        if (!client) {
            client = await MongoClient.connect(URL)
        }
        return client;
    } catch (err) {
        console.log(err)
    }
}

async function getMongoCollection(dbName, collectionName) {
    const client = await connectToMongo()
    return client.db(dbName).collection(collectionName)
}

async function insertUser(user) {
    const collection = await getMongoCollection("Test1", "users")
    const res = await collection.insertOne(user)
    return res
}

async function findUserByEmail(email) {
    const collection = await getMongoCollection("Test1", "users")
    const user = await collection.findOne({ email })
    return user
}

async function insertSession(session) {
    const collection = await getMongoCollection("Test1", "sessions")
    const res = await collection.insertOne(session)
    return res.insertedId
}

async function getEmailByToken(token) {
    const collection = await getMongoCollection("Test1", "sessions")
    const sessionUser = await collection.findOne({ _id: new ObjectId(token) })
    return sessionUser.email
}

async function getStudentInfo(email) {
    const collection = await getMongoCollection("Test1", "StudentsInfo")
    const student = await collection.find({ email: email })
    return student.toArray()
}

async function getTop() {
    const collection = await getMongoCollection("Test1", "topOfTheWeekList")
    const top = await collection.findOne()
    return top.top
}

async function getAwardsByEmail(email) {
    const collection = await getMongoCollection("Test1", "awards")
    const awards = await collection.findOne({ email: email })
    return awards.awards
}

async function getPhotosByEmail(email) {
    const collection = await getMongoCollection("Test1", "photos")
    const pictures = await collection.findOne({ email: email })
    return pictures.photos
}

async function insertMessages(data) {
    const collection = await getMongoCollection("Test1", "messages")
    const res = await collection.insertOne(data)
    return res.insertedId
}

async function getTips() {
    const collection = await getMongoCollection("Test1", "tipsOfTheWeek")
    const top = await collection.findOne()
    return top.tips
}

async function getRewarsByEmail(email) {
    const collection = await getMongoCollection("Test1", "Rewards")
    const res = await collection.findOne({ email: email })
    return res.Rewards
}

module.exports = { insertUser, findUserByEmail, insertSession, getStudentInfo, getEmailByToken, getTop, getAwardsByEmail, getPhotosByEmail, insertMessages, getTips, getRewarsByEmail }