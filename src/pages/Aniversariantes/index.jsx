import { useState, useEffect } from "react";

// Componentes
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";

//Firebase
import { getDatabase, ref, set, onValue } from "firebase/database";

// Icones
import { FaBirthdayCake } from "react-icons/fa";

import "../../App.css";

// JoyUI
import {
    Stack,
    Typography,
    Button,
    Select,
    Option
} from "@mui/joy"

//Utils
import { formatarData, filtrarData } from '../../utils/datas';

//MediaQuery
import useMediaQuery from '@mui/material/useMediaQuery';

const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
const mesAtual = meses[new Date().getMonth()];

let opcoesAno = [];
for (let i = 2023; i <= new Date().getFullYear(); i++) {
    opcoesAno.push(i);
}

export default function Aniversariantes() {

    const mobile = useMediaQuery('(max-width:1200px)');
    const db = getDatabase();

    const [mes, setMes] = useState(mesAtual.toLowerCase());
    const [aniversariantes, setAniversariantes] = useState([]);

    useEffect(() => {
        buscarAniversariantes();
    }, []);

    const buscarAniversariantes = () => {
        const aniversariantesRef = ref(db, 'membros/');
        onValue(aniversariantesRef, (snapshot) => {
            const data = snapshot.val();
            let listaAniversariantes = [];
            data.forEach(membro => {
                let numMes = (meses.indexOf(capitalizeFirstLetter(mes)) + 1);
                numMes = numMes.toString().padStart(2, '0');
                if (membro.dataDeNascimento) {
                    if (membro.dataDeNascimento.split("-")[1] == numMes) {
                        listaAniversariantes.push(
                            {
                                nome: membro.nome,
                                data: formatarData(membro.dataDeNascimento).split("/")[0] + "/" + formatarData(membro.dataDeNascimento).split("/")[1]
                            }
                        )
                    }
                }
            });
            setAniversariantes(listaAniversariantes);
        });
    }

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
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
                    Aniversariantes
                </Typography>

                <Stack>
                    <Stack flexDirection={"row"} justifyContent={'flex-end'} alignItems={"flex-end"}>
                        <Stack>
                            <Typography>Mês</Typography>
                            <Select value={mes} onChange={(event, newValue) => setMes(newValue)} defaultValue={mesAtual.toLowerCase()}>
                                {meses.map(function (mes) {
                                    return (
                                        <Option value={mes.toLowerCase()}>{mes}</Option>
                                    )
                                })}
                            </Select>
                        </Stack>
                        <Button onClick={buscarAniversariantes} sx={{ marginLeft: "15px" }}>Filtrar</Button>
                    </Stack>
                    <Stack mt={mobile ? "50px" : "30px"}>
                        {aniversariantes.map(function (aniversariante) {
                            return (
                                <Stack mb="10px" width={mobile ? "100%" : "400px"} flexDirection={"row"} alignItems={"center"} sx={{ borderBottom: "1px solid #ddd", paddingBottom: "5px" }}>
                                    <FaBirthdayCake color="#1976d2" size={28} style={{ marginRight: "10px" }} />
                                    <Stack>
                                        <Typography level="title-md">
                                            {aniversariante.nome}
                                        </Typography>
                                        <Typography level="body-md">
                                            {aniversariante.data}
                                        </Typography>
                                    </Stack>
                                </Stack>
                            );
                        })}
                    </Stack>
                </Stack>
            </Stack>
        </Stack>
    )
}