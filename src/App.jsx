import './App.css'
import CompraEntrada from './components/CompraEntrada'
function App() {
  const eventoId = import.meta.env.VITE_EVENTO_ID || null
  return (
    <>
      <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">Compra tu entrada</h1>
        <CompraEntrada eventoId={eventoId} />
      </div>
    </div>
    </>
  )
}

export default App
