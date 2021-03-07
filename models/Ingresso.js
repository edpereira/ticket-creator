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
        type: Array,
        required: [true, "Ingresso é obrigatório"]
    },
    combo1: {
        type: Number,
        default: 0
    },
    combo2: {
        type: Number,
        default: 0
    }
});

export default mongoose.models.Ingresso || mongoose.model("Ingresso", IngressoSchema);