import dbConnect from "../../../utils/dbConnect";
import Ingresso from "../../../models/Ingresso";
import Assento from "../../../models/Assento";

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
                res.status(201).json({success: true, data: ticket})
            } catch(error) {
                res.status(400).json({success: false, data: error})
            }
            break
    }
}