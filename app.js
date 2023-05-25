const express = require('express')
const app = express()
const fileData4Y = require("./4YfileData.json");
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const port = 3000

app.use(express.json())

/* Listener */
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
  // setTimeout(post4YFile, 15000);
})

app.get('/', (req, res) => {
  res.send('ROOT!')
})

/**
 * *** MEDICAL CONTRACTOR
 */
const medLogHead = '[MEDICAL CONTRACTOR]'
app.get('/medical-contractor', (req, res) => {
  res.send(`${logHead} endpoint!`)
})

app.post('/medical-contractor/4YFile', (req, res) => {
  const applicantCount = req?.body?.length ? req.body.length : 0;
  const message = `${medLogHead} received a POST with ${applicantCount} applicant${applicantCount === 1 ? '' : 's'}. Sending Successful 200 OK`
  console.log(message)
  const response = {
      message,
      timestamp: new Date().toISOString(),
      "0": req.body[0]
  }
  res.send(response)
})

/** mock-ep: "http://localhost:3000/medical-contractor/4YFile" **/


/**
 * *** SALESFORCE
 */
const sfLogHead = '[SALESFORCE]'
async function post4YFile() {
  console.log(`${sfLogHead} 4Y report has been generated and will now POST to dha-applicants-xapi, eventually to MedCtr: `)
  try {
    await fetch('http://127.0.0.1:8082/xapi/applicants/4YFile', {
      method: 'POST',
      body: JSON.stringify(fileData4Y),
      headers: { 'Content-type': 'application/json' }
    })
    console.log(`${sfLogHead} received confirmation from POST to Medical Contractor\n\n`)
  } catch(error) {
    console.error('error posting 4Y', error)
  }
}


async function startup(_func, _runCount) {
  let intervalId, i = 0;
  if(!intervalId) {
    intervalId = setInterval(() => {
      if(i > _runCount) clearInterval(intervalId);
      _func();
      console.log(`interval ran ${++i} time${i > 1 ? 's':''}`)
    }, 30000)
  }
}
// startup()


