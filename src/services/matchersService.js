const runner = require('../utils/runner')
const { promises: fs } = require('fs')
const conn = require('../utils/conn')
const { MATCHERS_COLLECTION } = require('../constants')

const path = require('path')
const { TMP_DIR, MATCHERS_SCRIPT } = require('../utils/paths')

module.exports.loadMatchers = async (year, nvdPath, metadata) => {

  const finalMatchersPath = path.join(TMP_DIR, `/matchers-${year}.json`)
  const output = await runner(MATCHERS_SCRIPT, nvdPath, finalMatchersPath)

  console.log(`Extracted matchers. Output:\n${output}`)

  const rawMatchers = await fs.readFile(finalMatchersPath)
  const matchers = JSON.parse(rawMatchers)
  const transformedMatchers = await transform(matchers, year, metadata.sha256)

  console.log(`Matchers for insertion: ${transformedMatchers.length}`)

  const result = await insertData(transformedMatchers)
  console.log(`Inserted ${result.insertedCount} matchers for the year ${year}`)

  const deleteResult = await cleanupData(year, metadata.sha256)
  console.log(`Deleted ${deleteResult.deletedCount} items`)
}

const cleanupData = (year, sha256) => conn.getDb()
  .collection(MATCHERS_COLLECTION)
  .deleteMany({ $and: [{ year: year }, { sha256: { $ne: sha256 } }] })

const insertData = (matchers) => conn.getDb()
  .collection(MATCHERS_COLLECTION)
  .insertMany(matchers)

const transform = async (matchers, year, sha256) => {
  matchers.forEach(cve => {
    const nodes = cve.config?.nodes
    const products = new Set()
    const vendors = new Set()
    //TODO: add OS

    nodes?.forEach(node => traverseNode(node, products, vendors))

    cve.year = year
    cve.sha256 = sha256
    cve.products = [...products.keys()]
    cve.vendors = [...vendors.keys()]
  })
  return matchers
}

const traverseNode = (node, products, vendors) => {
  const { cpe_match: cpeMatch, children } = node
  if (children) {
    children.forEach(node => traverseNode(node, products, vendors))
  }
  traverseCpeMatch(cpeMatch, products, vendors)
}

const traverseCpeMatch = (cpeMatch, products, vendors) => {
  cpeMatch.forEach(cpe => {
    const { cpe23Uri } = cpe
    const [, , type, vendor, product, exactVersion, update, , , target] = cpe23Uri.split(':')

    cpe.type = normalizeCpeValue(type)
    cpe.vendor = normalizeCpeValue(vendor)
    cpe.product = normalizeCpeValue(product)
    cpe.exactVersion = normalizeCpeValue(exactVersion)
    cpe.update = normalizeCpeValue(update)
    cpe.target = normalizeCpeValue(target)

    products.add(product)
    vendors.add(vendor)
  })
}

const normalizeCpeValue = (value) => value === '*' || value === '-' ? null : value