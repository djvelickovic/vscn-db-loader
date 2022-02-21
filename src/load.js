// Load to database

const { MongoClient, Collection } = require('mongodb')
const { META_COLLECTION } = require('./constants')

const options = { upsert: true }

module.exports = async (data, metadata, { uri, databaseName }) => {
    const client = new MongoClient(uri)
    const dataCollectionName = getCollectionName(metadata.year)

    console.log(dataCollectionName)

    try {
        await client.connect()

        const database = client.db(databaseName)
        const vulnerabilitiesCollection = database.collection(dataCollectionName)
        const result = await vulnerabilitiesCollection.insertMany(data)

        console.log(`Stored results: ${result.acknowledged} -> ${result.insertedCount} rows`)

        const metadataCollection = database.collection(META_COLLECTION)
        await updateMeta(metadataCollection, {
            year: metadata.year,
            sha256: metadata.sha256,
            collection: dataCollectionName,
        })
    } finally {
        await client.close()
    }
}

const getCollectionName = (year) => {
    return `nvd${year}t${new Date().getTime()}`
}

/**
 *
 * @param {*} metadata
 * @param {Collection<Document>} metaCollection
 */
const updateMeta = async (metaCollection, { year, sha256, collection }) => {
    await metaCollection.updateOne({ year }, { $set: { year, sha256, collection } }, options)
    console.log(`Updated metadata year: ${year}, sha256: ${sha256}`)
}
