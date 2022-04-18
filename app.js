console.clear()
const fs = require('fs')
const express = require('express')
const app = express();
const cors = require('cors')
require('./services/db')
const Viatic = require('./models/viatic')
/* var minify = require('minify'); */
var UglifyJS = require("uglify-js");


app.use(express.json())
app.use(cors())

app.get('/',  async (req, res) => {
  res.send('<html><body><h1>Ready api</h1></body></html>')
})

/* app.get('/') */

app.get('/code', (req, res) => {
  // let codeString = JSON.stringify(fs.readFileSync('./storage/codeTest.js', 'utf8'), null, 0)
  // codeString = codeString.replace(/(\r\n|\n|\r)/gm, "");
  /* let codeString = fs.readFileSync('./storage/code.js', 'utf8') */
  let codeString = fs.readFileSync('./storage/code.js', 'utf8')
  console.log(codeString)
  /* codeString = codeString.replace(/\n|\r/g, ""); */
  // codeString = codeString.replace(/"/g, "'");
  /* console.log(codeString) */
  // res.send( JSON.stringify(codeString, null, 0) )
  //
  //
  // var code = "function add(first, second) { return first + second; }";
  var options = {
    compress: {
      drop_debugger: false,
      collapse_vars : false,
      default_values : false,
      drop_console : false,
      expression : true,
      templates: false
    },
    mangle: {
      /* properties: false, */
      /* toplevel: false, */
      keep_fargs : true
    },
    output: {
      braces : true,
      comments : false,
      quote_style : 1,
      semicolons: true,
      beautify : false,
      ascii_only : true
    },
    nameCache: {}
  };
  var result = UglifyJS.minify(codeString, options);
  console.log(result.error); // runtime error, or `undefined` if no error
  console.log(result.code);
  // codeString = result.code.replace(/"/g, "'");
  /* res.send(result.code) */
  res.send(JSON.stringify(result.code))
  /* res.send(JSON.stringify(result.code).replace(/\\\\/g, "\\")) */
})

app.post('/', (req, res) => {
  console.log(req.body);
  console.log(req.params);
  console.log(req.query);
  if (req.query.hasOwnProperty('json')) {
    fs.writeFile('./storage/request.json', JSON.stringify(req.body, null, 4), 'utf8', function(err) {
      if (err) {
        console.log('Ocurrio un error al escribir el archivo');
      }
    })
  }

  res.send('ok')
})

app.put('/', (req, res) => {
  console.log(req.body);

  res.send('ok')
})



app.post('/back', async (req, res) => {
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

  // result = result.map(result => {
    // result = {...result,
      // OrgVentas: result['Org. Ventas'],
      // Nomina: result['No. Nomina']
    // }
    // delete result['Org. Ventas']
    // delete result['No. Nomina']

    // return result
  // })

  console.log(result);

  res.status(200).json({
    status: 'ok',
    data: result
  })
})

app.listen(3200, () => {
  console.log('server ready on port ', 3200);
})
