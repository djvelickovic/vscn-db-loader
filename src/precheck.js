const { MongoClient } = require('mongodb')
const { META_COLLECTION } = require('./constants')
const axios = require('axios').default

module.exports = async (nvdMetaUrl, year, { uri, databaseName }) => {
    const client = new MongoClient(uri)

    const meta = await getNVDMeta(nvdMetaUrl)
    console.log(`Fetched metadata for the year ${year} with sha256: ${meta.sha256}`)

    const enrichedMeta = { ...meta, year }

    try {
        await client.connect()

        const db = client.db(databaseName)
        const collection = db.collection(META_COLLECTION)
        const document = await collection.findOne({ type: `nvd_${year}` })

        if (!document) {
            console.log(`Document for the year ${year} is not found in the database`)
            return { success: true, meta: enrichedMeta }
        }

        const { sha256 } = document

        if (meta.sha256 === sha256) {
            console.log(`Document for the year ${year} with sha256: ${sha256} already exist. Skipping new load.`)
            return { success: false, meta: enrichedMeta }
        }
        console.log(`Document for the year ${year} with sha256: ${sha256} is outdated. Initiating new load.`)
        return { success: true, meta: enrichedMeta }
    } finally {
        client.close()
    }
}

const getNVDMeta = async (url) => {
    const response = await axios.get(url)
    const { status, data } = response

    // TODO: check status

    return parseMeta(data)
}

/**
 *
 * @param {string} data
 */
const parseMeta = (data) => {
    const [lastModified, size, zipSize, gzSize, sha256Raw] = data.split(/\r\n|\r|\n/)
    const sha256 = sha256Raw.split(':')[1]
    return {
        lastModified,
        size,
        zipSize,
        gzSize,
        sha256,
    }
}
