import { useRouter } from "next/router";
import Select from 'react-select';
import { useState } from "react"

export default function IngressoForm({assentos}) {
    const router = useRouter()
    const contentType = 'application/json'
    const [message, setMessage] = useState('')

    const [form, setForm] = useState({
        nome: "",
        email: "",
        ingresso: "",
        combo1: 0,
        combo2: 0
    })

    // set value for default selection
  const [selectedValue, setSelectedValue] = useState([]);
  const [assentosSelecionados, setAssentosSelecionados] = useState([]);
 
  // handle onChange event of the dropdown
  const handleChangeSelect = (e) => {
    setSelectedValue(Array.isArray(e) ? e.map(x => x.numero) : []);
    setAssentosSelecionados(Array.isArray(e) ? e.map(x => x) : []);
  }

    const handleChange = (e) => {
        const target = e.target
        const name = target.name
        const value = target.value;
        
        setForm({
            ...form,
            [name]: value,
        })
        
    }
    
    const handleSubmit = (e) => {
        e.preventDefault();
        form.ingresso = selectedValue.length > 0 ? assentosSelecionados : null;
        postData(form);
    }
    
    const postData = async (form) => {
        try {
          const res = await fetch('/api/ingressos', {
            method: 'POST',
            headers: {
              Accept: contentType,
              'Content-Type': contentType,
            },
            body: JSON.stringify(form),
          })
    
          // Throw error with status code in case Fetch API req failed
          if (!res.ok) {
            throw new Error(res.status)
          }
    
          router.push('/')
        } catch (error) {
          setMessage('Falha ao registrar ingresso')
        }
      }

    return (
        <>
            <form onSubmit={handleSubmit}>
                <label htmlFor="nome">Nome</label>
                <input
                type="text"
                name="nome"
                value={form.nome}
                onChange={handleChange}
                required
                />

                <label htmlFor="email">Email</label>
                <input
                type="text"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                />

                <label htmlFor="ingresso">Ingresso</label>
                <Select
                  className="dropdown"
                  placeholder="Selecione o(s) assento(s)"
                  getOptionLabel={option => option.numero}
                  getOptionValue={option => option._id}
                  value={assentos.filter(obj => selectedValue.includes(obj.numero))} // set selected values
                  options={assentos} // set list of the data
                  onChange={handleChangeSelect} // assign onChange function
                  isMulti
                  isClearable
                />

                <label htmlFor="combo">Combos</label>
                <div className="comboDiv">
                  <span>Combo 1</span>
                  <input 
                  type="number"
                  name="combo1"
                  value={form.combo1}
                  onChange={handleChange}
                  min="0"
                  required
                  />
                </div>
                <div className="comboDiv">
                  <span>Combo 2</span>
                  <input 
                  type="number"
                  name="combo2"
                  value={form.combo2}
                  onChange={handleChange}
                  min="0"
                  required
                  />
                </div>

                <button type="submit" className="btn">
                    Enviar
                </button>
            </form>
            <p>{message}</p>
        </>
    )
}