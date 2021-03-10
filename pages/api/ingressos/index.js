import dbConnect from "../../../utils/dbConnect";
import Ingresso from "../../../models/Ingresso";
import Assento from "../../../models/Assento";
import QRCode from "qrcode";
import nodemailer from "nodemailer";
import inlineBase64 from "nodemailer-plugin-inline-base64";
import EmailTicket from "../../../components/EmailTicket";
import EmailCombo from "../../../components/EmailCombo";
import ReactDOMServer from 'react-dom/server';
import nodeHtmlToImage from 'node-html-to-image'

async function gerarQrCode(ticket, prefixo) {
    try {
        const code = prefixo+"."+ticket._id.toString();
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

        const anexos = [];

        for (var i = 0; i < ticket.ingresso.length; i++) {
            const qrCodeTicket = await gerarQrCode(ticket, ticket.ingresso[i]);
            const htmlTicket = ReactDOMServer.renderToString(<EmailTicket qrCodeTicket={qrCodeTicket} ingresso={ticket.ingresso[i]} />);
            const img = await nodeHtmlToImage({
                output: './anexos/ingressos/'+ticket.ingresso[i]+'.png',
                html: htmlTicket,
                quality: 100,
                transparent: true
            });

            anexos.push({
                filename: ticket.ingresso[i]+'.png',
                content: img
            })
        }

        if (ticket.combo1 > 0 || ticket.combo2 > 0) {
            const qrCodeCombo = await gerarQrCode(ticket, "combo");
            const htmlCombo = ReactDOMServer.renderToString(<EmailCombo qrCodeCombo={qrCodeCombo} ticket={ticket} />);
            const img = await nodeHtmlToImage({
                output: './anexos/combos/'+ticket._id+'.png',
                html: htmlCombo,
                quality: 100,
                transparent: true
            });

            anexos.push({
                filename: 'Combo.png',
                content: img
            })
        }

        var mailOptions = {
            from: process.env.EMAIL,
            to: ticket.email,
            subject: 'Ingressos: Um conto que te contam',
            html: "<h2>Ebaaa! Seus ingressos estão anexados</h2>",
            attachments: anexos
        };

        console.log("Enviando email...")

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
                console.log("Email enviado")
                res.status(201).json({success: true, data: ticket})
            } catch(error) {
                res.status(400).json({success: false, data: error})
            }
            break
    }
}