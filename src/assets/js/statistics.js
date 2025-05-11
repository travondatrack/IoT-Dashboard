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

  // AQI thresholds and levels
  const AQI_THRESHOLDS = {
    GOOD: 50,
    MODERATE: 100,
    UNHEALTHY: 150,
    HAZARDOUS: 300,
  };

  // Set initial dates for report
  function initializeReportDates() {
    const today = new Date();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(today.getDate() - 7);

    const reportStartDate = document.getElementById("reportStartDate");
    const reportEndDate = document.getElementById("reportEndDate");

    if (reportStartDate && reportEndDate) {
      reportStartDate.valueAsDate = oneWeekAgo;
      reportEndDate.valueAsDate = today;
    }
  }

  // Initialize report dates
  initializeReportDates();

  // Initialize air quality date filters with default values
  function initializeAirQualityDateFilters() {
    const today = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(today.getMonth() - 1);

    const airQualityStartDate = document.getElementById("airQualityStartDate");
    const airQualityEndDate = document.getElementById("airQualityEndDate");

    if (airQualityStartDate && airQualityEndDate) {
      airQualityStartDate.valueAsDate = oneMonthAgo;
      airQualityEndDate.valueAsDate = today;
    }
  }

  // Initialize air quality date filters
  initializeAirQualityDateFilters();

  // Create Air Quality Chart
  const airQualityChartEl = document.getElementById("airQualityChart");
  let airQualityChart;
  let airQualityData = []; // Define globally so it's accessible in tooltip callbacks

  if (airQualityChartEl) {
    airQualityChart = new Chart(airQualityChartEl, {
      type: "line",
      data: {
        labels: [],
        datasets: [
          {
            label: "Chất lượng không khí (AQI)",
            data: [],
            borderColor: "rgb(75, 192, 192)",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderWidth: 2,
            fill: true,
            tension: 0.4,
            pointRadius: 6, // Larger points for better visibility
            pointHoverRadius: 8,
            pointBackgroundColor: function (context) {
              // Color points based on AQI value
              const value = context.raw;
              if (value <= AQI_THRESHOLDS.GOOD) {
                return "rgb(40, 167, 69)"; // Green
              } else if (value <= AQI_THRESHOLDS.MODERATE) {
                return "rgb(255, 193, 7)"; // Yellow
              } else if (value <= AQI_THRESHOLDS.UNHEALTHY) {
                return "rgb(255, 128, 0)"; // Orange
              } else {
                return "rgb(220, 53, 69)"; // Red
              }
            },
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          tooltip: {
            callbacks: {
              title: function (context) {
                const dataIndex = context[0].dataIndex;
                if (airQualityData && airQualityData[dataIndex]) {
                  const dataPoint = airQualityData[dataIndex];
                  const localTime = dataPoint.time.toLocaleString([], {
                    hour12: false,
                  });
                  const gmtTime = dataPoint.time.toUTCString();
                  return [`Thời gian: ${localTime}`, `GMT: ${gmtTime}`];
                }
                return "Thời gian không xác định";
              },
              label: function (context) {
                const value = context.raw;
                let label = `AQI: ${value}`;
                let description = "";

                if (value <= AQI_THRESHOLDS.GOOD) {
                  label += " (Tốt)";
                  description =
                    "Chất lượng không khí tốt, ít hoặc không có rủi ro.";
                } else if (value <= AQI_THRESHOLDS.MODERATE) {
                  label += " (Trung bình)";
                  description =
                    "Chất lượng không khí chấp nhận được, nhóm nhạy cảm nên cân nhắc.";
                } else if (value <= AQI_THRESHOLDS.UNHEALTHY) {
                  label += " (Không tốt)";
                  description =
                    "Không tốt cho sức khỏe, hạn chế hoạt động ngoài trời.";
                } else {
                  label += " (Nguy hiểm)";
                  description =
                    "Nguy hiểm! Tránh hoạt động ngoài trời và đóng cửa sổ.";
                }

                return [label, description];
              },
              afterLabel: function (context) {
                const value = context.raw;
                let recommendations = "";

                if (value <= AQI_THRESHOLDS.GOOD) {
                  recommendations = "👍 Lý tưởng cho các hoạt động ngoài trời.";
                } else if (value <= AQI_THRESHOLDS.MODERATE) {
                  recommendations =
                    "⚠️ Nhóm nhạy cảm nên giảm hoạt động ngoài trời kéo dài.";
                } else if (value <= AQI_THRESHOLDS.UNHEALTHY) {
                  recommendations =
                    "❗ Mọi người nên rút ngắn thời gian ở ngoài trời.";
                } else {
                  recommendations =
                    "🚫 Tránh hoạt động ngoài trời, đeo khẩu trang nếu ra ngoài.";
                }

                return recommendations;
              },
            },
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            titleFont: {
              weight: "bold",
            },
            padding: 12,
            boxPadding: 6,
          },
          legend: {
            display: false,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            suggestedMax: 200,
            title: {
              display: true,
              text: "Chỉ số AQI",
            },
            grid: {
              color: "rgba(0, 0, 0, 0.05)",
            },
          },
          x: {
            title: {
              display: true,
              text: "Thời gian",
            },
            grid: {
              display: false,
            },
          },
        },
      },
    });
  }

  // Check air quality and show alert
  function checkAirQuality(airQualityData) {
    const airQualityAlert = document.getElementById("airQualityAlert");
    const airQualityMessage = document.getElementById("airQualityMessage");

    if (
      !airQualityAlert ||
      !airQualityMessage ||
      !airQualityData ||
      airQualityData.length === 0
    ) {
      return;
    }

    // Get the latest air quality value
    const latestData = airQualityData[airQualityData.length - 1].value;

    if (latestData > AQI_THRESHOLDS.HAZARDOUS) {
      // Hazardous level
      airQualityAlert.classList.remove("hidden");
      airQualityAlert.classList.add("danger");
      airQualityMessage.textContent = `Chỉ số AQI hiện tại là ${latestData} - MỨC NGUY HIỂM! Cần di tản hoặc hạn chế tiếp xúc.`;
    } else if (latestData > AQI_THRESHOLDS.UNHEALTHY) {
      // Unhealthy level
      airQualityAlert.classList.remove("hidden");
      airQualityAlert.classList.add("danger");
      airQualityMessage.textContent = `Chỉ số AQI hiện tại là ${latestData} - Chất lượng không khí XẤU. Nên giảm các hoạt động ngoài trời.`;
    } else if (latestData > AQI_THRESHOLDS.MODERATE) {
      // Moderate level
      airQualityAlert.classList.remove("hidden", "danger");
      airQualityMessage.textContent = `Chỉ số AQI hiện tại là ${latestData} - Chất lượng không khí TRUNG BÌNH. Nhóm nhạy cảm nên hạn chế hoạt động ngoài trời.`;
    } else {
      // Good level
      airQualityAlert.classList.add("hidden");
    }
  }

  // Update air quality chart
  function updateAirQualityChart(data, filterByDate = false) {
    if (!airQualityChart || !data || data.length === 0) return;

    // Find air quality data (different possible field names)
    airQualityData = []; // Clear the global array

    // Get date range if filtering is enabled
    let startDate, endDate;
    if (filterByDate) {
      const airQualityStartDate = document.getElementById(
        "airQualityStartDate"
      );
      const airQualityEndDate = document.getElementById("airQualityEndDate");

      if (
        airQualityStartDate &&
        airQualityEndDate &&
        airQualityStartDate.value &&
        airQualityEndDate.value
      ) {
        startDate = new Date(airQualityStartDate.value);
        startDate.setHours(0, 0, 0, 0);

        endDate = new Date(airQualityEndDate.value);
        endDate.setHours(23, 59, 59, 999);
      }
    }

    data.forEach((item) => {
      const timestamp = new Date(
        item.timestamp || item.date || item.time || item.createdAt
      );
      const aqi = item.airQuality || item.aqi || item.AQI || item.air_quality;

      if (aqi !== undefined && timestamp) {
        // Apply date filter if enabled
        if (filterByDate && startDate && endDate) {
          if (timestamp >= startDate && timestamp <= endDate) {
            airQualityData.push({
              time: timestamp,
              value: parseFloat(aqi),
            });
          }
        } else {
          airQualityData.push({
            time: timestamp,
            value: parseFloat(aqi),
          });
        }
      }
    });

    if (airQualityData.length === 0) {
      // Show no data message
      airQualityChart.data.labels = [];
      airQualityChart.data.datasets[0].data = [];
      airQualityChart.update();
      return;
    }

    // Sort by time
    airQualityData.sort((a, b) => a.time - b.time);

    // Update chart
    airQualityChart.data.labels = airQualityData.map((item) => {
      // Format date
      const date = item.time.toLocaleDateString();

      // Convert to GMT/UTC time string
      const time = item.time.toUTCString().split(" ")[4]; // Gets just the time part (HH:MM:SS)

      return `${time} GMT, ${date}`;
    });
    airQualityChart.data.datasets[0].data = airQualityData.map(
      (item) => item.value
    );

    // Update gradient color based on AQI ranges
    const ctx = airQualityChart.ctx;
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, "rgba(220, 53, 69, 0.2)"); // Hazardous (top)
    gradient.addColorStop(0.25, "rgba(255, 128, 0, 0.2)"); // Unhealthy
    gradient.addColorStop(0.5, "rgba(255, 193, 7, 0.2)"); // Moderate
    gradient.addColorStop(1, "rgba(40, 167, 69, 0.2)"); // Good (bottom)

    airQualityChart.data.datasets[0].backgroundColor = gradient;

    airQualityChart.update();

    // Check and show alert if needed
    checkAirQuality(airQualityData);
  }

  // Optional: Add this function to show original timestamps in a consistent format
  function formatTimestamp(timestamp) {
    // Create a date object
    const date = new Date(timestamp);

    // Format with explicit timezone information
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()} (${getTimezoneOffsetString(date)})`;
  }

  // Helper function to get timezone offset as a string
  function getTimezoneOffsetString(date) {
    const offset = date.getTimezoneOffset();
    const hours = Math.abs(Math.floor(offset / 60));
    const minutes = Math.abs(offset % 60);
    const sign = offset < 0 ? "+" : "-";
    return `GMT${sign}${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
  }

  // Apply air quality date filter
  function applyAirQualityDateFilter() {
    const airQualityStartDate = document.getElementById("airQualityStartDate");
    const airQualityEndDate = document.getElementById("airQualityEndDate");

    if (!airQualityStartDate || !airQualityEndDate) return;

    // Validate date range
    if (!airQualityStartDate.value || !airQualityEndDate.value) {
      alert("Vui lòng chọn khoảng thời gian");
      return;
    }

    const startDate = new Date(airQualityStartDate.value);
    const endDate = new Date(airQualityEndDate.value);

    if (startDate > endDate) {
      alert("Ngày bắt đầu phải trước ngày kết thúc");
      return;
    }

    // Get the data
    const queryHistory = loadState("queryHistory") || [];
    let data = [];

    if (queryHistory.length > 0) {
      // Get the most recent data
      data = queryHistory[0].results;
      // Apply the filter
      updateAirQualityChart(data, true);
    } else {
      alert("Không có dữ liệu để hiển thị. Vui lòng tải dữ liệu trước.");
    }
  }

  // Generate environmental report
  function generateEnvironmentalReport() {
    const reportType = document.getElementById("reportType").value;
    const startDate = new Date(
      document.getElementById("reportStartDate").value
    );
    const endDate = new Date(document.getElementById("reportEndDate").value);

    // Get the data
    const queryHistory = loadState("queryHistory") || [];
    let data = [];

    if (queryHistory.length > 0) {
      // Get the most recent data
      data = queryHistory[0].results;
    } else {
      alert("Không có dữ liệu để tạo báo cáo. Vui lòng tải dữ liệu trước.");
      return;
    }

    // Filter data by date range
    const filteredData = data.filter((item) => {
      const itemDate = new Date(
        item.timestamp || item.date || item.time || item.createdAt
      );
      return itemDate >= startDate && itemDate <= endDate;
    });

    if (filteredData.length === 0) {
      alert("Không có dữ liệu trong khoảng thời gian đã chọn.");
      return;
    }

    // Process data based on report type
    let processedData;

    switch (reportType) {
      case "shift":
        processedData = processShiftData(filteredData);
        break;
      case "weekly":
        processedData = processWeeklyData(filteredData);
        break;
      case "daily":
      default:
        processedData = processDailyData(filteredData);
        break;
    }

    displayEnvironmentalReport(processedData, reportType, startDate, endDate);
  }

  // Process data for shift-based report
  function processShiftData(data) {
    const shifts = {
      morning: { start: 6, end: 14, label: "Ca sáng (6h-14h)", data: [] },
      afternoon: { start: 14, end: 22, label: "Ca chiều (14h-22h)", data: [] },
      night: { start: 22, end: 6, label: "Ca đêm (22h-6h)", data: [] },
    };

    data.forEach((item) => {
      const timestamp = new Date(
        item.timestamp || item.date || item.time || item.createdAt
      );
      const hour = timestamp.getHours();

      if (hour >= shifts.morning.start && hour < shifts.morning.end) {
        shifts.morning.data.push(item);
      } else if (
        hour >= shifts.afternoon.start &&
        hour < shifts.afternoon.end
      ) {
        shifts.afternoon.data.push(item);
      } else {
        shifts.night.data.push(item);
      }
    });

    return Object.values(shifts).map((shift) => {
      return {
        label: shift.label,
        airQuality: calculateAverage(shift.data, "airQuality"),
        temperature: calculateAverage(shift.data, "temperature"),
        humidity: calculateAverage(shift.data, "humidity"),
        samples: shift.data.length,
      };
    });
  }

  // Process data for daily report
  function processDailyData(data) {
    const dailyData = {};

    data.forEach((item) => {
      const timestamp = new Date(
        item.timestamp || item.date || item.time || item.createdAt
      );
      const day = timestamp.toLocaleDateString();

      if (!dailyData[day]) {
        dailyData[day] = [];
      }

      dailyData[day].push(item);
    });

    return Object.keys(dailyData).map((day) => {
      return {
        label: day,
        airQuality: calculateAverage(dailyData[day], "airQuality"),
        temperature: calculateAverage(dailyData[day], "temperature"),
        humidity: calculateAverage(dailyData[day], "humidity"),
        samples: dailyData[day].length,
      };
    });
  }

  // Process data for weekly report
  function processWeeklyData(data) {
    const weeklyData = {};

    data.forEach((item) => {
      const timestamp = new Date(
        item.timestamp || item.date || item.time || item.createdAt
      );
      const weekStart = getWeekStartDate(timestamp);
      const weekKey = weekStart.toLocaleDateString();

      if (!weeklyData[weekKey]) {
        weeklyData[weekKey] = [];
      }

      weeklyData[weekKey].push(item);
    });

    return Object.keys(weeklyData).map((week) => {
      const weekStart = new Date(week);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);

      return {
        label: `${weekStart.toLocaleDateString()} - ${weekEnd.toLocaleDateString()}`,
        airQuality: calculateAverage(weeklyData[week], "airQuality"),
        temperature: calculateAverage(weeklyData[week], "temperature"),
        humidity: calculateAverage(weeklyData[week], "humidity"),
        samples: weeklyData[week].length,
      };
    });
  }

  // Get week start date (Monday)
  function getWeekStartDate(date) {
    const dayOfWeek = date.getDay(); // 0 is Sunday, 1 is Monday
    const diff = date.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    const monday = new Date(date);
    monday.setDate(diff);
    monday.setHours(0, 0, 0, 0);
    return monday;
  }

  // Calculate average for a specific field
  function calculateAverage(items, field) {
    const fieldNames = {
      airQuality: ["airQuality", "aqi", "AQI", "air_quality"],
      temperature: ["temperature", "temp", "Temperature"],
      humidity: ["humidity", "humid", "Humidity"],
    };

    const values = items
      .map((item) => {
        for (const name of fieldNames[field]) {
          if (item[name] !== undefined) {
            return parseFloat(item[name]);
          }
        }
        return null;
      })
      .filter((val) => val !== null);

    if (values.length === 0) return null;

    return values.reduce((sum, val) => sum + val, 0) / values.length;
  }

  // Display environmental report
  function displayEnvironmentalReport(data, reportType, startDate, endDate) {
    const reportSummary = document.getElementById("reportSummary");
    const reportCharts = document.getElementById("reportCharts");

    if (!reportSummary || !reportCharts) return;

    // Create report summary
    let reportTitle;
    switch (reportType) {
      case "shift":
        reportTitle = "Báo cáo môi trường theo ca";
        break;
      case "weekly":
        reportTitle = "Báo cáo môi trường theo tuần";
        break;
      case "daily":
      default:
        reportTitle = "Báo cáo môi trường theo ngày";
        break;
    }

    reportSummary.innerHTML = `
      <h3>${reportTitle}</h3>
      <p>Thời gian: ${startDate.toLocaleDateString()} đến ${endDate.toLocaleDateString()}</p>
      <p>Tổng số mẫu: ${data.reduce((sum, item) => sum + item.samples, 0)}</p>
    `;

    // Create charts
    reportCharts.innerHTML = `
      <div class="report-chart-container">
        <canvas id="reportAqiChart"></canvas>
      </div>
      <div class="report-chart-container">
        <canvas id="reportTempHumidityChart"></canvas>
      </div>
    `;

    // Create AQI Chart
    createReportAqiChart(data);

    // Create Temperature/Humidity Chart
    createReportTempHumidityChart(data);
  }

  // Create AQI chart for the report
  function createReportAqiChart(data) {
    const ctx = document.getElementById("reportAqiChart");
    if (!ctx) return;

    const labels = data.map((item) => item.label);
    const aqiData = data.map((item) => item.airQuality);

    // Create the background colors based on AQI values
    const backgroundColors = aqiData.map((value) => {
      if (!value) return "rgba(200, 200, 200, 0.5)";

      if (value <= AQI_THRESHOLDS.GOOD) {
        return "rgba(40, 167, 69, 0.5)";
      } else if (value <= AQI_THRESHOLDS.MODERATE) {
        return "rgba(255, 193, 7, 0.5)";
      } else if (value <= AQI_THRESHOLDS.UNHEALTHY) {
        return "rgba(255, 128, 0, 0.5)";
      } else {
        return "rgba(220, 53, 69, 0.5)";
      }
    });

    new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Chỉ số chất lượng không khí (AQI)",
            data: aqiData,
            backgroundColor: backgroundColors,
            borderColor: backgroundColors.map((color) =>
              color.replace("0.5", "1")
            ),
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "Chỉ số AQI",
            },
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

    // Update air quality chart if applicable
    if (
      results.some(
        (item) =>
          item.airQuality !== undefined ||
          item.aqi !== undefined ||
          item.AQI !== undefined ||
          item.air_quality !== undefined
      )
    ) {
      // Call without date filtering initially
      updateAirQualityChart(results, false);
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

  // Add event listener for generate report button
  const generateReportBtn = document.getElementById("generateReportBtn");
  if (generateReportBtn) {
    generateReportBtn.addEventListener("click", generateEnvironmentalReport);
  }

  // Event listener for air quality date filter button
  const applyAirQualityDateBtn = document.getElementById(
    "applyAirQualityDateBtn"
  );
  if (applyAirQualityDateBtn) {
    applyAirQualityDateBtn.addEventListener("click", applyAirQualityDateFilter);
  }
});
