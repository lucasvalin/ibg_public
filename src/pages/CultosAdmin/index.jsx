import { useState, useEffect } from "react";

import "../../App.css";

//Firebase
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

//MediaQuery
import useMediaQuery from '@mui/material/useMediaQuery';

export default function CultosAdmin(props) {

    const mobile = useMediaQuery('(max-width:1200px)');
    const db = getDatabase();

    const [procura, setProcura] = useState("");
    const [modalCulto, setModalCulto] = useState(false);
    const [cultos, setCultos] = useState([]);
    const [cultoSelecionado, setCultoSelecionado] = useState({});
    const [indiceSelecionado, setIndiceSelecionado] = useState(0);
    const [atualizarEstados, setAtualizarEstados] = useState(false);
    const [cultoNovo, setCultoNovo] = useState(false);
    const [dialogConfirmacao, setDialogConfirmacao] = useState(false);

    useEffect(() => {
        const cultosRef = ref(db, 'cultos/');
        onValue(cultosRef, (snapshot) => {
            const data = snapshot.val();
            setCultos(data == null ? [] : data);
        });
    }, []);


    const consultarCulto = (indice) => {
        cultoSelecionado.titulo = cultos[indice].titulo;
        cultoSelecionado.diaDaSemana = cultos[indice].diaDaSemana;
        cultoSelecionado.horario = cultos[indice].horario;
        setCultoNovo(false)
        setIndiceSelecionado(indice);
        setModalCulto(true);
    }

    const atualizarCultoSelecionado = (key, value) => {
        cultoSelecionado[key] = value;
        setAtualizarEstados(!atualizarEstados);
    }

    const salvarCulto = () => {
        if (cultoNovo) {
            let cultosAtuais = cultos;
            cultosAtuais.push(cultoSelecionado);
            setCultos(cultosAtuais);
        }
        else {
            cultos[indiceSelecionado].titulo = cultoSelecionado.titulo;
            cultos[indiceSelecionado].diaDaSemana = cultoSelecionado.diaDaSemana;
            cultos[indiceSelecionado].horario = cultoSelecionado.horario;
        }

        //Salvando no banco de dados
        set(ref(db, 'cultos'), cultos);
        setModalCulto(false);
    }

    const novoCulto = () => {
        setCultoSelecionado({});
        setCultoNovo(true)
        setModalCulto(true);
    }

    const excluirCulto = () => {
        let cultosAtuais = cultos;
        cultosAtuais.splice(indiceSelecionado, 1);
        setCultos(cultosAtuais);
        //Salvando no banco de dados
        set(ref(db, 'cultos'), cultosAtuais);
        setModalCulto(false);
    }

    return (
        <Stack flex={1}>
            <Stack width={"100%"} mt={mobile ? "20px" : "40px"} flexDirection={"row"} alignItems={"flex-end"} justifyContent={mobile ? "flex-start" : "space-between"}>
                <Stack width={"100%"} sx={{ marginRight: "20px" }} flexDirection={mobile ? "column" : "row"} alignItems={mobile ? "flex-start" : "center"}>
                    <Typography sx={mobile ? { marginRight: "0px" } : { marginRight: "10px" }}>Buscar por</Typography>
                    <Input placeholder="Nome do Culto" sx={mobile ? { width: "100%" } : { width: "400px" }} value={procura} onChange={(event) => setProcura(event.target.value)} />
                </Stack>
                <Button onClick={novoCulto} sx={mobile ? { marginLeft: "0px" } : { marginLeft: "20px" }}>Novo</Button>
            </Stack>
            <Stack mt="40px">
                {mobile ?
                    <Stack>
                        {cultos.map(function (culto, indice) {
                            if (culto.titulo.toLowerCase().includes(procura.toLowerCase())) {
                                return (
                                    <Stack onClick={() => consultarCulto(indice)} mb={"10px"} boxShadow={"md"} backgroundColor="#fff" borderRadius={"5px"} padding={"10px"}>
                                        <Stack flexDirection={"row"} alignItems={"center"}>
                                            <Typography level="body-md">{culto.titulo}</Typography>
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
                                <th style={{ height: "10px" }}>Título</th>
                                <th style={{ height: "10px", width: "150px" }}>Dia da Semana</th>
                                <th style={{ height: "10px", width: "150px" }}>Horário</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cultos.map(function (culto, indice) {
                                if (culto.titulo.toLowerCase().includes(procura.toLowerCase())) {
                                    return (
                                        <tr className="hover" onClick={() => consultarCulto(indice)}>
                                            <td>{culto.titulo}</td>
                                            <td>{culto.diaDaSemana}</td>
                                            <td>{culto.horario}</td>
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
                open={modalCulto}
                onClose={() => setModalCulto(false)}
                sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            >
                <Sheet
                    variant="outlined"
                    sx={{
                        minWidth: mobile ? "80%" : 600,
                        maxWidth: mobile ? "80%" : 600,
                        borderRadius: 'md',
                        p: 3,
                        boxShadow: 'lg',
                    }}
                >
                    <ModalClose
                        variant="outlined"
                        sx={{
                            top: 'calc(-1/4 * var(--IconButton-size))',
                            right: 'calc(-1/4 * var(--IconButton-size))',
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
                        Informações do Culto
                    </Typography>
                    <Stack mt="20px">
                        <Stack>
                            <Typography>Título</Typography>
                            <Input value={cultoSelecionado.titulo} onChange={(event) => atualizarCultoSelecionado("titulo", event.target.value)} />
                        </Stack>
                        <Stack mt="20px">
                            <Typography>Dia da Semana</Typography>
                            <Input value={cultoSelecionado.diaDaSemana} onChange={(event) => atualizarCultoSelecionado("diaDaSemana", event.target.value)} />
                        </Stack>
                        <Stack mt="20px">
                            <Typography>Horário</Typography>
                            <Input type="time" value={cultoSelecionado.horario} onChange={(event) => atualizarCultoSelecionado("horario", event.target.value)} />
                        </Stack>
                        <Stack flexDirection={"row"} justifyContent={"space-between"} mt="30px">
                            <Button color="danger" disabled={cultoNovo} onClick={() => setDialogConfirmacao(true)}>Excluir</Button>
                            <Button disabled={cultoSelecionado.titulo == ""} onClick={salvarCulto}>Salvar</Button>
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
                        <Button variant="solid" color="danger" onClick={() => [excluirCulto(), setDialogConfirmacao(false)]}>
                            Excluir
                        </Button>
                    </Box>
                </ModalDialog>
            </Modal>
        </Stack>
    )
}