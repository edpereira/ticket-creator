import dbConnect from "../../../utils/dbConnect";
import Ingresso from "../../../models/Ingresso";
import Assento from "../../../models/Assento";
import sgMail from "@sendgrid/mail"
import QRCode from "qrcode";

export async function email(ticket) {
    try {
        QRCode.toDataURL(ticket._id.toString())
        .then(url => {
            const imageb64 = url.replace('data:image/png;base64,' , '');
            const img = '<img src="cid:qrcode-ticket" alt="QRCode" />'

            sgMail.setApiKey(process.env.SENDGRID_API_KEY)
            const msg = {
            to: ticket.email,
            from: 'cofam.mnj@gmail.com',
            subject: 'Ingresso: Um conto que te contam',
            text: 'Seu ingresso:',
            html: '<html><body>'+img+'</body></html>',
            attachments: [
                {
                  filename: "imageattachment.png",
                  content: imageb64,
                  disposition: "inline",
                  content_id: "qrcode-ticket",
                }
              ]  
            }
            sgMail
            .send(msg)
            .then(() => {
                console.log('Email sent')
            })
            .catch((error) => {
                console.error(error)
            })
        })
        .catch(err => {
            console.error(err)
        })
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
                email(ticket);
                res.status(201).json({success: true, data: ticket})
            } catch(error) {
                res.status(400).json({success: false, data: error})
            }
            break
    }
}