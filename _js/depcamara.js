$(document).ready(function () {
	//console.log("Ready!");
	$(document).on("click", "#busca-btn", function (e) {
		//alert("Clicou no botão!");
		buscarDeputados();
	});

	$(document).on("keypress", function (e) {
		if(e.which == 13) {
			if($(document.activeElement).attr("id") == $("#deputado").attr("id")) {
				buscarDeputados();
			}
		}
	});

	$(document).on("click", ".details", function () {
		console.log($(this.parentNode).find(".details-div"));
		if($(this).hasClass("flipped")) {
			$(this).css("transform", "");
			$(this.parentNode).find(".details-div").css("display", "none");
			$(this).removeClass("flipped");
		}
		else {
			if(!$(this.parentNode).hasClass("has-content")) {
				detalhesDeputado ($(this.parentNode).attr("id"),$(this.parentNode).find(".details-div"));
				$(this.parentNode).addClass("has-content");
			}
			$(this).css("transform", "rotate(180deg)");
			$(this.parentNode).find(".details-div").css("display", "block");
			$(this).addClass("flipped");
		}
	});

	function buscarDeputados () {
		$("#deputados").css("display","block");
		$("#deputados").html("<div id=\"searchmoment\">Buscando deputados</div>");
		var interval = setInterval(function () {
			if($("#deputados").html() == "<div id=\"searchmoment\">Buscando deputados</div>") {
				$("#deputados").html("<div id=\"searchmoment\">Buscando deputados</div>.");
			}
			else if($("#deputados").html() == "<div id=\"searchmoment\">Buscando deputados</div>.") {
				$("#deputados").html("<div id=\"searchmoment\">Buscando deputados</div>..");
			}
			else if($("#deputados").html() == "<div id=\"searchmoment\">Buscando deputados</div>..") {
				$("#deputados").html("<div id=\"searchmoment\">Buscando deputados</div>...");
			}
			else if($("#deputados").html() == "<div id=\"searchmoment\">Buscando deputados</div>...") {
				$("#deputados").html("<div id=\"searchmoment\">Buscando deputados</div>");
			}
		}, 500);
		$.ajax({
			method: "GET",
			url: "https://dadosabertos.camara.leg.br/api/v2/deputados",
			data: { nome: $("#deputado").val().trim() },
			dataType: "json"
		}).done(function (msg) {
			clearInterval(interval);
			console.log(msg);
			var result = msg.dados;
			if(result.length == 0) {
				$("#deputados").html("<div id=\"searchmoment\">Desculpe. Nenhum deputado foi encontrado com este nome</div>");
			}
			else {
				var listahtml = "<ul id=\"deplist\" style=\"list-style-type:none\">";
				for(let i=0;i<result.length; i++) {
					listahtml += "<li id=\"" + result[i].id + "\" class=\"deplist-item\">" + (result[i].urlFoto? "<img class=\"depimg\" src=\"" + 
					result[i].urlFoto + "\"/>": "Foto indísponível.") + "<span class=\"resumo\"> Deputado: " + (result[i].nome? result[i].nome : "Nome indíspónível") + " Partido: " + result[i].siglaPartido +
					 " Estado: " + result[i].siglaUf + "</span> <input class=\"details\" type=\"image\" src=\"_imgs/arrow.png\" /> <br/> <div class=\"details-div\" style=\"box-shadow: 7px 7px 7px; margin: 1em; padding: 1em; display: none; background: white; border-radius: 5px;\"></div> </li>";
				}
				listahtml+= "</ul>";
				$("#deputados").html(listahtml);
			}
			
		});
	}

	function detalhesDeputado (id,detalhes) {
		console.log("aa");
		// Detalhes civis
		detalhes.html("Carregando conteúdo");
		var nome_eleitoral,conteudotwitter; // Para TWITTER
		var interval = setInterval(function () {
			if(detalhes.html() == "Carregando conteúdo") {
				detalhes.html("Carregando conteúdo.");
			}
			else if(detalhes.html() == "Carregando conteúdo.") {
				detalhes.html("Carregando conteúdo..");
			}
			else if(detalhes.html() == "Carregando conteúdo..") {
				detalhes.html("Carregando conteúdo...");
			}
			else if(detalhes.html() == "Carregando conteúdo...") {
				detalhes.html("Carregando conteúdo");
			}
		}, 500);
		$.ajax({
			method: "GET",
			url: "https://dadosabertos.camara.leg.br/api/v2/deputados/" + id,
			dataType: "json"
		}).done(function (msg) {
			console.log("Detalhes" , msg);
			let nome = msg.dados.nomeCivil;
			let id_do_deputado = msg.dados.id;
			let municipio = msg.dados.municipioNascimento;
			let uf = msg.dados.ufNascimento;
			nome_eleitoral = msg.dados.ultimoStatus.nomeEleitoral;
			conteudotwitter = "<div style=\"text-align: center;\"><a href=\"http://twitter.com/search?q=" + nome_eleitoral + "\" target=\"_blank\"> Veja os tweets mais recentes relacionados ao deputado! <img style=\"height: 2em;\" src=\"_imgs/twitter.png\" </a></div>";
			var conteudo = "<h2> Dados civis do(a) deputado(a) </h2><div> <b>Nome civil</b>: " + nome + " <br/><b>Número de identificação do(a) deputado(a)</b>	: " + id_do_deputado +
			"<br/><b>Estado de nascimento</b>: " + uf + "<br/><b>Municipio de nascimento</b>: " + municipio + "</div>";
			//detalhes.append(conteudo);
			// Eventos

			$.ajax({
				method: "GET",
				url: "https://dadosabertos.camara.leg.br/api/v2/deputados/" + id + "/eventos",
				dataType: "json"
			}).done(function (msg) {
				console.log("Eventos: " , msg);
				conteudo += "<h2> Eventos que o(a) deputado(a) participou: </h2><div>";
				for(let i=0; i<msg.dados.length; i++) {
					var data,titulo,descricaoTipo,local,orgaos = "Não informado na base de dados";
					
					if(msg.dados[i].dataHoraInicio && msg.dados[i].dataHoraInicio != null) {
						data = msg.dados[i].dataHoraInicio.substring(0,msg.dados[i].dataHoraInicio.indexOf("T"));
					}
					if(msg.dados[i].titulo && msg.dados[i].titulo != null) {
						titulo = msg.dados[i].titulo;
					}
					if(msg.dados[i].descricaoTipo && msg.dados[i].descricaoTipo != null) {
						descricaoTipo = msg.dados[i].descricaoTipo;
					}
					if(msg.dados[i].localCamara.nome && msg.dados[i].localCamara.nome != null) {
						local = msg.dados[i].localCamara.nome;
					}
					var orgaos = "<div><b>Orgaos do evento</b>:<br/>";
					for(let j=0;j<msg.dados[i].orgaos.length;j++) {
						orgaos += "<div class=\"orgaos\"><b>Orgao</b>: " + msg.dados[i].orgaos[j].nome + " - <b>Tipo do orgao</b>: " + msg.dados[i].orgaos[j].tipoOrgao + "<br/></div>";
					}
					orgaos += "</div>";
					conteudo += "<div class=\"eventos\"><b>Evento</b>: " + titulo + "<br/><b>Tipo de evento</b>: " + descricaoTipo + "<br/><b>Data do evento</b>: " + data + "<br/><b>Local do evento</b>: " + local + "<br/>" + orgaos + "<br/></div>";
				}


				// Orgaos

				$.ajax({
					method: "GET",
					url: "https://dadosabertos.camara.leg.br/api/v2/deputados/" + id + "/orgaos",
					dataType: "json"
				}).done(function (msg) {
					console.log("Orgaos: " , msg);
					conteudo += "<h2>Orgaos dos quais o(a) deputado(a) é/foi um integrante: </h2>";
					for(let i=0;i<msg.dados.length;i++) {
						conteudo += "<div class=\"orgaos\"><b>Nome do orgao</b>: " + msg.dados[i].nomeOrgao + "<br/><b>Papel do(a) deputado(a) no orgao</b>: " + msg.dados[i].nomePapel + "<br/><b>Período de participação</b>: " + msg.dados[i].dataInicio + " à " + (msg.dados[i].dataFim? msg.dados[i].dataFim : "Não informado.") + "<br/></div>";
					}
					clearInterval(interval);
					detalhes.html(conteudo);

					// Despesas

					$.ajax({
						method: "GET",
						url: "https://dadosabertos.camara.leg.br/api/v2/deputados/" + id + "/despesas",
						dataType: "json"
					}).done(function (msg) {
						console.log("Depesas: " , msg);
						// Gerar grafico a partir das despesas
						conteudo = "<h2> Despesas do deputado </h2><h3>(Passe o mouse pelos pontos para ver as despesas detalhadamente)</h3><div id=\"despesas" + id + "\"></div>";
						detalhes.append(conteudo);
						google.charts.load('current', {'packages':['annotationchart']});
			      		google.charts.setOnLoadCallback(drawChart);
			      		function drawChart() {
					        var data = new google.visualization.DataTable();
					        data.addColumn('date', 'Data');
					        data.addColumn('number', 'Despesas');
					        data.addColumn({type: 'string', role: 'tooltip', 'p': {'html': true}});
	                        //data.addColumn({type:'string', role:'annotationText'});
					        var linhas = [];
					        for(let i=0; i<msg.dados.length;i++) {
					        	let dia,mes,ano;
					        	dia = msg.dados[i].dataDocumento.substring(8);
					        	mes = msg.dados[i].dataDocumento.substring(5,7);
					        	ano = msg.dados[i].dataDocumento.substring(0,4);
					        	let valor = msg.dados[i].valorDocumento;
					        	let linha = [];
					        	linha.push(new Date(ano,mes,dia)); // data do documento
					        	linha.push(valor); // Valor do documento
					        	let descricao = "<div style=\"margin: 0.5em;\"><b>Data do documento</b>: " + (new Date(ano,mes,dia)).toLocaleDateString() + "<br/><b>Valor do documento</b>: " + valor + "<br/><b>Valor líquido do documento</b>: " + msg.dados[i].valorLiquido + "<br/><b>Tipo de despesa</b>: " + msg.dados[i].tipoDespesa + "</br><b>Nome do fornecedor</b>: " + msg.dados[i].nomeFornecedor + "<br/><b>CNPJ/CPF do fornecedor</b>: " + msg.dados[i].cnpjCpfFornecedor + "<br/><b>Tipo de documento</b>: " + msg.dados[i].tipoDocumento + "<br/><b>Número do documento</b>: " + msg.dados[i].numDocumento +  "<br/><b>Número do ressarcimento</b>: " + msg.dados[i].numRessarcimento + "<br/></div>";
					        	linha.push(descricao); // Descrição geral da parada
					        	linhas.push(linha);
					        }
					        linhas.sort(function(a,b){return a[0].getTime() - b[0].getTime()});
					        data.addRows(linhas);

					        var chart = new google.visualization.LineChart(document.getElementById('despesas' + id));

					        var options = {
					        	'legend':'bottom',
	                            tooltip: {isHtml: true},
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