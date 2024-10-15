import React, { useEffect, useState } from "react";
import axios from "axios";
import MascotaCard from "./layaouts/MascotaCard";
import '../scss/ListarMascotas.scss';
import AddIcon from '@mui/icons-material/Add';
import BuscadorMascotas from "./layaouts/BuscadorMascotas";
import { useNavigate } from 'react-router-dom';

const ListarMascota = () => {
    const [mascotas, setMascotas] = useState([]);
    const [buscarMascota, setBuscarMascota] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMascotas = async () => {
            try {
                const response = await axios.get("http://localhost:8082/cuidame/listar");
                setMascotas(response.data.mascotas);
            } catch (error) {
                console.error("Error al obtener las mascotas:", error);
            }
        };

        fetchMascotas();
    }, []);

    const filtrarMascotas = () => {
        return mascotas.filter((mascota) =>
            mascota.nombre?.toLowerCase().includes(buscarMascota.toLowerCase())
        );
    };

    const mascotasFiltrar = filtrarMascotas();

    return (
        <div className="mainDiv">
            <p>Selecciona la que quieras consultar</p>
            <BuscadorMascotas setBuscarMascota={setBuscarMascota} />

            <section className="mascotasCards">
                <div className="cardMascota agregar" onClick={() => navigate('/agregar')}>
                    <div className="iconContainer">
                        <span className="circle">
                            <AddIcon style={{ fontSize: 100 }} />
                        </span>
                    </div>
                    <div className="nombreContenedor">
                        <h2 className="nombreMascota">Agregar</h2>
                    </div>
                </div>

                {mascotasFiltrar.map((mascota) => (
                    <MascotaCard
                        key={mascota.id_mascota} 
                        nombre={mascota.nombre}
                        imagenPath={mascota.foto_path}
                        id={mascota.id_mascota}
                    />
                ))}
            </section>
        </div>
    );
};

export default ListarMascota;
