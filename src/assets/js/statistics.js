document.addEventListener("DOMContentLoaded", function () {
  // Temperature & Humidity Chart
  const tempHumidityChart = document.getElementById("temperatureHumidityChart");
  if (tempHumidityChart) {
    new Chart(tempHumidityChart, {
      type: "bar",
      data: {
        labels: [
          "ESP8266-001",
          "ESP8266-002",
          "ESP32-003",
          "Arduino-004",
          "ESP32-005",
        ],
        datasets: [
          {
            label: "Nhiệt độ (°C)",
            data: [25.5, 24.2, 28.7, 22.1, 26.8],
            backgroundColor: "rgba(255, 99, 132, 0.7)",
            borderColor: "rgb(255, 99, 132)",
            borderWidth: 1,
          },
          {
            label: "Độ ẩm (%)",
            data: [68, 72, 58, 75, 65],
            backgroundColor: "rgba(54, 162, 235, 0.7)",
            borderColor: "rgb(54, 162, 235)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }

  // Device Status Pie Chart
  const deviceStatusChart = document.getElementById("deviceStatusChart");
  if (deviceStatusChart) {
    new Chart(deviceStatusChart, {
      type: "pie",
      data: {
        labels: ["Hoạt động", "Không hoạt động", "Cảnh báo"],
        datasets: [
          {
            data: [25, 3, 5],
            backgroundColor: [
              "rgba(75, 192, 192, 0.7)",
              "rgba(201, 203, 207, 0.7)",
              "rgba(255, 159, 64, 0.7)",
            ],
            borderColor: [
              "rgb(75, 192, 192)",
              "rgb(201, 203, 207)",
              "rgb(255, 159, 64)",
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "bottom",
          },
        },
      },
    });
  }

  // Device Type Chart
  const deviceTypeChart = document.getElementById("deviceTypeChart");
  if (deviceTypeChart) {
    new Chart(deviceTypeChart, {
      type: "pie",
      data: {
        labels: ["ESP8266", "ESP32", "Arduino", "Raspberry Pi"],
        datasets: [
          {
            data: [12, 8, 5, 3],
            backgroundColor: [
              "rgba(54, 162, 235, 0.7)",
              "rgba(153, 102, 255, 0.7)",
              "rgba(255, 99, 132, 0.7)",
              "rgba(75, 192, 192, 0.7)",
            ],
            borderColor: [
              "rgb(54, 162, 235)",
              "rgb(153, 102, 255)",
              "rgb(255, 99, 132)",
              "rgb(75, 192, 192)",
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "bottom",
          },
        },
      },
    });
  }

  // Time Comparison Chart
  const timeComparisonChart = document.getElementById("timeComparisonChart");
  if (timeComparisonChart) {
    new Chart(timeComparisonChart, {
      type: "line",
      data: {
        labels: ["05/04", "06/04", "07/04", "08/04", "09/04", "10/04", "11/04"],
        datasets: [
          {
            label: "Nhiệt độ trung bình (°C)",
            data: [24.3, 24.8, 25.2, 24.9, 25.1, 24.8, 25.6],
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            borderColor: "rgb(255, 99, 132)",
            borderWidth: 2,
            fill: true,
            tension: 0.3,
          },
          {
            label: "Độ ẩm trung bình (%)",
            data: [65, 67, 68, 70, 65, 70, 68],
            backgroundColor: "rgba(54, 162, 235, 0.2)",
            borderColor: "rgb(54, 162, 235)",
            borderWidth: 2,
            fill: true,
            tension: 0.3,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: false,
          },
        },
      },
    });
  }

  // Toggle comparison chart view
  const comparisonButtons = document.querySelectorAll(".comparison-btn");
  comparisonButtons.forEach((button) => {
    button.addEventListener("click", function () {
      comparisonButtons.forEach((btn) => btn.classList.remove("active"));
      this.classList.add("active");
      // Implement logic to change chart data based on selection
    });
  });

  // Function to load state from localStorage
  function loadState(key) {
    const value = localStorage.getItem(`cosmosDb_${key}`);
    return value ? JSON.parse(value) : null;
  }

  // Load query history from localStorage
  function loadQueryHistory() {
    const querySelector = document.getElementById("querySelector");
    if (!querySelector) return;

    const queryHistory = loadState("queryHistory") || [];

    // Clear existing options except the first one
    while (querySelector.options.length > 1) {
      querySelector.remove(1);
    }

    // Add query history as options
    queryHistory.forEach((query, index) => {
      const option = document.createElement("option");
      option.value = index;

      // Create a readable timestamp
      const date = new Date(query.timestamp);
      const dateStr = date.toLocaleDateString();
      const timeStr = date.toLocaleTimeString();

      option.textContent = `${dateStr} ${timeStr} - ${query.container} (${query.results.length} rows)`;
      querySelector.appendChild(option);
    });
  }

  // Load and display query data
  function displayQueryData(queryData) {
    const dataSourceInfo = document.getElementById("dataSourceInfo");
    const dataTable = document.getElementById("dataTable");

    if (!dataSourceInfo || !dataTable || !queryData) return;

    // Update data source info
    const timestamp = new Date(queryData.timestamp);
    dataSourceInfo.innerHTML = `
      <p><strong>Container:</strong> ${queryData.container}</p>
      <p><strong>Query:</strong> ${queryData.query}</p>
      <p><strong>Timestamp:</strong> ${timestamp.toLocaleString()}</p>
      <p><strong>Results:</strong> ${queryData.results.length} rows</p>
    `;

    // Create data table
    if (queryData.results.length === 0) {
      dataTable.innerHTML = `
        <div class="no-data">
          <i class="fas fa-database"></i>
          <p>Không có dữ liệu để hiển thị</p>
        </div>
      `;
      return;
    }

    // Get all unique keys from the results
    const allKeys = new Set();
    queryData.results.forEach((item) => {
      Object.keys(item).forEach((key) => allKeys.add(key));
    });

    // Convert to array and filter out common metadata fields
    const keys = Array.from(allKeys).filter(
      (key) => !["_rid", "_self", "_etag", "_attachments", "_ts"].includes(key)
    );

    // Create table HTML
    let tableHtml = `
      <table class="data-table">
        <thead>
          <tr>
            ${keys.map((key) => `<th>${key}</th>`).join("")}
          </tr>
        </thead>
        <tbody>
    `;

    // Add rows
    queryData.results.forEach((item) => {
      tableHtml += "<tr>";
      keys.forEach((key) => {
        const value = item[key];
        let displayValue = "";

        if (value === null || value === undefined) {
          displayValue = "<em>null</em>";
        } else if (typeof value === "object") {
          displayValue = JSON.stringify(value);
        } else {
          displayValue = value.toString();
        }

        tableHtml += `<td>${displayValue}</td>`;
      });
      tableHtml += "</tr>";
    });

    tableHtml += "</tbody></table>";
    dataTable.innerHTML = tableHtml;

    // Update charts with query data if possible
    updateChartsWithQueryData(queryData.results);
  }

  // Update charts with real data
  function updateChartsWithQueryData(results) {
    // Check if this data contains temperature/humidity
    const hasTemperature = results.some(
      (item) =>
        item.temperature !== undefined ||
        item.temp !== undefined ||
        item.Temperature !== undefined
    );

    const hasHumidity = results.some(
      (item) =>
        item.humidity !== undefined ||
        item.humid !== undefined ||
        item.Humidity !== undefined
    );

    // Update temperature & humidity chart if applicable
    if (hasTemperature || hasHumidity) {
      updateTempHumidityChart(results);
    }

    // Update device status chart if applicable
    if (
      results.some(
        (item) => item.status !== undefined || item.deviceStatus !== undefined
      )
    ) {
      updateDeviceStatusChart(results);
    }

    // Update time comparison chart if applicable
    if (
      results.some(
        (item) =>
          item.timestamp !== undefined ||
          item.date !== undefined ||
          item.time !== undefined
      )
    ) {
      updateTimeComparisonChart(results);
    }
  }

  // Example function to update temperature & humidity chart
  function updateTempHumidityChart(data) {
    const chart = Chart.getChart("temperatureHumidityChart");
    if (!chart) return;

    // Extract device IDs
    const deviceIds = [
      ...new Set(
        data.map(
          (item) => item.deviceId || item.id || item.device_id || "Unknown"
        )
      ),
    ];

    // Extract temperature and humidity data
    const tempData = deviceIds.map((id) => {
      const deviceData = data.filter(
        (item) => (item.deviceId || item.id || item.device_id) === id
      );
      const temps = deviceData.map(
        (item) => item.temperature || item.temp || item.Temperature || 0
      );
      // Calculate average if multiple points exist
      return temps.length
        ? temps.reduce((sum, val) => sum + val, 0) / temps.length
        : 0;
    });

    const humidityData = deviceIds.map((id) => {
      const deviceData = data.filter(
        (item) => (item.deviceId || item.id || item.device_id) === id
      );
      const humidity = deviceData.map(
        (item) => item.humidity || item.humid || item.Humidity || 0
      );
      return humidity.length
        ? humidity.reduce((sum, val) => sum + val, 0) / humidity.length
        : 0;
    });

    // Update chart data
    chart.data.labels = deviceIds;
    chart.data.datasets[0].data = tempData;
    chart.data.datasets[1].data = humidityData;
    chart.update();
  }

  // Example function to update device status chart
  function updateDeviceStatusChart(data) {
    const chart = Chart.getChart("deviceStatusChart");
    if (!chart) return;

    // Count devices by status
    const statusCount = {
      "Hoạt động": 0,
      "Không hoạt động": 0,
      "Cảnh báo": 0,
    };

    data.forEach((item) => {
      const status = item.status || item.deviceStatus || "Unknown";
      if (status === "active" || status === "online" || status === 1) {
        statusCount["Hoạt động"]++;
      } else if (
        status === "inactive" ||
        status === "offline" ||
        status === 0
      ) {
        statusCount["Không hoạt động"]++;
      } else if (status === "warning" || status === "alert") {
        statusCount["Cảnh báo"]++;
      }
    });

    // Update chart data
    chart.data.datasets[0].data = [
      statusCount["Hoạt động"],
      statusCount["Không hoạt động"],
      statusCount["Cảnh báo"],
    ];
    chart.update();
  }

  // Example function to update time comparison chart
  function updateTimeComparisonChart(data) {
    const chart = Chart.getChart("timeComparisonChart");
    if (!chart) return;

    // Sort data by timestamp
    const sortedData = [...data].sort((a, b) => {
      const timeA = a.timestamp || a.date || a.time || 0;
      const timeB = b.timestamp || b.date || b.time || 0;
      return new Date(timeA) - new Date(timeB);
    });

    // Group by day
    const groupedByDay = {};
    sortedData.forEach((item) => {
      const date = new Date(item.timestamp || item.date || item.time);
      const day = date.toLocaleDateString();

      if (!groupedByDay[day]) {
        groupedByDay[day] = { temps: [], humidity: [] };
      }

      if (item.temperature || item.temp || item.Temperature) {
        groupedByDay[day].temps.push(
          Number(item.temperature || item.temp || item.Temperature)
        );
      }

      if (item.humidity || item.humid || item.Humidity) {
        groupedByDay[day].humidity.push(
          Number(item.humidity || item.humid || item.Humidity)
        );
      }
    });

    // Calculate averages per day
    const days = Object.keys(groupedByDay);
    const tempAverages = days.map((day) => {
      const temps = groupedByDay[day].temps;
      return temps.length
        ? temps.reduce((sum, val) => sum + val, 0) / temps.length
        : null;
    });

    const humidityAverages = days.map((day) => {
      const humidity = groupedByDay[day].humidity;
      return humidity.length
        ? humidity.reduce((sum, val) => sum + val, 0) / humidity.length
        : null;
    });

    // Update chart
    chart.data.labels = days;
    chart.data.datasets[0].data = tempAverages;
    chart.data.datasets[1].data = humidityAverages;
    chart.update();
  }

  // Load query selector and add event listeners
  const querySelector = document.getElementById("querySelector");
  const loadDataBtn = document.getElementById("loadDataBtn");

  if (querySelector && loadDataBtn) {
    // Load query history on page load
    loadQueryHistory();

    // Add event listener for load button
    loadDataBtn.addEventListener("click", function () {
      const selectedIndex = querySelector.value;
      if (!selectedIndex) {
        alert("Vui lòng chọn một truy vấn từ danh sách");
        return;
      }

      const queryHistory = loadState("queryHistory") || [];
      const selectedQuery = queryHistory[selectedIndex];

      if (selectedQuery) {
        displayQueryData(selectedQuery);
      }
    });

    // Check if there's a current query result to display
    const currentQueryData = loadState("queryResults");
    if (currentQueryData) {
      // Auto-select the first option (most recent query)
      if (querySelector.options.length > 1) {
        querySelector.selectedIndex = 1;
      }
      displayQueryData(currentQueryData);
    }
  }
});
