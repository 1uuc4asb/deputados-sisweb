$(document).ready(function () {
    //console.log("Ready!");
    $(document).on("click", "#busca-btn", function (e) {
        //alert("Clicou no botão!");
        buscarDeputados();
    });

    $(document).on("keypress", function (e) {
        if (e.which == 13) {
            if ($(document.activeElement).attr("id") == $("#deputado").attr("id")) {
                buscarDeputados();
            }
        }
    });

    $(document).on("click", ".details", function () {
        console.log($(this.parentNode).find(".details-div"));
        if ($(this).hasClass("flipped")) {
            $(this).css("transform", "");
            $(this.parentNode).find(".details-div").css("display", "none");
            $(this).removeClass("flipped");
        } else {
            if (!$(this.parentNode).hasClass("has-content")) {
                detalhesDeputado($(this.parentNode).attr("id"), $(this.parentNode).find(".details-div"));
                $(this.parentNode).addClass("has-content");
            }
            $(this).css("transform", "rotate(180deg)");
            $(this).css("box-shadow", "-5px -5px 12px");
            $(this.parentNode).find(".details-div").css("display", "block");
            $(this).addClass("flipped");
        }
    });

    $(document).on("click", ".eventos-details-btn", function () {
        console.log($(this.parentNode.parentNode).find(".eventos-div"));
        if ($(this).hasClass("flipped")) {
            $(this).css("transform", "");
            $(this.parentNode.parentNode).find(".eventos-div").css("display", "none");
            $(this).removeClass("flipped");
        } else {
            $(this).css("transform", "rotate(180deg)");
            $(this).css("box-shadow", "-5px -5px 12px");
            $(this.parentNode.parentNode).find(".eventos-div").css("display", "block");
            $(this).addClass("flipped");
        }
    });

    $(document).on("click", ".orgaos-details-btn", function () {
        console.log($(this.parentNode.parentNode).find(".orgaos-div"));
        if ($(this).hasClass("flipped")) {
            $(this).css("transform", "");
            $(this.parentNode.parentNode).find(".orgaos-div").css("display", "none");
            $(this).removeClass("flipped");
        } else {
            $(this).css("transform", "rotate(180deg)");
            $(this).css("box-shadow", "-5px -5px 12px");
            $(this.parentNode.parentNode).find(".orgaos-div").css("display", "block");
            $(this).addClass("flipped");
        }
    });

    function buscarDeputados() {
        $("#deputados").css("display", "block");
        $("#deputados").html("<div id=\"searchmoment\">Buscando deputados</div>");
        var interval = setInterval(function () {
            if ($("#deputados").html() == "<div id=\"searchmoment\">Buscando deputados</div>") {
                $("#deputados").html("<div id=\"searchmoment\">Buscando deputados</div>.");
            } else if ($("#deputados").html() == "<div id=\"searchmoment\">Buscando deputados</div>.") {
                $("#deputados").html("<div id=\"searchmoment\">Buscando deputados</div>..");
            } else if ($("#deputados").html() == "<div id=\"searchmoment\">Buscando deputados</div>..") {
                $("#deputados").html("<div id=\"searchmoment\">Buscando deputados</div>...");
            } else if ($("#deputados").html() == "<div id=\"searchmoment\">Buscando deputados</div>...") {
                $("#deputados").html("<div id=\"searchmoment\">Buscando deputados</div>");
            }
        }, 500);
        $.ajax({
            method: "GET",
            url: "https://dadosabertos.camara.leg.br/api/v2/deputados",
            data: {
                nome: $("#deputado").val().trim()
            },
            dataType: "json"
        }).done(function (msg) {
            clearInterval(interval);
            console.log(msg);
            if (msg.dados) {
                var result = msg.dados;
                if (result.length == 0) {
                    $("#deputados").html("<div id=\"searchmoment\">Desculpe. Nenhum deputado foi encontrado com este nome</div>");
                } else {
                    var listahtml = "<ul id=\"deplist\" style=\"list-style-type:none\">";
                    for (let i = 0; i < result.length; i++) {
                        listahtml += "<li id=\"" + result[i].id + "\" class=\"deplist-item\">" + (result[i].urlFoto ? "<img class=\"depimg\" src=\"" +
                                result[i].urlFoto + "\"/>" : "Foto indísponível.") + "<span class=\"resumo\"> Deputado: " + (result[i].nome ? result[i].nome : "Nome indíspónível") + " Partido: " + (result[i].siglaPartido ? result[i].siglaPartido : "Não informado.") +
                            " Estado: " + result[i].siglaUf + "</span> <input class=\"details\" type=\"image\" src=\"_imgs/arrow.png\" /> <br/> <div class=\"details-div\" style=\"box-shadow: 7px 7px 7px; margin: 1em; padding: 1em; display: none; background: white; border-radius: 5px;\"></div> </li>";
                    }
                    listahtml += "</ul>";
                    $("#deputados").html(listahtml);
                }
            } else {
                $("#deputados").html("<div id=\"searchmoment\">Desculpe. Nenhum deputado foi encontrado com este nome</div>");
            }

        });
    }

    function detalhesDeputado(id, detalhes) {
        console.log("aa");
        // Detalhes civis
        detalhes.html("Carregando conteúdo");
        var nome_eleitoral, conteudotwitter; // Para TWITTER
        var interval = setInterval(function () {
            if (detalhes.html() == "Carregando conteúdo") {
                detalhes.html("Carregando conteúdo.");
            } else if (detalhes.html() == "Carregando conteúdo.") {
                detalhes.html("Carregando conteúdo..");
            } else if (detalhes.html() == "Carregando conteúdo..") {
                detalhes.html("Carregando conteúdo...");
            } else if (detalhes.html() == "Carregando conteúdo...") {
                detalhes.html("Carregando conteúdo");
            }
        }, 500);
        $.ajax({
            method: "GET",
            url: "https://dadosabertos.camara.leg.br/api/v2/deputados/" + id,
            dataType: "json"
        }).done(function (msg) {
            console.log("Detalhes", msg);
            let nome = (msg.dados.nomeCivil ? msg.dados.nomeCivil : "Não informado.");
            let id_do_deputado = (msg.dados.id ? msg.dados.id : "Não informado");
            let municipio = (msg.dados.municipioNascimento ? msg.dados.municipioNascimento : "Não informado.");
            let uf = (msg.dados.ufNascimento ? msg.dados.ufNascimento : "Não informado.");
            nome_eleitoral = (msg.dados.ultimoStatus.nomeEleitoral ? msg.dados.ultimoStatus.nomeEleitoral : 0);
            conteudotwitter = (nome_eleitoral == 0 ? "<div style=\"text-align: center;\"><a> Não foi possível recuperar o nome eleitoral de seu deputado :(  <img style=\"height: 2em;\" src=\"_imgs/twitter.png\" </a></div>" : "<div style=\"text-align: center;\"><a href=\"http://twitter.com/search?q=" + nome_eleitoral + "\" target=\"_blank\"> Veja os tweets mais recentes relacionados ao deputado! <img style=\"height: 2em;\" src=\"_imgs/twitter.png\" </a></div>");
            var conteudo = "<h2> Dados civis do(a) deputado(a) </h2><div> <b>Nome civil</b>: " + nome + " <br/><b>Número de identificação do(a) deputado(a)</b>	: " + id_do_deputado +
                "<br/><b>Estado de nascimento</b>: " + uf + "<br/><b>Municipio de nascimento</b>: " + municipio + "</div>";
            //detalhes.append(conteudo);
            // Eventos

            $.ajax({
                method: "GET",
                url: "https://dadosabertos.camara.leg.br/api/v2/deputados/" + id + "/eventos",
                dataType: "json"
            }).done(function (msg) {
                console.log("Eventos: ", msg);
                conteudo += "<h2> Eventos que o(a) deputado(a) participou: <input class=\"eventos-details-btn\" type=\"image\" src=\"_imgs/arrow.png\" /></h2><div style=\"display: none;\" class=\"eventos-div\">";
                if (msg.dados) {
                    for (let i = 0; i < msg.dados.length; i++) {
                        var data, titulo, descricaoTipo, local, orgaos = "Não informado.";

                        if (msg.dados[i].dataHoraInicio && msg.dados[i].dataHoraInicio != null) {
                            data = (msg.dados[i].dataHoraInicio ? msg.dados[i].dataHoraInicio.substring(0, msg.dados[i].dataHoraInicio.indexOf("T")) : "Não informado.");
                        }
                        if (msg.dados[i].titulo && msg.dados[i].titulo != null) {
                            titulo = (msg.dados[i].titulo ? msg.dados[i].titulo : "Não informado.");
                        }
                        if (msg.dados[i].descricaoTipo && msg.dados[i].descricaoTipo != null) {
                            descricaoTipo = (msg.dados[i].descricaoTipo ? msg.dados[i].descricaoTipo : "Não informado.");
                        }
                        if (msg.dados[i].localCamara.nome && msg.dados[i].localCamara.nome != null) {
                            local = (msg.dados[i].localCamara.nome ? msg.dados[i].localCamara.nome : "Não informado.");
                        }
                        var orgaos = "<div><b>Orgaos do evento</b>:<br/>";
                        for (let j = 0; j < msg.dados[i].orgaos.length; j++) {
                            orgaos += "<div class=\"orgaos\"><b>Orgao</b>: " + (msg.dados[i].orgaos[j].nome ? msg.dados[i].orgaos[j].nome : "Não informado.") + " - <b>Tipo do orgao</b>: " + (msg.dados[i].orgaos[j].tipoOrgao ? msg.dados[i].orgaos[j].tipoOrgao : "Não informado.") + "<br/></div>";
                        }
                        orgaos += "</div>";
                        conteudo += "<div class=\"eventos\"><b>Evento</b>: " + titulo + "<br/><b>Tipo de evento</b>: " + descricaoTipo + "<br/><b>Data do evento</b>: " + data + "<br/><b>Local do evento</b>: " + local + "<br/>" + orgaos + "<br/></div>";
                    }
                    conteudo += "</div>";
                } else {
                    conteudo += "<div> Não foi possível resgatas os dados :( </div>";
                }



                // Orgaos

                $.ajax({
                    method: "GET",
                    url: "https://dadosabertos.camara.leg.br/api/v2/deputados/" + id + "/orgaos",
                    dataType: "json"
                }).done(function (msg) {
                    console.log("Orgaos: ", msg);
                    conteudo += "<h2>Orgaos dos quais o(a) deputado(a) é/foi um integrante: <input class=\"orgaos-details-btn\" type=\"image\" src=\"_imgs/arrow.png\" /></h2><div style=\"display: none;\" class=\"orgaos-div\">";
                    if (msg.dados) {
                        for (let i = 0; i < msg.dados.length; i++) {
                            conteudo += "<div class=\"orgaos\"><b>Nome do orgao</b>: " + (msg.dados[i].nomeOrgao ? msg.dados[i].nomeOrgao : "Não informado.") + "<br/><b>Papel do(a) deputado(a) no orgao</b>: " + (msg.dados[i].nomePapel ? msg.dados[i].nomePapel : "Não informado") + "<br/><b>Período de participação</b>: " + (msg.dados[i].dataInicio ? msg.dados[i].dataInicio : "Não informado.") + " à " + (msg.dados[i].dataFim ? msg.dados[i].dataFim : "Não informado.") + "<br/></div>";
                        }
                        conteudo += "</div>";
                        clearInterval(interval);
                        detalhes.html(conteudo);
                    } else {
                        conteudo += "<div> Não foi possível resgatas os dados :( </div>";
                    }


                    // Despesas

                    $.ajax({
                        method: "GET",
                        url: "https://dadosabertos.camara.leg.br/api/v2/deputados/" + id + "/despesas",
                        dataType: "json"
                    }).done(function (msg) {
                        console.log("Depesas: ", msg);
                        // Gerar grafico a partir das despesas
                        conteudo = "<h2> Despesas do deputado </h2><h3>(Passe o mouse pelos pontos para ver as despesas detalhadamente)</h3><div id=\"despesas" + id + "\"></div>";
                        detalhes.append(conteudo);
                        google.charts.load('current', {
                            'packages': ['annotationchart']
                        });
                        google.charts.setOnLoadCallback(drawChart);

                        function drawChart() {
                            var data = new google.visualization.DataTable();
                            data.addColumn('date', 'Data');
                            data.addColumn('number', 'Despesas');
                            data.addColumn({
                                type: 'string',
                                role: 'tooltip',
                                'p': {
                                    'html': true
                                }
                            });
                            //data.addColumn({type:'string', role:'annotationText'});
                            var linhas = [];
                            for (let i = 0; i < msg.dados.length; i++) {
                                let dia, mes, ano;
                                dia = (msg.dados[i].dataDocumento ? msg.dados[i].dataDocumento.substring(8) : 0);
                                mes = (msg.dados[i].dataDocumento ? msg.dados[i].dataDocumento.substring(5, 7) : 0);
                                ano = (msg.dados[i].dataDocumento ? msg.dados[i].dataDocumento.substring(0, 4) : 0);
                                let valor = (msg.dados[i].valorDocumento ? msg.dados[i].valorDocumento : 0);
                                let linha = [];
                                linha.push(new Date(ano, mes - 1, dia)); // data do documento
                                linha.push(valor); // Valor do documento
                                let descricao = "<div style=\"margin: 0.5em; padding: 0.5em\"><b>Data do documento</b>: " + ((new Date(ano, mes, dia)).toDateString() == (new Date(0, 0, 0)).toDateString() ? "Não informado." : (new Date(ano, mes, dia)).toLocaleDateString()) + "<br/><b>Valor do documento</b>: " + (valor == 0 ? "Não informado." : valor) + "<br/><b>Valor líquido do documento</b>: " + (msg.dados[i].valorLiquido ? msg.dados[i].valorLiquido : "Não informado.") + "<br/><b>Tipo de despesa</b>: " + (msg.dados[i].tipoDespesa ? msg.dados[i].tipoDespesa : "Não informado.") + "</br><b>Nome do fornecedor</b>: " + (msg.dados[i].nomeFornecedor ? msg.dados[i].nomeFornecedor : "Não informado.") + "<br/><b>CNPJ/CPF do fornecedor</b>: " + (msg.dados[i].cnpjCpfFornecedor ? msg.dados[i].cnpjCpfFornecedor : "Não informado.") + "<br/><b>Tipo de documento</b>: " + (msg.dados[i].tipoDocumento ? msg.dados[i].tipoDocumento : "Não informado.") + "<br/><b>Número do documento</b>: " + (msg.dados[i].numDocumento ? msg.dados[i].numDocumento : "Não informado.") + "<br/><b>Número do ressarcimento</b>: " + (msg.dados[i].numRessarcimento ? msg.dados[i].numRessarcimento : "Não informado.") + "<br/></div>";
                                linha.push(descricao); // Descrição geral da parada
                                linhas.push(linha);
                            }
                            /*linhas.push([new Date(1999, 01, 23), 10, "<div style=\"margin: 0.5em; padding: 0.5em\"><b>Data do documento</b>: " + ((new Date(1999, 0, 23)).toDateString() == (new Date(0, 0, 0)).toDateString() ? "Não informado." : (new Date(1999, 01, 23)).toLocaleDateString()) + "<br/><b>Valor do documento</b>: " + 10 + "<br/><b>Valor líquido do documento</b>: " + 10 + "<br/><b>Tipo de despesa</b>: " + "Comida... que fome..." + "</br><b>Nome do fornecedor</b>: " + "Lucas Frango assado" + "<br/><b>CNPJ/CPF do fornecedor</b>: 123213213 - 12<br/><b>Tipo de documento</b>: " + "Nota fiscal" + "<br/><b>Número do documento</b>: " + 666 + "<br/><b>Número do ressarcimento</b>: " + 123213 + "<br/></div>"]);


                            linhas.push([new Date(2005, 0, 23), 100, "<div style=\"margin: 0.5em; padding: 0.5em\"><b>Data do documento</b>: " + ((new Date(2005, 0, 23)).toDateString() == (new Date(0, 0, 0)).toDateString() ? "Não informado." : (new Date(2005, 01, 23)).toLocaleDateString()) + "<br/><b>Valor do documento</b>: " + 100 + "<br/><b>Valor líquido do documento</b>: " + 100 + "<br/><b>Tipo de despesa</b>: " + "Comida... que fome..." + "</br><b>Nome do fornecedor</b>: " + "Matheus da pititinga" + "<br/><b>CNPJ/CPF do fornecedor</b>: 242424242-24 <br/><b>Tipo de documento</b>: " + "Nota fiscal" + "<br/><b>Número do documento</b>: " + 2424 + "<br/><b>Número do ressarcimento</b>: " + 2444444444 + "<br/></div>"]);


                            linhas.push([new Date(2011, 0, 23), 1123, "<div style=\"margin: 0.5em; padding: 0.5em\"><b>Data do documento</b>: " + ((new Date(2011, 0, 23)).toDateString() == (new Date(0, 0, 0)).toDateString() ? "Não informado." : (new Date(2011, 01, 23)).toLocaleDateString()) + "<br/><b>Valor do documento</b>: " + 1123 + "<br/><b>Valor líquido do documento</b>: " + 1123 + "<br/><b>Tipo de despesa</b>: " + "Comida... que fome..." + "</br><b>Nome do fornecedor</b>: " + "Daniel do peixe frito" + "<br/><b>CNPJ/CPF do fornecedor</b>: 222222222-44 <br/><b>Tipo de documento</b>: " + "Nota fiscal" + "<br/><b>Número do documento</b>: " + 24242424 + "<br/><b>Número do ressarcimento</b>: " + 24.666 + "<br/></div>"]);


                            linhas.push([new Date(2018, 0, 23), 11241, "<div style=\"margin: 0.5em; padding: 0.5em\"><b>Data do documento</b>: " + ((new Date(2018, 0, 23)).toDateString() == (new Date(0, 0, 0)).toDateString() ? "Não informado." : (new Date(2018, 01, 23)).toLocaleDateString()) + "<br/><b>Valor do documento</b>: " + 11241 + "<br/><b>Valor líquido do documento</b>: " + 11241 + "<br/><b>Tipo de despesa</b>: " + "Comida... que fome..." + "</br><b>Nome do fornecedor</b>: " + "Lucas Bonés Legais " + "<br/><b>CNPJ/CPF do fornecedor</b>: 66666666-66 <br/><b>Tipo de documento</b>: " + "Nota fiscal" + "<br/><b>Número do documento</b>: " + 666 + "<br/><b>Número do ressarcimento</b>: " + 777 + "<br/></div>"]);*/

                            // Demonstração para o professor = D
                            linhas.sort(function (a, b) {
                                return a[0].getTime() - b[0].getTime()
                            });
                            data.addRows(linhas);

                            var chart = new google.visualization.LineChart(document.getElementById('despesas' + id));

                            var options = {
                                'legend': 'bottom',
                                tooltip: {
                                    isHtml: true
                                },
                                pointSize: 3,
                                displayAnnotations: true,
                            };

                            chart.draw(data, options);
                        }

                        // SUBSTITUIÇÃO DA TWITTER API
                        detalhes.append(conteudotwitter);


                    });
                });

            });
        });
    }


});
