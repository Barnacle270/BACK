import fs from 'fs';
import { XMLParser } from 'fast-xml-parser';
import Servicio from '../models/servicio.model.js';


export const importarXML = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ mensaje: 'No se subió ningún archivo XML' });
    }

    const xml = fs.readFileSync(req.file.path, 'utf8');
    const parser = new XMLParser({ ignoreAttributes: false });
    const json = parser.parse(xml);
    const data = json['DespatchAdvice'];
    if (!data) return res.status(400).json({ mensaje: 'Estructura XML no válida' });

    const rawTipoGuia = data['cbc:DespatchAdviceTypeCode'];
    const tipoGuia = typeof rawTipoGuia === 'object' && rawTipoGuia['#text']
      ? String(rawTipoGuia['#text']).trim()
      : String(rawTipoGuia).trim();

    if (!['31', '62'].includes(tipoGuia)) {
      return res.status(400).json({ mensaje: 'Tipo de guía no soportado (solo 31 o 62)' });
    }

    const numeroGuia = data['cbc:ID'];
    const fechaTraslado =
      tipoGuia === '62'
        ? data['cbc:DespatchDate'] || data['cbc:IssueDate']
        : data['cbc:IssueDate'];

    const nota = data['cbc:Note'] || '';
    const numeroContenedor = /^[A-Z]{4}\d{7}/.test(nota) ? nota.substring(0, 11) : 'carga suelta';
    const documentoRelacionado = data?.['cac:AdditionalDocumentReference']?.['cbc:ID'] || null;

    // 🧾 Datos manuales desde frontend
    const tipoCarga = req.body.tipoCarga?.toUpperCase();
    const cliente = req.body.cliente;
    const horaCita = req.body.horaCita || null;

    if (!tipoCarga || !['CONTENEDOR', 'CARGA SUELTA', 'TOLVA', 'OTROS'].includes(tipoCarga)) {
      return res.status(400).json({ mensaje: 'Tipo de carga inválido o faltante' });
    }
    if (!cliente || typeof cliente !== 'string' || cliente.trim() === '') {
      return res.status(400).json({ mensaje: 'El nombre del cliente es obligatorio' });
    }

    const estado = tipoCarga === 'CONTENEDOR' ? 'PENDIENTE' : 'CONCLUIDO';

    // Validar duplicado
    const existe = await Servicio.findOne({ numeroGuia });
    if (existe) {
      return res.status(409).json({ mensaje: `Ya existe un servicio con la guía ${numeroGuia}` });
    }

    // Extraer datos comunes
    let remitente = { ruc: '', razonSocial: '' };
    let destinatario = { ruc: '', razonSocial: '' };
    let direccionPartida = '';
    let direccionLlegada = '';
    let placaVehiculoPrincipal = '';
    let nombreConductor = '';

    if (tipoGuia === '31') {
      // Guía NORMAL
      const shipment = data?.['cac:Shipment'];
      const delivery = shipment?.['cac:Delivery'];
      const despatch = delivery?.['cac:Despatch'];
      const remitenteParty = despatch?.['cac:DespatchParty'];
      const destinatarioParty = data?.['cac:DeliveryCustomerParty']?.['cac:Party'];

      remitente = {
        ruc: remitenteParty?.['cac:PartyIdentification']?.['cbc:ID']?.['#text'] || '',
        razonSocial: remitenteParty?.['cac:PartyLegalEntity']?.['cbc:RegistrationName'] || ''
      };
      destinatario = {
        ruc: destinatarioParty?.['cac:PartyIdentification']?.['cbc:ID']?.['#text'] || '',
        razonSocial: destinatarioParty?.['cac:PartyLegalEntity']?.['cbc:RegistrationName'] || ''
      };

      direccionPartida = despatch?.['cac:DespatchAddress']?.['cac:AddressLine']?.['cbc:Line'] || '';
      direccionLlegada = delivery?.['cac:DeliveryAddress']?.['cac:AddressLine']?.['cbc:Line'] || '';
      placaVehiculoPrincipal = shipment?.['cac:TransportHandlingUnit']?.['cac:TransportEquipment']?.['cbc:ID'] || '';
      nombreConductor = shipment?.['cac:ShipmentStage']?.['cac:DriverPerson']?.['cbc:FirstName'] || '';
    }

    if (tipoGuia === '62') {
      // Guía ESPECIAL
      direccionPartida = data?.['sac:SUNATShipment']?.['cac:OriginAddress']?.['cbc:StreetName'] || '';
      direccionLlegada = data?.['sac:SUNATShipment']?.['cac:DeliveryAddress']?.['cbc:StreetName'] || '';

      const roadTransport = data?.['sac:SUNATShipment']?.['sac:SUNATShipmentStage']?.['sac:SUNATTransportMeans']?.['sac:SUNATRoadTransport'];
      const placas = Array.isArray(roadTransport)
        ? roadTransport.map(p => p['cbc:LicensePlateID']).filter(Boolean)
        : [roadTransport?.['cbc:LicensePlateID']];

      placaVehiculoPrincipal = placas[0] || '';
      nombreConductor =
        data?.['sac:SUNATShipment']?.['sac:SUNATShipmentStage']?.['sac:SUNATTransportMeans']?.['sac:DriverParty']?.['cac:Party']?.['cac:PartyName']?.['cbc:Name'] || '';
    }

    const nuevoServicio = new Servicio({
      tipoGuia: tipoGuia === '31' ? 'NORMAL' : 'ESPECIAL',
      numeroGuia,
      fechaTraslado,
      documentoRelacionado,
      remitente,
      destinatario,
      direccionPartida,
      direccionLlegada,
      placaVehiculoPrincipal,
      nombreConductor,
      numeroContenedor,
      tipoCarga,
      cliente,
      horaCita,
      estado
    });

    await nuevoServicio.save();

    // ✅ Eliminar archivo una vez procesado
    fs.unlink(req.file.path, (err) => {
      if (err) console.warn('No se pudo eliminar el archivo temporal:', err);
    });

    return res.status(201).json({
      mensaje: 'Servicio creado exitosamente',
      servicio: nuevoServicio
    });

  } catch (error) {
    console.error('Error al importar XML:', error);
    return res.status(500).json({ mensaje: 'Error procesando el XML', error: error.message });
  }
};



export const actualizarCamposManuales = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      terminalDevolucion,
      vencimientoMemo,
      placaDevolucion,
      conductorDevolucion,
      horaCita,
      fechaDevolucion
    } = req.body;

    // Validación básica
    if (!terminalDevolucion || !vencimientoMemo) {
      return res.status(400).json({ mensaje: 'Faltan campos obligatorios: terminalDevolucion o vencimientoMemo' });
    }

    const servicio = await Servicio.findById(id);
    if (!servicio) {
      return res.status(404).json({ mensaje: 'Servicio no encontrado' });
    }

    // Actualizar campos manuales
    servicio.terminalDevolucion = terminalDevolucion;
    servicio.vencimientoMemo = vencimientoMemo;
    servicio.horaCita = horaCita;
    servicio.placaDevolucion = placaDevolucion || '';
    servicio.fechaDevolucion = fechaDevolucion || null;
    servicio.conductorDevolucion = conductorDevolucion || '';

    await servicio.save();

    res.status(200).json({
      mensaje: 'Campos manuales actualizados correctamente',
      servicio
    });
  } catch (error) {
    console.error('Error al actualizar servicio:', error);
    res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
  }
};


export const listarServiciosPendientes = async (req, res) => {
  try {
    const serviciosPendientes = await Servicio.find({ estado: 'PENDIENTE' }).select([
      'cliente',
      'numeroContenedor',
      'terminalDevolucion',
      'placaDevolucion',
      'conductorDevolucion',
      'vencimientoMemo',
      'fechaDevolucion',
      'horaCita'
    ]);

    res.status(200).json(serviciosPendientes);
  } catch (error) {
    console.error('Error al listar servicios pendientes:', error);
    res.status(500).json({ mensaje: 'Error al obtener los servicios pendientes', error: error.message });
  }
};

export const marcarComoDevuelto = async (req, res) => {
  try {
    const { id } = req.params;
    const { fechaDevolucion } = req.body;

    const servicio = await Servicio.findById(id);
    if (!servicio) {
      return res.status(404).json({ mensaje: 'Servicio no encontrado' });
    }

    if (servicio.estado !== 'PENDIENTE') {
      return res.status(400).json({ mensaje: 'Este servicio ya fue marcado como CONCLUIDO' });
    }

    servicio.estado = 'CONCLUIDO';
    servicio.fechaDevolucion = fechaDevolucion || new Date();

    await servicio.save();

    res.status(200).json({
      mensaje: 'Contenedor marcado como devuelto y servicio concluido',
      servicio
    });
  } catch (error) {
    console.error('Error al marcar como devuelto:', error);
    res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
  }
};

export const listarServiciosPorFecha = async (req, res) => {
  try {
    const { fecha } = req.query;
    if (!fecha) {
      return res.status(400).json({ mensaje: 'Debe enviar una fecha en formato YYYY-MM-DD' });
    }

    // Normalizar la fecha como inicio y fin del día en UTC
    const desde = new Date(`${fecha}T00:00:00.000Z`);
    const hasta = new Date(`${fecha}T23:59:59.999Z`);

    const servicios = await Servicio.find({
      fechaTraslado: {
        $gte: desde,
        $lte: hasta
      }
    }).sort({ createdAt: -1 });

    res.status(200).json(servicios);
  } catch (error) {
    console.error('Error al filtrar servicios:', error);
    res.status(500).json({ mensaje: 'Error al filtrar servicios', error: error.message });
  }
};

export const obtenerServicioPorId = async (req, res) => {
  try {
    const servicio = await Servicio.findById(req.params.id);
    if (!servicio) {
      return res.status(404).json({ mensaje: 'Servicio no encontrado' });
    }
    res.status(200).json(servicio);
  } catch (error) {
    console.error('Error al obtener servicio por ID:', error);
    res.status(500).json({ mensaje: 'Error al obtener servicio', error: error.message });
  }
};

export const editarServicio = async (req, res) => {
  try {
    const servicioActualizado = await Servicio.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!servicioActualizado) {
      return res.status(404).json({ mensaje: 'Servicio no encontrado' });
    }

    res.status(200).json({
      mensaje: 'Servicio actualizado correctamente',
      servicio: servicioActualizado
    });
  } catch (error) {
    console.error('Error al editar servicio:', error);
    res.status(500).json({ mensaje: 'Error al editar servicio', error: error.message });
  }
};

export const eliminarServicio = async (req, res) => {
  try {
    const servicioEliminado = await Servicio.findByIdAndDelete(req.params.id);
    if (!servicioEliminado) {
      return res.status(404).json({ mensaje: 'Servicio no encontrado' });
    }
    res.status(200).json({ mensaje: 'Servicio eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar servicio:', error);
    res.status(500).json({ mensaje: 'Error al eliminar servicio', error: error.message });
  }
};

export const importarXMLMasivo = async (req, res) => {
  try {
    const archivos = req.files;
    const tipoCarga = 'CONTENEDOR'; // Fijo en importación masiva
    const clienteFinal = typeof req.body.cliente === 'string' ? req.body.cliente.trim() : '';

    if (!archivos || archivos.length === 0) {
      return res.status(400).json({ mensaje: 'No se subieron archivos XML' });
    }

    if (!clienteFinal) {
      return res.status(400).json({ mensaje: 'El nombre del cliente es obligatorio' });
    }

    const parser = new XMLParser({ ignoreAttributes: false });
    const serviciosCreados = [];
    const errores = [];

    for (const archivo of archivos) {
      try {
        const xml = fs.readFileSync(archivo.path, 'utf8');
        const json = parser.parse(xml);
        const data = json['DespatchAdvice'];

        if (!data) throw new Error('Estructura XML no válida');

        const tipoGuia = data['cbc:DespatchAdviceTypeCode'];
        if (!['31', '62'].includes(tipoGuia)) {
          throw new Error(`Tipo de guía no soportado (${tipoGuia})`);
        }

        const numeroGuia = data['cbc:ID'];
        const fechaTraslado = data['cbc:IssueDate'];
        const documentoRelacionado = data?.['cac:AdditionalDocumentReference']?.['cbc:ID'] || null;
        const nota = data['cbc:Note'] || '';
        const numeroContenedor = /^[A-Z]{4}\d{7}/.test(nota) ? nota.substring(0, 11) : 'carga suelta';

        let remitente = { ruc: '', razonSocial: '' };
        let destinatario = { ruc: '', razonSocial: '' };
        let direccionPartida = '';
        let direccionLlegada = '';
        let placaVehiculoPrincipal = '';
        let nombreConductor = '';

        if (tipoGuia === '31') {
          const shipment = data?.['cac:Shipment'];
          const delivery = shipment?.['cac:Delivery'];
          const despatch = delivery?.['cac:Despatch'];
          const remitenteParty = despatch?.['cac:DespatchParty'];
          const destinatarioParty = data?.['cac:DeliveryCustomerParty']?.['cac:Party'];

          remitente = {
            ruc: remitenteParty?.['cac:PartyIdentification']?.['cbc:ID']?.['#text'] || '',
            razonSocial: remitenteParty?.['cac:PartyLegalEntity']?.['cbc:RegistrationName'] || ''
          };
          destinatario = {
            ruc: destinatarioParty?.['cac:PartyIdentification']?.['cbc:ID']?.['#text'] || '',
            razonSocial: destinatarioParty?.['cac:PartyLegalEntity']?.['cbc:RegistrationName'] || ''
          };

          direccionPartida = despatch?.['cac:DespatchAddress']?.['cac:AddressLine']?.['cbc:Line'] || '';
          direccionLlegada = delivery?.['cac:DeliveryAddress']?.['cac:AddressLine']?.['cbc:Line'] || '';
          placaVehiculoPrincipal = shipment?.['cac:TransportHandlingUnit']?.['cac:TransportEquipment']?.['cbc:ID'] || '';
          nombreConductor = shipment?.['cac:ShipmentStage']?.['cac:DriverPerson']?.['cbc:FirstName'] || '';
        }

        if (tipoGuia === '62') {
          direccionPartida = data?.['sac:SUNATShipment']?.['cac:OriginAddress']?.['cbc:StreetName'] || '';
          direccionLlegada = data?.['sac:SUNATShipment']?.['cac:DeliveryAddress']?.['cbc:StreetName'] || '';
          placaVehiculoPrincipal =
            data?.['sac:SUNATShipment']?.['sac:SUNATShipmentStage']?.['sac:SUNATTransportMeans']?.['sac:SUNATRoadTransport']?.['cbc:LicensePlateID'] || '';
          nombreConductor =
            data?.['sac:SUNATShipment']?.['sac:SUNATShipmentStage']?.['sac:SUNATTransportMeans']?.['sac:DriverParty']?.['cac:Party']?.['cac:PartyName']?.['cbc:Name'] || '';
        }

        const estado = tipoCarga === 'CONTENEDOR' ? 'PENDIENTE' : 'CONCLUIDO';

        const yaExiste = await Servicio.findOne({ numeroGuia });
        if (yaExiste) {
          errores.push(`Ya existe el servicio con la guía ${numeroGuia}`);
          continue;
        }

        const nuevoServicio = new Servicio({
          tipoGuia: tipoGuia === '31' ? 'NORMAL' : 'ESPECIAL',
          numeroGuia,
          fechaTraslado,
          documentoRelacionado,
          remitente,
          destinatario,
          direccionPartida,
          direccionLlegada,
          placaVehiculoPrincipal,
          nombreConductor,
          numeroContenedor,
          tipoCarga,
          cliente: clienteFinal,
          estado
        });

        await nuevoServicio.save();
        serviciosCreados.push(nuevoServicio);

      } catch (err) {
        errores.push(`Error en archivo ${archivo.originalname}: ${err.message}`);
      }
    }

    res.status(201).json({
      mensaje: `${serviciosCreados.length} servicios creados`,
      creados: serviciosCreados.length,
      errores
    });

  } catch (error) {
    console.error('Error al importar masivamente:', error);
    return res.status(500).json({ mensaje: 'Error en la importación masiva', error: error.message });
  }
};
// Obtener todos los servicios cuyo estadoFacturacion está vacío (null o no definido)

export const obtenerServiciosSinFacturar = async (req, res) => {
  try {
    const servicios = await Servicio.find({
      estadoFacturacion: { $nin: ['FACTURADO', 'RECEPCIONADO'] },
      estado: { $ne: 'ANULADA' }
    }).sort({ createdAt: -1 });

    res.json(servicios);
  } catch (error) {
    console.error('Error al obtener servicios sin facturar:', error);
    res.status(500).json({ message: 'Error al obtener servicios sin facturar' });
  }
};

// Actualizar estado de facturación (puede ser a RECEPCIONADO o FACTURADO)
export const actualizarEstadoFacturacion = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      estadoFacturacion,
      fechaRecepcion,
      fechaFacturacion,
      numeroFactura
    } = req.body;

    const servicio = await Servicio.findById(id);
    if (!servicio) {
      return res.status(404).json({ mensaje: 'Servicio no encontrado' });
    }

    if (estadoFacturacion === 'RECEPCIONADO') {
      servicio.estadoFacturacion = 'RECEPCIONADO';
      servicio.fechaRecepcion = fechaRecepcion;
      servicio.fechaFacturacion = null;
      servicio.numeroFactura = null;
    } else if (estadoFacturacion === 'FACTURADO') {
      servicio.estadoFacturacion = 'FACTURADO';
      servicio.fechaFacturacion = fechaFacturacion;
      servicio.numeroFactura = numeroFactura;
    } else {
      return res.status(400).json({ mensaje: 'Estado de facturación inválido' });
    }

    await servicio.save();
    res.json({ mensaje: 'Estado de facturación actualizado correctamente', servicio });

  } catch (error) {
    console.error('Error al actualizar estado de facturación:', error);
    res.status(500).json({ mensaje: 'Error al actualizar estado de facturación' });
  }
};

// Actualizar múltiples servicios a RECEPCIONADO con la misma fecha
export const recepcionarLoteServicios = async (req, res) => {
  try {
    const { ids, fechaRecepcion } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ mensaje: 'Lista de IDs inválida' });
    }

    const result = await Servicio.updateMany(
      { _id: { $in: ids } },
      {
        $set: {
          estadoFacturacion: 'RECEPCIONADO',
          fechaRecepcion,
          fechaFacturacion: null,
          numeroFactura: null
        }
      }
    );

    res.json({
      mensaje: 'Servicios recepcionados correctamente',
      modificados: result.modifiedCount
    });
  } catch (error) {
    console.error('Error al recepcionar lote:', error);
    res.status(500).json({ mensaje: 'Error al recepcionar lote' });
  }
};