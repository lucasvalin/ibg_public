// Componentes
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";

import "../../App.css";

// JoyUI
import {
    Stack,
    Typography,
} from "@mui/joy"

//MediaQuery
import useMediaQuery from '@mui/material/useMediaQuery';

export default function Biblia() {

    const mobile = useMediaQuery('(max-width:1200px)');

    return (
        <Stack backgroundColor="#f5f5f5" height="100%" minHeight={"100vh"}>
            <Header mobile={mobile} />
            <Sidebar mobile={mobile} />
            <Stack
                ml={mobile ? "0px" : "250px"}
                mt="50px"
                flex={1}
                height={"calc(100% - 55px)"}
                // p={mobile ? "20px" : "50px"}
                overflow="auto"
            >
                {/* Conteúdo da tela */}
                <iframe name="bibliaonline" frameborder="0" src="https://biblia.novageracao.org/nvi/AT_Gn" width="100%" style={{flex: 1}}></iframe>
            </Stack>
        </Stack>
    )
}