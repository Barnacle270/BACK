import {
  check,
  validationResult
} from "express-validator";

const validationTransporte = () => {

  return [

    check('fechat').notEmpty().escape().withMessage('El campo fecha esta vacio'),
    check('cliente').notEmpty().withMessage('El campo cliente esta vacio'),
    check('puntoPartida').notEmpty().withMessage('El campo punto de partida esta vacio'),
    check('puntoDestino').notEmpty().withMessage('El campo punto de destino esta vacio'),
    check('guiaRemitente').notEmpty().withMessage('El campo guia remitente esta vacio'),
    check('guiaTransportista').notEmpty().withMessage('El campo guia transportista esta vacio'),
    check('placa').notEmpty().withMessage('El campo placa esta vacio'),
    check('conductor').notEmpty().withMessage('El campo conductor esta vacio'),
    check('tipoServicio').notEmpty().withMessage('El campo tipo de servicio esta vacio'),
    check('detalle').notEmpty().withMessage('El campo detalle esta vacio'),
    check('almacenDev').notEmpty().withMessage('El campo almacen de devolucion esta vacio'),
    check('comprobanteDev').notEmpty().withMessage('El campo comprobande de devolucion esta vacio'),
    check('estado').notEmpty().withMessage('El campo estado esta vacio'),
    check('turno').notEmpty().withMessage('El campo turno esta vacio'),

    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const checkError = errors.array().map(error => error.msg);
        res.status(400).json({
          msg: checkError
        })
        return;
      }
      next();
    }
  ]
}

export default validationTransporte