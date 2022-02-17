const { fetchData } = require('./fetch')
const extractZip = require('extract-zip')

exports.extract = async (nvdUrl, extractTargetDir) => {
    const file = await fetchData(nvdUrl)
    await extractZip(file, {
        dir: extractTargetDir,
    })
    console.log('Extraction complete')
}
