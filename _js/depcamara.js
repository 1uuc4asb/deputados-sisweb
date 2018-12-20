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
		$("#deputados").html("Buscando deputados");
		var interval = setInterval(function () {
			if($("#deputados").html() == "Buscando deputados") {
				$("#deputados").html("Buscando deputados.");
			}
			else if($("#deputados").html() == "Buscando deputados.") {
				$("#deputados").html("Buscando deputados..");
			}
			else if($("#deputados").html() == "Buscando deputados..") {
				$("#deputados").html("Buscando deputados...");
			}
			else if($("#deputados").html() == "Buscando deputados...") {
				$("#deputados").html("Buscando deputados");
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
				$("#deputados").html("Desculpe. Nenhum deputado foi encontrado com este nome");
			}
			else {
				var listahtml = "<ul id=\"deplist\" style=\"list-style-type:none\">";
				for(let i=0;i<result.length; i++) {
					listahtml += "<li id=\"" + result[i].id + "\" class=\"deplist-item\"> <img class=\"depimg\" src=\"" + 
					result[i].urlFoto + "\"/> <span class=\"resumo\"> Deputado: " + result[i].nome + " Partido: " + result[i].siglaPartido +
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
			let id_do_canditado = msg.dados.id;
			let municipio = msg.dados.municipioNascimento;
			let uf = msg.dados.ufNascimento;
			var conteudo = "<h2> Dado civis do deputado </h2><div> Nome civil: " + nome + " <br/>Número de identificação do candidato: " + id_do_canditado +
			"<br/>Estado de nascimento: " + uf + "<br/>Municipio de nascimento: " + municipio + "</div>";
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
					var orgaos = "<div>Orgaos do evento:<br/>";
					for(let j=0;j<msg.dados[i].orgaos.length;j++) {
						orgaos += "Orgao: " + msg.dados[i].orgaos[j].nome + ", Tipo do orgao: " + msg.dados[i].orgaos[j].tipoOrgao + "<br/>";
					}
					orgaos += "</div>";
					conteudo += "<div>Evento: " + titulo + "<br/>Tipo de evento: " + descricaoTipo + "<br/>Data do evento: " + data + "<br/>Local do evento: " + local + "<br/>" + orgaos + "<br/>";
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
					conteudo = "<h2> Despesas do deputado </h2><div id=\"despesas" + id + "\"></div>";
					detalhes.append(conteudo);
					google.charts.load('current', {'packages':['annotationchart']});
		      		google.charts.setOnLoadCallback(drawChart);
		      		function drawChart() {
				        var data = new google.visualization.DataTable();
				        data.addColumn('date', 'Data');
				        data.addColumn('number', 'Valor do documento');
				        data.addColumn({type: 'string', role: 'tooltip', 'p': {'html': true}});
                        //data.addColumn({type:'string', role:'annotationText'});
				        var linhas = [];
				        for(let i=0; i<msg.dados.length;i++) {
				        	let dia,mes,ano;
				        	dia = msg.dados[i].dataDocumento.substring(8);
				        	mes = msg.dados[i].dataDocumento.substring(5,7);
				        	ano = msg.dados[i].dataDocumento.substring(0,4);
				        	let valor = msg.dados[i].valorDocumento;
				        	console.log(dia + mes + ano);
				        	let linha = [];
				        	linha.push(new Date(ano,mes,dia)); // data do documento
				        	linha.push(valor); // Valor do documento
				        	let descricao = "<div style=\"margin: 0.5em;\"><b>Data do documento</b>: " + (new Date(ano,mes,dia)).toLocaleDateString() + "<br/><b>Valor do documento</b>: " + valor + "</div>";
				        	linha.push(descricao); // Descrição geral da parada
				        	linhas.push(linha);
				        }
				        console.log(linhas);
				        linhas.sort(function(a,b){return a[0].getTime() - b[0].getTime()});
				        data.addRows(linhas);

				        var chart = new google.visualization.LineChart(document.getElementById('despesas' + id));

				        var options = {
                            tooltip: {isHtml: true},
				        	pointSize: 3,
				          	displayAnnotations: true
				        };

				        chart.draw(data, options);
				      }
				});

			});
		});

		

		// Orgaos

		$.ajax({
			method: "GET",
			url: "https://dadosabertos.camara.leg.br/api/v2/deputados/" + id + "/orgaos",
			dataType: "json"
		}).done(function (msg) {
			console.log("Orgaos: " , msg);
		});

		// Mesa

		$.ajax({
			method: "GET",
			url: "https://dadosabertos.camara.leg.br/api/v2/deputados/" + id + "/mesa",
			dataType: "json"
		}).done(function (msg) {
			console.log("Mesa: " , msg);
		});

		// situacoesDeputado

		$.ajax({
			method: "GET",
			url: "https://dadosabertos.camara.leg.br/api/v2/deputados/" + id + "/situacoesDeputado",
			dataType: "json"
		}).done(function (msg) {
			console.log("situacoesDeputado: " , msg);
		});
	}


});