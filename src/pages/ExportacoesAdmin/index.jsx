import { useState, useEffect, useRef } from "react";

import "../../App.css";

import { toPng } from 'html-to-image';

//Firebase
import database from '../../services/Firebase';
import { getDatabase, ref, set, onValue } from "firebase/database";

//Icones
import { IoCalendar, IoTime, IoBookmark, IoLocationSharp, IoPerson } from "react-icons/io5";
import { BiSolidChurch } from "react-icons/bi";


// JoyUI
import { Stack, Typography, Box, Checkbox, Button, Input, Select, Option } from "@mui/joy"

import { IoWarning } from "react-icons/io5";

//Utils
import { formatarData, getDate } from '../../utils/datas';

import Resizer from 'react-image-file-resizer';

//MediaQuery
import useMediaQuery from '@mui/material/useMediaQuery';
import { toast } from "react-toastify";

export default function ExportacoesAdmin() {

    const db = getDatabase();

    const containerRef = useRef(null);

    const mobile = useMediaQuery('(max-width:1200px)');

    const [datas, setDatas] = useState({ inicial: "", final: "" });
    const [opcoes, setOpcoes] = useState({ eventos: false, reunioes: false, escalas: false });
    const [eventos, setEventos] = useState([]);
    const [reunioes, setReunioes] = useState([]);
    const [escalas, setEscalas] = useState([]);
    const [categoriasEscalas, setCategoriasEscalas] = useState([]);
    const [categoriaSelecionada, setCategoriaSelecionada] = useState("");
    const [conteudoImagem, setConteudoImagem] = useState({ eventos: [], reunioes: [], escalas: [] });
    const [exibirImagem, setExibirImagem] = useState(false);
    const [imagemParaCompartilhar, setImagemParaCompartilhar] = useState(false);
    const [imagemGerada, setImagemGerada] = useState('');

    useEffect(() => {
        toast.loading("Buscando informações salvas...", { toastId: "toast" });

        const eventosRef = ref(db, 'eventos/');
        onValue(eventosRef, (snapshot) => {
            const data = snapshot.val();
            setEventos(data != null ? data : []);
        });

        const reunioesRef = ref(db, 'reunioes/');
        onValue(reunioesRef, (snapshot) => {
            const data = snapshot.val();
            setReunioes(data != null ? data : []);
        });

        const escalasRef = ref(db, 'escalas/');
        onValue(escalasRef, (snapshot) => {
            const data = snapshot.val();
            setEscalas(data != null ? data : []);
        });

        const categoriasEscalasRef = ref(db, 'categorias/');
        onValue(categoriasEscalasRef, (snapshot) => {
            const data = snapshot.val();
            setCategoriasEscalas(data != null ? data : []);
        });

        toast.dismiss();

        setDatas(prevState => ({ ...prevState, inicial: getDate() }));
        setDatas(prevState => ({ ...prevState, final: obterDataComUmMesAdicionado() }));

    }, []);

    function obterDataComUmMesAdicionado() {
        const dataAtual = new Date();
        dataAtual.setMonth(dataAtual.getMonth() + 1);

        const ano = dataAtual.getFullYear();
        const mes = String(dataAtual.getMonth() + 1).padStart(2, '0');
        const dia = String(dataAtual.getDate()).padStart(2, '0');

        const dataFormatada = `${ano}-${mes}-${dia}`;
        return dataFormatada;
    }

    const gerarImagem = () => {

        setImagemParaCompartilhar(false);

        let eventosFiltrados = [];
        let reunioesFiltradas = [];
        let escalasFiltradas = [];

        if (opcoes.eventos) {
            eventos.forEach(evento => {
                if (dataEstaEntre(evento.data, datas.inicial, datas.final)) {
                    eventosFiltrados.push(evento);
                }
            });
        }

        if (opcoes.reunioes) {
            reunioes.forEach(reuniao => {
                if (dataEstaEntre(reuniao.data, datas.inicial, datas.final)) {
                    reunioesFiltradas.push(reuniao);
                }
            });
        }

        if (opcoes.escalas) {
            escalas[categoriaSelecionada].forEach(escala => {
                if (dataEstaEntre(escala.dataEHora.split(' as ')[0], datas.inicial, datas.final)) {
                    escalasFiltradas.push(escala);
                }
            });
        }

        //Ordenando eventos por data
        eventosFiltrados.sort((a, b) => {
            const dataA = a.data;
            const dataB = b.data;

            if (dataA < dataB) {
                return -1;
            }
            if (dataA > dataB) {
                return 1;
            }
            return 0;
        });

        //Ordenando eventos por data
        eventosFiltrados.sort((a, b) => {
            const dataA = a.data;
            const dataB = b.data;

            if (dataA < dataB) {
                return -1;
            }
            if (dataA > dataB) {
                return 1;
            }
            return 0;
        });

        //Ordenando escalas por data e hora crescente
        escalasFiltradas.sort((a, b) => {
            const dataHoraA = new Date(a.dataEHora.split(' as ')[0]);
            const horaA = a.dataEHora.split(' as ')[1];

            const dataHoraB = new Date(b.dataEHora.split(' as ')[0]);
            const horaB = b.dataEHora.split(' as ')[1];

            if (dataHoraA.getTime() === dataHoraB.getTime()) {
                // Se as datas forem iguais, comparar com base na hora
                return horaA.localeCompare(horaB);
            } else {
                return dataHoraA - dataHoraB;
            }
        });

        console.log(reunioesFiltradas);

        setConteudoImagem(prevState => ({ ...prevState, eventos: eventosFiltrados }));
        setConteudoImagem(prevState => ({ ...prevState, reunioes: reunioesFiltradas }));
        setConteudoImagem(prevState => ({ ...prevState, escalas: escalasFiltradas }));

        setExibirImagem(true);
        setTimeout(() => {
            capturarImagem();
        }, 50);

    }

    const dataEstaEntre = (dataVerificar, dataInicial, dataFinal) => {
        const dataVerificarObj = new Date(dataVerificar);
        const dataInicialObj = new Date(dataInicial);
        const dataFinalObj = new Date(dataFinal);

        return dataVerificarObj >= dataInicialObj && dataVerificarObj <= dataFinalObj;
    }

    const capturarImagem = () => {
        if (containerRef.current) {
            setTimeout(() => {
                toPng(containerRef.current)
                    .then(function (dataUrl) {
                        // Capturar a imagem foi bem-sucedido
                        const img = new Image();
                        img.src = dataUrl;
                        setImagemGerada(img.src);
                        setExibirImagem(false);
                        setImagemParaCompartilhar(true);

                    })
                    .catch(function (err) {
                        setExibirImagem(false);
                        alert("Ocorreu um erro")
                        console.log(err);
                    });
            }, 500);
        }
    };

    const compararDatas = (a, b) => {
        const dataA = a.data;
        const dataB = b.data;

        if (dataA < dataB) {
            return -1;
        }
        if (dataA > dataB) {
            return 1;
        }
        return 0;
    }

    return (
        <Stack flex={1}>
            <Stack width={mobile ? "100%" : "auto"} mt="30px" alignSelf={"flex-start"}>
                <Typography level="title-lg">O que deseja exportar?</Typography>
                <Box mt="20px" alignItems={"center"} mb="20px" sx={{ display: 'flex', gap: 3, flexWrap: "wrap" }}>
                    <Checkbox checked={opcoes.eventos} onChange={(e) => setOpcoes(prevState => ({ ...prevState, eventos: e.target.checked }))} label="Eventos" />
                    <Checkbox checked={opcoes.reunioes} onChange={(e) => setOpcoes(prevState => ({ ...prevState, reunioes: e.target.checked }))} label="Reuniões" />
                    <Checkbox checked={opcoes.escalas} onChange={(e) => setOpcoes(prevState => ({ ...prevState, escalas: e.target.checked }))} label="Escalas" />
                    <Select disabled={!opcoes.escalas} value={categoriaSelecionada} onChange={(e, newValue) => setCategoriaSelecionada(newValue)} placeholder="Categoria da escala" sx={mobile ? { width: "100%" } : { width: "150px" }}>
                        {categoriasEscalas.map((categoria, indice) => {
                            return (
                                <Option value={categoria}>{categoria}</Option>
                            );
                        })}
                    </Select>
                </Box>
                <Stack width={mobile ? "100%" : "auto"} flexDirection="row" justifyContent={"space-between"} alignItems="center" mb="40px">
                    <Stack sx={{ marginRight: "20px", width: "47%" }}>
                        <Typography>Data Inicial</Typography>
                        <Input value={datas.inicial} onChange={(e) => setDatas(prevState => ({ ...prevState, inicial: e.target.value }))} type="date" />
                    </Stack>
                    <Stack sx={{ width: "47%" }}>
                        <Typography>Data Final</Typography>
                        <Input value={datas.final} onChange={(e) => setDatas(prevState => ({ ...prevState, final: e.target.value }))} type="date" />
                    </Stack>
                </Stack>
                <Button disabled={!opcoes.eventos && !opcoes.reunioes && (!(opcoes.escalas && categoriaSelecionada))} onClick={gerarImagem} color="success" sx={{ marginBottom: "50px" }}>Gerar Imagem</Button>
            </Stack>
            {exibirImagem ?
                <Stack ref={containerRef} width={mobile ? "80%" : "420px"} padding="30px" bgcolor={"#333"} alignSelf={"flex-start"}>
                    {conteudoImagem.eventos.length > 0 ?
                        <Typography sx={{ color: "#eee", fontSize: 20, marginBottom: "10px", backgroundColor: "#555", padding: "5px 10px", borderRadius: "5px" }}>Eventos:</Typography>
                        : null
                    }
                    {conteudoImagem.eventos.map((evento, indice) => {
                        console.log(evento);
                        return (
                            <Stack mb="20px" borderBottom="1px solid #888" paddingBottom={"5px"}>
                                <Stack flexDirection={"row"} alignItems={"center"}>
                                    <IoBookmark color="#eee" fontSize={18} />
                                    <Typography sx={{ color: "#eee", marginLeft: "5px", fontSize: 18 }}>{evento.descricao}</Typography>
                                </Stack>
                                <Stack flexDirection={"row"} alignItems={"center"}>
                                    <IoCalendar color="#eee" fontSize={18} />
                                    <Typography sx={{ color: "#eee", marginLeft: "5px" }}>{formatarData(evento.data)}</Typography>
                                </Stack>
                                <Stack flexDirection={"row"} alignItems={"center"}>
                                    <IoTime color="#eee" fontSize={18} />
                                    <Typography sx={{ color: "#eee", marginLeft: "5px" }}>{evento.hora}</Typography>
                                </Stack>
                            </Stack>
                        );
                    })}

                    {conteudoImagem.reunioes.length > 0 ?
                        <Typography sx={{ color: "#eee", fontSize: 20, marginBottom: "10px", backgroundColor: "#555", padding: "5px 10px", borderRadius: "5px" }}>Reuniões:</Typography>
                        : null
                    }
                    {conteudoImagem.reunioes.map((reuniao, indice) => {
                        console.log(reuniao);
                        return (
                            <Stack mb="20px" borderBottom="1px solid #888" paddingBottom={"5px"}>
                                <Stack flexDirection={"row"} alignItems={"center"}>
                                    <IoBookmark color="#eee" fontSize={18} />
                                    <Typography sx={{ color: "#eee", marginLeft: "5px", fontSize: 18 }}>{reuniao.descricao}</Typography>
                                </Stack>
                                <Stack flexDirection={"row"} alignItems={"center"}>
                                    <IoCalendar color="#eee" fontSize={18} />
                                    <Typography sx={{ color: "#eee", marginLeft: "5px" }}>{formatarData(reuniao.data)}</Typography>
                                </Stack>
                                <Stack flexDirection={"row"} alignItems={"center"}>
                                    <IoTime color="#eee" fontSize={18} />
                                    <Typography sx={{ color: "#eee", marginLeft: "5px" }}>{reuniao.hora}</Typography>
                                </Stack>
                                <Stack flexDirection={"row"} alignItems={"center"}>
                                    <IoLocationSharp color="#eee" fontSize={18} />
                                    <Typography sx={{ color: "#eee", marginLeft: "5px" }}>{reuniao.local}</Typography>
                                </Stack>
                            </Stack>
                        );
                    })}

                    {conteudoImagem.escalas.length > 0 ?
                        <Stack>
                            <Typography sx={{ color: "#eee", fontSize: 20, marginBottom: "10px", backgroundColor: "#555", padding: "5px 10px", borderRadius: "5px" }}>Escalas:</Typography>
                            <Typography sx={{ color: "#eee", fontSize: 20, textDecoration: "underline", marginBottom: "10px" }}>{categoriaSelecionada}</Typography>
                        </Stack>
                        : null
                    }
                    {conteudoImagem.escalas.map((escala, indice) => {
                        return (
                            <Stack mb="20px" borderBottom="1px solid #888" paddingBottom={"5px"}>
                                <Stack flexDirection={"row"} alignItems={"center"}>
                                    <BiSolidChurch color="#eee" fontSize={18} />
                                    <Typography sx={{ color: "#eee", marginLeft: "5px", fontSize: 18 }}>{escala.titulo}</Typography>
                                </Stack>
                                <Stack flexDirection={"row"} alignItems={"center"}>
                                    <IoCalendar color="#eee" fontSize={18} />
                                    <Typography sx={{ color: "#eee", marginLeft: "5px" }}>{formatarData(escala.dataEHora.split(" as ")[0]) + " as " + escala.dataEHora.split(" as ")[1]}</Typography>
                                </Stack>
                                <Stack flexDirection={"row"} alignItems={"center"}>
                                    <IoPerson color="#eee" fontSize={18} />
                                    <Typography sx={{ color: "#eee", marginLeft: "5px" }}>{escala.membro}</Typography>
                                </Stack>
                            </Stack>
                        );
                    })}

                </Stack>
                : null
            }

            {imagemParaCompartilhar && ((conteudoImagem.eventos.length > 0) || (conteudoImagem.escalas.length > 0) || (conteudoImagem.reunioes.length > 0)) ?
                <Stack width={mobile ? "100%" : "480px"}>
                    <img src={imagemGerada} />
                </Stack>
                : null
            }
        </Stack>
    )
}