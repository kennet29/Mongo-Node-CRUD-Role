import mongoose from 'mongoose';

const facturaSchema = new mongoose.Schema({
  cliente: {
    nombre: { type: String, required: true },
  },
  servicios: [{
    servicio: { type: mongoose.Schema.Types.ObjectId, ref: 'Servicio', required: true },
    cantidad: { type: Number, required: true },
    total: { type: Number, required: true },
  }],
  fecha: { type: Date, default: Date.now },
  iva:{type:Number,required:true},
  subtotal:{type:Number,required:true},
  totalFactura: { type: Number, required: true },
  //TotalDolares:{type:Number,required:true},

});

const Factura = mongoose.model('Factura', facturaSchema);

export default Factura;
