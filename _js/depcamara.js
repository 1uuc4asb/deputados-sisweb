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

	function buscarDeputados () {
		$.ajax({
			method: "GET",
			url: "https://dadosabertos.camara.leg.br/api/v2/deputados",
			data: { nome: $("#deputado").val().trim() }
		}).done(function (msg) {
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
					 " Estado: " + result[i].siglaUf + "</span> <input id=\"details\" type=\"image\" src=\"_imgs/arrow.png\" /></li>";
				}
				listahtml+= "</ul>";
				$("#deputados").html(listahtml);
			}
			
		});
	}

});