import { useState, useEffect } from "react";

import "../../App.css";

//Firebase
import { getDatabase, ref, set, onValue } from "firebase/database";

// JoyUI
import {
    Stack,
    Typography,
    Button,
    Input,
    Table,
    Modal,
    ModalClose,
    Sheet,
    ModalDialog,
    Divider,
    Box,
    Select,
    Option,
    Checkbox,
    Tabs,
    Tab,
    TabList,
    TabPanel,
    Textarea
} from "@mui/joy"

import { IoWarning } from "react-icons/io5";

//Utils
import { formatarData } from '../../utils/datas';

//MediaQuery
import useMediaQuery from '@mui/material/useMediaQuery';

// Navegação
import { useNavigate } from "react-router-dom";

export default function Consolidacao(props) {

    const mobile = useMediaQuery('(max-width:1200px)');
    const db = getDatabase();

    const [procura, setProcura] = useState("");
    const [modalConsolidacao, setModalConsolidacao] = useState(false);
    const [consolidacoes, setConsolidacoes] = useState([]);
    const [consolidacaoSelecionada, setConsolidacaoSelecionada] = useState({});
    const [indiceSelecionado, setIndiceSelecionado] = useState(0);
    const [atualizarEstados, setAtualizarEstados] = useState(false);
    const [consolidacaoNova, setConsolidacaoNova] = useState(false);
    const [dialogConfirmacao, setDialogConfirmacao] = useState(false);

    useEffect(() => {
        const consolidacoesRef = ref(db, 'consolidacoes/');
        onValue(consolidacoesRef, (snapshot) => {
            const data = snapshot.val();
            setConsolidacoes(data == null ? [] : data);
            console.log(data);
        });
    }, []);

    const consultarConsolidacao = (indice) => {

        consolidacaoSelecionada.consolidador = consolidacoes[indice].consolidador;
        consolidacaoSelecionada.data = consolidacoes[indice].data;
        consolidacaoSelecionada.nomeDaPessoa = consolidacoes[indice].nomeDaPessoa;
        consolidacaoSelecionada.estadoCivil = consolidacoes[indice].estadoCivil;
        consolidacaoSelecionada.nomeDoCompanheiro = consolidacoes[indice].nomeDoCompanheiro;
        consolidacaoSelecionada.filhos = consolidacoes[indice].filhos;
        consolidacaoSelecionada.conheceAlguem = consolidacoes[indice].conheceAlguem;
        consolidacaoSelecionada.endereco = consolidacoes[indice].endereco;
        consolidacaoSelecionada.bairro = consolidacoes[indice].bairro;
        consolidacaoSelecionada.telefone = consolidacoes[indice].telefone;
        consolidacaoSelecionada.horarioContato = consolidacoes[indice].horarioContato;
        consolidacaoSelecionada.ocupacao = consolidacoes[indice].ocupacao;
        consolidacaoSelecionada.horario = consolidacoes[indice].horario;
        consolidacaoSelecionada.habilidadesProfissionais = consolidacoes[indice].habilidadesProfissionais;
        consolidacaoSelecionada.dataNascimento = consolidacoes[indice].dataNascimento;
        consolidacaoSelecionada.estudando = consolidacoes[indice].estudando;
        consolidacaoSelecionada.redesSociais = consolidacoes[indice].redesSociais;
        consolidacaoSelecionada.pergunta1 = consolidacoes[indice].pergunta1;
        consolidacaoSelecionada.pergunta2 = consolidacoes[indice].pergunta2;
        consolidacaoSelecionada.pergunta3 = consolidacoes[indice].pergunta3;
        consolidacaoSelecionada.pergunta4 = consolidacoes[indice].pergunta4;
        consolidacaoSelecionada.pergunta5 = consolidacoes[indice].pergunta5;
        consolidacaoSelecionada.pergunta6 = consolidacoes[indice].pergunta6;
        consolidacaoSelecionada.pergunta7 = consolidacoes[indice].pergunta7;

        setConsolidacaoNova(false)
        setIndiceSelecionado(indice);
        setModalConsolidacao(true);
    }

    const atualizarConsolidacaoSelecionada = (key, value, checkbox) => {
        if (checkbox) {
            consolidacaoSelecionada[key] = value.target.checked;
        }
        else {
            consolidacaoSelecionada[key] = value;
        }
        setAtualizarEstados(!atualizarEstados);
    }

    const salvarConsolidacao = () => {
        if (consolidacaoNova) {
            let consolidacoesAtuais = consolidacoes;
            consolidacoesAtuais.push(consolidacaoSelecionada);
            setConsolidacoes(consolidacoesAtuais);
        }
        else {
            consolidacoes[indiceSelecionado].nomeDaPessoa = consolidacaoSelecionada.nomeDaPessoa;
            consolidacoes[indiceSelecionado].consolidador = consolidacaoSelecionada.consolidador || "";
            consolidacoes[indiceSelecionado].data = consolidacaoSelecionada.data || "";
            consolidacoes[indiceSelecionado].estadoCivil = consolidacaoSelecionada.estadoCivil || "";
            consolidacoes[indiceSelecionado].nomeDoCompanheiro = consolidacaoSelecionada.nomeDoCompanheiro || "";
            consolidacoes[indiceSelecionado].filhos = consolidacaoSelecionada.filhos || "";
            consolidacoes[indiceSelecionado].conheceAlguem = consolidacaoSelecionada.conheceAlguem || "";
            consolidacoes[indiceSelecionado].endereco = consolidacaoSelecionada.endereco || "";
            consolidacoes[indiceSelecionado].bairro = consolidacaoSelecionada.bairro || "";
            consolidacoes[indiceSelecionado].telefone = consolidacaoSelecionada.telefone || "";
            consolidacoes[indiceSelecionado].horarioContato = consolidacaoSelecionada.horarioContato || "";
            consolidacoes[indiceSelecionado].ocupacao = consolidacaoSelecionada.ocupacao || "";
            consolidacoes[indiceSelecionado].horario = consolidacaoSelecionada.horario || "";
            consolidacoes[indiceSelecionado].habilidadesProfissionais = consolidacaoSelecionada.habilidadesProfissionais || "";
            consolidacoes[indiceSelecionado].dataNascimento = consolidacaoSelecionada.dataNascimento || "";
            consolidacoes[indiceSelecionado].estudando = consolidacaoSelecionada.estudando || "";
            consolidacoes[indiceSelecionado].redesSociais = consolidacaoSelecionada.redesSociais || "";
            consolidacoes[indiceSelecionado].pergunta1 = consolidacaoSelecionada.pergunta1 || "";
            consolidacoes[indiceSelecionado].pergunta2 = consolidacaoSelecionada.pergunta2 || "";
            consolidacoes[indiceSelecionado].pergunta3 = consolidacaoSelecionada.pergunta3 || "";
            consolidacoes[indiceSelecionado].pergunta4 = consolidacaoSelecionada.pergunta4 || "";
            consolidacoes[indiceSelecionado].pergunta5 = consolidacaoSelecionada.pergunta5 || "";
            consolidacoes[indiceSelecionado].pergunta6 = consolidacaoSelecionada.pergunta6 || "";
            consolidacoes[indiceSelecionado].pergunta7 = consolidacaoSelecionada.pergunta7 || "";
        }

        //Salvando no banco de dados
        set(ref(db, 'consolidacoes'), consolidacoes);
        setModalConsolidacao(false);
    }

    const novaConsolidacao = () => {
        setConsolidacaoSelecionada({});
        setConsolidacaoNova(true)
        setModalConsolidacao(true);
    }

    const excluirConsolidacao = () => {
        let consolidacoesAtuais = consolidacoes;
        consolidacoesAtuais.splice(indiceSelecionado, 1);
        setConsolidacoes(consolidacoesAtuais);
        setModalConsolidacao(false);

        //Salvando no banco de dados
        set(ref(db, 'consolidacoes'), consolidacoesAtuais);
    }

    return (
        <Stack flex={1}>
            <Stack width={"100%"} mt={mobile ? "20px" : "40px"} flexDirection={"row"} alignItems={"flex-end"} justifyContent={mobile ? "flex-start" : "space-between"}>
                <Stack width={"100%"} sx={{ marginRight: "20px" }} flexDirection={mobile ? "column" : "row"} alignItems={mobile ? "flex-start" : "center"}>
                    <Typography sx={mobile ? { marginRight: "0px" } : { marginRight: "10px" }}>Buscar consolidação</Typography>
                    <Input placeholder="Nome da Pessoa" sx={mobile ? { width: "100%" } : { width: "400px" }} value={procura} onChange={(event) => setProcura(event.target.value)} />
                </Stack>
                <Button onClick={novaConsolidacao} sx={mobile ? { marginLeft: "0px" } : { marginLeft: "20px" }}>Novo</Button>
            </Stack>
            <Stack mt="40px">
                {mobile ?
                    <Stack>
                        {consolidacoes.map(function (consolidacao, indice) {
                            if (consolidacao.nomeDaPessoa.toLowerCase().includes(procura.toLowerCase())) {
                                return (
                                    <Stack key={indice} onClick={() => consultarConsolidacao(indice)} mb={"10px"} boxShadow={"md"} backgroundColor="#fff" borderRadius={"5px"} padding={"10px"}>
                                        <Stack flexDirection={"row"} alignItems={"center"}>
                                            <Typography level="body-md">{consolidacao.nomeDaPessoa}</Typography>
                                        </Stack>
                                    </Stack>
                                )
                            }
                        })}
                    </Stack>
                    :
                    <Table aria-label="basic table" stripe="even">
                        <thead>
                            <tr>
                                <th style={{ height: "10px" }}>Nome</th>
                                <th style={{ height: "10px", width: "350px" }}>Consolidador</th>
                                <th style={{ height: "10px", width: "150px" }}>Data</th>
                            </tr>
                        </thead>
                        <tbody>
                            {consolidacoes.map(function (consolidacao, indice) {
                                if (consolidacao.nomeDaPessoa.toLowerCase().includes(procura.toLowerCase())) {
                                    return (
                                        <tr key={indice} className="hover" onClick={() => consultarConsolidacao(indice)}>
                                            <td>{consolidacao.nomeDaPessoa}</td>
                                            <td>{consolidacao.consolidador}</td>
                                            <td>{formatarData(consolidacao.data)}</td>
                                        </tr>
                                    );
                                }
                            })}
                        </tbody>
                    </Table>
                }
            </Stack>

            <Modal
                aria-labelledby="modal-title"
                aria-describedby="modal-desc"
                open={modalConsolidacao}
                onClose={() => setModalConsolidacao(false)}
                sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            >
                <Sheet
                    variant="outlined"
                    sx={{
                        minWidth: mobile ? "80%" : 600,
                        maxWidth: mobile ? "80%" : 600,
                        borderRadius: 'md',
                        p: 3,
                        boxShadow: 'lg',
                    }}
                >
                    <ModalClose
                        variant="outlined"
                        sx={{
                            boxShadow: '0 2px 12px 0 rgba(0 0 0 / 0.2)',
                            borderRadius: '50%',
                            bgcolor: 'background.surface',
                        }}
                    />
                    <Typography
                        component="h2"
                        id="modal-title"
                        level="h4"
                        textColor="inherit"
                        fontWeight="lg"
                        mb={1}
                    >
                        Consolidação
                    </Typography>
                    <Stack mt="20px">
                        <Tabs aria-label="Basic tabs" defaultValue={0}>
                            <TabList>
                                <Tab color="primary">1° Fase</Tab>
                                <Tab color="primary">2° Fase</Tab>
                            </TabList>
                            <TabPanel value={0} style={{ maxHeight: "60vh", overflow: "auto", padding: "20px 0" }} >
                                <Stack>
                                    <Typography>Consolidador</Typography>
                                    <Input value={consolidacaoSelecionada.consolidador} placeholder="Nome da pessoa" onChange={(event) => atualizarConsolidacaoSelecionada("consolidador", event.target.value)} />
                                </Stack>
                                <Stack mt="20px">
                                    <Typography>Data</Typography>
                                    <Input type="date" value={consolidacaoSelecionada.data} onChange={(event) => atualizarConsolidacaoSelecionada("data", event.target.value)} />
                                </Stack>
                                <Stack mt="20px">
                                    <Typography>Nome da Pessoa</Typography>
                                    <Input value={consolidacaoSelecionada.nomeDaPessoa} placeholder="Nome do membro" onChange={(event) => atualizarConsolidacaoSelecionada("nomeDaPessoa", event.target.value)} />
                                </Stack>
                                <Stack mt="20px">
                                    <Typography>Estado civil</Typography>
                                    <Select value={consolidacaoSelecionada.estadoCivil} placeholder="Estado civil" onChange={(event, newValue) => atualizarConsolidacaoSelecionada("estadoCivil", newValue)}>
                                        <Option value="solteiro">Solteiro</Option>
                                        <Option value="congregado">Noivo</Option>
                                        <Option value="casado">Casado</Option>
                                        <Option value="convivente">Convivente</Option>
                                        <Option value="viuvo">Viúvo</Option>
                                    </Select>
                                </Stack>
                                <Stack mt="20px">
                                    <Typography>Nome do Companheiro (caso haja)</Typography>
                                    <Input value={consolidacaoSelecionada.nomeDoCompanheiro} placeholder="Nome do companheiro" onChange={(event) => atualizarConsolidacaoSelecionada("nomeDoCompanheiro", event.target.value)} />
                                </Stack>
                                <Stack mt="20px">
                                    <Stack flexDirection={'row'} alignItems={'center'}>
                                        <Checkbox checked={consolidacaoSelecionada.filhos} onChange={(event) => atualizarConsolidacaoSelecionada("filhos", event, true)} sx={{ marginRight: "10px" }} />
                                        <Typography>Tem filho(s)?</Typography>
                                    </Stack>
                                </Stack>
                                <Stack mt="20px">
                                    <Typography>Conhece alguem na igreja?</Typography>
                                    <Input placeholder="Nome(s) de quem conhece" value={consolidacaoSelecionada.conheceAlguem} onChange={(event) => atualizarConsolidacaoSelecionada("conheceAlguem", event.target.value)} />
                                </Stack>
                                <Stack mt="20px">
                                    <Typography>Endereço</Typography>
                                    <Input placeholder="Endereço do membro" value={consolidacaoSelecionada.endereco} onChange={(event) => atualizarConsolidacaoSelecionada("endereco", event.target.value)} />
                                </Stack>
                                <Stack mt="20px">
                                    <Typography>Bairro</Typography>
                                    <Input placeholder="Bairro do membro" value={consolidacaoSelecionada.bairro} onChange={(event) => atualizarConsolidacaoSelecionada("bairro", event.target.value)} />
                                </Stack>
                                <Stack mt="20px">
                                    <Typography>Telefone</Typography>
                                    <Input placeholder="Telefone do membro" value={consolidacaoSelecionada.telefone} onChange={(event) => atualizarConsolidacaoSelecionada("telefone", event.target.value)} />
                                </Stack>
                                <Stack mt="20px">
                                    <Typography>Melhor horário para contato</Typography>
                                    <Input type="time" placeholder="Horário para contato" value={consolidacaoSelecionada.horarioContato} onChange={(event) => atualizarConsolidacaoSelecionada("horarioContato", event.target.value)} />
                                </Stack>
                            </TabPanel>
                            <TabPanel value={1} style={{ maxHeight: "60vh", overflow: "auto", padding: "10px 0" }}>
                                <Stack>
                                    <Typography>Ocupação profissional</Typography>
                                    <Input placeholder="Com que trabalha?" value={consolidacaoSelecionada.ocupacao} onChange={(event) => atualizarConsolidacaoSelecionada("ocupacao", event.target.value)} />
                                </Stack>
                                <Stack mt="20px">
                                    <Typography>Horário</Typography>
                                    <Input placeholder="Horário de trabalho" value={consolidacaoSelecionada.horario} onChange={(event) => atualizarConsolidacaoSelecionada("horario", event.target.value)} />
                                </Stack>
                                <Stack mt="20px">
                                    <Typography>Outras habilidades profissionais</Typography>
                                    <Input placeholder="Outras habilidades profissionais" value={consolidacaoSelecionada.habilidadesProfissionais} onChange={(event) => atualizarConsolidacaoSelecionada("habilidadesProfissionais", event.target.value)} />
                                </Stack>
                                <Stack mt="20px">
                                    <Typography>Data de Nascimento</Typography>
                                    <Input type="date" placeholder="Outras habilidades profissionais" value={consolidacaoSelecionada.dataNascimento} onChange={(event) => atualizarConsolidacaoSelecionada("dataNascimento", event.target.value)} />
                                </Stack>
                                <Stack mt="20px">
                                    <Stack flexDirection={'row'} alignItems={'center'}>
                                        <Checkbox checked={consolidacaoSelecionada.estudando} onChange={(event) => atualizarConsolidacaoSelecionada("estudando", event, true)} sx={{ marginRight: "10px" }} />
                                        <Typography>Estudando</Typography>
                                    </Stack>
                                </Stack>
                                <Stack mt="20px">
                                    <Typography>Redes sociais</Typography>
                                    <Input placeholder="Facebook, Instagram, TikTok ..." value={consolidacaoSelecionada.redesSociais} onChange={(event) => atualizarConsolidacaoSelecionada("redesSociais", event.target.value)} />
                                </Stack>
                                <Stack mt="20px">
                                    <Typography>1. Qual é o seu sonho ou como você se vê daqui a 10 anos (vida profissional e espiritual)?</Typography>
                                    <Textarea minRows={5} placeholder="Descreva aqui" value={consolidacaoSelecionada.pergunta1} onChange={(event) => atualizarConsolidacaoSelecionada("pergunta1", event.target.value)} />
                                </Stack>
                                <Stack mt="20px">
                                    <Typography>2. É cristão? Desde quando?</Typography>
                                    <Textarea minRows={5} placeholder="Descreva aqui" value={consolidacaoSelecionada.pergunta2} onChange={(event) => atualizarConsolidacaoSelecionada("pergunta2", event.target.value)} />
                                </Stack>
                                <Stack mt="20px">
                                    <Stack flexDirection={'row'} alignItems={'center'}>
                                        <Checkbox checked={consolidacaoSelecionada.pergunta3} onChange={(event) => atualizarConsolidacaoSelecionada("pergunta3", event, true)} sx={{ marginRight: "10px" }} />
                                        <Typography>3. É batizado em igreja evangélica?</Typography>
                                    </Stack>
                                </Stack>
                                <Stack mt="20px">
                                    <Typography>4. Ja reuniu em outras igrejas e/ou teve outras religiões? Quais?</Typography>
                                    <Textarea minRows={5} placeholder="Descreva aqui" value={consolidacaoSelecionada.pergunta4} onChange={(event) => atualizarConsolidacaoSelecionada("pergunta4", event.target.value)} />
                                </Stack>
                                <Stack mt="20px">
                                    <Typography>5. Porque motivo saiu?</Typography>
                                    <Textarea minRows={5} placeholder="Descreva aqui" value={consolidacaoSelecionada.pergunta5} onChange={(event) => atualizarConsolidacaoSelecionada("pergunta5", event.target.value)} />
                                </Stack>
                                <Stack mt="20px">
                                    <Typography>6. Que função ja exerceu na igreja?</Typography>
                                    <Textarea minRows={5} placeholder="Descreva aqui" value={consolidacaoSelecionada.pergunta6} onChange={(event) => atualizarConsolidacaoSelecionada("pergunta6", event.target.value)} />
                                </Stack>
                                <Stack mt="20px">
                                    <Typography>7. Existe algo hoje na sua vida que te impede exercer seu ministério?</Typography>
                                    <Textarea minRows={5} placeholder="Descreva aqui" value={consolidacaoSelecionada.pergunta7} onChange={(event) => atualizarConsolidacaoSelecionada("pergunta7", event.target.value)} />
                                </Stack>
                            </TabPanel>
                        </Tabs>
                        <Stack flexDirection={"row"} justifyContent={"space-between"} mt="30px">
                            <Button color="danger" disabled={consolidacaoNova} onClick={() => setDialogConfirmacao(true)}>Excluir</Button>
                            <Button disabled={consolidacaoSelecionada.nomeDaPessoa == ""} onClick={salvarConsolidacao}>Salvar</Button>
                        </Stack>
                    </Stack>
                </Sheet>
            </Modal>

            <Modal open={dialogConfirmacao} onClose={() => setDialogConfirmacao(false)}>
                <ModalDialog
                    variant="outlined"
                    role="alertdialog"
                    aria-labelledby="alert-dialog-modal-title"
                    aria-describedby="alert-dialog-modal-description"
                >
                    <Typography
                        id="alert-dialog-modal-title"
                        level="h2"
                        startDecorator={<IoWarning size="20px" color="#FF0000" />}
                    >
                        Tem certeza que deseja excluir?
                    </Typography>
                    <Divider />
                    <Typography id="alert-dialog-modal-description" textColor="text.tertiary">
                        Esta operação é irreversível
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', pt: 2 }}>
                        <Button variant="plain" color="neutral" onClick={() => setDialogConfirmacao(false)}>
                            Cancelar
                        </Button>
                        <Button variant="solid" color="danger" onClick={() => [excluirConsolidacao(), setDialogConfirmacao(false)]}>
                            Excluir
                        </Button>
                    </Box>
                </ModalDialog>
            </Modal>
        </Stack >
    )
}