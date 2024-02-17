import DetallesVenta from "../models/DetallesVenta.js";
import puppeteer from 'puppeteer';
import Configuracion from "../models/Configuracion.js";


export const getAllDetVentas = async (req, res) => {
  try {
    const detallesVentas = await DetallesVenta.find();
    res.status(200).json(detallesVentas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const createNewDetVentas = async (req, res) => {
  const detallesVenta = req.body;

  try {
    const nuevoDetallesVenta = await DetallesVenta.create(detallesVenta);
    res.status(201).json(nuevoDetallesVenta);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateDetVentasById = async (req, res) => {
  const { id } = req.params;
  const detallesVenta = req.body;

  try {
    const updatedDetallesVenta = await DetallesVenta.findByIdAndUpdate(
      id,
      detallesVenta,
      { new: true }
    );

    res.status(200).json(updatedDetallesVenta);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const printDetallesVenta = async (req, res) => {
  const { id } = req.params;

  try {
    const detallesVenta = await DetallesVenta.findById(id)
   
    .populate({
      path: 'id_ventas',
      model: 'Ventas',
      select: 'cliente createdAt total',
    })
    .populate({
      path: 'articulos.id_articulo',
      model: 'Articulo',
      select: 'nombre',
    })
    .populate({
      path: 'articulos.id_color',
      model: 'Color',
      select: 'color',
    })
    .populate({
      path: 'articulos.id_talla',
      model: 'Talla',
      select: 'talla',
    })
    .populate({
      path: 'articulos.id_marca',
      model: 'Marca',
      select: 'marca',
    });

    if (!detallesVenta) {
      return res.status(404).json({ message: 'Detalles de ventas no encontrados' });
    }

    const configuracion = await Configuracion.findOne(); 

    if (!configuracion) {
      return res.status(404).json({ message: 'Configuración no encontrada' });
    }

    const browser = await puppeteer.launch({
      executablePath: 'C:\\Users\\kenne\\.cache\\puppeteer\\chrome\\win64-119.0.6045.105\\chrome-win64\\chrome.exe',
      // Otras opciones de configuración según sea necesario
    });

    const page = await browser.newPage();
    
    const content = `
    <html>
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">
      </head>
      <body>
        <div style="font-size: 10px; border: 1px solid black; width:280px; text-align:center"> 
          <p style="font-size:23px; text-align:center">Mafy Store</p>
          <p style="font-size: 14px;">ID-Factura </br> ${detallesVenta._id}</p>
          <p style="font-size: 12px;">Fecha: ${new Date(detallesVenta.id_ventas.createdAt).toLocaleString('es-ES') } </br>  Cliente: ${detallesVenta.id_ventas.cliente} </p>
          <table style="width:95%; border-collapse: collapse; margin:0 auto">
            <tr>
              <th style=" text-align: left; font-size: 14px;">Artículos</th>
              <th style=" text-align: left; font-size: 14px;"> Precio</th>
              <th style=" text-align: center; font-size: 14px;"> Cant.</th>
              <th style=" text-align: left; font-size: 14px;"> Subtotal</th>
            </tr>
            ${detallesVenta.articulos.map(articulo => `
              <tr>
                <td style="border: text-align: left; font-size: 12px;">
                  ${articulo.id_articulo.nombre}  
                  ${articulo.id_color.color}  
                  ${articulo.id_marca.marca}  
                  ${articulo.id_talla.talla}
                </td>
                <td style="border: text-align: left; font-size: 12px;">${articulo.precio.toFixed(2)}</td>
                <td style="border: text-align: right; font-size: 12px;">${articulo.cantidad}</td>
                <td style="border: text-align: left; font-size: 12px;">${articulo.subtotal.toFixed(2)}</td>
              </tr>
            `).join('')}
          </table>
          <p style="font-size: 12px;">Total: ${detallesVenta.id_ventas.total.toFixed(2)}</p>
          <p style="font-size: 12px;">Dirección: ${configuracion.direccion}</p>
          <p style="font-size: 12px;">E-Mail: ${configuracion.correo_electronico}</p>
          <p style="font-size: 12px;">Teléfono 1: ${configuracion.telefono_1}  Teléfono 2: ${configuracion.telefono_2}</p>
          <p style="font-size:12px; text-align:center">Precios incluyen IVA</p>
          <p style="font-size:23px; text-align:center">¡Gracias por su Compra!</p>
        </div>
      </body>
    </html>
    `;

    await page.setContent(content);
    await page.waitForTimeout(1000); 
    const pdfBuffer = await page.pdf();

    await browser.close();

    res.setHeader('Content-Disposition', `attachment; filename=detallesVenta_${id}.pdf`);
    res.setHeader('Content-Type', 'application/pdf');
    res.status(200).send(pdfBuffer);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error generando el PDF' });
  }
};