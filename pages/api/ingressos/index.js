import dbConnect from "../../../utils/dbConnect";
import Ingresso from "../../../models/Ingresso";
import Assento from "../../../models/Assento";
// import sgMail from "@sendgrid/mail"
import nodemailer from "nodemailer";
import inlineBase64 from "nodemailer-plugin-inline-base64";
import QRCode from "qrcode";

export async function email(ticket) {
    try {
        // console.log(process.env.SENDGRID_API_KEY)
        // sgMail.setApiKey(process.env.SENDGRID_API_KEY)
        // const msg = {
        // to: 'eduardo.pereira2806@gmail.com', // Change to your recipient
        // from: 'cofam.mnj@gmail.com', // Change to your verified sender
        // subject: 'Sending with SendGrid is Fun',
        // text: 'and easy to do anywhere, even with Node.js',
        // html: '<strong>and easy to do anywhere, even with Node.js</strong>',
        // }
        // sgMail
        // .send(msg)
        // .then(() => {
        //     console.log('Email sent')
        // })
        // .catch((error) => {
        //     console.error(error)
        // })
        // console.log(process.env.EMAIL);

        var transporter = nodemailer.createTransport({
            service: 'Gmail',
            port: 587,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.SENHA
            }
        });

        transporter.use('compile', inlineBase64());

        
        // With promises
        QRCode.toDataURL(ticket._id.toString())
        .then(url => {

            const img = '<img src="'+url+'" alt="QRCode" />'

            var mailOptions = {
                from: process.env.EMAIL,
                to: ticket.email,
                subject: 'Sending Email using Node.js',
                html: '<html><body>'+img+'</body></html>'
            };
    
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
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