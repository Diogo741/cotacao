document.addEventListener("DOMContentLoaded", function () {
  const url = "https://economia.awesomeapi.com.br/last/USD-BRL,EUR-BRL,BTC-BRL";

  const ctxUSD = document.getElementById("usdChart").getContext("2d");
  const ctxEUR = document.getElementById("eurChart").getContext("2d");
  const ctxBTC = document.getElementById("btcChart").getContext("2d");

  let usdChart, eurChart, btcChart;

  function createChart(ctx, label) {
    return new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Compra", "Venda"],
        datasets: [
          {
            label: label,
            data: [],
            backgroundColor: [
              "rgba(75, 192, 192, 0.2)",
              "rgba(153, 102, 255, 0.2)",
            ],
            borderColor: ["rgba(75, 192, 192, 1)", "rgba(153, 102, 255, 1)"],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 2000,
          easing: "easeOutCubic",
        },
        scales: {
          y: {
            beginAtZero: false,
            title: {
              display: true,
              text: "Valor",
            },
            ticks: {
              callback: function (value) {
                return value >= 1000 ? value / 1000 + "k" : value;
              },
            },
          },
          x: {
            title: {
              display: true,
              text: "Tipo",
            },
          },
        },
        plugins: {
          title: {
            display: true,
            text: label,
            align: "center",
          },
        },
      },
    });
  }

  function updateCharts(data) {
    const tableBody = document.getElementById("currency-data");
    tableBody.innerHTML = "";

    const currencies = ["USDBRL", "EURBRL", "BTCBRL"];
    const compra = { USD: null, EUR: null, BTC: null };
    const venda = { USD: null, EUR: null, BTC: null };

    currencies.forEach((currency) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${data[currency].code}</td>
        <td>${parseFloat(data[currency].bid).toFixed(2)}</td>
        <td>${parseFloat(data[currency].ask).toFixed(2)}</td>
      `;
      tableBody.appendChild(row);

      if (currency === "USDBRL") {
        compra.USD = parseFloat(data[currency].bid);
        venda.USD = parseFloat(data[currency].ask);
        if (!usdChart) {
          usdChart = createChart(ctxUSD, "USD-BRL");
        }
        usdChart.data.datasets[0].data = [compra.USD, venda.USD];
        usdChart.options.scales.y.min = compra.USD / 2;
        usdChart.update();
      } else if (currency === "EURBRL") {
        compra.EUR = parseFloat(data[currency].bid);
        venda.EUR = parseFloat(data[currency].ask);
        if (!eurChart) {
          eurChart = createChart(ctxEUR, "EUR-BRL");
        }
        eurChart.data.datasets[0].data = [compra.EUR, venda.EUR];
        eurChart.options.scales.y.min = compra.EUR / 2;
        eurChart.update();
      } else if (currency === "BTCBRL") {
        compra.BTC = parseFloat(data[currency].bid);
        venda.BTC = parseFloat(data[currency].ask);
        if (!btcChart) {
          btcChart = createChart(ctxBTC, "BTC-BRL");
        }
        btcChart.data.datasets[0].data = [compra.BTC, venda.BTC];
        btcChart.options.scales.y.min = compra.BTC / 2;
        btcChart.update();
      }
    });
  }

  function fetchData() {
    fetch(url)
      .then((response) => response.json())
      .then((data) => updateCharts(data))
      .catch((error) => console.error("Erro:", error));
  }

  fetchData();
  setInterval(fetchData, 1);
});
