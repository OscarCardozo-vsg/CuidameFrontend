import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from "./components/layaouts/Header";
import ListarMascota from "./components/ListarMascota";
import AgregarMascota from "./components/AgregarMascota";
import MostrarMascota from "./components/MostrarMascota";
import EditarMascota from './components/EditarMascota';

function App() {
    return (
      <div className="App">
        <Header />
        <main>
        <Router>
          <Routes>
            {/* Ruta para agregar una nueva mascota */}
            <Route path="/agregar" element={<AgregarMascota />} />

            {/* Ruta para listar todas las mascotas */}
            <Route path="/" element={<ListarMascota />} />

            {/* Ruta para mostrar una mascota por ID */}
            <Route path="/mascota/:id" element={<MostrarMascota />} />

            {/* Ruta para editar una mascota por ID */}
            <Route path="/editar/:id" element={<EditarMascota />} />
          </Routes>
        </Router>
        </main>
      </div>
    );
}

export default App;
