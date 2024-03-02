import { useState, useEffect } from "react";

//Firebase
import { getDatabase, ref, set, onValue } from "firebase/database";

// Componentes
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";

// Icones
import { IoSchoolSharp } from "react-icons/io5";

import "../../App.css";

// JoyUI
import {
    Stack,
    Typography,
    Button,
    Link
} from "@mui/joy"

//MediaQuery
import useMediaQuery from '@mui/material/useMediaQuery';

// Navegação
import { useNavigate } from "react-router-dom";

const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
const mesAtual = meses[new Date().getMonth()];

let opcoesAno = [];
for (let i = 2023; i <= new Date().getFullYear(); i++) {
    opcoesAno.push(i);
}

export default function Treinamentos() {

    const mobile = useMediaQuery('(max-width:1200px)');
    const navigate = useNavigate();
    const db = getDatabase();

    const [treinamentos, setTreinamentos] = useState([]);

    useEffect(() => {
        obterTreinamentos();
    }, [])

    const obterTreinamentos = () => {
        const treinamentosRef = ref(db, 'treinamentos/');
        onValue(treinamentosRef, (snapshot) => {
            const data = snapshot.val();
            setTreinamentos(data != null ? data : []);
        });
    }

    const CardQuestionario = (props) => {
        return (
            <Stack minWidth={mobile ? "250px" : "300px"} maxWidth={mobile ? "250px" : "300px"} bgcolor={"#fff"} mr={mobile ? "20px" : "30px"} sx={{ borderTopLeftRadius: "10px", borderTopRightRadius: "10px" }}>
                <Stack sx={{ borderBottom: "1px solid #ddd" }}>
                    <Typography padding="10px" sx={{ fontWeight: "bold" }}>{props.titulo}</Typography>
                </Stack>
                <Stack flex={1}>
                    <Typography padding="20px 10px" flex={1}>
                        {props.descricao}
                    </Typography>
                </Stack>
                <Button onClick={props.destino} sx={{ borderRadius: 0, borderBottomLeftRadius: "10px", borderBottomRightRadius: "10px" }}>
                    Iniciar
                </Button>

            </Stack>
        )
    }

    const Treinamento = (props) => {
        return (
            <Stack mb="10px" alignSelf={"flex-start"} flexDirection={"row"} alignItems={"center"} className="hover" onClick={() => window.open(props.link)} sx={{ borderBottom: "1px solid #ddd", paddingBottom: "5px" }}>
                <IoSchoolSharp fontSize={24} color="#f44336" style={{ marginRight: "10px" }} />
                <Typography>
                    {props.descricao}
                </Typography>
            </Stack>
        );
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
                    Treinamentos
                </Typography>

                <Stack mt="40px">
                    <Typography level="title-md">
                        Questionários
                    </Typography>
                    <Stack flexDirection={"row"} mt="20px" overflow={"auto"}>
                        <CardQuestionario titulo="Temperamento" destino={() => navigate("/temperamentos")} descricao="Realize um análise no seu temperamento e descubra em qual perfil voce se encaixa, quais pontos fortes e fracos e muito mais." />
                        <CardQuestionario titulo="Jogo da Vida" destino={() => navigate("/rodaDaVida")} descricao="Faça uma análise respondendo algumas perguntas e descubra como esta a sua vida" />
                    </Stack>
                </Stack>

                <Stack mt="40px">
                    <Typography level="title-md">
                        Cursos e Palestras
                    </Typography>
                    <Stack mt="20px">
                        {treinamentos.map(function (treinamento) {
                            return (
                                <Treinamento descricao={treinamento.titulo} link={treinamento.link} />
                            );
                        })}
                        {treinamentos.length == 0 ?
                            <Typography level="body-sm">
                                Nenhum curso ou palestra cadastrado
                            </Typography>
                            : null
                        }
                    </Stack>
                </Stack>
            </Stack>
        </Stack>
    )
}