import { useRouter } from "next/router";
import { useState } from "react"
import BaseSelect from "react-select";
import FixRequiredSelect from "./FixRequiredSelect";

const Select = props => (
  <FixRequiredSelect
    {...props}
    SelectComponent={BaseSelect}
    options={props.options || options}
  />
);

export default function IngressoForm({assentos}) {
    const router = useRouter()
    const contentType = 'application/json'
    const [message, setMessage] = useState('')
    const [isLoading, setIsLoading] = useState(false);

    const [form, setForm] = useState({
        nome: "",
        email: "",
        ingresso: "",
        combo1: "",
        combo2: ""
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

    function clearForm() {
      setForm({nome: "",
      email: "",
      ingresso: "",
      combo1: "",
      combo2: ""})
      setSelectedValue([]);
      setAssentosSelecionados([]);
    }
    
    const handleSubmit = (e) => {
        e.preventDefault();
        form.ingresso = selectedValue.length > 0 ? assentosSelecionados : null;
        form.combo1 === "" && delete form.combo1;
        form.combo2 === "" && delete form.combo2;
        postData(form);
    }
    
    const postData = async (form) => {
        try {
          setIsLoading(true);
          const res = await fetch('/api/ingressos', {
            method: 'POST',
            headers: {
              Accept: contentType,
              'Content-Type': contentType,
            },
            body: JSON.stringify(form),
          })
          setIsLoading(false);
    
          // Throw error with status code in case Fetch API req failed
          if (!res.ok) {
            throw new Error(res.status)
          }

          clearForm();
          router.push('/');
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
              type="email"
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
                required
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
                placeholder="0"
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
                placeholder="0"
                />
              </div>

              <button type="submit" className="btn">
                  Enviar
              </button>
            </form>
            <p>{message}</p>
            { isLoading && (
            <div class="spinner-box">
              <div class="pulse-container">  
                <div class="pulse-bubble pulse-bubble-1"></div>
                <div class="pulse-bubble pulse-bubble-2"></div>
                <div class="pulse-bubble pulse-bubble-3"></div>
              </div>
            </div>
          )}
        </>
    )
}