import dbConnect from "../../../utils/dbConnect";
import Ingresso from "../../../models/Ingresso";
import Assento from "../../../models/Assento";
import QRCode from "qrcode";
import nodemailer from "nodemailer";
import inlineBase64 from "nodemailer-plugin-inline-base64";
import EmailTicket from "../../../components/EmailTicket";
import ReactDOMServer from 'react-dom/server';

async function gerarQrCodeTicket(ticket, ingresso) {
    try {
        const code = ingresso+"."+ticket._id.toString();
        console.log(code);
        const result = QRCode.toDataURL(code,
        { color: {
            light: '#0000'
        }});
        return result;
    } catch(error) {
        console.error("Nao foi possivel gerar o qrcode")
        console.error(error)
    }
}

async function sendEmail(ticket) {
    try {
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.SENHA
            }
        });

        transporter.use('compile', inlineBase64());

        const qrCodeTicket = [];
        for (var i = 0; i < ticket.ingresso.length; i++) {
            qrCodeTicket[i] = await gerarQrCodeTicket(ticket, ticket.ingresso[i])
        }

        const htmlTicket = ReactDOMServer.renderToString(<EmailTicket qrCodeTicket={qrCodeTicket} ticket={ticket} />);
        
        var mailOptions = {
            from: process.env.EMAIL,
            to: ticket.email,
            subject: 'Ingressos: Um conto que te contam',
            html: htmlTicket
        };

        return transporter.sendMail(mailOptions);
    } catch(error) {
        console.log("Nao foi possivel enviar o email")
        console.error(error)
    }
}

export default async function handler(req, res) {
    const {method} = req;

    await dbConnect();

    switch(method) {
        case 'POST':
            try {
                const ingresso = req.body.ingresso;
                let numeroIngressos = [];
                for (let i = 0; i < ingresso.length; i++) {
                    let assento = ingresso[i];
                    assento.ocupado = true;
                    await Assento.findByIdAndUpdate(assento._id, assento);
                    numeroIngressos.push(assento.numero);
                }
                req.body.ingresso = numeroIngressos;
                const ticket = await Ingresso.create(req.body);
                await sendEmail(ticket);
                res.status(201).json({success: true, data: ticket})
            } catch(error) {
                res.status(400).json({success: false, data: error})
            }
            break
    }
}