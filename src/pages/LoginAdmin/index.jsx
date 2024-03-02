import { useState, useEffect } from "react";

//Firebase
import { getDatabase, ref, set, onValue } from "firebase/database";

import "../../App.css";

// JoyUI
import {
    Stack,
    Typography,
    Button,
    Input,
} from "@mui/joy"

//MediaQuery
import useMediaQuery from '@mui/material/useMediaQuery';

// Navegação
import { useNavigate } from "react-router-dom";

export default function LoginAdmin(props) {



    const mobile = useMediaQuery('(max-width:1200px)');
    const db = getDatabase();

    const [login, setLogin] = useState({});
    const [usuario, setUsuario] = useState("");
    const [senha, setSenha] = useState("");
    const [credenciaisIncorretas, setCredenciaisIncorretas] = useState(false);

    useEffect(() => {
        const cultosRef = ref(db, 'login/');
        onValue(cultosRef, (snapshot) => {
            const data = snapshot.val();
            setLogin(data);
        });
    }, []);

    const realizarLogin = () => {

        if ((usuario == login.usuario) && (senha == login.senha)) {
            sessionStorage.setItem('token_autenticacao', btoa("autenticado"));
            setCredenciaisIncorretas(false);
            props.setTelaAtual("membros");
        }
        else {
            setCredenciaisIncorretas(true);
        }
    }

    return (
        <Stack flex={1} alignItems="center" justifyContent="center">
            <Stack backgroundColor={mobile ? "" : "#fff"} mb="100px" borderRadius={"10px"} padding="50px" width={mobile ? "80%" : "300px"}>
                <Stack>
                    <Typography sx={{ marginBottom: "5px" }}>Usuário</Typography>
                    <Input value={usuario} onChange={(event) => setUsuario(event.target.value)} placeholder="usuário" />
                </Stack>
                <Stack mt={"20px"}>
                    <Typography sx={{ marginBottom: "5px" }}>Senha</Typography>
                    <Input value={senha} onChange={(event) => setSenha(event.target.value)} type="password" placeholder="senha" />
                </Stack>
                {credenciaisIncorretas ?
                    <Typography sx={{ color: "red" }}>Usuário ou Senha incorretos</Typography>
                    : null
                }
                <Button onClick={() => realizarLogin()} sx={{ marginTop: "30px" }} color="neutral">Entrar</Button>
            </Stack>
        </Stack>
    )
}