$(document).ready(function () {
	console.log("Ready!");
	$(document).on("click", "#busca-btn", function () {
		alert("Clicou no botão!");
		$.ajax({
			method: "GET",
			url: "https://dadosabertos.camara.leg.br/api/v2/deputados",
			data: { nome: $("#deputado").val() }
		}).done(function (msg) {
			console.log(msg);
			$("#deputados").html(msg);
		})
	});
});