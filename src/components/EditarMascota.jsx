import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { TextField, Button, Snackbar, Select, MenuItem } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import axios from "axios";
import '../scss/AgregarMascota.scss';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const EditarMascota = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [nombre, setNombre] = useState("");
    const [foto, setFoto] = useState("");
    const [fotoPreview, setFotoPreview] = useState(null);
    const [sexo, setSexo] = useState("");
    const [especie, setEspecie] = useState("");
    const [raza, setRaza] = useState("");
    const [fechaNacimiento, setFechaNacimiento] = useState("");
    const [chip, setChip] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [errorMessages, setErrorMessages] = useState([]);
    const [openSnackbar, setOpenSnackbar] = useState(false);

    // Cargar datos de la mascota al montar el componente
    useEffect(() => {
        const fetchMascota = async () => {
            try {
                const response = await axios.get(`http://localhost:8082/cuidame/listarPorId/${id}`);
                const mascota = response.data.responde;
                setNombre(mascota.nombre);
                setSexo(mascota.sexo);
                setEspecie(mascota.especie);
                setRaza(mascota.raza);
                setFechaNacimiento(mascota.fecha_nacimiento.split('T')[0]); // Formatear fecha
                setChip(mascota.chip);
                setDescripcion(mascota.descripcion);
                setFotoPreview(`http://localhost:8082/uploads/${mascota.foto_path}`); // Mostrar imagen actual
                setFoto(mascota.foto_path);
                console.log(foto);
            } catch (error) {
                console.error("Error al cargar la mascota:", error);
                setErrorMessages(["Error al cargar la información de la mascota."]);
                setOpenSnackbar(true);
            }
        };

        fetchMascota();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = [];

        // Validaciones
        if (nombre.length > 25) {
            errors.push("El nombre no puede tener más de 25 caracteres.");
        }
        if (especie.length > 20) {
            errors.push("La especie no puede tener más de 20 caracteres.");
        }
        if (raza.length > 20) {
            errors.push("La raza no puede tener más de 20 caracteres.");
        }
        if (chip.length > 15) {
            errors.push("El número de chip no puede tener más de 15 caracteres.");
        }
        if (descripcion.length > 250) {
            errors.push("La descripción no puede tener más de 250 caracteres.");
        }
        if (!fechaNacimiento || new Date(fechaNacimiento) > new Date()) {
            errors.push("La fecha de nacimiento no puede ser mayor a la fecha actual.");
        }

        if (errors.length > 0) {
            setErrorMessages(errors);
            setOpenSnackbar(true);
            return;
        }

        const formData = new FormData();
        formData.append("id_mascota", id);
        formData.append("nombre", nombre);
        formData.append("foto_path", foto);
        formData.append("sexo", sexo);
        formData.append("especie", especie);
        formData.append("raza", raza);
        formData.append("fecha_nacimiento", fechaNacimiento);
        formData.append("chip", chip);
        formData.append("descripcion", descripcion);
        formData.append("id_usuario", 1); // Cambiar en caso de agregar sesiones

        try {
            const response = await axios.put(`http://localhost:8082/cuidame/actualizar`, formData);
            navigate(`/mascota/${id}`)
        } catch (error) {
            console.error("Error al editar la mascota:", error);
            setErrorMessages(["Error al editar la mascota. Intenta nuevamente."]);
            setOpenSnackbar(true);
        }
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
        setErrorMessages([]);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && (file.type === "image/jpeg" || file.type === "image/png" || file.type === "image/jpg")) {
            setFoto(file);
            const fileURL = URL.createObjectURL(file);
            setFotoPreview(fileURL);
        } else {
            setErrorMessages(["El archivo debe ser una imagen (jpg, jpeg, png)."]);
            setOpenSnackbar(true);
        }
    };

    const handleBackClick = ( ) => {
        navigate(`/mascota/${id}`)
    };

    return (
        <div className={"mainDiv"}>
            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity="error">
                    {errorMessages.map((msg, index) => (
                        <div key={index}>{msg}</div>
                    ))}
                </Alert>
            </Snackbar>

            <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '600px' }}>
                <div className="perritoContainer">
                    <p>Por favor ingresa los datos que quieras cambiar de tu mascota</p>
                    <img className="tuMascota" src={`http://localhost:8082/uploads/${foto}`} alt="perrito" />
                </div>

                <div className={"inputDiv nombre"}>
                    <TextField
                        label="Nombre"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        inputProps={{ maxLength: 25 }}
                        fullWidth
                    />
                </div>

                <div className={"inputDiv sexo"}>
                    <Select
                        value={sexo}
                        onChange={(e) => setSexo(e.target.value)}
                        fullWidth
                        displayEmpty
                    >
                        <MenuItem value="">
                            <em>Selecciona el sexo</em>
                        </MenuItem>
                        <MenuItem value={0}>Masculino</MenuItem>
                        <MenuItem value={1}>Femenino</MenuItem>
                    </Select>
                </div>

                <div className={"inputDiv especie"}>
                    <TextField
                        label="Especie"
                        value={especie}
                        onChange={(e) => setEspecie(e.target.value)}
                        inputProps={{ maxLength: 20 }}
                        fullWidth
                    />
                </div>

                <div className={"inputDiv raza"}>
                    <TextField
                        label="Raza"
                        value={raza}
                        onChange={(e) => setRaza(e.target.value)}
                        inputProps={{ maxLength: 20 }}
                        fullWidth
                    />
                </div>

                <div className={"inputDiv nacimiento"}>
                    <TextField
                        label="Fecha de Nacimiento"
                        type="date"
                        value={fechaNacimiento}
                        onChange={(e) => setFechaNacimiento(e.target.value)}
                        fullWidth
                        InputLabelProps={{
                            shrink: true,
                        }}
                        inputProps={{
                            pattern: "\\d{4}-\\d{2}-\\d{2}" // yyyy-mm-dd
                        }}
                    />
                </div>

                <div className={"inputDiv chip"}>
                    <TextField
                        label="Chip"
                        value={chip}
                        onChange={(e) => setChip(e.target.value)}
                        inputProps={{ maxLength: 15 }}
                        fullWidth
                    />
                </div>

                <div className={"bottomPart"}>
                    <div className={"inputDiv imagen"}>
                        <input
                            type="file"
                            accept="image/jpeg, image/png, image/jpg"
                            onChange={handleFileChange}
                            style={{ display: 'none' }}
                            id="foto-upload"
                        />
                        <label htmlFor="foto-upload">
                            <Button variant="contained" component="span">
                                Subir Foto
                            </Button>
                        </label>
                        {fotoPreview && (
                            <div style={{ marginTop: '10px' }}>
                                <img
                                    className={"imgPreview"}
                                    src={`http://localhost:8082/uploads/${foto}`}
                                    alt="Vista previa"
                                />
                            </div>
                        )}
                    </div>

                    <div className={"inputDiv descripcion"}>
                        <TextField
                            label="Descripción"
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                            inputProps={{ maxLength: 250 }}
                            fullWidth
                            multiline
                            rows={4}
                        />
                    </div>
                </div>

                <div style={{ textAlign: 'center' }}>
                    <Button onClick={handleBackClick} variant="contained" color="error" style={{marginRight: '15px'}}>
                        Cancelar
                    </Button>
                    <Button type="submit" variant="contained" color="primary">
                        Agregar
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default EditarMascota;
