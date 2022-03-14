const runner = require('../utils/runner')
const { promises: fs } = require('fs')
const conn = require('../utils/conn')
const { MATCHERS_COLLECTION } = require('../constants')

const path = require('path')
const { TMP_DIR, MATCHERS_SCRIPT } = require('../utils/paths')

module.exports.loadMatchers = async (year, nvdPath) => {

  const finalMatchersPath = path.join(TMP_DIR, `/matchers-${year}.json`)
  const output = await runner(MATCHERS_SCRIPT, nvdPath, finalMatchersPath)

  console.log(`Extracted matchers. Output:\n${output}`)

  const rawMatchers = await fs.readFile(finalMatchersPath)
  const matchers = JSON.parse(rawMatchers)
  const transformedMatchers = await transform(matchers)

  console.log(`Matchers for insertion: ${transformedMatchers.length}`)

  const result = await conn.getDb()
    .collection(MATCHERS_COLLECTION)
    .insertMany(transformedMatchers)

  console.log(`Inserted ${result.insertedCount} matchers for the year ${year}`)
}

const transform = async (matchers) => {
  matchers.forEach(cve => {
    const nodes = cve.config.nodes
    const products = new Set()
    const vendors = new Set()
    //TODO: add OS

    nodes.forEach(node => {
      traverseNode(node, products, vendors)
    })

    cve.products = Array.from(products.keys())
    cve.vendors = Array.from(vendors.keys())
  })
  return matchers
}

const traverseNode = (node, products, vendors) => {
  const {cpe_match: cpeMatch, children} = node
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