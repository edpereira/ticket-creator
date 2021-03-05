import { useRouter } from "next/router";
import { useState } from "react"

export default function IngressoForm() {
    const router = useRouter()
    const contentType = 'application/json'
    const [message, setMessage] = useState('')

    const [form, setForm] = useState({
        nome: "",
        email: "",
        ingresso: "",
        combo: "",
    })

    const handleChange = (e) => {
        const target = e.target
        const name = target.name
        const value = target.value
        
        setForm({
            ...form,
            [name]: value,
        })
        
    }
    
    const handleSubmit = (e) => {
        e.preventDefault()
        console.log(form)
        postData(form)
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
                <input
                type="text"
                name="ingresso"
                value={form.ingresso}
                onChange={handleChange}
                required
                />

                <label htmlFor="combo">Combo</label>
                <input
                type="text"
                name="combo"
                value={form.combo}
                onChange={handleChange}
                required
                />

                <button type="submit" className="btn">
                    Enviar
                </button>
            </form>
            <p>{message}</p>
        </>
    )
}