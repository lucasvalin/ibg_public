import {
    Link,
    Stack,
    Menu,
    MenuButton,
    MenuItem,
    Dropdown,
    Typography,
    Divider
} from '@mui/joy';

//MediaQuery
import useMediaQuery from '@mui/material/useMediaQuery';

import logoOficial from '../../assets/logoOficial.png';

export default function Header(props) {

    const mobile = useMediaQuery('(max-width:1200px)');

    return (
        <Stack position="fixed" zIndex={2} top={0} left={0} width="100vw" height={"50px"} backgroundColor="#444" display={"flex"} flexDirection="row" justifyContent="center" alignItems={"center"}>
            {props.mobile ?
                < img height={"90%"} src={logoOficial} />
                : null
            }
        </Stack >
    )
}