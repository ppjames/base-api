console.time('inter');
/* functions */
/* function ExceptionReadFile(message, value) { */
    /* this.message = message; */
    /* this.value = value; */
    /* this.toString = function () { */
        /* return `${this.message} / ${this.value}` */
    /* } */
/* }; */
class ExceptionReadFile {
  constructor(message, value) {
    this.message = message;
    this.value = value;
    this.toString = function () {
      return `${ this.message } / ${ this.value }`
    }
  }
};

const getEnvironment = () => {
  const identityURL = {
    'QA': 'http://api.sigma-alimentos.com/qa/common/identity/users',
    'PRD': 'http://api.sigma-alimentos.com/common/identity/users'
  };
  let { apiUrl } = this['$$Env'];
  let environment = apiUrl.indexOf('/qa/') != -1 || apiUrl.indexOf('localhost') != -1
    ? 'QA'
    : 'PRD';
  return identityURL[environment];
};

const validateHeaders = (arrayString) => {
    if (arrayString.length !== HEADERS.length) {
        window.alert(`La esctructura del archivo es invalida, las columnas esperadas son ${HEADERS.length} :: columnas ${HEADERS}`);
        throw new ExceptionReadFile('El numero de columnas debe ser: ', HEADERS.length)
    };
    arrayString.map(value => {
        if (!HEADERS.includes(value)) {
            window.alert(`Las columnas esperadas son:  ${ HEADERS }`);
            throw new ExceptionReadFile('Las columnas esperadas son:', HEADERS)
        }
    })
};

const getFirstBranchOffice = (headers, rows, delimiter) => {
    let branchOfficeIndex = headers.findIndex(header => header === 'SUCURSAL');
    let firstRow = rows.shift().split(delimiter);
    return firstRow[branchOfficeIndex]
};

const getUniq = (data = []) => {
    return data.filter((value, index, self) => index === self.findIndex((t) => t.NO_NOMINA === value.NO_NOMINA))
};

let createRequest = (data) => {
    let emails = [data[0].SUPERVISOR_EMAIL, data[0].GERENTE_EMAIL, data[0].CONTRALOR_EMAIL, data[0].ROC_EMAIL];
    let signatoriesRequestArray = emails.map(email => {
        let url = `${identityURL}/${email}`;
        return fetch(url).then(response => response.json());
    });
    let sellerRequestArray = data.map(element => {
        let url = `${identityURL}/${element.NO_NOMINA}`;
        return fetch(url).then(response => response.json());
    });
    return signatoriesRequestArray.concat(sellerRequestArray);
};

const csvToArray = (str, delimiter = ',') => {
  debugger;
  let data = str.split(new RegExp(/\r\n|\n/));
  /* console.log(data); */
  /* console.log(data.length); */
  let headers = data.shift().split(',');
  console.log(data.length);
  validateHeaders(headers);
  const branchOffice = getFirstBranchOffice(headers, [...data], delimiter);
  console.log(data.length);
  /* debugger; */
  const arr = data.filter(row => row.split(delimiter).join('') !== '').map(function (row) {
    const values = row.split(delimiter);
    const el = headers.reduce(function (object, header, index) {
      if (header === 'SUCURSAL' && values[index] !== branchOffice) {
        window.alert(`Solo una sucursal puede ser declarada por solicitud, hay mas de una en esta solicitud ${branchOffice} - ${values[index]}`);
        throw new ExceptionReadFile('Solo una sucursal puede ser declarada por solicitud, hay mas de una en esta solicitud', branchOffice, values[index])
      }; ;
      object[header] = values[index] ? NOT_TRANSFORM.includes(header) ? values[index].trim() : values[index].toUpperCase().trim() : '';
      return object;
    }, {});
    return el;
  });
  return arr;
};

const css = (element, style) => {
    for (const property in style)
        element.style[property] = style[property];
}

const showErrors = (errors) => {
  /* console.log('ERRORS: ', errors); */
  /* console.log(div); */
  if (errors.length) {
    let fileUpload = document.querySelector('sigma-file-upload');
    let lastAlert = document.querySelector('.alert');
    lastAlert.remove();
    let div = document.createElement('div');
    div.className = "alert";
    let html = '';
    errors.forEach(error => {
      html += `<li>${ error }</li>`;
    })

    div.innerHTML = `<ul>${ html }</ul>`;
    css(div, {
      padding: '15px',
      'background-color': '#f8d7da',
    })

    fileUpload.before(div);
    /* window.alert(errors); */
    throw new ExceptionReadFile(errors, '');
  }
}

/* debugger; */
/* consts */
const HEADERS = ['NOMBRE', 'NO_NOMINA', 'SOCIEDAD', 'NOMBRE_SOCIEDAD', 'ORG_VENTAS', 'CANAL', 'SUCURSAL', 'RUTA', 'CANTIDAD', 'FORMA_PAGO', 'NOMBRE_BANCO', 'NUM_CUENTA', 'SUPERVISOR', 'SUPERVISOR_EMAIL', 'GERENTE', 'GERENTE_EMAIL', 'CONTRALOR', 'CONTRALOR_EMAIL', 'ROC', 'ROC_EMAIL', 'CATEGORIA'];
const NOT_TRANSFORM = ['SUPERVISOR_EMAIL', 'GERENTE_EMAIL', 'CONTRALOR_EMAIL', 'ROC_EMAIL'];
let identityURL = getEnvironment();
let errors = [];

/* start script */

console.group('UPLOAD');
/* console.log(this.uploadFileSimple); */
let button = document.getElementById('add-sigma-accordion-item');
var saveButton = document.querySelector('.mat-raised-button.mat-primary') === null
  ? document.querySelector('.mat-raised-button.validator')
  : document.querySelector('.mat-raised-button.mat-primary');

saveButton.classList.add('mat-primary');
saveButton.classList.add('validator');
/* console.log(saveButton); */
saveButton.classList.toggle('mat-primary');
saveButton.addEventListener('click', function(e) {
  /* console.log(errors); */
  e.preventDefault();
  if (errors.length) {
    console.warn(errors)
    window.alert(`El archivo a subir contiene errores: ${errors.join(', ')} ** Verifica que la informacion sea correcta`, )
    /* window.alert(`El archivo a subir contiene errores`); */
  }
});


button.style.visibility = 'hidden';
let file = this.uploadFileSimple[0].file.data;
/* console.log(file); */
let reader = new FileReader();
reader.readAsText(file, 'UTF-8');
reader.onload = async() => {
  try {
    /* debugger; */
    this.suiteConService.waitStart();
    this.suiteConService.waitStart();
    console.log('Wainting :', this.suiteConService.waiting);
    console.log(this.suiteConService.hasOwnProperty('waitStart'));

    const source$ = new ObservableOf(this.suiteConService.waiting)

    source$.subscribe(
      (message) => console.log("El valor de waiting es" + message),
      (error) => console.log("error: " + error),
      () => console.log("complete First")
    )
    /* debugger; */
    /* console.log(reader.result); [>debugger;<]; */
    let arr = csvToArray(reader.result); /*debugger*/;
    debugger;
    let uniqSellerArray = getUniq(arr);
    let requestArr = createRequest(uniqSellerArray);

    this.suiteConService.waitStart();
    let res = await Promise.all(requestArr);
    let responses =  [uniqSellerArray[0].SUPERVISOR_EMAIL, uniqSellerArray[0].GERENTE_EMAIL, uniqSellerArray[0].CONTRALOR_EMAIL, uniqSellerArray[0].ROC_EMAIL];
    uniqSellerArray.forEach(seller => responses.push(seller.NO_NOMINA));
    /* console.log(responses); */
    /* console.log(this) */
    res.forEach((element, index) => {
      if (element.hasOwnProperty('status') && element.status === 'fail' && element.code === 'searchFail') {
        message = index <= 3
          ? `El valor ${ responses[index] } no es un email valido en Sigma`
          : `El valor ${ responses[index] } no es un Numero de Nomina Correcto`
        /* window.alert(message); */
        errors.push(message);
        /* throw new ExceptionReadFile(message, responses[index]); */
      }
    })
    /* showErrors(errors, div); */
    if (errors.length) {
      window.alert(`El archivo no contiene informacion valida: ${errors}`);
      throw new ExceptionReadFile(errors);
    }
    /* console.log('RESPONSE REQUEST', arr); */
    let resRequest = {
      SUPERVISOR_ID: res[0].user._id,
      GERENTE_ID: res[1].user._id,
      CONTRALOR_ID: res[2].user._id,
      ROC_ID: res[3].user._id
    };
    let sellerResponse = {};
    res.slice(4).forEach((element, index) => {
      sellerResponse[element.user.employeeId] = element.user._id;
    });

    arr = arr.map(element => {
      button.click();
      return {
        ...element,
        ID: sellerResponse[element.NO_NOMINA],
        ...resRequest
      }
    })

    /* let button = document.getElementById('add-sigma-accordion-item'); */
    /* let arrayButton = arr.map(row => { */
      /* return new Promise((resolve, reject) => { */
        /* resolve(button.click()); */
      /* } */
    /* }); */
    /* await Promise.all(arrayButton); */
    setTimeout(() => {
      /* console.log(this.gastosComprobacionFiscal.length); */
      arr.map((row, index) => {
        this.gastosComprobacionFiscal[index].dataSourceSociedad = [{
          id: row.SOCIEDAD,
          description: '3026'
        }
        ];
        this.gastosComprobacionFiscal[index].formaPago = row.FORMA_PAGO;
        this.gastosComprobacionFiscal[index].sociedad = row.SOCIEDAD;
        this.gastosComprobacionFiscal[index].financialUnitName = row.NOMBRE_SOCIEDAD;
        this.gastosComprobacionFiscal[index].orgVentas = row.ORG_VENTAS;
        this.gastosComprobacionFiscal[index].canal = row.CANAL;
        this.gastosComprobacionFiscal[index].oficina = row.SUCURSAL;
        this.gastosComprobacionFiscal[index].ruta = row.RUTA;
        this.gastosComprobacionFiscal[index].nomina = row.NO_NOMINA;
        this.gastosComprobacionFiscal[index].cantidad = row.CANTIDAD;
        this.gastosComprobacionFiscal[index].bankName = row.NOMBRE_BANCO;
        this.gastosComprobacionFiscal[index].sellerName = row.NOMBRE;
        this.gastosComprobacionFiscal[index].bankAccount = row.NUM_CUENTA.replaceAll(' ', '');
        this.gastosComprobacionFiscal[index].supervisorName = row.SUPERVISOR;
        this.gastosComprobacionFiscal[index].supervisorEmail = row.SUPERVISOR_EMAIL;
        this.gastosComprobacionFiscal[index].managerName = row.GERENTE;
        this.gastosComprobacionFiscal[index].managerEmail = row.GERENTE_EMAIL;
        this.gastosComprobacionFiscal[index].contralorName = row.CONTRALOR;
        this.gastosComprobacionFiscal[index].contralorEmail = row.CONTRALOR_EMAIL;
        this.gastosComprobacionFiscal[index].rocName = row.ROC;
        this.gastosComprobacionFiscal[index].rocEmail = row.ROC_EMAIL;
        this.gastosComprobacionFiscal[index].categoryName = row.CATEGORIA;
        this.gastosComprobacionFiscal[index].id = row.ID;
        this.gastosComprobacionFiscal[index].supervisorId = row.SUPERVISOR_ID;
        this.gastosComprobacionFiscal[index].managerId = row.GERENTE_ID;
        this.gastosComprobacionFiscal[index].contralorId = row.CONTRALOR_ID;
        this.gastosComprobacionFiscal[index].rocId = row.ROC_ID; ;
        /* console.log(row) */
      });

      this.suiteConService.stopWait(); ;
      /* console.log(this.gastosComprobacionFiscal[0]) */
      saveButton.classList.toggle('mat-primary');

    }, 2000);
  } catch (e) {
    console.error(e);
    this.suiteConService.stopWait();
  };
};
console.timeEnd('inter');
console.groupEnd();


// observable
function ObservableOf(...data) {
    this.subscribe =  function(...observer) {
      const [next,error,complete] = observer
      observerD = {next, error, complete };

      try{
        data.forEach((item)=> {
          //simulated an error with the type
          if(typeof item  === 'string'){
            throw {};
          }
          observerD.next(item)
        });
        observerD.complete();
      }catch(e){
        observerD.error("is a string");
      }
    };

    return {subscribe: this.subscribe}
}

const source$ = new ObservableOf(1,"2",3)

source$.subscribe(
     (message) => console.log("First observer message:" + message),
     (error) => console.log("First observer error:" + error),
     () => console.log("complete First")
)

source$.subscribe(
    (message) => console.log("Second observer message:" + message),
    (error) => console.log("Second observer error:" + error),
    () => console.log("complete Second")
)
