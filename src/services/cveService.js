const runner = require('../utils/runner')
const fs = require('fs').promises
const conn = require('../utils/conn')
const { CVE_COLLECTION } = require('../constants')

const path = require('path')
const { TMP_DIR, CVE_SCRIPT } = require('../utils/paths')

module.exports.loadCve = async (year, nvdPath, nvdMetadata) => {
  const finalCvePath = path.join(TMP_DIR, `/cve-${year}.json`)
  const output = await runner(CVE_SCRIPT, nvdPath, finalCvePath)

  console.log(`Extracted CVE. Output:\n${output}`)

  const rawCve = await fs.readFile(finalCvePath)
  const cves = JSON.parse(rawCve)

  const transformedCVEs = await transform(cves, year, nvdMetadata.sha256)

  const result = await insertData(transformedCVEs)
  console.log(`Inserted ${result.insertedCount} cves for the year ${year}`)

  const deleteResult = await cleanupData(year, nvdMetadata.sha256)
  console.log(`Deleted ${deleteResult.deletedCount} items`)
}


const cleanupData = (year, sha256) => conn.getDb()
  .collection(CVE_COLLECTION)
  .deleteMany({ $and: [{ year: year }, { sha256: { $ne: sha256 } }] })


const insertData = (cves) => conn.getDb()
  .collection(CVE_COLLECTION)
  .insertMany(cves)


const transform = async (cves, year, sha256) => {
  cves.forEach(cve => {
    cve.sha256 = sha256
    cve.year = year
  })
  return cves
}