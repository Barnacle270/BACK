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

    // Extraer ramas de datos anidados
    const shipment = data?.['cac:Shipment'];
    const delivery = shipment?.['cac:Delivery'];
    const despatch = delivery?.['cac:Despatch'];
    const remitenteParty = despatch?.['cac:DespatchParty'];
    const destinatarioParty = data?.['cac:DeliveryCustomerParty']?.['cac:Party'];

    // Datos automáticos del XML
    const numeroGuia = data['cbc:ID'];
    const fechaTraslado = data['cbc:IssueDate'];
    const documentoRelacionado = data['cac:AdditionalDocumentReference']?.['cbc:ID'] || null;

    const remitente = {
      ruc: remitenteParty?.['cac:PartyIdentification']?.['cbc:ID']?.['#text'] || '',
      razonSocial: remitenteParty?.['cac:PartyLegalEntity']?.['cbc:RegistrationName'] || ''
    };

    const destinatario = {
      ruc: destinatarioParty?.['cac:PartyIdentification']?.['cbc:ID']?.['#text'] || '',
      razonSocial: destinatarioParty?.['cac:PartyLegalEntity']?.['cbc:RegistrationName'] || ''
    };

    const direccionPartida = despatch?.['cac:DespatchAddress']?.['cac:AddressLine']?.['cbc:Line'] || '';
    const direccionLlegada = delivery?.['cac:DeliveryAddress']?.['cac:AddressLine']?.['cbc:Line'] || '';
    const placaVehiculoPrincipal = shipment?.['cac:TransportHandlingUnit']?.['cac:TransportEquipment']?.['cbc:ID'] || '';
    const nombreConductor = shipment?.['cac:ShipmentStage']?.['cac:DriverPerson']?.['cbc:FirstName'] || '';

    // Número de contenedor desde <cbc:Note>
    const nota = data['cbc:Note'] || '';
    const numeroContenedor = /^[A-Z]{4}\d{7}/.test(nota) ? nota.substring(0, 11) : 'carga suelta';

    // 🧾 Campos manuales desde frontend
    const tipoCarga = req.body.tipoCarga?.toUpperCase();
    const cliente = req.body.cliente;

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

    // Crear nuevo documento
    const nuevoServicio = new Servicio({
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
      estado
    });

    await nuevoServicio.save();

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
      'fechaDevolucion'
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
    const tipoCarga = 'CONTENEDOR'; // fijo
    const clienteFinal = typeof req.body.cliente === 'string' ? req.body.cliente.trim() : '';

    if (!archivos || archivos.length === 0) {
      return res.status(400).json({ mensaje: 'No se subieron archivos XML' });
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

        const shipment = data?.['cac:Shipment'];
        const delivery = shipment?.['cac:Delivery'];
        const despatch = delivery?.['cac:Despatch'];
        const remitenteParty = despatch?.['cac:DespatchParty'];
        const destinatarioParty = data?.['cac:DeliveryCustomerParty']?.['cac:Party'];

        const numeroGuia = data['cbc:ID'];
        const fechaTraslado = data['cbc:IssueDate'];
        const documentoRelacionado = data['cac:AdditionalDocumentReference']?.['cbc:ID'] || null;

        const remitente = {
          ruc: remitenteParty?.['cac:PartyIdentification']?.['cbc:ID']?.['#text'] || '',
          razonSocial: remitenteParty?.['cac:PartyLegalEntity']?.['cbc:RegistrationName'] || ''
        };

        const destinatario = {
          ruc: destinatarioParty?.['cac:PartyIdentification']?.['cbc:ID']?.['#text'] || '',
          razonSocial: destinatarioParty?.['cac:PartyLegalEntity']?.['cbc:RegistrationName'] || ''
        };

        const direccionPartida = despatch?.['cac:DespatchAddress']?.['cac:AddressLine']?.['cbc:Line'] || '';
        const direccionLlegada = delivery?.['cac:DeliveryAddress']?.['cac:AddressLine']?.['cbc:Line'] || '';
        const placaVehiculoPrincipal = shipment?.['cac:TransportHandlingUnit']?.['cac:TransportEquipment']?.['cbc:ID'] || '';
        const nombreConductor = shipment?.['cac:ShipmentStage']?.['cac:DriverPerson']?.['cbc:FirstName'] || '';
        const nota = data['cbc:Note'] || '';
        const numeroContenedor = /^[A-Z]{4}\d{7}/.test(nota) ? nota.substring(0, 11) : 'carga suelta';

        const estado = 'PENDIENTE'; // ya que tipoCarga siempre es CONTENEDOR

        const existe = await Servicio.findOne({ numeroGuia });
        if (existe) {
          errores.push(`Ya existe un servicio con la guía ${numeroGuia}`);
          continue;
        }

        const nuevoServicio = new Servicio({
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

    return res.status(201).json({
      mensaje: `${serviciosCreados.length} servicios creados exitosamente`,
      creados: serviciosCreados.length,
      errores
    });

  } catch (error) {
    console.error('Error al importar masivamente:', error);
    return res.status(500).json({ mensaje: 'Error en la importación masiva', error: error.message });
  }
};