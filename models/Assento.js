import mongoose from "mongoose";

const AssentoSchema = new mongoose.Schema({
    numero: {
        type: String
    },
    ocupado: {
        type: Boolean,
        default: false
    }
});

export default mongoose.models.Assento || mongoose.model("Assento", AssentoSchema);