import { useState, useEffect } from "react";

// Componentes
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";

// Telas
import LoginAdmin from '../LoginAdmin';
import Membros from "../MembrosAdmin";
import Escalas from "../EscalasAdmin";
import Eventos from "../EventosAdmin";
import Reunioes from "../ReunioesAdmin";
import Treinamentos from "../TreinamentosAdmin";
import Cultos from "../CultosAdmin";
import Consolidacao from "../Consolidacao";
import Exportacoes from "../ExportacoesAdmin";

import "../../App.css";

// JoyUI
import {
    Stack,
    Typography,
    ToggleButtonGroup,
    Button,
    Select,
    Option
} from "@mui/joy"

//MediaQuery
import useMediaQuery from '@mui/material/useMediaQuery';

// Navegação
import { useNavigate } from "react-router-dom";

export default function Administracao() {

    const mobile = useMediaQuery('(max-width:1200px)');
    const navigate = useNavigate();
    const [telaAtual, setTelaAtual] = useState(atob(sessionStorage.getItem("token_autenticacao")) == "autenticado" ? 'membros' : 'login');
    const [autenticado, setAutenticado] = useState(atob(sessionStorage.getItem("token_autenticacao")) == "autenticado");

    return (
        <Stack backgroundColor="#f5f5f5" height="100%" maxWidth="100%" minHeight={"100vh"} overflow={"hidden"}>
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
                    Administração
                </Typography>

                {telaAtual != "login" && !mobile ?
                    <ToggleButtonGroup
                        value={telaAtual}
                        sx={{ marginTop: "40px" }}
                        onChange={(event, newValue) => {
                            newValue != null ? setTelaAtual(newValue) : setTelaAtual(telaAtual);
                        }}
                    >
                        <Button value="membros">Membros</Button>
                        <Button value="escalas">Escalas</Button>
                        <Button value="eventos">Eventos</Button>
                        <Button value="reunioes">Reuniões</Button>
                        <Button value="treinamentos">Treinamentos</Button>
                        <Button value="cultos">Cultos</Button>
                        <Button value="consolidacao">Consolidação</Button>
                        <Button value="exportar">Exportar</Button>
                    </ToggleButtonGroup>
                    : null
                }

                {telaAtual != "login" && mobile ?
                    <Stack sx={{ marginTop: "20px" }}>
                        <Typography>Aba selecionada</Typography>
                        <Select variant="solid" defaultValue="membros" onChange={(event, newValue) => {
                            newValue != null ? setTelaAtual(newValue) : setTelaAtual(telaAtual);
                        }}>
                            <Option value="membros">Membros</Option>
                            <Option value="escalas">Escalas</Option>
                            <Option value="eventos">Eventos</Option>
                            <Option value="reunioes">Reuniões</Option>
                            <Option value="treinamentos">Treinamentos</Option>
                            <Option value="cultos">Cultos</Option>
                            <Option value="consolidacao">Consolidações</Option>
                            <Option value="exportar">Exportar</Option>
                        </Select>
                    </Stack>
                    : null
                }

                {telaAtual == "login" ? <LoginAdmin setTelaAtual={setTelaAtual} /> : null}
                {telaAtual == "membros" ? <Membros /> : null}
                {telaAtual == "escalas" ? <Escalas /> : null}
                {telaAtual == "eventos" ? <Eventos /> : null}
                {telaAtual == "reunioes" ? <Reunioes /> : null}
                {telaAtual == "treinamentos" ? <Treinamentos /> : null}
                {telaAtual == "cultos" ? <Cultos /> : null}
                {telaAtual == "consolidacao" ? <Consolidacao /> : null}
                {telaAtual == "exportar" ? <Exportacoes /> : null}
            </Stack>
        </Stack>
    )
}