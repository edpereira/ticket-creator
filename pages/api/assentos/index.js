import dbConnect from "../../../utils/dbConnect";
import Assento from "../../../models/Assento";

export default async function handler(req, res) {
    const {method} = req;

    await dbConnect();

    switch(method) {
        case 'GET':
            try {
                const assentos = await Assento.find({})
                res.status(200).json({ success: true, data: assentos })
              } catch (error) {
                res.status(400).json({ success: false })
              }
            break
        case 'POST':
            try {
                if (Array.isArray(req.body)) {
                    const response = await Assento.insertMany(req.body);
                    res.status(201).json({success: true, data: response})
                } else {
                    const response = await Assento.create(req.body);
                    res.status(201).json({success: true, data: response})
                }
            } catch(error) {
                res.status(400).json({success: false, data: error})
            }
            break
        case 'PUT':
            try {
                var response = [];
                for (var i = 0; i < req.body.length; i++) {
                    var assento = req.body[i];
                    const r = await Assento.findByIdAndUpdate(assento._id, assento);
                    response.push(r);
                }
                res.status(201).json({success: true, data: response})
            } catch(error) {
                res.status(400).json({success: false, data: error})
            }
            break
    }
}