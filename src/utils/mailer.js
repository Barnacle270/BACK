import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export const enviarAlertaCorreo = async (destinatarios, asunto, mensaje) => {
  const toField = Array.isArray(destinatarios) ? destinatarios.join(', ') : destinatarios;

  await transporter.sendMail({
    from: `"Alerta Mantenimiento" <${process.env.EMAIL_USER}>`,
    to: toField,
    subject: asunto,
    text: mensaje
  });
};
