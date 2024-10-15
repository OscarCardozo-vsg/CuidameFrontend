import React from 'react';
import TextField from '@mui/material/TextField';

const BuscadorMascotas = ({ setBuscarMascota }) => {
    const handleInputChange = (e) => {
        setBuscarMascota(e.target.value);
    };

    return (
        <TextField
            label="Busca tu mascota"
            variant="outlined"
            onChange={handleInputChange} // Actualiza el término de búsqueda
            style={{ width: '80%', margin: '0 10%' }}
        />
    );
};

export default BuscadorMascotas;
