import { useState, useEffect } from "react";

//Firebase
import { getDatabase, ref, set, onValue } from "firebase/database";

// Componentes
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";

// Icones
import { IoInformationCircleSharp, IoDocumentTextOutline } from "react-icons/io5";

import "../../App.css";

// JoyUI
import {
    Stack,
    Typography,
    Button,
    Input,
    Slider,
    Modal,
    Sheet,
    ModalClose,
    LinearProgress,
    List,
    ListItem,
    ListItemButton,
    ListItemDecorator,
    ListItemContent
} from "@mui/joy"

//Utils
import { obterDataAtual } from "../../utils/datas";

//MediaQuery
import useMediaQuery from '@mui/material/useMediaQuery';

const legendas = ["Nunca", "Nunca", "Quase Nunca", "Quase Nunca", "As Vezes", "As Vezes", "Quase Sempre", "Quase Sempre", "Sempre", "Sempre"];

export default function AnaliseTemperamentos() {

    const db = getDatabase();

    const mobile = useMediaQuery('(max-width:1200px)');
    const [analises, setAnalises] = useState([]);
    const [perguntas, setPerguntas] = useState({});
    const [dominante, setDominante] = useState(0);
    const [extrovertido, setExtrovertido] = useState(0);
    const [paciente, setPaciente] = useState(0);
    const [analitico, setAnalitico] = useState(0);
    const [modalResultados, setModalResultados] = useState(false);
    const [modalCaracteristicas, setModalCaracteristicas] = useState(false);
    const [perfilSelecionado, setPerfilSelecionado] = useState("");
    const [nomeCompleto, setNomeCompleto] = useState("");
    const [analiseSalva, setAnaliseSalva] = useState(false);

    useEffect(() => {
        obterAnaliseDeTemperamentos();
    }, [])

    const obterAnaliseDeTemperamentos = () => {
        const temperamentosRef = ref(db, 'analiseDeTemperamentos/');
        onValue(temperamentosRef, (snapshot) => {
            const data = snapshot.val();
            setAnalises(data != null ? data : []);
        });
    }

    const calcularResultado = () => {

        let dominante = 0;
        let extrovertido = 0;
        let paciente = 0;
        let analitico = 0;

        for (let i = 0; i < 44; i++) {
            let indice = i + 1;
            if (!isNaN(perguntas[indice])) {
                if (indice == 1 || indice == 5 || indice == 9 || indice == 13 || indice == 17 || indice == 21 || indice == 25 || indice == 29 || indice == 33 || indice == 37 || indice == 41) {
                    dominante += parseInt(perguntas[indice]);
                } else if (indice == 2 || indice == 6 || indice == 10 || indice == 14 || indice == 18 || indice == 22 || indice == 26 || indice == 30 || indice == 34 || indice == 38 || indice == 42) {
                    extrovertido += parseInt(perguntas[indice]);
                } else if (indice == 3 || indice == 7 || indice == 11 || indice == 15 || indice == 19 || indice == 23 || indice == 27 || indice == 31 || indice == 35 || indice == 39 || indice == 43) {
                    paciente += parseInt(perguntas[indice]);
                } else if (indice == 4 || indice == 8 || indice == 12 || indice == 16 || indice == 20 || indice == 24 || indice == 28 || indice == 32 || indice == 36 || indice == 40 || indice == 44) {
                    analitico += parseInt(perguntas[indice]);
                }
            }
        }

        setDominante(dominante);
        setExtrovertido(extrovertido);
        setPaciente(paciente);
        setAnalitico(analitico);

        let analisesAtuais = analises;
        analisesAtuais.push(
            {
                dominante: dominante,
                extrovertido: extrovertido,
                paciente: paciente,
                analitico: analitico,
                nome: nomeCompleto,
                data: obterDataAtual()
            }
        );

        if (!analiseSalva) {
            //Salvando no banco de dados
            set(ref(db, 'analiseDeTemperamentos'), analisesAtuais);
            setAnaliseSalva(true);
        }
        setModalResultados(true);
    }

    return (
        <Stack backgroundColor="#f5f5f5" height="100%" minHeight={"100vh"}>
            <Header mobile={mobile} />
            <Sidebar mobile={mobile} />
            <Stack
                ml={mobile ? "0px" : "250px"}
                mt="50px"
                flex={1}
                height={"calc(100% - 55px)"}
                p={mobile ? "20px" : "50px"}
                overflow="auto"
            >
                {/* Conteúdo da tela */}
                <Typography level="h4">
                    Análise de Temperamentos
                </Typography>

                <Stack flexDirection={mobile ? "column" : "row"} mt="40px">
                    <Stack mr={mobile ? "0px" : "100px"} mb={mobile ? "20px" : "0px"}>
                        <Typography level="title-md">Questionários Anteriores</Typography>
                        <List>
                            {analises.map(function (analise) {
                                if (nomeCompleto == analise.nome) {
                                    return (
                                        <ListItem onClick={() => [
                                            setModalResultados(true),
                                            setDominante(analise.dominante),
                                            setExtrovertido(analise.extrovertido),
                                            setPaciente(analise.paciente),
                                            setAnalitico(analise.analitico)
                                        ]}>
                                            <ListItemButton>
                                                <ListItemDecorator><IoDocumentTextOutline size={20} /></ListItemDecorator>
                                                <ListItemContent>{analise.data}</ListItemContent>
                                            </ListItemButton>
                                        </ListItem>
                                    );
                                }
                            })}
                        </List>
                    </Stack>
                    <Stack width={mobile ? "100%" : "500px"}>
                        <Typography level="title-md" sx={{ marginBottom: "10px" }}>Novo Questionário</Typography>
                        <Typography>Informe seu nome completo*</Typography>
                        <Input value={nomeCompleto} onChange={(event) => setNomeCompleto(event.target.value)} placeholder="Exemplo: João da Silva" />

                        <Typography level="title-md" sx={{ marginTop: "30px" }}>Indique um número de 1 a 10 para as perguntas abaixo:</Typography>
                        <Typography level="body-md" sx={{ marginTop: "10px" }}>Legenda</Typography>
                        <Stack flexDirection={"row"} width="100%">
                            <Stack flex={1} alignItems={"center"} sx={{ border: "1px solid #ddd", padding: "5px", backgroundColor: "#1976d2", alignItems: "center" }}>
                                <Typography sx={{ color: "#eee", fontWeight: "bold" }}>1-2</Typography>
                                <Typography sx={{ color: "#eee", fontSize: "11px", textAlign: "center" }}>Nunca</Typography>
                            </Stack>
                            <Stack flex={1} alignItems={"center"} sx={{ border: "1px solid #ddd", padding: "5px", backgroundColor: "#1976d2", alignItems: "center" }}>
                                <Typography sx={{ color: "#eee", fontWeight: "bold" }}>3-4</Typography>
                                <Typography sx={{ color: "#eee", fontSize: "11px", textAlign: "center" }}>Quase Nunca</Typography>
                            </Stack>
                            <Stack flex={1} alignItems={"center"} sx={{ border: "1px solid #ddd", padding: "5px", backgroundColor: "#1976d2", alignItems: "center" }}>
                                <Typography sx={{ color: "#eee", fontWeight: "bold" }}>5-6</Typography>
                                <Typography sx={{ color: "#eee", fontSize: "11px", textAlign: "center" }}>As Vezes</Typography>
                            </Stack>
                            <Stack flex={1} alignItems={"center"} sx={{ border: "1px solid #ddd", padding: "5px", backgroundColor: "#1976d2", alignItems: "center" }}>
                                <Typography sx={{ color: "#eee", fontWeight: "bold" }}>7-8</Typography>
                                <Typography sx={{ color: "#eee", fontSize: "11px", textAlign: "center" }}>Quase Sempre</Typography>
                            </Stack>
                            <Stack flex={1} alignItems={"center"} sx={{ border: "1px solid #ddd", padding: "5px", backgroundColor: "#1976d2", alignItems: "center" }}>
                                <Typography sx={{ color: "#eee", fontWeight: "bold" }}>9-10</Typography>
                                <Typography sx={{ color: "#eee", fontSize: "11px", textAlign: "center" }}>Sempre</Typography>
                            </Stack>
                        </Stack>

                        <Stack mt="60px">
                            <Typography>1 - Fica entediado com frequência?</Typography>
                            <Slider
                                defaultValue={1}
                                step={1}
                                marks
                                min={1}
                                max={10}
                                valueLabelDisplay="auto"
                                color="warning"
                                value={perguntas[1]}
                                onChange={(event, value) => setPerguntas({ ...perguntas, 1: value })}
                                size="lg"
                            />
                            <Stack alignSelf={"flex-end"}>
                                <Typography level="title-lg">{legendas[(perguntas[1] - 1)]}</Typography>
                            </Stack>
                        </Stack>

                        <Stack mt="60px">
                            <Typography>2 - Prefere liberdade à detalhes e controle?</Typography>
                            <Slider
                                defaultValue={1}
                                step={1}
                                marks
                                min={1}
                                max={10}
                                valueLabelDisplay="auto"
                                color="warning"
                                value={perguntas[2]}
                                onChange={(event, value) => setPerguntas({ ...perguntas, 2: value })}
                                size="lg"
                            />
                            <Stack alignSelf={"flex-end"}>
                                <Typography level="title-lg">{legendas[(perguntas[2] - 1)]}</Typography>
                            </Stack>
                        </Stack>

                        <Stack mt="60px">
                            <Typography>3 - Gosta de eficiência e planejamento?</Typography>
                            <Slider
                                defaultValue={1}
                                step={1}
                                marks
                                min={1}
                                max={10}
                                valueLabelDisplay="auto"
                                color="warning"
                                value={perguntas[3]}
                                onChange={(event, value) => setPerguntas({ ...perguntas, 3: value })}
                                size="lg"
                            />
                            <Stack alignSelf={"flex-end"}>
                                <Typography level="title-lg">{legendas[(perguntas[3] - 1)]}</Typography>
                            </Stack>
                        </Stack>

                        <Stack mt="60px">
                            <Typography>4 - É organizado e voltado para o processo?</Typography>
                            <Slider
                                defaultValue={1}
                                step={1}
                                marks
                                min={1}
                                max={10}
                                valueLabelDisplay="auto"
                                color="warning"
                                value={perguntas[4]}
                                onChange={(event, value) => setPerguntas({ ...perguntas, 4: value })}
                                size="lg"
                            />
                            <Stack alignSelf={"flex-end"}>
                                <Typography level="title-lg">{legendas[(perguntas[4] - 1)]}</Typography>
                            </Stack>
                        </Stack>

                        <Stack mt="60px">
                            <Typography>5 - Possui autoconfiança elevada?</Typography>
                            <Slider
                                defaultValue={1}
                                step={1}
                                marks
                                min={1}
                                max={10}
                                valueLabelDisplay="auto"
                                color="warning"
                                value={perguntas[5]}
                                onChange={(event, value) => setPerguntas({ ...perguntas, 5: value })}
                                size="lg"
                            />
                            <Stack alignSelf={"flex-end"}>
                                <Typography level="title-lg">{legendas[(perguntas[5] - 1)]}</Typography>
                            </Stack>
                        </Stack>

                        <Stack mt="60px">
                            <Typography>6 - Usa bem a linguagem verbal?</Typography>
                            <Slider
                                defaultValue={1}
                                step={1}
                                marks
                                min={1}
                                max={10}
                                valueLabelDisplay="auto"
                                color="warning"
                                value={perguntas[6]}
                                onChange={(event, value) => setPerguntas({ ...perguntas, 6: value })}
                                size="lg"
                            />
                            <Stack alignSelf={"flex-end"}>
                                <Typography level="title-lg">{legendas[(perguntas[6] - 1)]}</Typography>
                            </Stack>
                        </Stack>

                        <Stack mt="60px">
                            <Typography>7 - Gosta de relacionamentos profundos?</Typography>
                            <Slider
                                defaultValue={1}
                                step={1}
                                marks
                                min={1}
                                max={10}
                                valueLabelDisplay="auto"
                                color="warning"
                                value={perguntas[7]}
                                onChange={(event, value) => setPerguntas({ ...perguntas, 7: value })}
                                size="lg"
                            />
                            <Stack alignSelf={"flex-end"}>
                                <Typography level="title-lg">{legendas[(perguntas[7] - 1)]}</Typography>
                            </Stack>
                        </Stack>

                        <Stack mt="60px">
                            <Typography>8 - Perfeccionista?</Typography>
                            <Slider
                                defaultValue={1}
                                step={1}
                                marks
                                min={1}
                                max={10}
                                valueLabelDisplay="auto"
                                color="warning"
                                value={perguntas[8]}
                                onChange={(event, value) => setPerguntas({ ...perguntas, 8: value })}
                                size="lg"
                            />
                            <Stack alignSelf={"flex-end"}>
                                <Typography level="title-lg">{legendas[(perguntas[8] - 1)]}</Typography>
                            </Stack>
                        </Stack>

                        <Stack mt="60px">
                            <Typography>9 - É direcionado para resultados?</Typography>
                            <Slider
                                defaultValue={1}
                                step={1}
                                marks
                                min={1}
                                max={10}
                                valueLabelDisplay="auto"
                                color="warning"
                                value={perguntas[9]}
                                onChange={(event, value) => setPerguntas({ ...perguntas, 9: value })}
                                size="lg"
                            />
                            <Stack alignSelf={"flex-end"}>
                                <Typography level="title-lg">{legendas[(perguntas[9] - 1)]}</Typography>
                            </Stack>
                        </Stack>

                        <Stack mt="60px">
                            <Typography>10 - É direcionado para pessoas?</Typography>
                            <Slider
                                defaultValue={1}
                                step={1}
                                marks
                                min={1}
                                max={10}
                                valueLabelDisplay="auto"
                                color="warning"
                                value={perguntas[10]}
                                onChange={(event, value) => setPerguntas({ ...perguntas, 10: value })}
                                size="lg"
                            />
                            <Stack alignSelf={"flex-end"}>
                                <Typography level="title-lg">{legendas[(perguntas[10] - 1)]}</Typography>
                            </Stack>
                        </Stack>

                        <Stack mt="60px">
                            <Typography>11 - Não gosta de mudança de ultima hora?</Typography>
                            <Slider
                                defaultValue={1}
                                step={1}
                                marks
                                min={1}
                                max={10}
                                valueLabelDisplay="auto"
                                color="warning"
                                value={perguntas[11]}
                                onChange={(event, value) => setPerguntas({ ...perguntas, 11: value })}
                                size="lg"
                            />
                            <Stack alignSelf={"flex-end"}>
                                <Typography level="title-lg">{legendas[(perguntas[11] - 1)]}</Typography>
                            </Stack>
                        </Stack>

                        <Stack mt="60px">
                            <Typography>12 - É sistemático nos relacionamentos?</Typography>
                            <Slider
                                defaultValue={1}
                                step={1}
                                marks
                                min={1}
                                max={10}
                                valueLabelDisplay="auto"
                                color="warning"
                                value={perguntas[12]}
                                onChange={(event, value) => setPerguntas({ ...perguntas, 12: value })}
                                size="lg"
                            />
                            <Stack alignSelf={"flex-end"}>
                                <Typography level="title-lg">{legendas[(perguntas[12] - 1)]}</Typography>
                            </Stack>
                        </Stack>

                        <Stack mt="60px">
                            <Typography>13 - Gosta de desafios e mudanças?</Typography>
                            <Slider
                                defaultValue={1}
                                step={1}
                                marks
                                min={1}
                                max={10}
                                valueLabelDisplay="auto"
                                color="warning"
                                value={perguntas[13]}
                                onChange={(event, value) => setPerguntas({ ...perguntas, 13: value })}
                                size="lg"
                            />
                            <Stack alignSelf={"flex-end"}>
                                <Typography level="title-lg">{legendas[(perguntas[13] - 1)]}</Typography>
                            </Stack>
                        </Stack>

                        <Stack mt="60px">
                            <Typography>14 - Usa bem a intuição?</Typography>
                            <Slider
                                defaultValue={1}
                                step={1}
                                marks
                                min={1}
                                max={10}
                                valueLabelDisplay="auto"
                                color="warning"
                                value={perguntas[14]}
                                onChange={(event, value) => setPerguntas({ ...perguntas, 14: value })}
                                size="lg"
                            />
                            <Stack alignSelf={"flex-end"}>
                                <Typography level="title-lg">{legendas[(perguntas[14] - 1)]}</Typography>
                            </Stack>
                        </Stack>

                        <Stack mt="60px">
                            <Typography>15 - Não gosta de conflitos?</Typography>
                            <Slider
                                defaultValue={1}
                                step={1}
                                marks
                                min={1}
                                max={10}
                                valueLabelDisplay="auto"
                                color="warning"
                                value={perguntas[15]}
                                onChange={(event, value) => setPerguntas({ ...perguntas, 15: value })}
                                size="lg"
                            />
                            <Stack alignSelf={"flex-end"}>
                                <Typography level="title-lg">{legendas[(perguntas[15] - 1)]}</Typography>
                            </Stack>
                        </Stack>

                        <Stack mt="60px">
                            <Typography>16 - Valoriza a verdade e a precisão?</Typography>
                            <Slider
                                defaultValue={1}
                                step={1}
                                marks
                                min={1}
                                max={10}
                                valueLabelDisplay="auto"
                                color="warning"
                                value={perguntas[16]}
                                onChange={(event, value) => setPerguntas({ ...perguntas, 16: value })}
                                size="lg"
                            />
                            <Stack alignSelf={"flex-end"}>
                                <Typography level="title-lg">{legendas[(perguntas[16] - 1)]}</Typography>
                            </Stack>
                        </Stack>

                        <Stack mt="60px">
                            <Typography>17 - Gosta de arriscar?</Typography>
                            <Slider
                                defaultValue={1}
                                step={1}
                                marks
                                min={1}
                                max={10}
                                valueLabelDisplay="auto"
                                color="warning"
                                value={perguntas[17]}
                                onChange={(event, value) => setPerguntas({ ...perguntas, 17: value })}
                                size="lg"
                            />
                            <Stack alignSelf={"flex-end"}>
                                <Typography level="title-lg">{legendas[(perguntas[17] - 1)]}</Typography>
                            </Stack>
                        </Stack>

                        <Stack mt="60px">
                            <Typography>18 - É simpático?</Typography>
                            <Slider
                                defaultValue={1}
                                step={1}
                                marks
                                min={1}
                                max={10}
                                valueLabelDisplay="auto"
                                color="warning"
                                value={perguntas[18]}
                                onChange={(event, value) => setPerguntas({ ...perguntas, 18: value })}
                                size="lg"
                            />
                            <Stack alignSelf={"flex-end"}>
                                <Typography level="title-lg">{legendas[(perguntas[18] - 1)]}</Typography>
                            </Stack>
                        </Stack>

                        <Stack mt="60px">
                            <Typography>19 - Um bom ouvinte?</Typography>
                            <Slider
                                defaultValue={1}
                                step={1}
                                marks
                                min={1}
                                max={10}
                                valueLabelDisplay="auto"
                                color="warning"
                                value={perguntas[19]}
                                onChange={(event, value) => setPerguntas({ ...perguntas, 19: value })}
                                size="lg"
                            />
                            <Stack alignSelf={"flex-end"}>
                                <Typography level="title-lg">{legendas[(perguntas[19] - 1)]}</Typography>
                            </Stack>
                        </Stack>

                        <Stack mt="60px">
                            <Typography>20 - Suas decisões são baseadas na lógica?</Typography>
                            <Slider
                                defaultValue={1}
                                step={1}
                                marks
                                min={1}
                                max={10}
                                valueLabelDisplay="auto"
                                color="warning"
                                value={perguntas[20]}
                                onChange={(event, value) => setPerguntas({ ...perguntas, 20: value })}
                                size="lg"
                            />
                            <Stack alignSelf={"flex-end"}>
                                <Typography level="title-lg">{legendas[(perguntas[20] - 1)]}</Typography>
                            </Stack>
                        </Stack>

                        <Stack mt="60px">
                            <Typography>21 - Possui alta expectativa em relação aos outros e a si próprio?</Typography>
                            <Slider
                                defaultValue={1}
                                step={1}
                                marks
                                min={1}
                                max={10}
                                valueLabelDisplay="auto"
                                color="warning"
                                value={perguntas[21]}
                                onChange={(event, value) => setPerguntas({ ...perguntas, 21: value })}
                                size="lg"
                            />
                            <Stack alignSelf={"flex-end"}>
                                <Typography level="title-lg">{legendas[(perguntas[21] - 1)]}</Typography>
                            </Stack>
                        </Stack>

                        <Stack mt="60px">
                            <Typography>22 - É amigo?</Typography>
                            <Slider
                                defaultValue={1}
                                step={1}
                                marks
                                min={1}
                                max={10}
                                valueLabelDisplay="auto"
                                color="warning"
                                value={perguntas[22]}
                                onChange={(event, value) => setPerguntas({ ...perguntas, 22: value })}
                                size="lg"
                            />
                            <Stack alignSelf={"flex-end"}>
                                <Typography level="title-lg">{legendas[(perguntas[22] - 1)]}</Typography>
                            </Stack>
                        </Stack>

                        <Stack mt="60px">
                            <Typography>23 - Se identifica com a instituição, empresa, igreja, equipe, amigos, etc?</Typography>
                            <Slider
                                defaultValue={1}
                                step={1}
                                marks
                                min={1}
                                max={10}
                                valueLabelDisplay="auto"
                                color="warning"
                                value={perguntas[23]}
                                onChange={(event, value) => setPerguntas({ ...perguntas, 23: value })}
                                size="lg"
                            />
                            <Stack alignSelf={"flex-end"}>
                                <Typography level="title-lg">{legendas[(perguntas[23] - 1)]}</Typography>
                            </Stack>
                        </Stack>

                        <Stack mt="60px">
                            <Typography>24 - Quer saber todos os detalhes de fatos e situações?</Typography>
                            <Slider
                                defaultValue={1}
                                step={1}
                                marks
                                min={1}
                                max={10}
                                valueLabelDisplay="auto"
                                color="warning"
                                value={perguntas[24]}
                                onChange={(event, value) => setPerguntas({ ...perguntas, 24: value })}
                                size="lg"
                            />
                            <Stack alignSelf={"flex-end"}>
                                <Typography level="title-lg">{legendas[(perguntas[24] - 1)]}</Typography>
                            </Stack>
                        </Stack>

                        <Stack mt="60px">
                            <Typography>25 - Detesta indecisões?</Typography>
                            <Slider
                                defaultValue={1}
                                step={1}
                                marks
                                min={1}
                                max={10}
                                valueLabelDisplay="auto"
                                color="warning"
                                value={perguntas[25]}
                                onChange={(event, value) => setPerguntas({ ...perguntas, 25: value })}
                                size="lg"
                            />
                            <Stack alignSelf={"flex-end"}>
                                <Typography level="title-lg">{legendas[(perguntas[25] - 1)]}</Typography>
                            </Stack>
                        </Stack>

                        <Stack mt="60px">
                            <Typography>26 - É persuasivo e carismático?</Typography>
                            <Slider
                                defaultValue={1}
                                step={1}
                                marks
                                min={1}
                                max={10}
                                valueLabelDisplay="auto"
                                color="warning"
                                value={perguntas[26]}
                                onChange={(event, value) => setPerguntas({ ...perguntas, 26: value })}
                                size="lg"
                            />
                            <Stack alignSelf={"flex-end"}>
                                <Typography level="title-lg">{legendas[(perguntas[26] - 1)]}</Typography>
                            </Stack>
                        </Stack>

                        <Stack mt="60px">
                            <Typography>27 - Deseja paz e harmonia?</Typography>
                            <Slider
                                defaultValue={1}
                                step={1}
                                marks
                                min={1}
                                max={10}
                                valueLabelDisplay="auto"
                                color="warning"
                                value={perguntas[27]}
                                onChange={(event, value) => setPerguntas({ ...perguntas, 27: value })}
                                size="lg"
                            />
                            <Stack alignSelf={"flex-end"}>
                                <Typography level="title-lg">{legendas[(perguntas[27] - 1)]}</Typography>
                            </Stack>
                        </Stack>

                        <Stack mt="60px">
                            <Typography>28 - Tem a tendênci a se preocupar?</Typography>
                            <Slider
                                defaultValue={1}
                                step={1}
                                marks
                                min={1}
                                max={10}
                                valueLabelDisplay="auto"
                                color="warning"
                                value={perguntas[28]}
                                onChange={(event, value) => setPerguntas({ ...perguntas, 28: value })}
                                size="lg"
                            />
                            <Stack alignSelf={"flex-end"}>
                                <Typography level="title-lg">{legendas[(perguntas[28] - 1)]}</Typography>
                            </Stack>
                        </Stack>

                        <Stack mt="60px">
                            <Typography>29 - Gosta de respostas diretas?</Typography>
                            <Slider
                                defaultValue={1}
                                step={1}
                                marks
                                min={1}
                                max={10}
                                valueLabelDisplay="auto"
                                color="warning"
                                value={perguntas[29]}
                                onChange={(event, value) => setPerguntas({ ...perguntas, 29: value })}
                                size="lg"
                            />
                            <Stack alignSelf={"flex-end"}>
                                <Typography level="title-lg">{legendas[(perguntas[29] - 1)]}</Typography>
                            </Stack>
                        </Stack>

                        <Stack mt="60px">
                            <Typography>30 - É confiável?</Typography>
                            <Slider
                                defaultValue={1}
                                step={1}
                                marks
                                min={1}
                                max={10}
                                valueLabelDisplay="auto"
                                color="warning"
                                value={perguntas[30]}
                                onChange={(event, value) => setPerguntas({ ...perguntas, 30: value })}
                                size="lg"
                            />
                            <Stack alignSelf={"flex-end"}>
                                <Typography level="title-lg">{legendas[(perguntas[30] - 1)]}</Typography>
                            </Stack>
                        </Stack>

                        <Stack mt="60px">
                            <Typography>31 - Prefere um ambiente estável?</Typography>
                            <Slider
                                defaultValue={1}
                                step={1}
                                marks
                                min={1}
                                max={10}
                                valueLabelDisplay="auto"
                                color="warning"
                                value={perguntas[31]}
                                onChange={(event, value) => setPerguntas({ ...perguntas, 31: value })}
                                size="lg"
                            />
                            <Stack alignSelf={"flex-end"}>
                                <Typography level="title-lg">{legendas[(perguntas[31] - 1)]}</Typography>
                            </Stack>
                        </Stack>

                        <Stack mt="60px">
                            <Typography>32 - Exige um alto padrão de si mesmo e dos outros?</Typography>
                            <Slider
                                defaultValue={1}
                                step={1}
                                marks
                                min={1}
                                max={10}
                                valueLabelDisplay="auto"
                                color="warning"
                                value={perguntas[32]}
                                onChange={(event, value) => setPerguntas({ ...perguntas, 32: value })}
                                size="lg"
                            />
                            <Stack alignSelf={"flex-end"}>
                                <Typography level="title-lg">{legendas[(perguntas[32] - 1)]}</Typography>
                            </Stack>
                        </Stack>

                        <Stack mt="60px">
                            <Typography>33 - É enfático e exigente?</Typography>
                            <Slider
                                defaultValue={1}
                                step={1}
                                marks
                                min={1}
                                max={10}
                                valueLabelDisplay="auto"
                                color="warning"
                                value={perguntas[33]}
                                onChange={(event, value) => setPerguntas({ ...perguntas, 33: value })}
                                size="lg"
                            />
                            <Stack alignSelf={"flex-end"}>
                                <Typography level="title-lg">{legendas[(perguntas[33] - 1)]}</Typography>
                            </Stack>
                        </Stack>

                        <Stack mt="60px">
                            <Typography>34 - É autoconfiante e se autopromove?</Typography>
                            <Slider
                                defaultValue={1}
                                step={1}
                                marks
                                min={1}
                                max={10}
                                valueLabelDisplay="auto"
                                color="warning"
                                value={perguntas[34]}
                                onChange={(event, value) => setPerguntas({ ...perguntas, 34: value })}
                                size="lg"
                            />
                            <Stack alignSelf={"flex-end"}>
                                <Typography level="title-lg">{legendas[(perguntas[34] - 1)]}</Typography>
                            </Stack>
                        </Stack>

                        <Stack mt="60px">
                            <Typography>35 - Busca a lealdade?</Typography>
                            <Slider
                                defaultValue={1}
                                step={1}
                                marks
                                min={1}
                                max={10}
                                valueLabelDisplay="auto"
                                color="warning"
                                value={perguntas[35]}
                                onChange={(event, value) => setPerguntas({ ...perguntas, 35: value })}
                                size="lg"
                            />
                            <Stack alignSelf={"flex-end"}>
                                <Typography level="title-lg">{legendas[(perguntas[35] - 1)]}</Typography>
                            </Stack>
                        </Stack>

                        <Stack mt="60px">
                            <Typography>36 - Não expressa sua opnião, ao mesmo que tenha certeza?</Typography>
                            <Slider
                                defaultValue={1}
                                step={1}
                                marks
                                min={1}
                                max={10}
                                valueLabelDisplay="auto"
                                color="warning"
                                value={perguntas[36]}
                                onChange={(event, value) => setPerguntas({ ...perguntas, 36: value })}
                                size="lg"
                            />
                            <Stack alignSelf={"flex-end"}>
                                <Typography level="title-lg">{legendas[(perguntas[36] - 1)]}</Typography>
                            </Stack>
                        </Stack>

                        <Stack mt="60px">
                            <Typography>37 - Sua avaliação é baseada nas realizações?</Typography>
                            <Slider
                                defaultValue={1}
                                step={1}
                                marks
                                min={1}
                                max={10}
                                valueLabelDisplay="auto"
                                color="warning"
                                value={perguntas[37]}
                                onChange={(event, value) => setPerguntas({ ...perguntas, 37: value })}
                                size="lg"
                            />
                            <Stack alignSelf={"flex-end"}>
                                <Typography level="title-lg">{legendas[(perguntas[37] - 1)]}</Typography>
                            </Stack>
                        </Stack>

                        <Stack mt="60px">
                            <Typography>38 - Age por impulso e emoção?</Typography>
                            <Slider
                                defaultValue={1}
                                step={1}
                                marks
                                min={1}
                                max={10}
                                valueLabelDisplay="auto"
                                color="warning"
                                value={perguntas[38]}
                                onChange={(event, value) => setPerguntas({ ...perguntas, 38: value })}
                                size="lg"
                            />
                            <Stack alignSelf={"flex-end"}>
                                <Typography level="title-lg">{legendas[(perguntas[38] - 1)]}</Typography>
                            </Stack>
                        </Stack>

                        <Stack mt="60px">
                            <Typography>39 - Gosta de uma atmosfera calma e relaxada?</Typography>
                            <Slider
                                defaultValue={1}
                                step={1}
                                marks
                                min={1}
                                max={10}
                                valueLabelDisplay="auto"
                                color="warning"
                                value={perguntas[39]}
                                onChange={(event, value) => setPerguntas({ ...perguntas, 39: value })}
                                size="lg"
                            />
                            <Stack alignSelf={"flex-end"}>
                                <Typography level="title-lg">{legendas[(perguntas[39] - 1)]}</Typography>
                            </Stack>
                        </Stack>

                        <Stack mt="60px">
                            <Typography>40 - É muito consciente e busca a qualidade?</Typography>
                            <Slider
                                defaultValue={1}
                                step={1}
                                marks
                                min={1}
                                max={10}
                                valueLabelDisplay="auto"
                                color="warning"
                                value={perguntas[40]}
                                onChange={(event, value) => setPerguntas({ ...perguntas, 40: value })}
                                size="lg"
                            />
                            <Stack alignSelf={"flex-end"}>
                                <Typography level="title-lg">{legendas[(perguntas[40] - 1)]}</Typography>
                            </Stack>
                        </Stack>

                        <Stack mt="60px">
                            <Typography>41 - Rápido e impaciente?</Typography>
                            <Slider
                                defaultValue={1}
                                step={1}
                                marks
                                min={1}
                                max={10}
                                valueLabelDisplay="auto"
                                color="warning"
                                value={perguntas[41]}
                                onChange={(event, value) => setPerguntas({ ...perguntas, 41: value })}
                                size="lg"
                            />
                            <Stack alignSelf={"flex-end"}>
                                <Typography level="title-lg">{legendas[(perguntas[41] - 1)]}</Typography>
                            </Stack>

                            <Stack mt="60px">
                                <Typography>42 - Encoraja as tomadas de decisões da equipe?</Typography>
                                <Slider
                                    defaultValue={1}
                                    step={1}
                                    marks
                                    min={1}
                                    max={10}
                                    valueLabelDisplay="auto"
                                    color="warning"
                                    value={perguntas[42]}
                                    onChange={(event, value) => setPerguntas({ ...perguntas, 42: value })}
                                    size="lg"
                                />
                                <Stack alignSelf={"flex-end"}>
                                    <Typography level="title-lg">{legendas[(perguntas[42] - 1)]}</Typography>
                                </Stack>
                            </Stack>
                        </Stack>

                        <Stack mt="60px">
                            <Typography>43 - Importa-se com a equipe?</Typography>
                            <Slider
                                defaultValue={1}
                                step={1}
                                marks
                                min={1}
                                max={10}
                                valueLabelDisplay="auto"
                                color="warning"
                                value={perguntas[43]}
                                onChange={(event, value) => setPerguntas({ ...perguntas, 43: value })}
                                size="lg"
                            />
                            <Stack alignSelf={"flex-end"}>
                                <Typography level="title-lg">{legendas[(perguntas[43] - 1)]}</Typography>
                            </Stack>
                        </Stack>

                        <Stack mt="60px">
                            <Typography>44 - É racional e traça planos para resolver os problemas?</Typography>
                            <Slider
                                defaultValue={1}
                                step={1}
                                marks
                                min={1}
                                max={10}
                                valueLabelDisplay="auto"
                                color="warning"
                                value={perguntas[44]}
                                onChange={(event, value) => setPerguntas({ ...perguntas, 44: value })}
                                size="lg"
                            />
                            <Stack alignSelf={"flex-end"}>
                                <Typography level="title-lg">{legendas[(perguntas[44] - 1)]}</Typography>
                            </Stack>
                        </Stack>

                        <Button disabled={nomeCompleto == ""} onClick={calcularResultado} sx={{ marginTop: "40px" }}>{analiseSalva ? "Ver Resultados" : "Salvar e Calcular"}</Button>
                        {analiseSalva ?
                            <Button sx={{ marginTop: "20px" }} color="neutral" onClick={() => setAnaliseSalva(false)}>Nova Análise</Button>
                            : null
                        }
                        {nomeCompleto == "" ? <Typography sx={{ color: "red", fontSize: 12, marginTop: "10px" }}>Necessário informar o nome completo</Typography> : null}
                    </Stack>
                </Stack>
            </Stack>

            <Modal
                open={modalResultados}
                onClose={() => setModalResultados(false)}
                sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            >
                <Sheet
                    variant="outlined"
                    sx={{
                        minWidth: mobile ? "80%" : 500,
                        maxWidth: mobile ? "80%" : 500,
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
                        Resultados
                    </Typography>
                    <Stack flexDirection={"row"} justifyContent={"space-between"}>
                        <Typography fontWeight={(dominante > extrovertido) && (dominante > paciente) && (dominante > analitico) ? "bold" : "normal"}>1. Dominante:</Typography>
                        <Stack flexDirection={"row"}>
                            <Typography fontWeight={(dominante > extrovertido) && (dominante > paciente) && (dominante > analitico) ? "bold" : "normal"} sx={{ marginRight: "10px" }}>{dominante}</Typography>
                            <IoInformationCircleSharp className="hover" onClick={() => [setPerfilSelecionado("dominante"), setModalCaracteristicas(true)]} color="#1976d2" size={24} />
                        </Stack>
                    </Stack>
                    <Stack flexDirection={"row"} justifyContent={"space-between"}>
                        <Typography fontWeight={(extrovertido > dominante) && (extrovertido > paciente) && (extrovertido > analitico) ? "bold" : "normal"}>2. Extrovertido:</Typography>
                        <Stack flexDirection={"row"}>
                            <Typography fontWeight={(extrovertido > dominante) && (extrovertido > paciente) && (extrovertido > analitico) ? "bold" : "normal"} sx={{ marginRight: "10px" }}>{extrovertido}</Typography>
                            <IoInformationCircleSharp className="hover" onClick={() => [setPerfilSelecionado("extrovertido"), setModalCaracteristicas(true)]} color="#1976d2" size={24} />
                        </Stack>
                    </Stack>
                    <Stack flexDirection={"row"} justifyContent={"space-between"}>
                        <Typography fontWeight={(paciente > dominante) && (paciente > extrovertido) && (paciente > analitico) ? "bold" : "normal"}>3. Paciente:</Typography>
                        <Stack flexDirection={"row"}>
                            <Typography fontWeight={(paciente > dominante) && (paciente > extrovertido) && (paciente > analitico) ? "bold" : "normal"} sx={{ marginRight: "10px" }}>{paciente}</Typography>
                            <IoInformationCircleSharp className="hover" onClick={() => [setPerfilSelecionado("paciente"), setModalCaracteristicas(true)]} color="#1976d2" size={24} />
                        </Stack>
                    </Stack>
                    <Stack flexDirection={"row"} justifyContent={"space-between"}>
                        <Typography fontWeight={(analitico > dominante) && (analitico > extrovertido) && (analitico > paciente) ? "bold" : "normal"}>4. Analítico</Typography>
                        <Stack flexDirection={"row"}>
                            <Typography fontWeight={(analitico > dominante) && (analitico > extrovertido) && (analitico > paciente) ? "bold" : "normal"} sx={{ marginRight: "10px" }}>{analitico}</Typography>
                            <IoInformationCircleSharp className="hover" onClick={() => [setPerfilSelecionado("analítico"), setModalCaracteristicas(true)]} color="#1976d2" size={24} />
                        </Stack>
                    </Stack>
                    <Stack mt="30px" spacing={2} sx={{ flex: 1 }}>
                        <Typography>Dominante</Typography>
                        <LinearProgress determinate value={dominante} />
                        <Typography>Extrovertido</Typography>
                        <LinearProgress determinate value={extrovertido} />
                        <Typography>Paciente</Typography>
                        <LinearProgress determinate value={paciente} />
                        <Typography>Analítico</Typography>
                        <LinearProgress determinate value={analitico} />
                    </Stack>
                </Sheet>
            </Modal>

            <Modal
                open={modalCaracteristicas}
                onClose={() => setModalCaracteristicas(false)}
                sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            >
                <Sheet
                    variant="outlined"
                    sx={{
                        minWidth: mobile ? "80%" : 500,
                        maxWidth: mobile ? "80%" : 500,
                        borderRadius: 'md',
                        p: 3,
                        boxShadow: 'lg',
                        height: "90%",
                        overflow: "auto",
                        // overflowX: "hidden",
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
                        Características do perfil {perfilSelecionado}
                    </Typography>

                    <Stack>



                        {perfilSelecionado == "dominante" ?
                            <Stack>
                                <Typography>- Fica entediado facilmente;</Typography>
                                <Typography>- Direcionado para resultados;</Typography>
                                <Typography>- Gosta de desafios e mudanças;</Typography>
                                <Typography>- Possui alta expectativa em relação aos outros e a ele próprio;</Typography>
                                <Typography>- Gosta de se arriscar;</Typography>
                                <Typography>- Possui autoconfiança elevada;</Typography>
                                <Typography>- Pode ser enfático e exigente ( em relação a si e aos outros );</Typography>
                                <Typography>- Gosta de respostas diretas;</Typography>
                                <Typography>- Sua avaliação é baseada nas realizações;</Typography>
                                <Typography>- É rápido e impaciente;</Typography>

                                <Typography sx={{ marginTop: "10px", marginBottom: "5px", backgroundColor: "#1976d2", color: "#eee", borderRadius: "5px", padding: "5px" }} level="title-md">
                                    O que o dominante gosta de receber
                                </Typography>

                                <Typography>- Gosta de ser reconhecido pelos resultados;</Typography>
                                <Typography>- Receber elogios;</Typography>
                                <Typography>- Prêmio ou placa com seu nome;</Typography>
                                <Typography>- Indicações para seus superiores se suas realizações;</Typography>
                                <Typography>- Promoções baseadas em méritos;</Typography>
                                <Typography>- Mais autoridade e poder;</Typography>
                                <Typography>- Papéis na liderança;</Typography>
                                <Typography>- Treinamento para melhores trabalhos;</Typography>
                                <Typography>- Promoções para posições elevadas;</Typography>
                                <Typography>- Deixá-lo dar relatórios para uma pessoa de status;</Typography>

                                <Typography sx={{ marginTop: "10px", marginBottom: "5px", backgroundColor: "#1976d2", color: "#eee", borderRadius: "5px", padding: "5px" }} level="title-md">
                                    Pontos fortes do perfil dominante
                                </Typography>

                                <Typography>- Sente-se confortável no papel de liderança;</Typography>
                                <Typography>- Toma decisões rápidas;</Typography>
                                <Typography>- Deixa claro o papel de cada liderado;</Typography>
                                <Typography>- Cresce em momentos de mudança e crise;</Typography>
                                <Typography>- Aceita desafios;</Typography>

                                <Typography sx={{ marginTop: "10px", marginBottom: "5px", backgroundColor: "#1976d2", color: "#eee", borderRadius: "5px", padding: "5px" }} level="title-md">
                                    Sem flexibilidade, o líder dominante pode ser visto como:
                                </Typography>

                                <Typography>- Intimidador;</Typography>
                                <Typography>- Insensível;</Typography>
                                <Typography>- Impaciente;</Typography>
                                <Typography>- Preocupado mais com os resultados do que com as pessoas;</Typography>
                                <Typography>- Detesta indecisão;</Typography>
                            </Stack>
                            : null}

                        {perfilSelecionado == "extrovertido" ?
                            <Stack>
                                <Typography>- Direcionado para pessoas;</Typography>
                                <Typography>- Prefere liberdade a detalhes e controles;</Typography>
                                <Typography>- Usa bem a intuição;</Typography>
                                <Typography>- É simpático;</Typography>
                                <Typography>- É amigo;</Typography>
                                <Typography>- Usa bem a linguagem verbal;</Typography>
                                <Typography>- É confiável;</Typography>
                                <Typography>- É persuasivo e carismático;</Typography>
                                <Typography>- Age por impulso e emoção;</Typography>
                                <Typography>- É autoconfiante e se autopromove;</Typography>
                                <Typography>- É entusiasta;</Typography>
                                <Typography>- Encoraja as tomadas de decisão da equipe;</Typography>

                                <Typography sx={{ marginTop: "10px", marginBottom: "5px", backgroundColor: "#1976d2", color: "#eee", borderRadius: "5px", padding: "5px" }} level="title-md">
                                    O que o extrovertido gosta de receber
                                </Typography>

                                <Typography>- Implementação de suas idéias criativas;</Typography>
                                <Typography>- Invenções e dispositivos únicos;</Typography>
                                <Typography>- Liberdade e dispositivos únicos;</Typography>
                                <Typography>- Camisetas com o logo do time;</Typography>
                                <Typography>- Final de semana com três dias;</Typography>
                                <Typography>- Permissão para diminuir a quantidade de papelada;</Typography>
                                <Typography>- Férias ou excursões para lugares interessantes;</Typography>
                                <Typography>- Horário de trabalho flexível;</Typography>
                                <Typography>- Acessórios confortáveis e originais;</Typography>
                                <Typography>- Bugigangas;</Typography>
                                <Typography>- Alvo divertido na sua mesa;</Typography>
                                <Typography>- Bilhete para show de comédia, concerto, ou um musical;</Typography>

                                <Typography sx={{ marginTop: "10px", marginBottom: "5px", backgroundColor: "#1976d2", color: "#eee", borderRadius: "5px", padding: "5px" }} level="title-md">
                                    Pontos fortes do perfil extrovertido
                                </Typography>

                                <Typography>- Mantém uma política de portas abertas;</Typography>
                                <Typography>- Dá atenção aos seus liderados;</Typography>
                                <Typography>- Inspira e motiva seus liderados;</Typography>
                                <Typography>- Faz vários comentários positivos e construtivos;</Typography>

                                <Typography sx={{ marginTop: "10px", marginBottom: "5px", backgroundColor: "#1976d2", color: "#eee", borderRadius: "5px", padding: "5px" }} level="title-md">
                                    Sem flexibilidade, o líder extrovertido pode ser visto como:
                                </Typography>

                                <Typography>- Desorganizado;</Typography>
                                <Typography>- Não confiável em cumprir compromissos assumidos;</Typography>
                                <Typography>- Mais preocupado em manter as pessoas alegres do que em alcançar metas;</Typography>
                            </Stack>
                            : null}

                        {perfilSelecionado == "paciente" ?
                            <Stack>
                                <Typography>- Gosta de eficiência e planejamento;</Typography>
                                <Typography>- É tendencioso a relacionamentos profundos;</Typography>
                                <Typography>- Não gosta de mudanças de última hora;</Typography>
                                <Typography>- Não gosta de conflitos, é um pacificador nato;</Typography>
                                <Typography>- É um bom ouvinte;</Typography>
                                <Typography>- Gosta de se identificar com a empresa;</Typography>
                                <Typography>- Deseja paz e harmonia;</Typography>
                                <Typography>- Prefere um ambiente estável;</Typography>
                                <Typography>- Busca lealdade;</Typography>
                                <Typography>- Gosta de atmosfera calma e relaxada;</Typography>
                                <Typography>- Importa-se com a equipe;</Typography>
                                <Typography>- É metódico;</Typography>

                                <Typography sx={{ marginTop: "10px", marginBottom: "5px", backgroundColor: "#1976d2", color: "#eee", borderRadius: "5px", padding: "5px" }} level="title-md">
                                    O que o paciente gosta de receber
                                </Typography>

                                <Typography>- Ajuda para completar a sua tarefa;</Typography>
                                <Typography>- Uma vaga no time;</Typography>
                                <Typography>- Elogio pessoal;</Typography>
                                <Typography>- Compreensão do que está falando;</Typography>
                                <Typography>- Atitudes pacientes e amigáveis;</Typography>
                                <Typography>- Suas perguntas levadas a sério;</Typography>
                                <Typography>- Mais tempo de folga;</Typography>
                                <Typography>- Presentes feitos com as próprias mãos;</Typography>
                                <Typography>- Encontros sociais;</Typography>
                                <Typography>- Presentes pessoais que demonstrem que pensaram nele;</Typography>
                                <Typography>- Fotografia que trazem à memória;</Typography>
                                <Typography>- Cartas de agradecimento;</Typography>

                                <Typography sx={{ marginTop: "10px", marginBottom: "5px", backgroundColor: "#1976d2", color: "#eee", borderRadius: "5px", padding: "5px" }} level="title-md">
                                    Pontos fortes do perfil paciente
                                </Typography>

                                <Typography>- Bom ouvinte;</Typography>
                                <Typography>- Empático e sensível às necessidades;</Typography>
                                <Typography>- Valida seus liderados com frequência;</Typography>
                                <Typography>- Aprecia seus liderados;</Typography>
                                <Typography>- Consistente no estilo de liderança;</Typography>
                                <Typography>- Processo de comunicação de forma metódica;</Typography>

                                <Typography sx={{ marginTop: "10px", marginBottom: "5px", backgroundColor: "#1976d2", color: "#eee", borderRadius: "5px", padding: "5px" }} level="title-md">
                                    Sem flexibilidade, o líder paciente pode ser visto como:
                                </Typography>

                                <Typography>- Indeciso;</Typography>
                                <Typography>- Indireto em dar orientações;</Typography>
                                <Typography>- Recusa-se a abordar questões difíceis;</Typography>
                                <Typography>- Hesita em programar mudanças;</Typography>
                            </Stack>
                            : null}

                        {perfilSelecionado == "analítico" ?
                            <Stack>
                                <Typography>- É organizado e voltado para o processo;</Typography>
                                <Typography>- Tende a ser perfeccionista;</Typography>
                                <Typography>- É sistemático nos relacionamentos;</Typography>
                                <Typography>- Valoriza a verdade e a precisão;</Typography>
                                <Typography>- Exige um alto padrão de si mesmo e dos outros;</Typography>
                                <Typography>- Tem tendência a se preocupar;</Typography>
                                <Typography>- Quer saber todos os detalhes e fatos;</Typography>
                                <Typography>- Suas decisões são baseadas na lógica;</Typography>
                                <Typography>- Não expressa sua opnião, a menos que tenha certeza;</Typography>
                                <Typography>- É muito consciente e busca a qualidade;</Typography>
                                <Typography>- É racional e traça planos para resolver problemas;</Typography>

                                <Typography sx={{ marginTop: "10px", marginBottom: "5px", backgroundColor: "#1976d2", color: "#eee", borderRadius: "5px", padding: "5px" }} level="title-md">
                                    O que o analítico gosta de receber
                                </Typography>

                                <Typography>- Elogio na presença de pessoas que admira;</Typography>
                                <Typography>- Prêmio, placa ou taça;</Typography>
                                <Typography>- Agenda de couro;</Typography>
                                <Typography>- Livros importantes;</Typography>
                                <Typography>- Livros históricos ou relíquias de família;</Typography>
                                <Typography>- Local de trabalhar silencioso e isolado;</Typography>
                                <Typography>- Aprovação por sua competência;</Typography>
                                <Typography>- Palavras que podem elevar sua reputação;</Typography>
                                <Typography>- Papéis, cartões de gráficas gravados com seu nome;</Typography>
                                <Typography>- Programa de computador que aumenta a eficiência;</Typography>
                                <Typography>- Bilhete para orquestra sinfônica ou ópera;</Typography>
                                <Typography>- Poesia tradicional;</Typography>

                                <Typography sx={{ marginTop: "10px", marginBottom: "5px", backgroundColor: "#1976d2", color: "#eee", borderRadius: "5px", padding: "5px" }} level="title-md">
                                    Pontos fortes do perfil analítico
                                </Typography>

                                <Typography>- É objetivo e justo para com todos;</Typography>
                                <Typography>- Desenvolve processos lógicos;</Typography>
                                <Typography>- Detalhista quando lhe atribuem funções;</Typography>
                                <Typography>- Aplicação consistente e efetiva de normas;</Typography>
                                <Typography>- Capaz de manter confiança;</Typography>

                                <Typography sx={{ marginTop: "10px", marginBottom: "5px", backgroundColor: "#1976d2", color: "#eee", borderRadius: "5px", padding: "5px" }} level="title-md">
                                    Sem flexibilidade, o líder analítico pode ser visto como:
                                </Typography>

                                <Typography>- Demasiadamente perfeccionista;</Typography>
                                <Typography>- Difícil de cumprir suas normas;</Typography>
                                <Typography>- Prejudica a cratividade pelo desejo de manter as regras e normas;</Typography>
                            </Stack>
                            : null}

                    </Stack>

                </Sheet>
            </Modal>

        </Stack >
    )
}