const { MongoClient } = require('mongodb')
const { META_COLLECTION } = require('./constants')

module.exports = async (data, metadata, { uri, databaseName }) => {
    const client = new MongoClient(uri)
    const dataCollectionName = buildCollectionName(metadata.year)

    try {
        await client.connect()

        const database = client.db(databaseName)
        const vulnerabilitiesCollection = database.collection(dataCollectionName)
        const result = await vulnerabilitiesCollection.insertMany(data)

        console.log(`Stored results: ${result.acknowledged} -> ${result.insertedCount} rows`)

        const metadataCollection = database.collection(META_COLLECTION)
        const metadataResult = await metadataCollection.updateOne(
            { type: `nvd_${metadata.year}` },
            { $set: { type: `nvd_${metadata.year}`, sha256: metadata.sha256, collection: dataCollectionName } },
            { upsert: true }
        )
        console.log(
            `Updated metadata: ${metadataResult.acknowledged} -> ${metadataResult.upsertedCount} year: ${metadata.year}, sha256: ${metadata.sha256}`
        )
    } finally {
        await client.close()
    }
}

const buildCollectionName = (year) => {
    return `nvd_${year}_${new Date().getTime()}`
}
