import React from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";

//Páginas
import SobreNos from "../pages/SobreNos";
import Eventos from "../pages/Eventos";
import Treinamentos from "../pages/Treinamentos";
import AnaliseTemperamentos from "../pages/AnaliseTemperamentos";
import Aniversariantes from "../pages/Aniversariantes";
import Biblia from "../pages/Biblia";
import Cultos from "../pages/Cultos";
import RodaDaVida from "../pages/RodaDaVida";
import Administracao from "../pages/Administracao";

const Rotas = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/*" element={<SobreNos />} />
                <Route path="/sobreNos" element={<SobreNos />} exact />
                <Route path="/eventos" element={<Eventos />} exact />
                <Route path="/treinamentos" element={<Treinamentos />} exact />
                <Route path="/temperamentos" element={<AnaliseTemperamentos />} exact />
                <Route path="/rodaDaVida" element={<RodaDaVida />} exact />
                <Route path="/aniversariantes" element={<Aniversariantes />} exact />
                <Route path="/biblia" element={<Biblia />} exact />
                <Route path="/cultos" element={<Cultos />} exact />
                <Route path="/admin" element={<Administracao />} exact />
            </Routes>
        </BrowserRouter>
    )
}

export default Rotas;