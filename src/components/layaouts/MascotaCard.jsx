import * as React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../scss/MascotaCard.scss';

const MascotaCard = ({ nombre, imagenPath, id }) => {
    const navigate = useNavigate();
    const [img, setImg] = React.useState("");

    React.useEffect(() => {
        const fetchImagen = async () => {
            try {
                if (imagenPath === "Agregar") {
                    setImg("/images/add.png");
                } else {
                    // Solicitar la imagen al backend
                    const response = await axios.get(`http://localhost:8082/uploads/${imagenPath}`, { responseType: 'blob' });

                    // Crear un URL para la imagen
                    const url = URL.createObjectURL(response.data);
                    setImg(url);
                }
            } catch (error) {
                console.error("Error al cargar la imagen:", error.response ? error.response.data : error.message);
                // Puedes establecer una imagen por defecto en caso de error
                setImg("/images/default.png"); 
            }
        };

        fetchImagen();
    }, [imagenPath]);

    const handleCardClick = () => {
        if (id === -1) {
            navigate(`/agregar`);
        } else {
            navigate(`/mascota/${id}`);
        }
    };

    return (
        <div className={`cardMascota`} onClick={handleCardClick}>
            <img
                className={"imgMascota"}
                src={img} // Usar el estado img que contiene la URL de la imagen
                alt={`${nombre} Mascota`}
            />
            <div className={"nombreContenedor"}>
                <h2 className={"nombreMascota"}>{nombre}</h2>
            </div>
        </div>
    );
}

export default MascotaCard;
