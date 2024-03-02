import { useState, useEffect } from "react";

//Firebase
import { getDatabase, ref, set, onValue } from "firebase/database";

// Componentes
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";

// JoyUI
import {
    Stack,
    Typography,
    Select,
    Option,
    Button
} from "@mui/joy"

//Utils
import { formatarData, filtrarData } from '../../utils/datas';

//MediaQuery
import useMediaQuery from '@mui/material/useMediaQuery';

// Fotos
import imagemDefault from '../../assets/image.png';
import { toast } from "react-toastify";

const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
const mesAtual = meses[new Date().getMonth()];

let opcoesAno = [];
for (let i = 2023; i <= new Date().getFullYear() + 1; i++) {
    opcoesAno.push(i);
}

export default function Eventos() {

    const mobile = useMediaQuery('(max-width:1200px)');
    const db = getDatabase();

    const [eventos, setEventos] = useState([]);
    const [mes, setMes] = useState(mesAtual.toLowerCase());
    const [ano, setAno] = useState(new Date().getFullYear());

    useEffect(() => {
        obterEventos();
    }, [])

    const obterEventos = () => {
        toast.loading("Buscando eventos salvos...", { toastId: "toast" });
        const eventosRef = ref(db, 'eventos/');
        onValue(eventosRef, (snapshot) => {
            const data = snapshot.val();
            let dadosFiltrados = [];
            if (data != null) {
                data.forEach(evento => {
                    if (filtrarData(meses.indexOf(capitalizeFirstLetter(mes)), ano, evento.data)) {
                        dadosFiltrados.push(evento);
                    }
                });
            }
            setEventos(dadosFiltrados);
            toast.dismiss();
        });
    }

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    }

    const CardEvento = (props) => {
        return (
            <Stack boxShadow={"md"} width={mobile ? "100%" : "400px"} backgroundColor="#fff" borderRadius={"10px"} mb="50px" mr={mobile ? "0px" : "50px"}>
                <Stack flex={1}>
                    <img src={props.imagem ? props.imagem : imagemDefault} width="100%" height={mobile ? "250px" : "300px"} style={{ borderTopLeftRadius: "10px", borderTopRightRadius: "10px" }} />
                </Stack>
                <Stack padding={"15px"}>
                    <Typography sx={{ color: "#777" }}>Data: <Typography sx={{ color: "#222", fontWeight: 500 }}>{props.data}</Typography></Typography>
                    <Typography sx={{ color: "#777" }}>Hora: <Typography sx={{ color: "#222", fontWeight: 500 }}>{props.hora}</Typography></Typography>
                    <Typography sx={{ color: "#777" }}>Local: <Typography sx={{ color: "#222", fontWeight: 500 }}>{props.local}</Typography></Typography>
                    <Typography sx={{ color: "#777" }}>Descrição: <Typography sx={{ color: "#222", fontWeight: 500 }}>{props.descricao}</Typography></Typography>
                </Stack>
            </Stack>
        )
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
                    Eventos
                </Typography>
                <Stack flexDirection={mobile ? "column" : "row"} justifyContent="flex-end" mt={mobile ? "30px" : "0px"}>
                    <Stack flexDirection={"row"} alignItems="center" mb={mobile ? "20px" : "0px"}>
                        <Stack width={mobile ? "50%" : null} flexDirection={mobile ? "column" : "row"} alignItems={mobile ? "flex-start" : "center"}>
                            <Typography>Mês</Typography>
                            <Select value={mes} onChange={(event, newValue) => newValue != null ? setMes(newValue) : null} sx={mobile ? { ml: "0px", width: "100%" } : { ml: "10px" }}>
                                {meses.map(function (mes) {
                                    return (
                                        <Option value={mes.toLowerCase()}>{mes}</Option>
                                    )
                                })}
                            </Select>
                        </Stack>
                        <Stack width={mobile ? "50%" : null} flexDirection={mobile ? "column" : "row"} alignItems={mobile ? "flex-start" : "center"} ml="20px">
                            <Typography>Ano</Typography>
                            <Select value={ano} onChange={(event, newValue) => setAno(newValue)} sx={mobile ? { ml: "0px", width: "100%" } : { ml: "10px" }}>
                                {opcoesAno.map(function (ano) {
                                    return (
                                        <Option value={ano}>{ano}</Option>
                                    )
                                })}
                            </Select>
                        </Stack>
                    </Stack>
                    <Button onClick={obterEventos} sx={mobile ? {} : { marginLeft: "30px" }}>Filtrar</Button>
                </Stack>
                <Stack mt="50px" flexDirection={"row"} flexWrap="wrap">
                    {eventos.map(function (evento) {
                        return (
                            <CardEvento
                                data={formatarData(evento.data)}
                                hora={evento.hora}
                                local={evento.local}
                                descricao={evento.descricao}
                                imagem={evento.imagem}
                            />
                        );
                    })}
                </Stack>

            </Stack>
        </Stack>
    )
}