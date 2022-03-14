const axios = require('axios').default
const fs = require('fs').promises

module.exports.downloadFile = async ({url, destination}) => {
  console.log(`Downloading ${url}`)
  const response = await axios.get(url, {
    responseType: 'stream'
  })
  if (response.status !== 200) {
    console.error(`Received status ${response.status} while downloading ${url}`)
  }
  await fs.writeFile(destination, response.data)
}