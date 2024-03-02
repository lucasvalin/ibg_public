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

export default function ReunioesAdmin() {

    const db = getDatabase();

    const mobile = useMediaQuery('(max-width:1200px)');

    const [procura, setProcura] = useState("");
    const [modalReuniao, setModalReuniao] = useState(false);
    const [reunioes, setReunioes] = useState([]);
    const [reuniaoSelecionada, setReuniaoSelecionada] = useState({});
    const [indiceSelecionado, setIndiceSelecionado] = useState(0);
    const [atualizarEstados, setAtualizarEstados] = useState(false);
    const [reuniaoNova, setReuniaoNova] = useState(false);
    const [dialogConfirmacao, setDialogConfirmacao] = useState(false);

    useEffect(() => {
        toast.loading("Buscando reunioes salvas...", { toastId: "toast" });
        const reunioesRef = ref(db, 'reunioes/');
        onValue(reunioesRef, (snapshot) => {
            toast.dismiss();
            const data = snapshot.val();
            console.log(data);
            setReunioes(data != null ? data : []);
        });
    }, []);

    const consultarReuniao = (indice) => {
        reuniaoSelecionada.descricao = reunioes[indice].descricao;
        reuniaoSelecionada.data = reunioes[indice].data;
        reuniaoSelecionada.hora = reunioes[indice].hora;
        reuniaoSelecionada.local = reunioes[indice].local;
        // reuniaoSelecionada.imagem = reunioes[indice].imagem;
        setReuniaoNova(false)
        setIndiceSelecionado(indice);
        setModalReuniao(true);
    }

    const atualizarReuniaoSelecionada = (key, value) => {
        reuniaoSelecionada[key] = value;
        setAtualizarEstados(!atualizarEstados);
    }

    const salvarReuniao = async () => {

        if (reuniaoNova) {
            let reunioesAtuais = reunioes;
            reunioesAtuais.push(reuniaoSelecionada);
            setReunioes(reunioesAtuais);
        }
        else {
            reunioes[indiceSelecionado].descricao = reuniaoSelecionada.descricao;
            reunioes[indiceSelecionado].data = reuniaoSelecionada.data;
            reunioes[indiceSelecionado].hora = reuniaoSelecionada.hora;
            reunioes[indiceSelecionado].local = reuniaoSelecionada.local;
        }

        //Salvando no banco de dados
        set(ref(db, 'reunioes'), reunioes);
        setModalReuniao(false);
    }

    const novaReuniao = () => {
        setReuniaoSelecionada({});
        setReuniaoNova(true)
        setModalReuniao(true);
    }

    const excluirReuniao = () => {
        let reunioesAtuais = reunioes;
        reunioesAtuais.splice(indiceSelecionado, 1);
        setReunioes(reunioesAtuais);
        setModalReuniao(false);
        //Salvando no banco de dados
        set(ref(db, 'reunioes'), reunioesAtuais);
    }

    return (
        <Stack flex={1}>
            <Stack width={"100%"} mt={mobile ? "20px" : "40px"} flexDirection={"row"} alignItems={"flex-end"} justifyContent={mobile ? "flex-start" : "space-between"}>
                <Stack width={"100%"} sx={{ marginRight: "20px" }} flexDirection={mobile ? "column" : "row"} alignItems={mobile ? "flex-start" : "center"}>
                    <Typography sx={mobile ? { marginRight: "0px" } : { marginRight: "10px" }}>Buscar por</Typography>
                    <Input placeholder="Descrição da reunião" sx={mobile ? { width: "100%" } : { width: "400px" }} value={procura} onChange={(event) => setProcura(event.target.value)} />
                </Stack>
                <Button onClick={novaReuniao} sx={mobile ? { marginLeft: "0px" } : { marginLeft: "20px" }}>Novo</Button>
            </Stack>
            <Stack mt="40px">
                {mobile ?
                    <Stack>
                        {reunioes.map(function (reuniao, indice) {
                            if (reuniao.descricao.toLowerCase().includes(procura.toLowerCase())) {
                                return (
                                    <Stack key={indice} onClick={() => consultarReuniao(indice)} mb={"10px"} boxShadow={"md"} backgroundColor="#fff" borderRadius={"5px"} padding={"10px"}>
                                        <Stack flexDirection={"row"} alignItems={"center"}>
                                            <Typography level="body-md">{reuniao.descricao}</Typography>
                                        </Stack>
                                    </Stack>
                                );
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
                            {reunioes.map(function (reuniao, indice) {
                                if (reuniao.descricao.toLowerCase().includes(procura.toLowerCase())) {
                                    return (
                                        <tr key={indice} className="hover" onClick={() => consultarReuniao(indice)}>
                                            <td>{reuniao.descricao}</td>
                                            <td>{formatarData(reuniao.data)}</td>
                                            <td>{reuniao.hora}</td>
                                            <td>{reuniao.local}</td>
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
                open={modalReuniao}
                onClose={() => setModalReuniao(false)}
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
                        Informações da reuniao
                    </Typography>
                    <Stack mt="20px">
                        <Stack>
                            <Typography>Descrição</Typography>
                            <Input value={reuniaoSelecionada.descricao} onChange={(event) => atualizarReuniaoSelecionada("descricao", event.target.value)} />
                        </Stack>
                        <Stack mt="20px">
                            <Typography>Data</Typography>
                            <Input type="date" value={reuniaoSelecionada.data} onChange={(event) => atualizarReuniaoSelecionada("data", event.target.value)} />
                        </Stack>
                        <Stack mt="20px">
                            <Typography>Hora</Typography>
                            <Input type="time" value={reuniaoSelecionada.hora} onChange={(event) => atualizarReuniaoSelecionada("hora", event.target.value)} />
                        </Stack>
                        <Stack mt="20px">
                            <Typography>Local</Typography>
                            <Input value={reuniaoSelecionada.local} onChange={(event) => atualizarReuniaoSelecionada("local", event.target.value)} />
                        </Stack>
                        <Stack flexDirection={"row"} justifyContent={"space-between"} mt="30px">
                            <Button color="danger" disabled={reuniaoNova} onClick={() => setDialogConfirmacao(true)}>Excluir</Button>
                            <Button disabled={reuniaoSelecionada.nome == ""} onClick={salvarReuniao}>Salvar</Button>
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
                        <Button variant="solid" color="danger" onClick={() => [excluirReuniao(), setDialogConfirmacao(false)]}>
                            Excluir
                        </Button>
                    </Box>
                </ModalDialog>
            </Modal>
        </Stack>
    )
}