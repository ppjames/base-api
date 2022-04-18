const mongoose = require('mongoose');

// {
            // "Sociedad": "3026",
            // "Org. Ventas": "DETA",
            // "Canal": "DE",
            // "Oficina": "QRO",
            // "Ruta": "1234567891",
            // "No. Nomina": "101010",
            // "Cantidad": "1000"
        // },
let viaticSchema = mongoose.Schema({
  Sociedad: { type: String },
  OrgVentas: { type: String },
  Canal: { type: String },
  Oficina: { type: String },
  Ruta: { type: String },
  Nomina: { type: String },
  Cantidad: { type: String }
},
  { timestamps: true }
)

module.exports = mongoose.model('viatic', viaticSchema);
