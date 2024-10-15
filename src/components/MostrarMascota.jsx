import * as React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

import '../scss/MostrarMascota.scss';

function MostrarMascota() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [mascota, setMascota] = React.useState(null);
    const [usuario, setUsuario] = React.useState(null);
    const [expanded, setExpanded] = React.useState(false);
    const [loading, setLoading] = React.useState(true);
    const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
    const [error, setError] = React.useState(null); 

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true); // Activa el estado de carga
    
                // Primero obtener la mascota
                const response = await axios.get(`http://localhost:8082/cuidame/listarPorId/${id}`);
                const mascotaData = {
                    ...response.data.responde,
                    fecha_nacimiento: response.data.responde.fecha_nacimiento.split('T')[0]
                };
                setMascota(mascotaData);
    
                // Luego obtener el usuario usando el id_usuario de mascotaData
                const responseUsuario = await axios.get(`http://localhost:8082/cuidame/obtenerUsuario/${mascotaData.id_usuario}`);
                setUsuario(responseUsuario.data.responde);
    
            } catch (error) {
                console.error("Error fetching data:", error);
                setError("Error al cargar la mascota o el usuario.");
            } finally {
                setLoading(false); // Desactiva el estado de carga
            }
        };
    
        fetchData();
    }, [id]);
    
    // Muestra un mensaje de carga mientras los datos no están listos
    if (loading) {
        return <Typography>Cargando...</Typography>;
    }
    


    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const handleDeleteClick = () => {
        setOpenDeleteDialog(true);
    };

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
    };

    const handleConfirmDelete = async () => {
        try {
            await axios.delete(`http://localhost:8082/cuidame/eliminar/${id}`);
            navigate('/');
        } catch (error) {
            console.error("Error deleting the pet:", error);
        } finally {
            setOpenDeleteDialog(false);
        }
    };

    // Si hay un error, muestra el mensaje de error
    if (error) {
        return <Typography color="error">{error}</Typography>;
    }

    // Si mascota es null, puedes mostrar un mensaje
    if (!mascota) {
        return <Typography>No se encontró la mascota.</Typography>;
    }

    const handleBackClick = ( id ) => {
        if(id === -1){
            navigate('/');
        }else{
            navigate(`/editar/${id}`)
        }
    };

    return (
        <section className={"mainSec"}>
            <Card sx={{ maxWidth: 345, borderRadius: 5 }}>
                <CardHeader
                    className={"cardExtremos"}
                    title={mascota.nombre}
                    action={
                        <IconButton aria-label="volver" onClick={() => handleBackClick(-1)}>
                            <ArrowBackIcon />
                        </IconButton>
                    }
                />
                <CardMedia
                    component="img"
                    height="400px"
                    image={`http://localhost:8082/uploads/${mascota.foto_path}`}
                    alt={`Foto de ${mascota.nombre}`}
                />
                <CardContent className={"cardContent"}>
                    <Typography variant="body2" color="text.secondary">
                        <strong>Raza:</strong> {mascota.raza}<br />
                        <strong>Edad:</strong> {mascota.edad} años<br />
                        <strong>Chip:</strong> {mascota.chip}<br />
                        <strong>Sexo:</strong> {mascota.sexo === 0 ? 'Masculino' : 'Femenino'}<br />
                        <strong>Fecha de Nacimiento:</strong> {mascota.fecha_nacimiento}<br />
                        <strong>Descripción:</strong> {mascota.descripcion}
                    </Typography>
                </CardContent>
                <CardActions className={"cardExtremos"} disableSpacing>
                   <IconButton aria-label="edit" onClick={() => handleBackClick(mascota.id_mascota)}>  
                        <EditIcon />
                    </IconButton>
                    <IconButton aria-label="delete" onClick={handleDeleteClick}>
                        <DeleteIcon />
                    </IconButton>
                    <ExpandMore
                        expand={expanded}
                        onClick={handleExpandClick}
                        aria-expanded={expanded}
                        aria-label="show more"
                    >
                        <ExpandMoreIcon />
                    </ExpandMore>
                </CardActions>
                <Collapse className={"cardCollapse"} in={expanded} timeout="auto" unmountOnExit>
                    <CardContent>
                        <Typography variant="body2" sx={{ marginBottom: 1 }}>
                            <strong>Dueño:</strong> {usuario.nombre + " " + usuario.apellidos}<br />
                            <strong>Correo:</strong> {usuario.correo}<br />
                            <strong>Telefono:</strong> {usuario.telefono}<br />
                        </Typography>
                    </CardContent>
                </Collapse>
            </Card>

            <Dialog
                open={openDeleteDialog}
                onClose={handleCloseDeleteDialog}
            >
                <DialogTitle>{"Confirmar eliminación"}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        ¿Estás seguro de que deseas eliminar a {mascota.nombre}?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteDialog} color="primary">
                        Cancelar
                    </Button>
                    <Button onClick={handleConfirmDelete} color="secondary" autoFocus>
                        Eliminar
                    </Button>
                </DialogActions>
            </Dialog>
        </section>
    );
}

const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme }) => ({
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
    ...(props => ({
        transform: props.expand ? 'rotate(180deg)' : 'rotate(0deg)',
    })),
}));

export default MostrarMascota;
