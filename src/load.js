// Load to database

const { MongoClient, Collection } = require('mongodb')

module.exports = async (data, metadata, { uri, databaseName }) => {
    const client = new MongoClient(uri)
    const dataCollectionName = getCollectionName()
    const metaCollectionName = 'metadata'
    const namesCollectionName = 'collectionNames'
    try {
        await client.connect()

        const database = client.db(databaseName)
        const vulnerabilitiesCollection = database.collection(collection)
        const result = await vulnerabilitiesCollection.insertMany(data)

        console.log(`Stored results: ${result.acknowledged} -> ${result.insertedCount} rows`)

        const metadataCollection = database.collection(metaCollectionName)
        await saveMeta(metadata, metadataCollection)

        const namesCollection = database.collection(namesCollectionName)
        await updateCollectionName({ year: metadata.year, name: dataCollectionName }, namesCollection)
    } finally {
        await client.close()
    }
}

const getCollectionName = () => {
    return 'vulnerabilitiesTestCol'
}

/**
 *
 * @param {*} metadata
 * @param {Collection<Document>} metaCollection
 */
const saveMeta = async (metadata, metaCollection) => {
    await metaCollection.updateOne({ year: metadata.year }, metadata)
    console.log(`Updated metadata ${metadata.year} ${metadata.sha256}`)
}

/**
 *
 * @param {*} metadata
 * @param {Collection<Document>} collections
 */
const updateCollectionName = async (collectionData, collections) => {
    await collections.updateOne({ year: collectionData.year }, collectionData)
    console.log(`Updated metadata ${collectionData.year} ${collectionData.name}`)
}
