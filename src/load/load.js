// Load to database

const { MongoClient } = require('mongodb')

const uri = process.env.MONGODB_URI
const databaseName = process.env.MONGODB_DATABASE_NAME

const client = new MongoClient(uri)

module.exports.loadData = async (collectionName, data) => {
    try {
        await client.connect()

        const database = client.db(MONGODB_DATABASE_NAME)
        const vulnerabilities = database.collection(collectionName)
        const result = await vulnerabilities.insertMany(data)

        console.log('Stored results: ', result)
    } finally {
        await client.close()
    }
}
