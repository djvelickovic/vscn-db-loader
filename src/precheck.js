const { MongoClient } = require('mongodb')
const axios = require('axios').default

module.exports = async (nvdMetaUrl, year, { uri, databaseName, collectionName = 'metaCollection' }) => {
    const client = new MongoClient(uri)

    const meta = await getNVDMeta(nvdMetaUrl)
    console.log(`Fetched meta for year ${year}. Meta: ${JSON.stringify(meta)}`)

    const enrichedMeta = { ...meta, year }

    try {
        await client.connect()

        const db = client.db(databaseName)
        const collection = db.collection(collectionName)
        const document = await collection.findOne({ year })

        if (!document) {
            console.log(`Document for the year ${year} is not found`)
            return { success: true, meta: enrichedMeta }
        }

        const { sha256 } = document

        if (meta.sha256 == sha256) {
            return { success: false, meta: enrichedMeta }
        }
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
    const [lastModified, size, zipSize, gzSize, sha256] = data.split(/\r\n|\r|\n/)
    return {
        lastModified,
        size,
        zipSize,
        gzSize,
        sha256,
    }
}
