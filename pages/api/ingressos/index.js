import dbConnect from "../../../utils/dbConnect";
import Ingresso from "../../../models/Ingresso";

export default async function handler(req, res) {
    const {method} = req;

    await dbConnect();

    switch(method) {
        case 'POST':
            try {
                const ingresso = await Ingresso.create(req.body);
                res.status(201).json({success: true, data: ingresso})
            } catch(error) {
                res.status(400).json({success: false, data: error})
            }
            break
    }
}