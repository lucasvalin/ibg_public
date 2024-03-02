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
    Link,
    Dropdown,
    MenuButton,
    Menu,
    MenuItem,
    List,
    ListItem,
    ListItemButton,
    ListItemContent,
    ListItemDecorator,
    LinearProgress
} from "@mui/joy"

import { IoWarning, IoPerson } from "react-icons/io5";

//MediaQuery
import useMediaQuery from '@mui/material/useMediaQuery';

export default function TreinamentosAdmin() {

    const mobile = useMediaQuery('(max-width:1200px)');
    const db = getDatabase();

    const [procura, setProcura] = useState("");
    const [modalTreinamento, setModalTreinamento] = useState(false);
    const [modalResultadoTemperamentos, setModalResultadoTemperamentos] = useState(false);
    const [modalResultadoRodaDaVida, setModalResultadoRodaDaVida] = useState(false);
    const [exibirResultadoTemperamentos, setExibirResultadoTemperamentos] = useState(false);
    const [exibirResultadoRodaDaVida, setExibirResultadoRodaDaVida] = useState(false);
    const [treinamentos, setTreinamentos] = useState([
        {
            titulo: "Cura e libertação para família",
            link: "https://twitter.com",
        },
        {
            titulo: "Livro de Apocalipse",
            link: "https://youtube.com",
        }
    ]);
    const [treinamentoSelecionado, setTreinamentoSelecionado] = useState({});
    const [indiceSelecionado, setIndiceSelecionado] = useState(0);
    const [atualizarEstados, setAtualizarEstados] = useState(false);
    const [treinamentoNovo, setTreinamentoNovo] = useState(false);
    const [dialogConfirmacao, setDialogConfirmacao] = useState(false);
    const [nomeResultadoTemperamentos, setNomeResultadoTemperamentos] = useState("");
    const [nomeResultadoRodaDaVida, setNomeResultadoRodaDaVida] = useState("");
    const [resultadosTemperamentos, setResultadosTemperamentos] = useState([]);
    const [resultadosRodaDaVida, setResultadosRodaDaVida] = useState([]);
    const [indiceResultadoExibido, setIndiceResultadoExibido] = useState(0);
    const [indiceRodaDaVida, setIndiceRodaDaVida] = useState(0);

    useEffect(() => {
        const treinamentosRef = ref(db, 'treinamentos/');
        onValue(treinamentosRef, (snapshot) => {
            const data = snapshot.val();
            setTreinamentos(data == null ? [] : data);
        });

        const temperamentosRef = ref(db, 'analiseDeTemperamentos/');
        onValue(temperamentosRef, (snapshot) => {
            const data = snapshot.val();
            const temperamentos = {}
            if (data != null) {
                data.forEach(result => {
                    if (temperamentos.hasOwnProperty(result.nome)) {
                        temperamentos[result.nome].push(result);
                    }
                    else {
                        temperamentos[result.nome] = [result];
                    }

                });
            }
            setResultadosTemperamentos(temperamentos);
        });

        const rodaDaVidaRef = ref(db, 'rodaDaVida/');
        onValue(rodaDaVidaRef, (snapshot) => {
            const data = snapshot.val();
            setResultadosRodaDaVida(data != null ? data : []);
        });
    }, []);

    const consultarTreinamento = (indice) => {
        treinamentoSelecionado.titulo = treinamentos[indice].titulo;
        treinamentoSelecionado.link = treinamentos[indice].link;
        setTreinamentoNovo(false)
        setIndiceSelecionado(indice);
        setModalTreinamento(true);
    }

    const atualizarTreinamentoSelecionado = (key, value) => {
        treinamentoSelecionado[key] = value;
        setAtualizarEstados(!atualizarEstados);
    }

    const salvarTreinamento = () => {
        if (treinamentoNovo) {
            let treinamentosAtuais = treinamentos;
            treinamentosAtuais.push(treinamentoSelecionado);
            setTreinamentos(treinamentosAtuais);
        }
        else {
            treinamentos[indiceSelecionado].titulo = treinamentoSelecionado.titulo;
            treinamentos[indiceSelecionado].link = treinamentoSelecionado.link;
        }

        //Salvando no banco de dados
        set(ref(db, 'treinamentos'), treinamentos);
        setModalTreinamento(false);
    }

    const novoTreinamento = () => {
        setTreinamentoSelecionado({});
        setTreinamentoNovo(true)
        setModalTreinamento(true);
    }

    const excluirTreinamento = () => {
        let treinamentosAtuais = treinamentos;
        treinamentosAtuais.splice(indiceSelecionado, 1);
        setTreinamentoNovo(treinamentosAtuais);

        //Salvando no banco de dados
        set(ref(db, 'treinamentos'), treinamentosAtuais);
        setModalTreinamento(false);
    }

    const exibirResultadosTemperamentos = (nome) => {
        setNomeResultadoTemperamentos(nome)
        setExibirResultadoTemperamentos(true);
    }

    const exibirResultadosRodaDaVida = (nome) => {
        setNomeResultadoRodaDaVida(nome)
        setExibirResultadoRodaDaVida(true);
        resultadosRodaDaVida.forEach((resultado, indice) => {
            if (resultado.nome == nome) {
                setIndiceRodaDaVida(indice);
            }
        });
    }

    return (
        <Stack flex={1}>
            <Stack sx={mobile ? { marginTop: "20px", alignSelf: "flex-end", width: "100%" } : { marginTop: "40px", alignSelf: "flex-start" }}>
                <Dropdown>
                    <MenuButton>
                        Resultado dos Questionários
                    </MenuButton>
                    <Menu>
                        <MenuItem onClick={() => [setModalResultadoTemperamentos(true), setExibirResultadoTemperamentos(false)]}>Análise de Temperamentos</MenuItem>
                        <MenuItem onClick={() => [setModalResultadoRodaDaVida(true), setExibirResultadoRodaDaVida(false), setIndiceResultadoExibido(0)]}>Roda da Vida</MenuItem>
                    </Menu>
                </Dropdown>
            </Stack>
            <Stack width={"100%"} mt={mobile ? "20px" : "40px"} flexDirection={"row"} alignItems={"flex-end"} justifyContent={mobile ? "flex-start" : "space-between"}>
                <Stack width={"100%"} sx={{ marginRight: "20px" }} flexDirection={mobile ? "column" : "row"} alignItems={mobile ? "flex-start" : "center"}>
                    <Typography sx={mobile ? { marginRight: "0px" } : { marginRight: "10px" }}>Buscar por</Typography>
                    <Input placeholder="Descrição do treinamento" sx={mobile ? { width: "100%" } : { width: "400px" }} value={procura} onChange={(event) => setProcura(event.target.value)} />
                </Stack>
                <Button onClick={novoTreinamento} sx={mobile ? { marginLeft: "0px" } : { marginLeft: "20px" }}>Novo</Button>
            </Stack>
            <Stack mt="40px">
                {mobile ?
                    <Stack>
                        {treinamentos.map(function (treinamento, indice) {
                            if (treinamento.titulo.toLowerCase().includes(procura.toLowerCase())) {
                                return (
                                    <Stack onClick={() => consultarTreinamento(indice)} mb={"10px"} boxShadow={"md"} backgroundColor="#fff" borderRadius={"5px"} padding={"10px"}>
                                        <Stack flexDirection={"row"} alignItems={"center"}>
                                            <Typography level="body-md">{treinamento.titulo}</Typography>
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
                                <th style={{ height: "10px" }}>Link</th>
                            </tr>
                        </thead>
                        <tbody>
                            {treinamentos.map(function (treinamento, indice) {
                                if (treinamento.titulo.toLowerCase().includes(procura.toLowerCase())) {
                                    return (
                                        <tr className="hover" onClick={() => consultarTreinamento(indice)}>
                                            <td>{treinamento.titulo}</td>
                                            <td>{treinamento.link}</td>
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
                open={modalTreinamento}
                onClose={() => setModalTreinamento(false)}
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
                        Informações do Treinamento
                    </Typography>
                    <Stack mt="20px">
                        <Stack>
                            <Typography>Título</Typography>
                            <Input value={treinamentoSelecionado.titulo} onChange={(event) => atualizarTreinamentoSelecionado("titulo", event.target.value)} />
                        </Stack>
                        <Stack mt="20px">
                            <Typography>Link</Typography>
                            <Input value={treinamentoSelecionado.link} onChange={(event) => atualizarTreinamentoSelecionado("link", event.target.value)} />
                        </Stack>
                        <Stack flexDirection={"row"} justifyContent={"space-between"} mt="30px">
                            <Button color="danger" disabled={treinamentoNovo} onClick={() => setDialogConfirmacao(true)}>Excluir</Button>
                            <Button disabled={treinamentoSelecionado.nome == ""} onClick={salvarTreinamento}>Salvar</Button>
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
                        <Button variant="solid" color="danger" onClick={() => [excluirTreinamento(), setDialogConfirmacao(false)]}>
                            Excluir
                        </Button>
                    </Box>
                </ModalDialog>
            </Modal>

            <Modal
                aria-labelledby="modal-title"
                aria-describedby="modal-desc"
                open={modalResultadoTemperamentos}
                onClose={() => setModalResultadoTemperamentos(false)}
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
                        Análise de Temperamentos
                    </Typography>
                    <Stack mt="20px">
                        {/* Lista de pessoas que preencheram o questionário */}
                        {!exibirResultadoTemperamentos ?
                            <Stack>
                                <Typography>Lista de Participantes</Typography>
                                <List sx={{ fontSize: "14px" }}>
                                    {Object.keys(resultadosTemperamentos).map(function (resultado) {
                                        return (
                                            <ListItem onClick={() => exibirResultadosTemperamentos(resultado)}>
                                                <ListItemButton>
                                                    <ListItemDecorator><IoPerson size={20} /></ListItemDecorator>
                                                    <ListItemContent>{resultado}</ListItemContent>
                                                </ListItemButton>
                                            </ListItem>
                                        );
                                    })}
                                </List>
                            </Stack>
                            :
                            <Stack>
                                <Stack mb={1} alignItems="flex-start">
                                    <Button onClick={() => setExibirResultadoTemperamentos(false)} variant="plain">Voltar</Button>
                                    <Typography
                                        component="h2"
                                        id="modal-title"
                                        level="h4"
                                        textColor="inherit"
                                        fontWeight="lg"
                                        sx={{ alignSelf: "center" }}
                                    >
                                        {nomeResultadoTemperamentos}
                                    </Typography>
                                </Stack>
                                <Stack flexDirection={"row"} justifyContent="center" alignItems="center">
                                    <Button disabled={indiceResultadoExibido == 0} sx={{ marginRight: "25px" }} onClick={() => setIndiceResultadoExibido(indiceResultadoExibido - 1)}>Anterior</Button>
                                    <Typography>{indiceResultadoExibido + 1 + " de " + resultadosTemperamentos[nomeResultadoTemperamentos].length}</Typography>
                                    <Button disabled={(indiceResultadoExibido + 1) == resultadosTemperamentos[nomeResultadoTemperamentos].length} sx={{ marginLeft: "25px" }} onClick={() => setIndiceResultadoExibido(indiceResultadoExibido + 1)}>Próximo</Button>
                                </Stack>
                                <Typography sx={{ alignSelf: "center", margin: "10px" }}>{resultadosTemperamentos[nomeResultadoTemperamentos][indiceResultadoExibido].data}</Typography>
                                <Stack flexDirection={"row"} justifyContent={"space-between"}>
                                    <Typography fontWeight={(resultadosTemperamentos[nomeResultadoTemperamentos][indiceResultadoExibido].dominante > resultadosTemperamentos[nomeResultadoTemperamentos][indiceResultadoExibido].extrovertido) && (resultadosTemperamentos[nomeResultadoTemperamentos][indiceResultadoExibido].dominante > resultadosTemperamentos[nomeResultadoTemperamentos][indiceResultadoExibido].paciente) && (resultadosTemperamentos[nomeResultadoTemperamentos][indiceResultadoExibido].dominante > resultadosTemperamentos[nomeResultadoTemperamentos][indiceResultadoExibido].analitico) ? "bold" : "normal"}>1. Dominante:</Typography>
                                    <Stack flexDirection={"row"}>
                                        <Typography fontWeight={(resultadosTemperamentos[nomeResultadoTemperamentos][indiceResultadoExibido].dominante > resultadosTemperamentos[nomeResultadoTemperamentos][indiceResultadoExibido].extrovertido) && (resultadosTemperamentos[nomeResultadoTemperamentos][indiceResultadoExibido].dominante > resultadosTemperamentos[nomeResultadoTemperamentos][indiceResultadoExibido].paciente) && (resultadosTemperamentos[nomeResultadoTemperamentos][indiceResultadoExibido].dominante > resultadosTemperamentos[nomeResultadoTemperamentos][indiceResultadoExibido].analitico) ? "bold" : "normal"} sx={{ marginRight: "10px" }}>{resultadosTemperamentos[nomeResultadoTemperamentos][indiceResultadoExibido].dominante}</Typography>
                                    </Stack>
                                </Stack>
                                <Stack flexDirection={"row"} justifyContent={"space-between"}>
                                    <Typography fontWeight={(resultadosTemperamentos[nomeResultadoTemperamentos][indiceResultadoExibido].extrovertido > resultadosTemperamentos[nomeResultadoTemperamentos][indiceResultadoExibido].dominante) && (resultadosTemperamentos[nomeResultadoTemperamentos][indiceResultadoExibido].extrovertido > resultadosTemperamentos[nomeResultadoTemperamentos][indiceResultadoExibido].paciente) && (resultadosTemperamentos[nomeResultadoTemperamentos][indiceResultadoExibido].extrovertido > resultadosTemperamentos[nomeResultadoTemperamentos][indiceResultadoExibido].analitico) ? "bold" : "normal"}>2. Extrovertido:</Typography>
                                    <Stack flexDirection={"row"}>
                                        <Typography fontWeight={(resultadosTemperamentos[nomeResultadoTemperamentos][indiceResultadoExibido].extrovertido > resultadosTemperamentos[nomeResultadoTemperamentos][indiceResultadoExibido].dominante) && (resultadosTemperamentos[nomeResultadoTemperamentos][indiceResultadoExibido].extrovertido > resultadosTemperamentos[nomeResultadoTemperamentos][indiceResultadoExibido].paciente) && (resultadosTemperamentos[nomeResultadoTemperamentos][indiceResultadoExibido].extrovertido > resultadosTemperamentos[nomeResultadoTemperamentos][indiceResultadoExibido].analitico) ? "bold" : "normal"} sx={{ marginRight: "10px" }}>{resultadosTemperamentos[nomeResultadoTemperamentos][indiceResultadoExibido].extrovertido}</Typography>
                                    </Stack>
                                </Stack>
                                <Stack flexDirection={"row"} justifyContent={"space-between"}>
                                    <Typography fontWeight={(resultadosTemperamentos[nomeResultadoTemperamentos][indiceResultadoExibido].paciente > resultadosTemperamentos[nomeResultadoTemperamentos][indiceResultadoExibido].dominante) && (resultadosTemperamentos[nomeResultadoTemperamentos][indiceResultadoExibido].paciente > resultadosTemperamentos[nomeResultadoTemperamentos][indiceResultadoExibido].extrovertido) && (resultadosTemperamentos[nomeResultadoTemperamentos][indiceResultadoExibido].paciente > resultadosTemperamentos[nomeResultadoTemperamentos][indiceResultadoExibido].analitico) ? "bold" : "normal"}>3. Paciente:</Typography>
                                    <Stack flexDirection={"row"}>
                                        <Typography fontWeight={(resultadosTemperamentos[nomeResultadoTemperamentos][indiceResultadoExibido].paciente > resultadosTemperamentos[nomeResultadoTemperamentos][indiceResultadoExibido].dominante) && (resultadosTemperamentos[nomeResultadoTemperamentos][indiceResultadoExibido].paciente > resultadosTemperamentos[nomeResultadoTemperamentos][indiceResultadoExibido].extrovertido) && (resultadosTemperamentos[nomeResultadoTemperamentos][indiceResultadoExibido].paciente > resultadosTemperamentos[nomeResultadoTemperamentos][indiceResultadoExibido].analitico) ? "bold" : "normal"} sx={{ marginRight: "10px" }}>{resultadosTemperamentos[nomeResultadoTemperamentos][indiceResultadoExibido].paciente}</Typography>
                                    </Stack>
                                </Stack>
                                <Stack flexDirection={"row"} justifyContent={"space-between"}>
                                    <Typography fontWeight={(resultadosTemperamentos[nomeResultadoTemperamentos][indiceResultadoExibido].analitico > resultadosTemperamentos[nomeResultadoTemperamentos][indiceResultadoExibido].dominante) && (resultadosTemperamentos[nomeResultadoTemperamentos][indiceResultadoExibido].analitico > resultadosTemperamentos[nomeResultadoTemperamentos][indiceResultadoExibido].extrovertido) && (resultadosTemperamentos[nomeResultadoTemperamentos][indiceResultadoExibido].analitico > resultadosTemperamentos[nomeResultadoTemperamentos][indiceResultadoExibido].paciente) ? "bold" : "normal"}>4. Analítico</Typography>
                                    <Stack flexDirection={"row"}>
                                        <Typography fontWeight={(resultadosTemperamentos[nomeResultadoTemperamentos][indiceResultadoExibido].analitico > resultadosTemperamentos[nomeResultadoTemperamentos][indiceResultadoExibido].dominante) && (resultadosTemperamentos[nomeResultadoTemperamentos][indiceResultadoExibido].analitico > resultadosTemperamentos[nomeResultadoTemperamentos][indiceResultadoExibido].extrovertido) && (resultadosTemperamentos[nomeResultadoTemperamentos][indiceResultadoExibido].analitico > resultadosTemperamentos[nomeResultadoTemperamentos][indiceResultadoExibido].paciente) ? "bold" : "normal"} sx={{ marginRight: "10px" }}>{resultadosTemperamentos[nomeResultadoTemperamentos][indiceResultadoExibido].analitico}</Typography>
                                    </Stack>
                                </Stack>
                                <Stack mt="30px" spacing={2} sx={{ flex: 1 }}>
                                    <Typography>Dominante</Typography>
                                    <LinearProgress determinate value={resultadosTemperamentos[nomeResultadoTemperamentos][indiceResultadoExibido].dominante} />
                                    <Typography>Extrovertido</Typography>
                                    <LinearProgress determinate value={resultadosTemperamentos[nomeResultadoTemperamentos][indiceResultadoExibido].extrovertido} />
                                    <Typography>Paciente</Typography>
                                    <LinearProgress determinate value={resultadosTemperamentos[nomeResultadoTemperamentos][indiceResultadoExibido].paciente} />
                                    <Typography>Analítico</Typography>
                                    <LinearProgress determinate value={resultadosTemperamentos[nomeResultadoTemperamentos][indiceResultadoExibido].analitico} />
                                </Stack>
                            </Stack>
                        }
                    </Stack>
                </Sheet>
            </Modal>

            <Modal
                aria-labelledby="modal-title"
                aria-describedby="modal-desc"
                open={modalResultadoRodaDaVida}
                onClose={() => setModalResultadoRodaDaVida(false)}
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
                        Roda da Vida
                    </Typography>
                    <Stack mt="20px">
                        {/* Lista de pessoas que preencheram o questionário */}
                        {!exibirResultadoRodaDaVida ?
                            <Stack>
                                <Typography>Lista de Participantes</Typography>
                                <List sx={{ fontSize: "14px" }}>
                                    {resultadosRodaDaVida.map(function (resultado) {
                                        return (
                                            <ListItem onClick={() => exibirResultadosRodaDaVida(resultado.nome)}>
                                                <ListItemButton>
                                                    <ListItemDecorator><IoPerson size={20} /></ListItemDecorator>
                                                    <ListItemContent>{resultado.nome}</ListItemContent>
                                                </ListItemButton>
                                            </ListItem>
                                        );
                                    })}
                                </List>
                            </Stack>
                            :
                            <Stack>
                                <Stack mb={1} alignItems="flex-start">
                                    <Button onClick={() => setExibirResultadoRodaDaVida(false)} variant="plain">Voltar</Button>
                                    <Typography
                                        component="h2"
                                        id="modal-title"
                                        level="h4"
                                        textColor="inherit"
                                        fontWeight="lg"
                                        sx={{ alignSelf: "center" }}
                                    >
                                        {nomeResultadoRodaDaVida}
                                    </Typography>
                                </Stack>
                                <Typography
                                    component="h2"
                                    id="modal-title"
                                    level="h4"
                                    textColor="inherit"
                                    fontWeight="lg"
                                    mb={1}
                                >
                                    Resultados
                                </Typography>
                                <Stack mt="30px" spacing={2} sx={{ flex: 1, width: "100%" }}>
                                    <Stack flexDirection={"row"} margin={0} padding={0} justifyContent={"space-between"}>
                                        <Typography>Familiar</Typography>
                                        <Typography fontWeight={"bold"}>{resultadosRodaDaVida[indiceRodaDaVida].familiar / 10}</Typography>
                                    </Stack>
                                    <LinearProgress determinate value={(resultadosRodaDaVida[indiceRodaDaVida].familiar) || 0} sx={{ width: "100%" }} />
                                    <Stack flexDirection={"row"} margin={0} padding={0} justifyContent={"space-between"}>
                                        <Typography>Contribuição Social</Typography>
                                        <Typography fontWeight={"bold"}>{resultadosRodaDaVida[indiceRodaDaVida].contribuicaoSocial / 10}</Typography>
                                    </Stack>
                                    <LinearProgress determinate value={(resultadosRodaDaVida[indiceRodaDaVida].contribuicaoSocial) || 0} />
                                    <Stack flexDirection={"row"} margin={0} padding={0} justifyContent={"space-between"}>
                                        <Typography>Conjugal</Typography>
                                        <Typography fontWeight={"bold"}>{resultadosRodaDaVida[indiceRodaDaVida].conjugal / 10}</Typography>
                                    </Stack>
                                    <LinearProgress determinate value={(resultadosRodaDaVida[indiceRodaDaVida].conjugal) || 0} />
                                    <Stack flexDirection={"row"} margin={0} padding={0} justifyContent={"space-between"}>
                                        <Typography>Espiritualidade</Typography>
                                        <Typography fontWeight={"bold"}>{resultadosRodaDaVida[indiceRodaDaVida].espiritualidade / 10}</Typography>
                                    </Stack>
                                    <LinearProgress determinate value={(resultadosRodaDaVida[indiceRodaDaVida].espiritualidade) || 0} />
                                    <Stack flexDirection={"row"} margin={0} padding={0} justifyContent={"space-between"}>
                                        <Typography>Hobbies</Typography>
                                        <Typography fontWeight={"bold"}>{resultadosRodaDaVida[indiceRodaDaVida].hobbies / 10}</Typography>
                                    </Stack>
                                    <LinearProgress determinate value={(resultadosRodaDaVida[indiceRodaDaVida].hobbies) || 0} />
                                    <Stack flexDirection={"row"} margin={0} padding={0} justifyContent={"space-between"}>
                                        <Typography>Recursos Financeiros</Typography>
                                        <Typography fontWeight={"bold"}>{resultadosRodaDaVida[indiceRodaDaVida].recursosFinanceiros / 10}</Typography>
                                    </Stack>
                                    <LinearProgress determinate value={(resultadosRodaDaVida[indiceRodaDaVida].recursosFinanceiros) || 0} />
                                    <Stack flexDirection={"row"} margin={0} padding={0} justifyContent={"space-between"}>
                                        <Typography>Saúde e Disposição</Typography>
                                        <Typography fontWeight={"bold"}>{resultadosRodaDaVida[indiceRodaDaVida].saudeEDisposicao / 10}</Typography>
                                    </Stack>
                                    <LinearProgress determinate value={(resultadosRodaDaVida[indiceRodaDaVida].saudeEDisposicao) || 0} />
                                    <Stack flexDirection={"row"} margin={0} padding={0} justifyContent={"space-between"}>
                                        <Typography>Equilíbrio Emocional</Typography>
                                        <Typography fontWeight={"bold"}>{resultadosRodaDaVida[indiceRodaDaVida].equilibrioEmocional / 10}</Typography>
                                    </Stack>
                                    <LinearProgress determinate value={(resultadosRodaDaVida[indiceRodaDaVida].equilibrioEmocional) || 0} />
                                    <Stack flexDirection={"row"} margin={0} padding={0} justifyContent={"space-between"}>
                                        <Typography>Desenvolvimento Intelectual</Typography>
                                        <Typography fontWeight={"bold"}>{resultadosRodaDaVida[indiceRodaDaVida].desenvolvimentoIntelectual / 10}</Typography>
                                    </Stack>
                                    <LinearProgress determinate value={(resultadosRodaDaVida[indiceRodaDaVida].desenvolvimentoIntelectual) || 0} />
                                </Stack>
                            </Stack>
                        }
                    </Stack>
                </Sheet>
            </Modal>
        </Stack >
    )
}