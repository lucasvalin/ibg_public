import { useState, useEffect, useRef } from "react";
import { toPng } from 'html-to-image';

import "../../App.css";

//Firebase
import { getDatabase, ref, set, onValue } from "firebase/database";

import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';

// JoyUI
import {
    Stack,
    Typography,
    Button,
    Input,
    Select,
    Option,
    Sheet,
    Modal,
    ModalClose,
    List,
    ListItem,
    ListItemButton,
    ListItemDecorator,
    ListItemContent,
    ModalDialog,
    Divider,
    Box,
    FormHelperText,
    Dropdown,
    MenuButton,
    Menu,
    MenuItem
} from "@mui/joy"

import { IoCalendar, IoTrash, IoWarning } from "react-icons/io5";
import { BiSolidCategoryAlt, BiEditAlt } from "react-icons/bi";
import { FaChurch } from "react-icons/fa";

//MediaQuery
import useMediaQuery from '@mui/material/useMediaQuery';

//Fotos
import logo from '../../assets/logo.jpeg';

//Icones
import { IoPersonSharp, IoCalendarSharp } from "react-icons/io5";
import { obterDataAtual } from "../../utils/datas";
import { toast } from "react-toastify";

const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

let opcoesAno = [];
for (let i = 2023; i <= new Date().getFullYear() + 1; i++) {
    opcoesAno.push(i);
}

// Obtém a data de hoje
const dataDeHoje = new Date();
// const hojeFormatada = `${dataDeHoje.getFullYear()}-${(dataDeHoje.getMonth() + 1).toString().padStart(2, '0')}-${dataDeHoje.getDate().toString().padStart(2, '0')}`;

// Obtém a data de hoje há dois meses atrás
const dataDoisMesesAtras = new Date();
const dataAtual = `${dataDeHoje.getFullYear()}-${(dataDeHoje.getMonth() + 1).toString().padStart(2, '0')}-${dataDeHoje.getDate().toString().padStart(2, '0')}`;
dataDoisMesesAtras.setMonth(dataDoisMesesAtras.getMonth() - 2);
const doisMesesAtrasFormatada = `${dataDoisMesesAtras.getFullYear()}-${(dataDoisMesesAtras.getMonth() + 1).toString().padStart(2, '0')}-${dataDoisMesesAtras.getDate().toString().padStart(2, '0')}`;



export default function Escalas(props) {

    const mobile = useMediaQuery('(max-width:1200px)');
    const db = getDatabase();
    const containerRef = useRef(null);

    const [dataInicial, setDataInicial] = useState("");
    const [dataFinal, setDataFinal] = useState(dataAtual);
    const [categorias, setCategorias] = useState([]);
    const [categoria, setCategoria] = useState("");
    const [escalas, setEscalas] = useState({});
    const [datasEscaladas, setDatasEscaladas] = useState([]);
    const [datasEscaladasInvertidas, setDatasEscaladasInvertidas] = useState([]);
    const [membrosCategorias, setMembrosCategorias] = useState({});
    const [modalCategorias, setModalCategorias] = useState(false);
    const [nomeNovaCategoria, setNomeNovaCategoria] = useState("");
    const [dialogConfirmacao, setDialogConfirmacao] = useState(false);
    const [categoriaSelecionada, setCategoriaSelecionada] = useState("Pregadores");
    const [modalMembrosCategoria, setModalMembrosCategoria] = useState(false);
    const [dialogConfirmacaoExclusaoMembroCategoria, setDialogConfirmacaoExclusaoMembroCategoria] = useState(false);
    const [membros, setMembros] = useState([]);
    const [membroParaIncluir, setMembroParaIncluir] = useState("");
    const [membroCategoriaSelecionado, setMembroCategoriaSelecionado] = useState("");
    const [carregado, setCarregado] = useState(false);
    const [modalEscalaGerada, setModalEscalaGerada] = useState(false);
    const [imagemGerada, setImagemGerada] = useState("");
    const [modeloImpressao, setModeloImpressao] = useState(false);
    const [modeloVisivel, setModeloVisivel] = useState(false);


    useEffect(() => {
        carregarContexto();
        // sugerirProximoEscalado("2023-11-15 as 19:30");
    }, [])

    const capturarImagem = () => {
        if (containerRef.current) {
            setModeloVisivel(true);
            setTimeout(() => {
                toPng(containerRef.current)
                    .then(function (dataUrl) {
                        // Capturar a imagem foi bem-sucedido
                        const img = new Image();
                        img.src = dataUrl;
                        setImagemGerada(img.src);

                        setModalEscalaGerada(true);
                        setModeloImpressao(true);
                        setModeloVisivel(false);
                    })
                    .catch(function (err) {
                        setModeloVisivel(false);
                        alert("Ocorreu um erro")
                        console.log(err);
                    });
            }, 100);
        }
    };

    const carregarContexto = async () => {
        setDataInicial(doisMesesAtrasFormatada);
        // setDataFinal(hojeFormatada);
        let datasDasEscalas = getDatesBetween(doisMesesAtrasFormatada, dataFinal);

        const escalasRef = ref(db, 'escalas/');
        const categoriasRef = ref(db, 'categorias/');
        const membrosRef = ref(db, 'membros/');
        const membrosCategoriasRef = ref(db, 'membrosCategorias/');

        Promise.all([
            onValue(escalasRef, (snapshot) => {
                const data = snapshot.val();
                const escalasDoBanco = data;
                setEscalas(data == null ? {} : data);
                let datasEscaladas = datasDasEscalas;
                if (escalas[categoria]) {
                    datasDasEscalas.forEach((dataDisponivel, indice) => {
                        if (escalasDoBanco[categoria].find(escala => escala.dataEHora === dataDisponivel.dataEHora)) {
                            const indiceEscala = escalasDoBanco[categoria].findIndex(escala => escala.dataEHora === dataDisponivel.dataEHora);
                            datasEscaladas[indice].membro = escalasDoBanco[categoria][indiceEscala].membro;
                        }
                    });
                }
                setDatasEscaladas(datasEscaladas.reverse());
                setDatasEscaladasInvertidas(datasEscaladas);
            }),
            onValue(categoriasRef, (snapshot) => {
                const data = snapshot.val();
                setCategorias(data == null ? [] : data);
            }),
            onValue(membrosRef, (snapshot) => {
                const data = snapshot.val();
                setMembros(data == null ? {} : data);
            }),
            onValue(membrosCategoriasRef, (snapshot) => {
                const data = snapshot.val();
                if (data != null) {
                    for (const chave in data) {
                        setCategoria(chave);
                        break;
                    }
                }
                setMembrosCategorias(data == null ? {} : data);
            })
        ])
            .then(() => {
                // Todas as promessas foram resolvidas aqui
                atualizarTimeline(doisMesesAtrasFormatada, dataFinal, "Pregadores");
                // sugerirProximoEscalado("2023-11-19 as 09:00", "Pregadores");
            })
            .catch((error) => {
                console.error('Erro ao buscar dados:', error);
            });
    }

    function getDatesBetween(startDateStr, endDateStr) {
        const startDate = new Date(startDateStr);
        const endDate = new Date(endDateStr);
        endDate.setDate(endDate.getDate() + 1);
        const today = new Date();
        today.setDate(endDate.getDate() + 1);
        const dates = [];

        while (startDate <= endDate) {
            if (startDate.getDay() === 0) { // Se for domingo
                const day = startDate.getDate();
                const month = startDate.getMonth() + 1; // O mês é baseado em zero, então adicionamos 1
                const year = startDate.getFullYear();
                const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
                if (startDate <= endDate) {
                    dates.push({
                        titulo: "Culto Santo Espírito",
                        dataEHora: formattedDate + " as 09:00",
                        membro: "",
                        funcao: ""
                    });
                    dates.push({
                        titulo: "Culto de Celebração",
                        dataEHora: formattedDate + " as 19:00",
                        membro: "",
                        funcao: ""
                    }); // Adiciona a data duas vezes no array
                }
            } else if (startDate.getDay() === 3) { // Se for quarta-feira
                const day = startDate.getDate();
                const month = startDate.getMonth() + 1; // O mês é baseado em zero, então adicionamos 1
                const year = startDate.getFullYear();
                const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
                if (startDate <= endDate) {
                    dates.push({
                        titulo: "Quarta da Vitória",
                        dataEHora: formattedDate + " as 19:30",
                        membro: "",
                        funcao: ""
                    });
                }
            }
            startDate.setDate(startDate.getDate() + 1); // Avança para o próximo dia
        }
        return dates;
    }

    function formatarData(dataNoFormatoYYYYMMDD) {
        if (dataNoFormatoYYYYMMDD) {
            const partes = dataNoFormatoYYYYMMDD.split("-");
            if (partes.length !== 3) {
                return "Data inválida";
            }

            const ano = partes[0];
            const mes = partes[1];
            const dia = partes[2];

            return `${dia}/${mes}/${ano}`;
        }
        return `00/00/0000`;
    }

    const atualizarEscala = (value, key, dataEHora) => {
        let datasDasEscalas = getDatesBetween(dataInicial, dataFinal);
        if (escalas[categoria]) {
            const indiceEscala = escalas[categoria].findIndex(escala => escala.dataEHora === dataEHora);

            if (indiceEscala === -1) {
                const indiceData = datasDasEscalas.findIndex(escala => escala.dataEHora === dataEHora);
                const dataAtribuida = datasDasEscalas[indiceData];
                dataAtribuida.membro = value;
                escalas[categoria].push(dataAtribuida);
            } else {
                escalas[categoria][indiceEscala].membro = value;
            }

            //Salvando no banco de dados
            set(ref(db, 'escalas'), escalas);
            atualizarTimeline(dataInicial, dataFinal, categoria);
        }
        else {
            let escalasAtuais = escalas;
            const indiceData = datasDasEscalas.findIndex(escala => escala.dataEHora === dataEHora);
            const dataAtribuida = datasDasEscalas[indiceData];
            dataAtribuida.membro = value;
            escalasAtuais[categoria] = [];
            escalasAtuais[categoria].push(dataAtribuida);
            setEscalas(escalasAtuais);

            //Salvando no banco de dados
            set(ref(db, 'escalas'), escalas);
            atualizarTimeline(dataInicial, dataFinal, categoria);
        }
    }

    const atualizarTimeline = (dataInicial, dataFinal, categoria) => {

        let datasDasEscalas = getDatesBetween(dataInicial, dataFinal);


        let datasEscaladas = datasDasEscalas;
        if (escalas[categoria]) {
            datasDasEscalas.forEach((dataDisponivel, indice) => {
                if (escalas[categoria].find(escala => escala.dataEHora === dataDisponivel.dataEHora)) {
                    const indiceEscala = escalas[categoria].findIndex(escala => escala.dataEHora === dataDisponivel.dataEHora);
                    datasEscaladas[indice].membro = escalas[categoria][indiceEscala].membro;
                }
            });
        }

        setDatasEscaladas(inverterArray(datasEscaladas));
        setDatasEscaladasInvertidas(datasEscaladas);
    }

    const inverterArray = (array) => {
        var arrayInvertido = [];

        for (var i = array.length - 1; i >= 0; i--) {
            arrayInvertido.push(array[i]);
        }

        return (arrayInvertido);
    }

    const novaCategoria = () => {
        if (nomeNovaCategoria != "") {
            let categoriasAtuais = categorias;
            categoriasAtuais.push(nomeNovaCategoria);

            //Salvando no banco de dados
            set(ref(db, 'categorias'), categoriasAtuais);
            setNomeNovaCategoria("");
        }
    }

    const excluirCategoria = () => {
        let categoriasAtuais = categorias;
        categoriasAtuais.splice(categorias.indexOf(categoriaSelecionada), 1);
        set(ref(db, 'categorias'), categoriasAtuais);
        //Excluindo membros desta categoria
        set(ref(db, 'membrosCategorias/' + categoriaSelecionada), null);
        //Excluindo escalas desta categoria
        set(ref(db, 'escalas/' + categoriaSelecionada), null);
    }

    const incluirMembro = () => {
        let membrosCategoriasAtuais = membrosCategorias;
        if (!membrosCategoriasAtuais[categoriaSelecionada]) {
            membrosCategoriasAtuais[categoriaSelecionada] = [];
        }
        if (membrosCategoriasAtuais[categoriaSelecionada].indexOf(membroParaIncluir) == -1) {
            membrosCategoriasAtuais[categoriaSelecionada].push(membroParaIncluir);
        }
        setMembrosCategorias(membrosCategoriasAtuais)
        set(ref(db, 'membrosCategorias'), membrosCategoriasAtuais);
    }

    const excluirMembroCategoria = () => {
        let membrosCategoriasAtuais = membrosCategorias;
        membrosCategoriasAtuais[categoriaSelecionada].splice(membrosCategoriasAtuais[categoriaSelecionada].indexOf(membroCategoriaSelecionado), 1);
        set(ref(db, 'membrosCategorias'), membrosCategoriasAtuais);
    }

    const sugerirProximoEscalado = (dataEHora, categoria) => {
        const indiceEscala = datasEscaladas.findIndex((data) => data.dataEHora === dataEHora);
        const ultimoEscalado = datasEscaladas[indiceEscala + 1].membro;
        const indiceUltimoEscalado = membrosCategorias[categoria].indexOf(ultimoEscalado);

        //Definindo próximo para a escala
        let indiceNovoEscalado = -1;

        if (membrosCategorias[categoria].length - 1 == indiceUltimoEscalado) {
            indiceNovoEscalado = 0
        }
        else {
            indiceNovoEscalado = indiceUltimoEscalado + 1;
        }

        const membroSugerido = membrosCategorias[categoria][indiceNovoEscalado];
        console.log(membroSugerido);

        //Definindo o membro sugerido na escala
        atualizarEscala(membroSugerido, indiceEscala, dataEHora);
    }

    const removerEscala = (escala) => {
        // dataEHora
        if (escalas[categoria]) {
            console.log(escalas);
            let arrayEscala = escalas[categoria];
            const indiceEscala = arrayEscala.findIndex(escalas => escalas.dataEHora === escala.dataEHora);
            // console.log(indiceEscala);
            // console.log(escalas);

            arrayEscala.splice(indiceEscala, 1);
            // console.log(arrayEscala);

            escalas[categoria] = arrayEscala;

            console.log(escalas);

            //Salvando no banco de dados
            set(ref(db, 'escalas'), escalas);
            atualizarTimeline(dataInicial, dataFinal, categoria);
        }
    }

    return (
        <Stack>
            <Stack mb="40px">
                <Stack width={"100%"} mt={mobile ? "20px" : "20px"} flexDirection={"row"} alignItems={"flex-end"} justifyContent={mobile ? "flex-start" : "flex-end"}>
                    <Stack flexDirection={mobile ? "column" : "row"} alignItems={mobile ? "flex-start" : "center"} mb={mobile ? "20px" : "0px"}>
                        <Stack flexDirection={"row"} mb={mobile ? "10px" : ""}>
                            <Stack width={mobile ? "40%" : null} flexDirection={mobile ? "column" : "row"} alignItems={mobile ? "flex-start" : "center"}>
                                <Typography>Data Inicial</Typography>
                                <Input type="date" value={dataInicial} onChange={(event) => [setDataInicial(event.target.value), atualizarTimeline(event.target.value, dataFinal, categoria)]} placeholder="Data de Inicio" sx={mobile ? { ml: "0px", width: "100%" } : { ml: "10px" }} />
                            </Stack>
                            <Stack width={mobile ? "40%" : null} flexDirection={mobile ? "column" : "row"} alignItems={mobile ? "flex-start" : "center"} ml={mobile ? "10px" : "20px"}>
                                <Typography>Data Final</Typography>
                                <Input type="date" value={dataFinal} onChange={(event) => [setDataFinal(event.target.value), atualizarTimeline(dataInicial, event.target.value, categoria)]} placeholder="Data de Fim" sx={mobile ? { ml: "0px", width: "100%" } : { ml: "10px" }} />
                            </Stack>
                        </Stack>
                        <Stack width={mobile ? "83%" : null} flexDirection={mobile ? "column" : "row"} alignItems={mobile ? "flex-start" : "center"} ml={mobile ? "0px" : "20px"}>
                            <Typography>Categoria</Typography>
                            <Select value={categoria} onChange={(event, newValue) => [setCategoria(newValue), setCategoriaSelecionada(newValue), atualizarTimeline(dataInicial, dataFinal, newValue)]} sx={mobile ? { ml: "0px", width: "100%" } : { ml: "10px" }}>
                                {categorias.map(function (categoria) {
                                    return (
                                        <Option value={categoria}>{categoria}</Option>
                                    )
                                })}
                            </Select>
                        </Stack>
                        <Stack ml={mobile ? "0px" : "20px"} mt={mobile ? "20px" : "0px"} width={mobile ? "87%" : null} flexDirection={mobile ? "column" : "row"} alignItems={mobile ? "flex-start" : "center"}>
                            {carregado ? <Button onClick={capturarImagem} sx={mobile ? { width: "95%" } : { marginRight: "20px" }} color="success">Compartilhar Escalas</Button> : null}
                            <Button onClick={() => setModalCategorias(true)} sx={mobile ? { width: "95%", marginTop: "20px" } : { marginRight: "20px" }} color="neutral">Gerenciar Categorias</Button>
                            <Button onClick={() => [atualizarTimeline(dataInicial, dataFinal, categoria), setCarregado(true)]} sx={mobile ? { width: "95%", marginTop: "20px" } : {}} >Carregar Escalas</Button>
                        </Stack>
                    </Stack>
                </Stack>
                <Stack flex={1} overflow={"auto"}>
                    {carregado ?
                        <VerticalTimeline>
                            {datasEscaladas.map(function (escala, indice) {
                                const existeDataAnterior = datasEscaladas[indice + 1];
                                let existeMembroEscaladoAnterior = false;
                                if (existeDataAnterior) {
                                    existeMembroEscaladoAnterior = datasEscaladas[indice + 1].membro != "";
                                    console.log(existeMembroEscaladoAnterior);
                                }

                                if (escala) {
                                    console.log(escala);
                                    return (
                                        <VerticalTimelineElement
                                            className="vertical-timeline-element--work"
                                            date={escala.dataEHora ? formatarData(escala.dataEHora.split(" as ")[0]) + " as " + escala.dataEHora.split(" as ")[1] : ""}
                                            iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
                                            icon={<IoCalendar />}
                                        >
                                            <h3 className="vertical-timeline-element-title">{escala.dataEHora ? escala.titulo : ""}</h3>
                                            {membrosCategorias[categoria] ?
                                                <Select value={escala.membro ? escala.membro : null} onChange={(event, newValue) => atualizarEscala(newValue, indice, escala.dataEHora)} sx={{ marginTop: "10px" }}>
                                                    {membrosCategorias[categoria].map(function (membro) {
                                                        return (
                                                            <Option value={membro}>{membro}</Option>
                                                        );
                                                    })}
                                                </Select>
                                                : null
                                            }
                                            {escala.membro ?
                                                <Stack width="100%">
                                                    <Button onClick={() => removerEscala(escala)} variant="plain" color="danger">Remover Membro</Button>
                                                </Stack>
                                                : null
                                            }
                                            {!escala.membro && existeMembroEscaladoAnterior ?
                                                <Stack flexDirection={"row"} alignItems={"center"}>
                                                    {/* <Button sx={{ flex: 1 }} onClick={() => console.log(membrosCategorias[categoria])} variant="plain">Ver Fila</Button> */}
                                                    <Dropdown>
                                                        <MenuButton sx={{width: "50%"}} color="primary" variant="plain">Ver Fila</MenuButton>
                                                        <Menu>
                                                            {
                                                                membrosCategorias[categoria].map((membro, indice) => {

                                                                    console.log(membrosCategorias[categoria]);

                                                                    const indiceEscala = datasEscaladas.findIndex((data) => data.dataEHora === escala.dataEHora);
                                                                    const ultimoEscalado = datasEscaladas[indiceEscala + 1].membro;
                                                                    const indiceUltimoEscalado = membrosCategorias[categoria].indexOf(ultimoEscalado);

                                                                    //Definindo próximo para a escala
                                                                    let indiceNovoEscalado = -1;

                                                                    if (membrosCategorias[categoria].length - 1 == indiceUltimoEscalado) {
                                                                        indiceNovoEscalado = 0
                                                                    }
                                                                    else {
                                                                        indiceNovoEscalado = indiceUltimoEscalado + 1;
                                                                    }

                                                                    const proximoFila = membrosCategorias[categoria][indiceNovoEscalado];

                                                                    return (
                                                                        <MenuItem onClick={() => atualizarEscala(membro, indice, escala.dataEHora)} sx={membro == proximoFila ? { fontWeight: "bold" } : {}}>{indice + 1 + "° " + membro}</MenuItem>
                                                                    );
                                                                })
                                                            }
                                                        </Menu>
                                                    </Dropdown>
                                                    <Button sx={{width: "50%"}} onClick={() => sugerirProximoEscalado(escala.dataEHora, categoriaSelecionada)} variant="plain">Sugerir</Button>
                                                </Stack>
                                                : null
                                            }
                                        </VerticalTimelineElement>
                                    );
                                }
                            })}
                        </VerticalTimeline>
                        : null
                    }
                </Stack>

                <Modal
                    aria-labelledby="modal-title"
                    aria-describedby="modal-desc"
                    open={modalCategorias}
                    onClose={() => setModalCategorias(false)}
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
                            Gerenciar Categorias
                        </Typography>
                        <Stack mt="20px">
                            <Stack width="100%" alignSelf={"flex-end"} flexDirection={"row"} alignItems="flex-end">
                                <Stack width="100%">
                                    <Typography>Nova Categoria</Typography>
                                    <Input value={nomeNovaCategoria} onChange={(event) => setNomeNovaCategoria(event.target.value)} placeholder="Nome da nova categoria" />
                                </Stack>
                                <Button onClick={() => novaCategoria()} sx={{ marginLeft: "10px" }}>Criar</Button>
                            </Stack>
                            <List>
                                {categorias.map(function (categoria) {
                                    return (
                                        <ListItem>
                                            <ListItemButton>
                                                <ListItemDecorator><BiSolidCategoryAlt size={20} /></ListItemDecorator>
                                                <ListItemContent onClick={() => [setModalMembrosCategoria(true), setCategoriaSelecionada(categoria)]}>{categoria}</ListItemContent>
                                                {/* <Button onClick={() => setNomeNovaCategoria("categoria")} variant="plain" sx={{padding: "10px"}}>
                                                <BiEditAlt size={20} />
                                            </Button> */}
                                                <Button onClick={() => [setDialogConfirmacao(true), setCategoriaSelecionada(categoria)]} variant="plain" sx={{ padding: "10px", paddingRight: "0px" }}>
                                                    <IoTrash size={20} color="#e53935" />
                                                </Button>
                                            </ListItemButton>
                                        </ListItem>
                                    );
                                })}
                            </List>
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
                            Esta operação é irreversível e excluirá todos as escalas vinculadas a esta categoria
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', pt: 2 }}>
                            <Button variant="plain" color="neutral" onClick={() => setDialogConfirmacao(false)}>
                                Cancelar
                            </Button>
                            <Button variant="solid" color="danger" onClick={() => [excluirCategoria(), setDialogConfirmacao(false)]}>
                                Excluir
                            </Button>
                        </Box>
                    </ModalDialog>
                </Modal>
                <Modal open={dialogConfirmacaoExclusaoMembroCategoria} onClose={() => setDialogConfirmacaoExclusaoMembroCategoria(false)}>
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
                            <Button variant="solid" color="danger" onClick={() => [excluirMembroCategoria(), setDialogConfirmacaoExclusaoMembroCategoria(false)]}>
                                Excluir
                            </Button>
                        </Box>
                    </ModalDialog>
                </Modal>
                <Modal
                    aria-labelledby="modal-title"
                    aria-describedby="modal-desc"
                    open={modalMembrosCategoria}
                    onClose={() => setModalMembrosCategoria(false)}
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
                            {categoriaSelecionada}
                        </Typography>
                        <Stack mt="20px">
                            <Stack width="100%" alignSelf={"flex-end"} flexDirection={"row"} alignItems="flex-end">
                                <Stack width="100%" flexDirection={"row"} alignItems={"flex-end"}>
                                    <Stack sx={mobile ? { width: "200px" } : { width: "100%" }} >
                                        <Typography>Incluir Membro</Typography>
                                        <Select value={membroParaIncluir} onChange={(event, newValue) => setMembroParaIncluir(newValue)}>
                                            {membros.map(function (membro) {
                                                return (
                                                    <Option value={membro.nome}>{membro.nome}</Option>
                                                );
                                            })}
                                        </Select>
                                    </Stack>
                                    <Button onClick={() => incluirMembro()} sx={{ marginLeft: "20px" }}>Incluir</Button>
                                </Stack>
                            </Stack>
                            {membrosCategorias[categoriaSelecionada] ?
                                <List>
                                    {membrosCategorias[categoriaSelecionada].map(function (membro) {
                                        return (
                                            <ListItem>
                                                <ListItemButton>
                                                    <ListItemDecorator><BiSolidCategoryAlt size={20} /></ListItemDecorator>
                                                    <ListItemContent>{membro}</ListItemContent>
                                                    <Button onClick={() => [setDialogConfirmacaoExclusaoMembroCategoria(true), setMembroCategoriaSelecionado(membro)]} variant="plain" sx={{ padding: "10px", paddingRight: "0px" }}>
                                                        <IoTrash size={20} color="#e53935" />
                                                    </Button>
                                                </ListItemButton>
                                            </ListItem>
                                        );
                                    })}
                                </List>
                                : null
                            }
                        </Stack>
                    </Sheet>
                </Modal>
                <Modal
                    aria-labelledby="modal-title"
                    aria-describedby="modal-desc"
                    open={modalEscalaGerada}
                    onClose={() => setModalEscalaGerada(false)}
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Sheet
                        variant="outlined"
                        sx={{
                            minWidth: mobile ? "90%" : 450,
                            maxWidth: mobile ? "90%" : 450,
                            borderRadius: 'md',
                            p: 1,
                            boxShadow: 'lg',
                            height: "90%",
                            backgroundColor: "#fff"
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
                            <Stack width="90%" padding={"10px 0"}>
                                <Typography level="title-lg" sx={{ marginLeft: "10px" }}>Escala</Typography>
                                <FormHelperText level="title-lg" sx={{ marginLeft: "10px", color: "#fb8c00" }}>Obs: {mobile ? "Clique e segure  na imagem para compartilhar" : "Clique com o botão direito do mouse e copie a imagem para compartilhar"}</FormHelperText>
                            </Stack>
                        </Typography>
                        <Stack mt="20px" height="70vh" overflow={'auto'}>
                            <Stack>
                                <img style={{ width: "100%" }} src={imagemGerada} />
                            </Stack>
                        </Stack>
                    </Sheet>
                </Modal>
            </Stack>

            {/* Vizualização das escalas para impressao */}

            <Stack width={mobile ? "100%" : "350px"} ref={containerRef} style={modeloVisivel ? { display: "block" } : { display: "none" }} padding={"10px"} bgcolor={"#fff"}>
                <Stack width="100%" flexDirection={"row"} alignItems={"center"} sx={{ marginBottom: "30px" }} borderBottom={"1px solid #aaa"} paddingBottom={"5px"}>
                    <img height="50px" src={logo} />
                    <Typography level="title-md" sx={{ marginLeft: "20px" }} fontSize={18}>{categoria}</Typography>
                </Stack>
                {datasEscaladasInvertidas.map(function (escala, indice) {
                    if (escala) {
                        if (escala.membro) {
                            return (
                                <Stack key={indice} mb="20px" width={mobile ? "85%" : "300px"} border={"1px solid gray"} borderRadius={"5px"} padding={"20px"} sx={{ backgroundColor: "#333" }}>
                                    <Stack flexDirection={"row"} alignItems={"center"}>
                                        <IoPersonSharp size={20} color="#eee" />
                                        <Typography
                                            style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                                            sx={{ color: "#eee", marginLeft: "10px" }}
                                            level="title-lg">
                                            {escala.membro}
                                        </Typography>
                                    </Stack>
                                    <Stack flexDirection={"row"} alignItems={"center"} mt={"5px"}>
                                        <FaChurch size={20} color="#eee" />
                                        <Typography sx={{ color: "#eee", marginLeft: "10px" }}>{escala.titulo}</Typography>
                                    </Stack>
                                    <Stack flexDirection={"row"} alignItems={"center"} mt={"5px"}>
                                        <IoCalendarSharp size={20} color="#eee" />
                                        <Typography sx={{ color: "#eee", marginLeft: "10px" }}>Data: {formatarData(escala.dataEHora.split(" as ")[0]) + " as " + escala.dataEHora.split(" as ")[1]}</Typography>
                                    </Stack>
                                </Stack>
                            );
                        }
                    }
                })}
            </Stack>

        </Stack >
    );
}