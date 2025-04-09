"use client"

import { useState } from "react"

export default function AgencyForm({ userEmail }: { userEmail: string }) {
  const [formData, setFormData] = useState({
    name: "",
    vatNumber: "",
    telephone: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const response = await fetch("/api/register-company", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...formData, userEmail }),
    })
    if (response.ok) {
      alert("Registrazione completata!")
    } else {
      alert("Errore nella registrazione")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <label>
        Nome Azienda
        <input type="text" name="name" value={formData.name} onChange={handleChange} required />
      </label>
      <label>
        Partita IVA
        <input type="text" name="vatNumber" value={formData.vatNumber} onChange={handleChange} required />
      </label>
      <label>
        Telefono
        <input type="text" name="telephone" value={formData.telephone} onChange={handleChange} required />
      </label>
      <button type="submit">Registrati</button>
    </form>
  )
}
