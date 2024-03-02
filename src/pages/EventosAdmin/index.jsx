import { useState, useEffect } from "react";

import "../../App.css";

//Firebase
import database from '../../services/Firebase';
import { getDatabase, ref, set, onValue } from "firebase/database";

// JoyUI
import {
    Stack,
    Typography,
    Button,
    Input,
    Table,
    Modal,
    ModalClose,
    Sheet,
    ModalDialog,
    Divider,
    Box,
} from "@mui/joy"

import { IoWarning } from "react-icons/io5";

//Utils
import { formatarData } from '../../utils/datas';

import Resizer from 'react-image-file-resizer';

//MediaQuery
import useMediaQuery from '@mui/material/useMediaQuery';
import { toast } from "react-toastify";

export default function EventosAdmin() {

    const db = getDatabase();

    const mobile = useMediaQuery('(max-width:1200px)');

    const [procura, setProcura] = useState("");
    const [modalEvento, setModalEvento] = useState(false);
    const [eventos, setEventos] = useState([]);
    const [eventoSelecionado, setEventoSelecionado] = useState({});
    const [indiceSelecionado, setIndiceSelecionado] = useState(0);
    const [atualizarEstados, setAtualizarEstados] = useState(false);
    const [eventoNovo, setEventoNovo] = useState(false);
    const [dialogConfirmacao, setDialogConfirmacao] = useState(false);
    const [selectedImage, setSelectedImage] = useState("");

    useEffect(() => {
        toast.loading("Buscando eventos salvos...", { toastId: "toast" });
        const eventosRef = ref(db, 'eventos/');
        onValue(eventosRef, (snapshot) => {
            toast.dismiss();
            const data = snapshot.val();
            console.log(data);
            setEventos(data != null ? data : []);
        });
    }, []);

    const consultarEvento = (indice) => {
        eventoSelecionado.descricao = eventos[indice].descricao;
        eventoSelecionado.data = eventos[indice].data;
        eventoSelecionado.hora = eventos[indice].hora;
        eventoSelecionado.local = eventos[indice].local;
        setSelectedImage(eventos[indice].imagem);
        // eventoSelecionado.imagem = eventos[indice].imagem;
        setEventoNovo(false)
        setIndiceSelecionado(indice);
        setModalEvento(true);
    }

    const atualizarEventoSelecionado = (key, value) => {
        eventoSelecionado[key] = value;
        setAtualizarEstados(!atualizarEstados);
    }

    const salvarEvento = async () => {

        if (eventoNovo) {
            let eventosAtuais = eventos;
            eventoSelecionado.imagem = selectedImage;
            eventosAtuais.push(eventoSelecionado);
            setEventos(eventosAtuais);
        }
        else {
            eventos[indiceSelecionado].descricao = eventoSelecionado.descricao;
            eventos[indiceSelecionado].data = eventoSelecionado.data;
            eventos[indiceSelecionado].hora = eventoSelecionado.hora;
            eventos[indiceSelecionado].local = eventoSelecionado.local;
            eventos[indiceSelecionado].imagem = selectedImage;
        }

        //Salvando no banco de dados
        set(ref(db, 'eventos'), eventos);
        setModalEvento(false);
    }

    const novoEvento = () => {
        setEventoSelecionado({});
        setEventoNovo(true)
        setModalEvento(true);
        setSelectedImage("");
    }

    const excluirEvento = () => {
        let eventosAtuais = eventos;
        eventosAtuais.splice(indiceSelecionado, 1);
        setEventos(eventosAtuais);
        setModalEvento(false);
        //Salvando no banco de dados
        set(ref(db, 'eventos'), eventosAtuais);
    }

    const selecionarNovaImagem = async (e) => {
        const file = e.target.files[0];

        if (file) {
            const reader = new FileReader();
            // reader.onload = async (event) => {
            //     const base64Image = event.target.result;
            //     setSelectedImage(base64Image);
            //     // const imagemCompactada = compactarImagem(base64Image);
            //     // setSelectedImage(imagemCompactada);
            // };
            toast.loading("Compactando imagem...");
            await compactarImagem(file);
            toast.dismiss();
            reader.readAsDataURL(file);
        }
    }

    const compactarImagem = async (imagemBase64) => {
        new Promise((resolve) => {
            Resizer.imageFileResizer(
                imagemBase64,
                500, // largura desejada
                500, // altura desejada
                'JPEG', // formato de saída
                100, // qualidade da imagem (0-100)
                0, // rotação (0 = sem rotação)
                (imagemCompactada) => {
                    // Faça algo com a imagem compactada, como enviar para o servidor
                    setSelectedImage(imagemCompactada);
                    console.log("Imagem substituída");
                    resolve(imagemCompactada);
                },
                'base64' // tipo de saída (base64 ou blob)
            );
        });
    };

    return (
        <Stack flex={1}>
            <Stack width={"100%"} mt={mobile ? "20px" : "40px"} flexDirection={"row"} alignItems={"flex-end"} justifyContent={mobile ? "flex-start" : "space-between"}>
                <Stack width={"100%"} sx={{ marginRight: "20px" }} flexDirection={mobile ? "column" : "row"} alignItems={mobile ? "flex-start" : "center"}>
                    <Typography sx={mobile ? { marginRight: "0px" } : { marginRight: "10px" }}>Buscar por</Typography>
                    <Input placeholder="Descrição do evento" sx={mobile ? { width: "100%" } : { width: "400px" }} value={procura} onChange={(event) => setProcura(event.target.value)} />
                </Stack>
                <Button onClick={novoEvento} sx={mobile ? { marginLeft: "0px" } : { marginLeft: "20px" }}>Novo</Button>
            </Stack>
            <Stack mt="40px">
                {mobile ?
                    <Stack>
                        {eventos.map(function (evento, indice) {
                            if (evento.descricao.toLowerCase().includes(procura.toLowerCase())) {
                                return (
                                    <Stack key={indice} onClick={() => consultarEvento(indice)} mb={"10px"} boxShadow={"md"} backgroundColor="#fff" borderRadius={"5px"} padding={"10px"}>
                                        <Stack flexDirection={"row"} alignItems={"center"}>
                                            <Typography level="body-md">{evento.descricao}</Typography>
                                        </Stack>
                                    </Stack>
                                )
                            }
                        })}
                    </Stack>
                    :
                    <Table aria-label="basic table" stripe="even">
                        <thead>
                            <tr>
                                <th style={{ height: "10px" }}>Descrição</th>
                                <th style={{ height: "10px", width: "150px" }}>Data</th>
                                <th style={{ height: "10px", width: "150px" }}>Hora</th>
                                <th style={{ height: "10px", width: "150px" }}>Local</th>
                            </tr>
                        </thead>
                        <tbody>
                            {eventos.map(function (evento, indice) {
                                if (evento.descricao.toLowerCase().includes(procura.toLowerCase())) {
                                    return (
                                        <tr key={indice} className="hover" onClick={() => consultarEvento(indice)}>
                                            <td>{evento.descricao}</td>
                                            <td>{formatarData(evento.data)}</td>
                                            <td>{evento.hora}</td>
                                            <td>{evento.local}</td>
                                        </tr>
                                    );
                                }
                            })}
                        </tbody>
                    </Table>
                }
            </Stack>

            <Modal
                aria-labelledby="modal-title"
                aria-describedby="modal-desc"
                open={modalEvento}
                onClose={() => setModalEvento(false)}
                sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            >
                <Sheet
                    variant="outlined"
                    sx={{
                        minWidth: mobile ? "80%" : 600,
                        maxWidth: mobile ? "80%" : 600,
                        maxHeight: mobile ? "90%" : null,
                        borderRadius: 'md',
                        p: 3,
                        boxShadow: 'lg',
                        overflow: "auto"
                    }}
                >
                    <ModalClose
                        variant="outlined"
                        sx={{
                            // top: 'calc(-1/4 * var(--IconButton-size))',
                            // right: 'calc(-1/4 * var(--IconButton-size))',
                            boxShadow: '0 2px 12px 0 rgba(0 0 0 / 0.2)',
                            borderRadius: '50%',
                            bgcolor: 'background.surface',
                        }}
                    />
                    <Typography
                        component="h2"
                        id="modal-title"
                        level="h4"
                        textColor="inherit"
                        fontWeight="lg"
                        mb={1}
                    >
                        Informações do Evento
                    </Typography>
                    <Stack mt="20px">
                        <Stack>
                            <Typography>Descrição</Typography>
                            <Input value={eventoSelecionado.descricao} onChange={(event) => atualizarEventoSelecionado("descricao", event.target.value)} />
                        </Stack>
                        <Stack mt="20px">
                            <Typography>Data</Typography>
                            <Input type="date" value={eventoSelecionado.data} onChange={(event) => atualizarEventoSelecionado("data", event.target.value)} />
                        </Stack>
                        <Stack mt="20px">
                            <Typography>Hora</Typography>
                            <Input type="time" value={eventoSelecionado.hora} onChange={(event) => atualizarEventoSelecionado("hora", event.target.value)} />
                        </Stack>
                        <Stack mt="20px">
                            <Typography>Local</Typography>
                            <Input value={eventoSelecionado.local} onChange={(event) => atualizarEventoSelecionado("local", event.target.value)} />
                        </Stack>
                        <Stack mt="20px" mb="20px">
                            <Typography sx={{ marginBottom: "10px" }}>Arte do Evento</Typography>
                            <img src={selectedImage != "" ? selectedImage : eventoSelecionado.imagem} width={150} height={150} />
                            <Input type="file" sx={{ marginTop: "20px" }} onChange={selecionarNovaImagem} />
                        </Stack>
                        <Stack flexDirection={"row"} justifyContent={"space-between"} mt="30px">
                            <Button color="danger" disabled={eventoNovo} onClick={() => setDialogConfirmacao(true)}>Excluir</Button>
                            <Button disabled={eventoSelecionado.nome == ""} onClick={salvarEvento}>Salvar</Button>
                        </Stack>
                    </Stack>
                </Sheet>
            </Modal>

            <Modal open={dialogConfirmacao} onClose={() => setDialogConfirmacao(false)}>
                <ModalDialog
                    variant="outlined"
                    role="alertdialog"
                    aria-labelledby="alert-dialog-modal-title"
                    aria-describedby="alert-dialog-modal-description"
                >
                    <Typography
                        id="alert-dialog-modal-title"
                        level="h2"
                        startDecorator={<IoWarning size="20px" color="#FF0000" />}
                    >
                        Tem certeza que deseja excluir?
                    </Typography>
                    <Divider />
                    <Typography id="alert-dialog-modal-description" textColor="text.tertiary">
                        Esta operação é irreversível
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', pt: 2 }}>
                        <Button variant="plain" color="neutral" onClick={() => setDialogConfirmacao(false)}>
                            Cancelar
                        </Button>
                        <Button variant="solid" color="danger" onClick={() => [excluirEvento(), setDialogConfirmacao(false)]}>
                            Excluir
                        </Button>
                    </Box>
                </ModalDialog>
            </Modal>
        </Stack>
    )
}