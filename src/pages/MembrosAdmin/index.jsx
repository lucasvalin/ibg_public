import { useState, useEffect } from "react";

// Componentes
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";

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
    Select,
    Option
} from "@mui/joy"

import { IoWarning } from "react-icons/io5";

//Utils
import { formatarData } from '../../utils/datas';

//MediaQuery
import useMediaQuery from '@mui/material/useMediaQuery';

// Navegação
import { useNavigate } from "react-router-dom";

export default function Membros(props) {

    const mobile = useMediaQuery('(max-width:1200px)');
    const db = getDatabase();

    const [procura, setProcura] = useState("");
    const [modalMembro, setModalMembro] = useState(false);
    const [membros, setMembros] = useState([]);
    const [membroSelecionado, setMembrosSelecionado] = useState({});
    const [indiceSelecionado, setIndiceSelecionado] = useState(0);
    const [atualizarEstados, setAtualizarEstados] = useState(false);
    const [membroNovo, setMembroNovo] = useState(false);
    const [dialogConfirmacao, setDialogConfirmacao] = useState(false);

    useEffect(() => {
        const membrosRef = ref(db, 'membros/');
        onValue(membrosRef, (snapshot) => {
            const data = snapshot.val();
            setMembros(data == null ? [] : data);
        });
    }, []);

    const consultarMembro = (indice) => {
        membroSelecionado.nome = membros[indice].nome;
        membroSelecionado.telefone = membros[indice].telefone;
        membroSelecionado.dataDeNascimento = membros[indice].dataDeNascimento;
        membroSelecionado.situacao = membros[indice].situacao;
        membroSelecionado.funcao = membros[indice].funcao;
        membroSelecionado.dataDeConversao = membros[indice].dataDeConversao;
        setMembroNovo(false)
        setIndiceSelecionado(indice);
        setModalMembro(true);
    }

    const atualizarMembroSelecionado = (key, value) => {
        membroSelecionado[key] = value;
        setAtualizarEstados(!atualizarEstados);
    }

    const salvarMembro = () => {
        if (membroNovo) {
            let membrosAtuais = membros;
            membrosAtuais.push(membroSelecionado);
            setMembros(membrosAtuais);
        }
        else {
            membros[indiceSelecionado].nome = membroSelecionado.nome;
            membros[indiceSelecionado].telefone = membroSelecionado.telefone || "";
            membros[indiceSelecionado].dataDeNascimento = membroSelecionado.dataDeNascimento || "";
            membros[indiceSelecionado].situacao = membroSelecionado.situacao || "";
            membros[indiceSelecionado].funcao = membroSelecionado.funcao || "";
            membros[indiceSelecionado].dataDeConversao = membroSelecionado.dataDeConversao || "";
        }

        //Salvando no banco de dados
        set(ref(db, 'membros'), membros);
        setModalMembro(false);
    }

    const novoMembro = () => {
        setMembrosSelecionado({});
        setMembroNovo(true)
        setModalMembro(true);
    }

    const excluirMembro = () => {
        let membrosAtuais = membros;
        membrosAtuais.splice(indiceSelecionado, 1);
        setMembros(membrosAtuais);
        setModalMembro(false);

        //Salvando no banco de dados
        set(ref(db, 'membros'), membrosAtuais);
    }

    return (
        <Stack flex={1}>
            <Stack width={"100%"} mt={mobile ? "20px" : "40px"} flexDirection={"row"} alignItems={"flex-end"} justifyContent={mobile ? "flex-start" : "space-between"}>
                <Stack width={"100%"} sx={{ marginRight: "20px" }} flexDirection={mobile ? "column" : "row"} alignItems={mobile ? "flex-start" : "center"}>
                    <Typography sx={mobile ? { marginRight: "0px" } : { marginRight: "10px" }}>Buscar por</Typography>
                    <Input placeholder="Nome da Pessoa" sx={mobile ? { width: "100%" } : { width: "400px" }} value={procura} onChange={(event) => setProcura(event.target.value)} />
                </Stack>
                <Button onClick={novoMembro} sx={mobile ? { marginLeft: "0px" } : { marginLeft: "20px" }}>Novo</Button>
            </Stack>
            <Stack mt="40px">
                {mobile ?
                    <Stack>
                        {membros.map(function (membro, indice) {
                            if (membro.nome.toLowerCase().includes(procura.toLowerCase())) {
                                return (
                                    <Stack key={indice} onClick={() => consultarMembro(indice)} mb={"10px"} boxShadow={"md"} backgroundColor="#fff" borderRadius={"5px"} padding={"10px"}>
                                        <Stack flexDirection={"row"} alignItems={"center"}>
                                            <Typography level="body-md">{membro.nome}</Typography>
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
                                <th style={{ height: "10px" }}>Nome</th>
                                <th style={{ height: "10px", width: "150px" }}>Telefone</th>
                                <th style={{ height: "10px", width: "150px" }}>Data de Nascimento</th>
                                <th style={{ height: "10px", width: "150px" }}>Situação</th>
                                <th style={{ height: "10px", width: "150px" }}>Função</th>
                                <th style={{ height: "10px", width: "150px" }}>Data de Conversão</th>
                            </tr>
                        </thead>
                        <tbody>
                            {membros.map(function (membro, indice) {
                                if (membro.nome.toLowerCase().includes(procura.toLowerCase())) {
                                    return (
                                        <tr key={indice} className="hover" onClick={() => consultarMembro(indice)}>
                                            <td>{membro.nome}</td>
                                            <td>{membro.telefone}</td>
                                            <td>{formatarData(membro.dataDeNascimento)}</td>
                                            <td>{membro.situacao}</td>
                                            <td>{membro.funcao}</td>
                                            <td>{membro.dataDeConversao ? formatarData(membro.dataDeConversao) : "Não Informado"}</td>
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
                open={modalMembro}
                onClose={() => setModalMembro(false)}
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
                        Informações do Membro
                    </Typography>
                    <Stack mt="20px">
                        <Stack>
                            <Typography>Nome</Typography>
                            <Input placeholder="Nome completo da pessoa" value={membroSelecionado.nome} onChange={(event) => atualizarMembroSelecionado("nome", event.target.value)} />
                        </Stack>
                        <Stack mt="20px">
                            <Typography>Telefone</Typography>
                            <Input type="tel" placeholder="(xx) 00000-0000" value={membroSelecionado.telefone} onChange={(event) => atualizarMembroSelecionado("telefone", event.target.value)} />
                        </Stack>
                        <Stack mt="20px">
                            <Typography>Data de Nascimento</Typography>
                            <Input type="date" placeholder="00/00/0000" value={membroSelecionado.dataDeNascimento} onChange={(event) => atualizarMembroSelecionado("dataDeNascimento", event.target.value)} />
                        </Stack>
                        <Stack mt="20px">
                            <Typography>Situação</Typography>
                            {/* <Input placeholder="Exemplo: Visitante" value={membroSelecionado.situacao} onChange={(event) => atualizarMembroSelecionado("situacao", event.target.value)} /> */}
                            <Select value={membroSelecionado.situacao} onChange={(event, newValue) => atualizarMembroSelecionado("situacao", newValue)}>
                                <Option value="Membro">Membro</Option>
                                <Option value="Congregado">Congregado</Option>
                                <Option value="Visitante">Visitante</Option>
                            </Select>
                        </Stack>
                        <Stack mt="20px">
                            <Typography>Função</Typography>
                            <Input placeholder="Exemplo: Pastor" value={membroSelecionado.funcao} onChange={(event) => atualizarMembroSelecionado("funcao", event.target.value)} />
                        </Stack>
                        <Stack mt="20px">
                            <Typography>Data de Conversão</Typography>
                            <Input type="date" placeholder="00/00/0000" value={membroSelecionado.dataDeConversao} onChange={(event) => atualizarMembroSelecionado("dataDeConversao", event.target.value)} />
                        </Stack>
                        <Stack flexDirection={"row"} justifyContent={"space-between"} mt="30px">
                            <Button color="danger" disabled={membroNovo} onClick={() => setDialogConfirmacao(true)}>Excluir</Button>
                            <Button disabled={membroSelecionado.nome == ""} onClick={salvarMembro}>Salvar</Button>
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
                        <Button variant="solid" color="danger" onClick={() => [excluirMembro(), setDialogConfirmacao(false)]}>
                            Excluir
                        </Button>
                    </Box>
                </ModalDialog>
            </Modal>
        </Stack>
    )
}