import { useState } from "react";

//Icones
import { FaChurch, FaCalendarDay, FaBirthdayCake, FaBible } from "react-icons/fa";
import { IoChevronForwardSharp, IoMenuSharp, IoCloseOutline, IoSchoolSharp, IoCalendar, IoSettingsSharp } from "react-icons/io5";

//Roteamento
import { Link, useLocation, useNavigate } from "react-router-dom";

import {
    Stack,
    List,
    ListItem,
    ListItemButton,
    ListItemDecorator,
    ListItemContent,
    Button,
    Typography,
    FormHelperText
} from '@mui/joy';

import logomarca from "../../assets/logo.jpeg";
import logoOficial from '../../assets/logoOficial.png';

import SwipeableDrawer from '@mui/material/SwipeableDrawer';

export default function Sidebar(props) {

    const { pathname } = useLocation();
    const navigate = useNavigate();

    const [drawer, setDrawer] = useState(false);
    const [sidebar, setSidebar] = useState(false);

    return (
        <Stack position="fixed" zIndex={2} top={60} left={10}>
            <Stack position={"relative"} top={-55}>
                <Button variant="plain" onClick={() => /*setDrawer(!drawer)*/ setSidebar(true)}>
                    <IoMenuSharp size={28} color="#ddd" />
                </Button>
            </Stack>
            <Stack position="fixed" zIndex={2} top={0} left={(props.mobile && !drawer) ? -260 : 0} height="100%" borderRight={1} borderColor={"#eee"} overflow="auto" width={"250px"} backgroundColor="#fff"  >
                <Stack display="flex" flexDirection="column" my={1} pb={2} alignItems={"center"} justifyContent={"center"} borderBottom={1} borderColor={"#ddd"}>
                    <img src={logoOficial} width="80%" style={{ borderRadius: "10px" }} />
                </Stack>
                <Stack flex={1}>
                    <List>
                        <Link to={"/sobreNos"} onClick={() => setDrawer(false)} style={{ textDecoration: "none" }}>
                            <ListItem>
                                <ListItemButton selected={pathname == "/sobreNos" || pathname == "/"}>
                                    <ListItemDecorator><FaChurch color="#444" fontSize={20} /></ListItemDecorator>
                                    <ListItemContent sx={{ fontSize: 16, userSelect: "none" }}>SOBRE NÓS</ListItemContent>
                                    <IoChevronForwardSharp />
                                </ListItemButton>
                            </ListItem>
                        </Link>

                        <Link to={"/eventos"} onClick={() => setDrawer(false)} style={{ textDecoration: "none" }}>
                            <ListItem>
                                <ListItemButton selected={pathname == "/eventos"}>
                                    <ListItemDecorator><FaCalendarDay fontSize={22} /></ListItemDecorator>
                                    <ListItemContent style={{ fontSize: "14px", userSelect: "none" }}>EVENTOS</ListItemContent>
                                    <IoChevronForwardSharp />
                                </ListItemButton>
                            </ListItem>
                        </Link>

                        <Link to={"/treinamentos"} onClick={() => setDrawer(false)} style={{ textDecoration: "none" }}>
                            <ListItem>
                                <ListItemButton selected={pathname == "/treinamentos"}>
                                    <ListItemDecorator><IoSchoolSharp fontSize={22} /></ListItemDecorator>
                                    <ListItemContent style={{ fontSize: "14px", userSelect: "none" }}>TREINAMENTOS</ListItemContent>
                                    <IoChevronForwardSharp />
                                </ListItemButton>
                            </ListItem>
                        </Link>

                        <Link to={"/aniversariantes"} onClick={() => setDrawer(false)} style={{ textDecoration: "none" }}>
                            <ListItem>
                                <ListItemButton selected={pathname == "/aniversariantes"}>
                                    <ListItemDecorator><FaBirthdayCake fontSize={22} /></ListItemDecorator>
                                    <ListItemContent style={{ fontSize: "14px", userSelect: "none" }}>ANIVERSARIANTES</ListItemContent>
                                    <IoChevronForwardSharp />
                                </ListItemButton>
                            </ListItem>
                        </Link>

                        <Link to={"/biblia"} onClick={() => setDrawer(false)} style={{ textDecoration: "none" }}>
                            <ListItem>
                                <ListItemButton selected={pathname == "/biblia"}>
                                    <ListItemDecorator><FaBible fontSize={22} /></ListItemDecorator>
                                    <ListItemContent style={{ fontSize: "14px", userSelect: "none" }}>BÍBLIA</ListItemContent>
                                    <IoChevronForwardSharp />
                                </ListItemButton>
                            </ListItem>
                        </Link>

                        <Link to={"/cultos"} onClick={() => setDrawer(false)} style={{ textDecoration: "none" }}>
                            <ListItem>
                                <ListItemButton selected={pathname == "/cultos"}>
                                    <ListItemDecorator><IoCalendar fontSize={22} /></ListItemDecorator>
                                    <ListItemContent style={{ fontSize: "14px", userSelect: "none" }}>CULTOS</ListItemContent>
                                    <IoChevronForwardSharp />
                                </ListItemButton>
                            </ListItem>
                        </Link>

                        <Link to={"/admin"} onClick={() => setDrawer(false)} style={{ textDecoration: "none" }}>
                            <ListItem>
                                <ListItemButton selected={pathname == "/admin"}>
                                    <ListItemDecorator><IoSettingsSharp fontSize={22} /></ListItemDecorator>
                                    <ListItemContent style={{ fontSize: "14px", userSelect: "none" }}>ADMINISTRAÇÃO</ListItemContent>
                                    <IoChevronForwardSharp />
                                </ListItemButton>
                            </ListItem>
                        </Link>
                    </List>
                </Stack>
                <FormHelperText sx={{ marginBottom: "20px", marginBottom: "0px", alignSelf: "center" }}>Desenvolvido por</FormHelperText>
                <Button onClick={() => window.open("https://api.whatsapp.com/send?phone=5527998176606")} variant="plain" sx={{ marginBottom: "20px", alignSelf: "center" }}>Lucas Valin</Button>
            </Stack>

            <SwipeableDrawer
                // container={container}
                // anchor="bottom"
                open={sidebar}
                onClose={() => setSidebar(false)}
                onOpen={() => setSidebar(true)}
                // swipeAreaWidth={drawerBleeding}
                disableSwipeToOpen={false}
                ModalProps={{
                    keepMounted: true,
                }}
            >
                <Stack width="250px">
                    <Stack display="flex" flexDirection="column" my={1} pb={2} alignItems={"center"} justifyContent={"center"} borderBottom={1} borderColor={"#ddd"}>
                        <img src={logomarca} width="80px" height={"80px"} style={{ borderRadius: "10px", padding: "0px 50px" }} />
                    </Stack>
                    <Stack>
                        <List>
                            <Link to={"/sobreNos"} onClick={() => setDrawer(false)} style={{ textDecoration: "none" }}>
                                <ListItem>
                                    <ListItemButton selected={pathname == "/sobreNos" || pathname == "/"}>
                                        <ListItemDecorator><FaChurch color="#444" fontSize={20} /></ListItemDecorator>
                                        <ListItemContent sx={{ fontSize: 16, userSelect: "none" }}>SOBRE NÓS</ListItemContent>
                                        <IoChevronForwardSharp />
                                    </ListItemButton>
                                </ListItem>
                            </Link>

                            <Link to={"/eventos"} onClick={() => setDrawer(false)} style={{ textDecoration: "none" }}>
                                <ListItem>
                                    <ListItemButton selected={pathname == "/eventos"}>
                                        <ListItemDecorator><FaCalendarDay fontSize={22} /></ListItemDecorator>
                                        <ListItemContent style={{ fontSize: "14px", userSelect: "none" }}>EVENTOS</ListItemContent>
                                        <IoChevronForwardSharp />
                                    </ListItemButton>
                                </ListItem>
                            </Link>

                            <Link to={"/treinamentos"} onClick={() => setDrawer(false)} style={{ textDecoration: "none" }}>
                                <ListItem>
                                    <ListItemButton selected={pathname == "/treinamentos"}>
                                        <ListItemDecorator><IoSchoolSharp fontSize={22} /></ListItemDecorator>
                                        <ListItemContent style={{ fontSize: "14px", userSelect: "none" }}>TREINAMENTOS</ListItemContent>
                                        <IoChevronForwardSharp />
                                    </ListItemButton>
                                </ListItem>
                            </Link>

                            <Link to={"/aniversariantes"} onClick={() => setDrawer(false)} style={{ textDecoration: "none" }}>
                                <ListItem>
                                    <ListItemButton selected={pathname == "/aniversariantes"}>
                                        <ListItemDecorator><FaBirthdayCake fontSize={22} /></ListItemDecorator>
                                        <ListItemContent style={{ fontSize: "14px", userSelect: "none" }}>ANIVERSARIANTES</ListItemContent>
                                        <IoChevronForwardSharp />
                                    </ListItemButton>
                                </ListItem>
                            </Link>

                            <Link to={"/biblia"} onClick={() => setDrawer(false)} style={{ textDecoration: "none" }}>
                                <ListItem>
                                    <ListItemButton selected={pathname == "/biblia"}>
                                        <ListItemDecorator><FaBible fontSize={22} /></ListItemDecorator>
                                        <ListItemContent style={{ fontSize: "14px", userSelect: "none" }}>BÍBLIA</ListItemContent>
                                        <IoChevronForwardSharp />
                                    </ListItemButton>
                                </ListItem>
                            </Link>

                            <Link to={"/cultos"} onClick={() => setDrawer(false)} style={{ textDecoration: "none" }}>
                                <ListItem>
                                    <ListItemButton selected={pathname == "/cultos"}>
                                        <ListItemDecorator><IoCalendar fontSize={22} /></ListItemDecorator>
                                        <ListItemContent style={{ fontSize: "14px", userSelect: "none" }}>CULTOS</ListItemContent>
                                        <IoChevronForwardSharp />
                                    </ListItemButton>
                                </ListItem>
                            </Link>

                            <Link to={"/admin"} onClick={() => setDrawer(false)} style={{ textDecoration: "none" }}>
                                <ListItem>
                                    <ListItemButton selected={pathname == "/admin"}>
                                        <ListItemDecorator><IoSettingsSharp fontSize={22} /></ListItemDecorator>
                                        <ListItemContent style={{ fontSize: "14px", userSelect: "none" }}>ADMINISTRAÇÃO</ListItemContent>
                                        <IoChevronForwardSharp />
                                    </ListItemButton>
                                </ListItem>
                            </Link>
                        </List>
                    </Stack>
                    <Stack sx={{position: "absolute", bottom: "0px", left: "70px"}}>
                        <FormHelperText sx={{ marginBottom: "20px", marginBottom: "0px", alignSelf: "center" }}>Desenvolvido por</FormHelperText>
                        <Button onClick={() => window.open("https://api.whatsapp.com/send?phone=5527998176606")} variant="plain" sx={{ marginBottom: "20px", alignSelf: "center" }}>Lucas Valin</Button>
                    </Stack>
                </Stack>
            </SwipeableDrawer>
        </Stack>
    )
}