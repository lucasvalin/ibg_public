import { useState, useEffect } from "react";

//Firebase
import { getDatabase, ref, set, onValue } from "firebase/database";

// Componentes
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";

// Icones
import { IoSchoolSharp } from "react-icons/io5";
import { FaBirthdayCake } from "react-icons/fa";

import "../../App.css";

// JoyUI
import {
    Stack,
    Typography,
    Button,
    Link,
    Input,
    Select,
    Option
} from "@mui/joy"

//MediaQuery
import useMediaQuery from '@mui/material/useMediaQuery';

//Utils
import { cultoAoVivo } from '../../utils/datas';

// Navegação
import { useNavigate } from "react-router-dom";

export default function Cultos() {

    const mobile = useMediaQuery('(max-width:1200px)');
    const db = getDatabase();
    const [cultos, setCultos] = useState([]);

    useEffect(() => {
        const cultosRef = ref(db, 'cultos/');
        onValue(cultosRef, (snapshot) => {
            const data = snapshot.val();
            setCultos(data == null ? [] : data);
        });
    }, []);

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
                <Typography level="h4" sx={{ marginBottom: "40px" }}>
                    Cultos
                </Typography>

                <Stack flexDirection={"row"} marginBottom={"40px"} alignItems="center" justifyContent={"flex-end"}>
                    <Button onClick={() => window.open("https://www.youtube.com/@batistagraca/videos")} color="neutral" sx={{ marginRight: "10px" }}>Reprises</Button>
                    <Button disabled={!cultoAoVivo()} onClick={() => window.open("https://www.youtube.com/c/Wolverine987Igrejabatistagraça/live")} color="danger">Ao Vivo</Button>
                    {/* <Button onclick={() => window.open("https://www.youtube.com/c/Wolverine987Igrejabatistagraça/live")} color="danger">Ao Vivo</Button> */}
                </Stack>

                <Stack>
                    {cultos.map(function (culto) {
                        return (
                            <Stack width={mobile ? "90%" : "300px"} padding="15px" borderRadius="5px" mb={"15px"} backgroundColor="#fff">
                                <Typography level="title-lg">
                                    {culto.titulo}
                                </Typography>
                                <Typography level="body-lg">
                                    {culto.diaDaSemana} as {culto.horario}
                                </Typography>
                            </Stack>
                        );
                    })}
                </Stack>
            </Stack>
        </Stack>
    )
}