// Initialize data variable and cache
let data = [];
let cachedData = null;
let myPieChart = null;
let myDonutChart = null;
let myBarChart = null;
let myLineChart = null;
let LineChartMe = null;

// Function to fetch and cache data
async function fetchData() {
  try {
    if (!cachedData) {
      const response = await fetch("data/data.json");
      data = await response.json();
      cachedData = data;
    } else {
      data = cachedData;
    }

    // Initialize charts with all data
    initializeCharts(data);

    // Update summary cards with all data
    updateSummaryCards(data);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// Function to initialize charts
function initializeCharts(data) {
  tampilanGrafikPie(data);
  tampilanGrafikPersentaseToko(data);
  TampilanGrafikOmsetToko(data);
  tampilanGrafikPendapatan(data);
  tampilanGrafikPendapatanBulanan(data); // Update this to ensure the line chart is rendered
}

// Function to calculate total quantity
function calculateTotalQuantity(data) {
  return data.reduce((total, item) => total + parseInt(item.transaction_qty), 0);
}

// Function to calculate total pendapatan
function calculateTotalPendapatan(data) {
  return data.reduce((total, item) => total + (parseInt(item.transaction_qty) * parseFloat(item.unit_price)), 0);
}

// Function to calculate jumlah toko
function calculateJumlahToko(data) {
  return new Set(data.map(item => item.store_location)).size;
}

// Function to update summary cards
function updateSummaryCards(data) {
  // Calculate total quantity
  const totalQuantity = calculateTotalQuantity(data);
  document.getElementById("totalQuantityCard").querySelector(".number").textContent = totalQuantity.toLocaleString();

  // Calculate total pendapatan
  const totalPendapatan = calculateTotalPendapatan(data);
  document.getElementById("totalPendapatanCard").querySelector(".number").textContent = totalPendapatan.toLocaleString();

  // Calculate jumlah toko
  const jumlahToko = calculateJumlahToko(data);
  document.getElementById("jumlahTokoCard").querySelector(".number").textContent = jumlahToko;
}

// Fetch data and initialize charts on DOMContentLoaded
document.addEventListener("DOMContentLoaded", fetchData);

// Handle form and reset button
const formFilter = document.getElementById("form-filter");
const storeLocationFilter = document.getElementById("storeLocationFilter");
const resetFilterButton = document.getElementById("reset-filter");
const tanggalInput = document.getElementById("tanggal");

// Add event listener to the reset button
resetFilterButton.addEventListener("click", function () {
  // Reset form
  formFilter.reset();

  // Reset store location filter
  storeLocationFilter.value = "";

  // Reset date filter (optional, set to empty)
  tanggalInput.value = "";

  // Reset all charts to the initial state with all data
  initializeCharts(data);

  // Update summary cards with all data
  updateSummaryCards(data);
});

// Handle form submit
formFilter.addEventListener("submit", function (e) {
  e.preventDefault();
  const formData = new FormData(e.target);

  const tanggal = formData.get("tanggal");
  const storeLocation = formData.get("storeLocation");
  const latestDate = new Date("2023-06-30");

  let filteredData = data;

  if (tanggal) {
    const tanggalDate = new Date(tanggal);

    if (tanggalDate.getTime() > latestDate.getTime()) {
      alert("Invalid date. Please select a date between January 1, 2023, and June 30, 2023.");
      return;
    }

    filteredData = filteredData.filter((item) => {
      const itemDate = new Date(item.transaction_date);
      return itemDate.toDateString() === tanggalDate.toDateString();
    });

    if (filteredData.length === 0) {
      alert("No data found for the selected date.");
      return;
    }
  }

  if (storeLocation) {
    filteredData = filteredData.filter((item) => item.store_location === storeLocation);

    if (filteredData.length === 0) {
      alert("No data found for the selected store location.");
      return;
    }
  }

  // Update charts with filtered data
  tampilanGrafikPie(filteredData);
  tampilanGrafikPersentaseToko(filteredData);
  TampilanGrafikOmsetToko(filteredData);
  tampilanGrafikPendapatan(filteredData);
  tampilanGrafikPendapatanBulanan(filteredData);

  // Update summary cards with filtered data
  updateSummaryCards(filteredData);
});




//pemanggilan dataset

document.addEventListener("DOMContentLoaded", async function () {
  try {
    const response = await fetch("data/data.json");
    const responseJSON = await response.json();

    // Assign data to the global variable
    data = responseJSON;

    // Initialize charts with all data
    tampilanGrafikPie(data);
    tampilanGrafikPersentaseToko(data);
    TampilanGrafikOmsetToko(data);
    tampilanGrafikPendapatan(data);
    tampilanGrafikPendapatanBulanan(data); // Update this to ensure the line chart is rendered
  } catch (error) {
    console.error("Error fetching data:", error);
  }
});



// B. total pendapatan

// 1. grafik pie
const tampilanGrafikPie = (dataGrafik) => {
  const productCategories = {};
  let totalQty = 0;

  dataGrafik.forEach((item) => {
    const category = item.product_category;
    const unitPrice = parseInt(item.unit_price);
    const qty = parseInt(item.transaction_qty);

    if (productCategories[category]) {
      productCategories[category] += qty * unitPrice;
    } else {
      productCategories[category] = qty * unitPrice;
    }

    totalQty += qty * unitPrice;
  });

  // Hitung persentase setiap kategori
  const labels = Object.keys(productCategories);
  const values = Object.values(productCategories).map((qty) =>
    ((qty / totalQty) * 100).toFixed(2)
  );

  const data = {
    labels: labels,
    datasets: [
      {
        data: values,
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
          "rgba(255, 192, 203, 0.2)",
          "rgba(165, 42, 42, 0.2)",
          "rgba(144, 238, 144, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
          "rgba(255, 192, 203, 1)",
          "rgba(165, 42, 42, 1)",
          "rgba(144, 238, 144, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };
  // Buat grafik
  if (myPieChart == null) {
    const ctx = document.getElementById("myPieChart").getContext("2d");
    myPieChart = new Chart(ctx, {
      type: "pie",
      data,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "top",
          },
          title: {
            display: true,
            text: "Persentase Penjualan Product category",
          },
          tooltip: {
            enabled: true,
            callbacks: {
              label: function (tooltipItem) {
                return (
                  labels[tooltipItem.dataIndex] +
                  ": " +
                  values[tooltipItem.dataIndex] +
                  "%"
                );
              },
            },
          },
        },
      },
    });
  }

  myPieChart.data = data;
  myPieChart.update();
};

// 2. grafik donut
const tampilanGrafikPersentaseToko = (dataGrafik) => {
  // Proses data untuk menghitung total pendapatan per toko
  const storeSales = {};
  let totalRevenue = 0;

  dataGrafik.forEach((item) => {
    const store = item.store_location;
    const revenue =
      parseInt(item.transaction_qty) * parseFloat(item.unit_price);

    if (storeSales[store]) {
      storeSales[store] += revenue;
    } else {
      storeSales[store] = revenue;
    }

    totalRevenue += revenue;
  });

  // Mengubah objek ke array untuk diurutkan
  const sortable = [];
  for (const store in storeSales) {
    sortable.push([store, storeSales[store]]);
  }

  // Urutkan berdasarkan total penjualan (descending)
  sortable.sort((a, b) => b[1] - a[1]);

  // Pisahkan kategori dan jumlah penjualan setelah diurutkan
  const labels = sortable.map((item) => item[0]);
  const values = sortable.map((item) =>
    ((item[1] / totalRevenue) * 100).toFixed(2)
  );

  const data = {
    labels: labels,
    datasets: [
      {
        data: values,
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  // Buat grafik donut
  if (myDonutChart == null) {
    const ctx = document.getElementById("myDonutChart").getContext("2d");
    myDonutChart = new Chart(ctx, {
      type: "doughnut",
      data,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "top",
          },
          title: {
            display: true,
            text: "Persentase Pendapatan Setiap Toko",
          },
          tooltip: {
            enabled: true,
            callbacks: {
              label: function (tooltipItem) {
                return (
                  labels[tooltipItem.dataIndex] +
                  ": " +
                  values[tooltipItem.dataIndex] +
                  "%"
                );
              },
            },
          },
        },
      },
    });
  } else {
    myDonutChart.data = data;
    myDonutChart.update();
  }
};

// 3. grafik Bar
// Definisikan fungsi TampilanGrafikOmsetToko
const TampilanGrafikOmsetToko = (dataGrafik) => {
  const storesData = {
    "Lower Manhattan": { totalQty: 0, totalUnitPrice: 0 },
    "Hell's Kitchen": { totalQty: 0, totalUnitPrice: 0 },
    "Astoria": { totalQty: 0, totalUnitPrice: 0 },
  };

  // Menghitung total quantity, unit price, dan omset untuk setiap toko
  dataGrafik.forEach((item) => {
    const store = item.store_location;
    const qty = parseInt(item.transaction_qty);
    const unitPrice = parseInt(item.unit_price);
    const omset = qty * unitPrice;

    storesData[store].totalQty += qty;
    storesData[store].totalUnitPrice += unitPrice;
    storesData[store].totalOmset =
    storesData[store].totalQty + storesData[store].totalUnitPrice;
  });

  // Persiapkan data untuk grafik
  const labels = Object.keys(storesData);
  const qtyValues = labels.map((store) => storesData[store].totalQty);
  const unitPriceValues = labels.map(
    (store) => storesData[store].totalUnitPrice
  );
  const omsetValues = labels.map((store) => storesData[store].totalOmset);

  const data = {
    labels: labels,
    datasets: [
      {
        label: "Total Quantity",
        data: qtyValues,
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
      {
        label: "Total Unit Price",
        data: unitPriceValues,
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
      {
        label: "Total Omset",
        data: omsetValues,
        backgroundColor: "rgba(255, 206, 86, 0.2)",
        borderColor: "rgba(255, 206, 86, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Membuat grafik bar
  if (myBarChart === undefined || myBarChart === null) {
    // Dapatkan objek konteks dari elemen canvas
    const ctx = document.getElementById("myBarChart").getContext("2d");
    myBarChart = new Chart(ctx, {
      type: "bar",
      data: data,
      options: {
        responsive: true,
        scales: {
          x: {
            stacked: false,
          },
          y: {
            stacked: false,
          },
        },
        plugins: {
          legend: {
            position: "top",
          },
          title: {
            display: true,
            text: "Total Quantity, Unit Price, and Omset for Stores",
          },
        },
      },
    });
  } else {
    myBarChart.data = data;
    myBarChart.update();
  }
};

// 4. table chart
const tampilanGrafikPendapatan = (dataGrafik) => {
  const productCategories = {};

  dataGrafik.forEach((item) => {
      const category = item.product_category;
      const qty = parseInt(item.transaction_qty);

      if (productCategories[category]) {
          productCategories[category] += qty;
      } else {
          productCategories[category] = qty;
      }
  });

  const labels = Object.keys(productCategories);
  const values = Object.values(productCategories);

  const data = {
      labels: labels,
      datasets: [{
          label: 'Total Quantity',
          data: values,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
      }]
  };

  if (myLineChart == null) {
    const ctx = document.getElementById('myLineChart').getContext('2d');
    myLineChart = new Chart(ctx, {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    enabled: true,
                    callbacks: {
                        label: function(tooltipItem) {
                            return labels[tooltipItem.dataIndex] + ': ' + values[tooltipItem.dataIndex];
                        }
                    }
                },
                title: {
                    display: true,
                    text: "Total Quantity dari Penjualan Setiap Jenis Produk",
                },
            },
        },
    });
} else {
    myLineChart.data = data;
    myLineChart.update();
}
}




// 5. line chart pendapatan harian tiap toko
// Fungsi untuk menghitung total pendapatan harian tiap toko
const hitungTotalPendapatanBulanan = (dataGrafik) => {
  const storeLocations = {};

  dataGrafik.forEach((item) => {
    const location = item.store_location;
    const date = new Date(item.transaction_date);
    const month = date.toLocaleString('default', { month: 'short' }) + ' ' + date.getFullYear();
    const qty = parseInt(item.transaction_qty);
    const unitPrice = parseInt(item.unit_price);
    const revenue = qty * unitPrice;

    if (!storeLocations[location]) {
      storeLocations[location] = {};
    }

    if (!storeLocations[location][month]) {
      storeLocations[location][month] = 0;
    }

    storeLocations[location][month] += revenue;
  });
  return storeLocations;
};

const tampilanGrafikPendapatanBulanan = (dataGrafik) => {
  const storeLocations = hitungTotalPendapatanBulanan(dataGrafik);

  // Get all unique months
  const labels = Array.from(new Set(Object.values(storeLocations).flatMap(Object.keys))).sort((a, b) => new Date(a) - new Date(b));

  // Prepare datasets
  const datasets = Object.keys(storeLocations).map((location, index) => {
    const data = labels.map((label) => storeLocations[location][label] || 0);
    let borderColor;
    switch (index % 3) {
      case 0:
        borderColor = "rgba(255, 99, 132, 1)";
        break;
      case 1:
        borderColor = "rgba(54, 162, 235, 1)";
        break;
      case 2:
        borderColor = "rgba(255, 206, 86, 1)";
        break;
      default:
        borderColor = `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 1)`;
        break;
    }
    return {
      label: location,
      data: data,
      fill: false,
      borderColor: borderColor,
      tension: 0.1
    };
  });


  const data = {
    labels: labels,
    datasets: datasets
  };

  if (window.LineChartMe instanceof Chart) {
    window.LineChartMe.data = data;
    window.LineChartMe.update();
  } else {
    const ctx = document.getElementById("LineChartMe").getContext("2d");
    window.LineChartMe = new Chart(ctx, {
      type: "line",
      data: data,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "top",
          },
          title: {
            display: true,
            text: "Pendapatan Bulanan dari Setiap Lokasi Toko",
          },
          tooltip: {
            enabled: true,
            callbacks: {
              label: function (tooltipItem) {
                return `${tooltipItem.dataset.label} (${tooltipItem.label}): ${tooltipItem.raw}`;
              },
            },
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Month',
            },
          },
          y: {
            title: {
              display: true,
              text: 'Revenue',
            },
          },
        },
      },
    });
  }
};
