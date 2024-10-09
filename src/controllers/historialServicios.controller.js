const Historial = require('../models/HistorialServicios');


exports.crearHistorial = async (req, res) => {
  try {
    const nuevoHistorial = new Historial(req.body);
    const historialGuardado = await nuevoHistorial.save();
    res.status(201).json(historialGuardado);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


exports.obtenerHistorial = async (req, res) => {
  try {
    const historial = await Historial.find().populate('factura');
    res.json(historial);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.obtenerHistorialPorId = async (req, res) => {
  try {
    const historial = await Historial.findById(req.params.id).populate('factura');
    if (!historial) return res.status(404).json({ message: 'Historial no encontrado' });
    res.json(historial);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.eliminarHistorial = async (req, res) => {
  try {
    await Historial.findByIdAndDelete(req.params.id);
    res.json({ message: 'Historial eliminado' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
