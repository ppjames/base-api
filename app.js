console.clear()
const express = require('express')
const app = express();

app.use(express.json())

app.get('/',  async (req, res) => {
  res.send('<html><body><h1>Ready api</h1></body></html>')
})

app.post('/', async (req, res) => {
  // console.log(req.body);
  let { instance } = req.body
  let { Data } = instance
  let [ element ] = Data
  let { Value } = element

  let values = Value.find(element => element.key === 'acdGastosComprobanteFiscal');
  let { value } = values;

  let result = []
  // console.log(".>>>>>>> init bucle >>>>>>>>.");
  for (let i = 0; i < value.length - 1; i++) {
    let element = {}
    for (let j = 0; j < value[i].length - 1; j++) {
      let obj = value[i][j]
      element[obj.metaData.tag] = obj.value
      result.push(element)
    }
  }

  console.log('result', result);

  res.status(200).json({
    status: 'ok',
    data: result
  })
})

app.listen(3200, () => {
  console.log('server ready on port ', 3200);
})
