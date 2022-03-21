const conn = require('../utils/conn')
const { SNAPSHOTS_COLLECTION } = require('../constants')

module.exports.shouldInsertSnapshot = async (year, metadata) => {
  const result = await conn.getDb()
    .collection(SNAPSHOTS_COLLECTION)
    .findOne({ year: year })

  if (!result) return true

  return result.sha256 !== metadata.sha256
}

module.exports.updateSnapshots = async (year, metadata) => {
  const updateResult = await conn.getDb()
    .collection(SNAPSHOTS_COLLECTION)
    .findOneAndReplace({ year: year }, { year: year, sha256: metadata.sha256 }, { upsert: true })

  console.log(`Updated snapshot for the year ${year} -> ${metadata.sha256}. Result: ${updateResult.value}`)
}
