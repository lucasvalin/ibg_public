import { useState } from "react";

// Componentes
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";

// JoyUI
import {
    Stack,
    Typography,
    Modal,
    ModalClose,
    Sheet
} from "@mui/joy"

//MediaQuery
import useMediaQuery from '@mui/material/useMediaQuery';

// Fotos
import imagemDefault from '../../assets/image.png';
import foto1 from '../../assets/foto1.jpg';
import foto2 from '../../assets/foto2.jpg';
import foto3 from '../../assets/foto3.jpg';
import foto4 from '../../assets/foto4.jpg';

export default function SobreNos() {

    const mobile = useMediaQuery('(max-width:1200px)');

    const [modalFoto, setModalFoto] = useState(false);
    const [imagemSelecionada, setImagemSelecionada] = useState("");

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
                    Sobre Nós
                </Typography>
                <Stack mt="20px" flexDirection={mobile ? "column" : "row"}>
                    <img height={mobile ? 250 : 200} src={foto1} />
                    <Stack ml={mobile ? "0px" : "20px"} mt={mobile ? "20px" : "0px"}>
                        <Typography level="body-md">Em meados de 1986, em Campo Grande, Cariacica/ES, nascia a "Igreja Batista". Fundada pelos pastores Elias Felix, na época com 36 anos e Helena Felix com 29, juntamente com seus filhos: Malcolm (11 anos), Mccoy (10 anos) e Raamá (4 anos). Anos depois, a igreja mudou-se para o bairro Santa Bárbara, em Cruzeiro do Sul, passando a chamar-se Igreja Assembléia de Deus. Em 1989, o Pr Elias Felix empossou um pastor local e mudou-se com a família para a Bahia, em razão de seu trabalho. Em 2007, 18 anos depois, movidos pelo desejo de dar continuidade ao chamado ministerial, os Prs Elias Felix, com 57 anos, Helena Felix (51), seus filhos: Malcolm(32), Mccoy(31), Raamá(25), Holssen(20) e seus respectivos cônjuges, além de alguns familiares, começaram a realizar cultos na varanda da casa dos Prs Elias e Helena, denominada "Comunidade Evangélica do Brasil", em 14/01/2007, vindo a ser chamada de Igreja do Avivamento Graça e Paz. Em 31/03/2012 o Pr Elias consagrou seu filho Malcolm(36) como pastor...</Typography>
                    </Stack>
                </Stack>
                <Stack mt="50px">
                    <Typography level="title-lg">
                        Fotos
                    </Typography>
                    <Stack flexDirection={"row"} overflow={mobile ? "auto" : "none"}>
                        <img onClick={() => [setImagemSelecionada(foto2), setModalFoto(true)]} height={150} src={foto2} style={mobile ? { marginRight: "20px" } : { marginRight: "50px" }} />
                        <img onClick={() => [setImagemSelecionada(foto3), setModalFoto(true)]} height={150} src={foto3} style={mobile ? { marginRight: "20px" } : { marginRight: "50px" }} />
                        <img onClick={() => [setImagemSelecionada(foto4), setModalFoto(true)]} height={150} src={foto4} style={mobile ? { marginRight: "20px" } : { marginRight: "50px" }} />
                        {/* <img onClick={() => [setImagemSelecionada(imagemDefault), setModalFoto(true)]} height={150} src={imagemDefault} /> */}
                    </Stack>
                </Stack>
                <Stack mt="50px">
                    <Typography level="title-lg">
                        Venha nos visitar
                    </Typography>
                    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3744.5474569515327!2d-40.27734672393066!3d-20.19455944660306!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xb81f239115bf61%3A0x168e1d766324066!2sIgreja%20Batista%20Gra%C3%A7a!5e0!3m2!1sen!2sbr!4v1693952539657!5m2!1sen!2sbr" width="100%" height="200" style={{ border: 0 }} loading="lazy"></iframe>
                </Stack>
            </Stack>

            <Modal
                aria-labelledby="modal-title"
                aria-describedby="modal-desc"
                open={modalFoto}
                onClose={() => setModalFoto(false)}
                sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: 0 }}
            >
                <Sheet
                    variant="outlined"
                    sx={{
                        maxWidth: mobile ? "90%" : 500,
                        borderRadius: 'md',
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
                    <img width={"100%"} src={imagemSelecionada} />
                </Sheet>
            </Modal>

        </Stack>
    )
}