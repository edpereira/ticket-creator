import mongoose from "mongoose";

const IngressoSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: [true, "Nome é obrigatório"]
    },
    email: {
        type: String
    },
    ingresso: {
        type: String,
        required: [true, "Ingresso é obrigatório"]
    },
    combo: {
        type: String
    }
});

export default mongoose.models.Ingresso || mongoose.model("Ingresso", IngressoSchema);