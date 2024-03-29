import Ingresos from "../models/Ingresos.js";
import fs from 'fs';
import PDFDocument from 'pdfkit';




export const getAllIngresos = async (req, res) => {
    try {
      const ingresos = await Ingresos.find();
      res.status(200).json(ingresos);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
export const createNewIngresos = async (req, res) => {
    const ingreso = req.body;
  
    try {
      const newIngreso = await Ingresos.create(ingreso);
      res.status(201).json(newIngreso);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

export const updateIngresoById = async (req, res) => {
    const { id } = req.params;
    const ingreso = req.body;
  
    try {
      const updatedIngreso = await Ingresos.findByIdAndUpdate(id, ingreso, { new: true });
      res.status(200).json(updatedIngreso);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  

  export const deleteIngresoByID = async (req, res) => {
    const { id } = req.params;
  
    try {
      await Ingresos.findByIdAndRemove(id);
      res.status(204).json({ message: 'Ingreso deleted successfully.' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  
  export const getIngresoById = async (req, res) => {
    const { id } = req.params;

    try {
        const ingreso = await Ingresos.findById(id);

        if (!ingreso) {
            return res.status(404).json({ message: 'Ingreso not found' });
        }

        res.status(200).json(ingreso);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};