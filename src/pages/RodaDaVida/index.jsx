import { useState, useEffect } from "react";

//Firebase
import { getDatabase, ref, set, onValue } from "firebase/database";

//Utils
import { obterDataAtual } from "../../utils/datas";

// Componentes
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";

// Icones
import { IoInformationCircleSharp } from "react-icons/io5";

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
    LinearProgress
} from "@mui/joy"

//MediaQuery
import useMediaQuery from '@mui/material/useMediaQuery';

export default function RodaDaVida() {

    const db = getDatabase();

    const mobile = useMediaQuery('(max-width:1200px)');
    const [perguntas, setPerguntas] = useState({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 });
    const [modalResultados, setModalResultados] = useState(false);
    const [nomeCompleto, setNomeCompleto] = useState("");
    const [analises, setAnalises] = useState([]);
    const [analiseSalva, setAnaliseSalva] = useState(false);

    useEffect(() => {
        obterRodaDaVida();
    }, [])

    const obterRodaDaVida = () => {
        const rodaDaVidaRef = ref(db, 'rodaDaVida/');
        onValue(rodaDaVidaRef, (snapshot) => {
            const data = snapshot.val();
            // console.log(data);
            setAnalises(data != null ? data : []);
        });
    }

    const calcularResultado = () => {

        if (!analiseSalva) {
            let analisesAtuais = analises;
            let indiceAnaliseAnterior = -1;
            analisesAtuais.forEach((analise, indice) => {
                if (analise.nome == nomeCompleto) {
                    indiceAnaliseAnterior = indice;
                }
            });
            if (indiceAnaliseAnterior >= 0) {
                console.log(perguntas);
                analisesAtuais[indiceAnaliseAnterior] = {
                    familiar: (perguntas[1]) * 10,
                    contribuicaoSocial: (perguntas[2]) * 10,
                    conjugal: (perguntas[3]) * 10,
                    espiritualidade: (perguntas[4]) * 10,
                    hobbies: (perguntas[5]) * 10,
                    recursosFinanceiros: (perguntas[6]) * 10,
                    saudeEDisposicao: (perguntas[7]) * 10,
                    equilibrioEmocional: (perguntas[8]) * 10,
                    desenvolvimentoIntelectual: (perguntas[9]) * 10,
                    nome: nomeCompleto,
                    data: obterDataAtual()
                }
            }
            else {
                analisesAtuais.push(
                    {
                        familiar: (perguntas[1]) * 10,
                        contribuicaoSocial: (perguntas[2]) * 10,
                        conjugal: (perguntas[3]) * 10,
                        espiritualidade: (perguntas[4]) * 10,
                        hobbies: (perguntas[5]) * 10,
                        recursosFinanceiros: (perguntas[6]) * 10,
                        saudeEDisposicao: (perguntas[7]) * 10,
                        equilibrioEmocional: (perguntas[8]) * 10,
                        desenvolvimentoIntelectual: (perguntas[9]) * 10,
                        nome: nomeCompleto,
                        data: obterDataAtual()
                    }
                );
            }

            //Salvando no banco de dados
            set(ref(db, 'rodaDaVida'), analisesAtuais);
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
                    Roda da Vida
                </Typography>

                <Stack flexDirection={mobile ? "column" : "row"} mt="40px">
                    <Stack width={mobile ? "100%" : "500px"}>
                        <Typography>Informe seu nome completo*</Typography>
                        <Input value={nomeCompleto} onChange={(event) => setNomeCompleto(event.target.value)} placeholder="Exemplo: João da Silva" />

                        <Typography level="title-md" sx={{ marginTop: "30px" }}>Avalie abaixo as áreas da sua vida atribuindo uma nota de 1 a 10:</Typography>
                        <Stack mt="20px">
                            <Typography level="title-md">Familiar</Typography>
                            <Typography level="body-sm">Há harmonia em seu lar? A divisão de tarefas é justa? O cumprimento dos papéis de cada membro da família é satisfatório?</Typography>
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
                                <Typography level="title-lg">{perguntas[1]}</Typography>
                            </Stack>
                        </Stack>
                        <Stack mt="20px">
                            <Typography level="title-md">Contribuição Social</Typography>
                            <Typography level="body-sm">Você tem a quem chamar para ir ao cinema no final de semana? Amigos jantam em sua casa ou vice-versa? Quando voce esta em apuros, tem para quem ligar? É convidado frequentemente para festas de aniversário e encontros sociais? Participa de algum clube, instituição, igreja ou organização social?</Typography>
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
                                <Typography level="title-lg">{perguntas[2]}</Typography>
                            </Stack>
                        </Stack>
                        <Stack mt="20px">
                            <Typography level="title-md">Conjugal</Typography>
                            <Typography level="body-sm">Você e seu cônjuge se completam? Sentem prazer em estar na companhia um do outro? Estão desenvolvendo projetos juntos, como viajar, construir uma casa nova, trocar de carro? Vocês se respeitam?</Typography>
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
                                <Typography level="title-lg">{perguntas[3]}</Typography>
                            </Stack>
                        </Stack>
                        <Stack mt="20px">
                            <Typography level="title-md">Espiritualidade</Typography>
                            <Typography level="body-sm">Você tem um tempo para seu desenvolvimento espiritual? Com que frequência ocupa-se com sua vida espiritual? Quais rotinas você pode mudar para melhorar sua espiritualidade?</Typography>
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
                                <Typography level="title-lg">{perguntas[4]}</Typography>
                            </Stack>
                        </Stack>
                        <Stack mt="20px">
                            <Typography level="title-md">Hobbies</Typography>
                            <Typography level="body-sm">Você tem um tempo individual de qualidade? Que hobby pratica que lhe dá prazer?</Typography>
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
                                <Typography level="title-lg">{perguntas[5]}</Typography>
                            </Stack>
                        </Stack>
                        <Stack mt="20px">
                            <Typography level="title-md">Recursos Financeiros</Typography>
                            <Typography level="body-sm">Você se sente feliz com a forma de lidar com seu dinheiro? Está conformado com a forma de gastar ou investir seus recursos?</Typography>
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
                                <Typography level="title-lg">{perguntas[6]}</Typography>
                            </Stack>
                        </Stack>
                        <Stack mt="20px">
                            <Typography level="title-md">Saúde e Disposição</Typography>
                            <Typography level="body-sm">Como você administra suas atividades esportivas? Você se alimenta corretamente? Você costuma ir ao médico para check-ups e exames periódicos?</Typography>
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
                                <Typography level="title-lg">{perguntas[7]}</Typography>
                            </Stack>
                        </Stack>
                        <Stack mt="20px">
                            <Typography level="title-md">Equilíbrio Emocional</Typography>
                            <Typography level="body-sm">Consegue se colocar no lugar dos outros? É uma pessoa que perdoa com facilidade? Tem facilidade em ver o melhor das coisas, não somente o lado negativo? Tem um sono reparador? Consegue governar suas preocupações? Sua razão fala mais alto do que sua emoção?</Typography>
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
                                <Typography level="title-lg">{perguntas[8]}</Typography>
                            </Stack>
                        </Stack>
                        <Stack mt="20px">
                            <Typography level="title-md">Desenvolvimento Intelectual</Typography>
                            <Typography level="body-sm">Você organiza sua vida para fazer cursos e reciclagem periodicamente? Você lê com frequência? Procura crescimento preventivo na vida intelectual ou só quando as coisas ficam difíceis? Relaciona-se com pessoas intelectualmente desenvolvidas que podem lhe ensinar algo?</Typography>
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
                                <Typography level="title-lg">{perguntas[9]}</Typography>
                            </Stack>
                        </Stack>
                        <Button disabled={nomeCompleto == ""} onClick={calcularResultado} sx={{ marginTop: "40px" }}>{analiseSalva ? "Ver Resultados" : "Calcular Resultado"}</Button>
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
                    <Stack mt="30px" spacing={2} sx={{ flex: 1, width: "100%" }}>
                        <Stack flexDirection={"row"} margin={0} padding={0} justifyContent={"space-between"}>
                            <Typography>Familiar</Typography>
                            <Typography fontWeight={"bold"}>{perguntas[1]}</Typography>
                        </Stack>
                        <LinearProgress determinate value={(perguntas[1]) * 10 || 0} sx={{ width: "100%" }} />
                        <Stack flexDirection={"row"} margin={0} padding={0} justifyContent={"space-between"}>
                            <Typography>Contribuição Social</Typography>
                            <Typography fontWeight={"bold"}>{perguntas[2]}</Typography>
                        </Stack>
                        <LinearProgress determinate value={(perguntas[2]) * 10 || 0} />
                        <Stack flexDirection={"row"} margin={0} padding={0} justifyContent={"space-between"}>
                            <Typography>Conjugal</Typography>
                            <Typography fontWeight={"bold"}>{perguntas[3]}</Typography>
                        </Stack>
                        <LinearProgress determinate value={(perguntas[3]) * 10 || 0} />
                        <Stack flexDirection={"row"} margin={0} padding={0} justifyContent={"space-between"}>
                            <Typography>Espiritualidade</Typography>
                            <Typography fontWeight={"bold"}>{perguntas[4]}</Typography>
                        </Stack>
                        <LinearProgress determinate value={(perguntas[4]) * 10 || 0} />
                        <Stack flexDirection={"row"} margin={0} padding={0} justifyContent={"space-between"}>
                            <Typography>Hobbies</Typography>
                            <Typography fontWeight={"bold"}>{perguntas[5]}</Typography>
                        </Stack>
                        <LinearProgress determinate value={(perguntas[5]) * 10 || 0} />
                        <Stack flexDirection={"row"} margin={0} padding={0} justifyContent={"space-between"}>
                            <Typography>Recursos Financeiros</Typography>
                            <Typography fontWeight={"bold"}>{perguntas[6]}</Typography>
                        </Stack>
                        <LinearProgress determinate value={(perguntas[6]) * 10 || 0} />
                        <Stack flexDirection={"row"} margin={0} padding={0} justifyContent={"space-between"}>
                            <Typography>Saúde e Disposição</Typography>
                            <Typography fontWeight={"bold"}>{perguntas[7]}</Typography>
                        </Stack>
                        <LinearProgress determinate value={(perguntas[7]) * 10 || 0} />
                        <Stack flexDirection={"row"} margin={0} padding={0} justifyContent={"space-between"}>
                            <Typography>Equilíbrio Emocional</Typography>
                            <Typography fontWeight={"bold"}>{perguntas[8]}</Typography>
                        </Stack>
                        <LinearProgress determinate value={(perguntas[8]) * 10 || 0} />
                        <Stack flexDirection={"row"} margin={0} padding={0} justifyContent={"space-between"}>
                            <Typography>Desenvolvimento Intelectual</Typography>
                            <Typography fontWeight={"bold"}>{perguntas[9]}</Typography>
                        </Stack>
                        <LinearProgress determinate value={(perguntas[9]) * 10 || 0} />
                    </Stack>
                </Sheet>
            </Modal>
        </Stack >
    )
}