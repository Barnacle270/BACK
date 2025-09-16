import QRCode from "qrcode";

const ruc = "20502472446";            // RUC del transportista
const tipoComprobante = "09";         // 09 = Guía de Remisión Transportista
const serie = "EG03";                 // Serie de la GRE
const numero = "0000549";               // Número correlativo
const fecha = "29/08/2025";           // Fecha de emisión
const monto = "0.00";                 // Para GRE, monto = 0.00

// URL de validación SUNAT para GRE
const url = `https://e-consulta.sunat.gob.pe/ol-ti-itconsvalicpe/ConsValiCpe.htm?accion=verificarCpe&numRuc=${ruc}&tipComp=${tipoComprobante}&serie=${serie}&numero=${numero}&fechaEmision=${fecha}&monto=${monto}`;

// Generar QR en base64
QRCode.toDataURL(url, function (err, qr) {
  if (err) console.error(err);
  console.log(qr); // Imagen en base64
});
