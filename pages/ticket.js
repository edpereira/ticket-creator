import IngressoForm from "../components/IngressoForm";
import Assento from "../models/Assento";
import dbConnect from "../utils/dbConnect";

export async function getServerSideProps() {
    await dbConnect()
  
    /* find all the data in our database */
    const result = await Assento.find({ ocupado: false })
    const assentos = result.map((doc) => {
      const assento = doc.toObject()
      assento._id = assento._id.toString()
      return assento
    })
  
    return { props: { assentos: assentos } }
  }

export default function NewTicket({ assentos }) {
    return <IngressoForm assentos={assentos} />
}