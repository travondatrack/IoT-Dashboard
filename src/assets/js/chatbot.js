document.addEventListener("DOMContentLoaded", function () {
  // API token
  const AQI_API_TOKEN = "e6c0d5df65979b306537333b17d1c1e8a7233937";
  const AQI_API_URL = "https://api.waqi.info/feed/";
  const AQI_API_URL_HERE =
    "https://api.waqi.info/feed/here/?token=e6c0d5df65979b306537333b17d1c1e8a7233937";

  // Removed Gemini API key and related functions

  // Danh sách các thành phố đã xác nhận có dữ liệu AQI
  const SUPPORTED_CITIES = [
    // Việt Nam
    { name: "Hà Nội", searchTerm: "hanoi" },
    { name: "TP Hồ Chí Minh", searchTerm: "saigon" },
    { name: "Đà Nẵng", searchTerm: "danang" },
    { name: "Huế", searchTerm: "hue" },
    { name: "Hải Phòng", searchTerm: "haiphong" },
    { name: "Cần Thơ", searchTerm: "cantho" },
    { name: "Nha Trang", searchTerm: "nhatrang" },
    { name: "Vinh", searchTerm: "vinh" },
    { name: "Biên Hòa", searchTerm: "bienhoa" },
    // Các thành phố quốc tế phổ biến
    { name: "Bangkok", searchTerm: "bangkok" },
    { name: "Singapore", searchTerm: "singapore" },
    { name: "Bắc Kinh", searchTerm: "beijing" },
    { name: "Seoul", searchTerm: "seoul" },
    { name: "Tokyo", searchTerm: "tokyo" },
    { name: "New York", searchTerm: "new-york" },
    { name: "London", searchTerm: "london" },
    { name: "Paris", searchTerm: "paris" },
    { name: "Sydney", searchTerm: "sydney" },
  ];

  // Danh sách từ khóa tìm kiếm bằng tiếng Việt
  const CITY_KEYWORDS = {
    "hà nội": "hanoi",
    "ha noi": "hanoi",
    "hồ chí minh": "saigon",
    "ho chi minh": "saigon",
    "sài gòn": "saigon",
    saigon: "saigon",
    "đà nẵng": "danang",
    "da nang": "danang",
    huế: "hue",
    hue: "hue",
    "hải phòng": "haiphong",
    "hai phong": "haiphong",
    "cần thơ": "cantho",
    "can tho": "cantho",
    "nha trang": "nhatrang",
    vinh: "vinh",
    "biên hòa": "bienhoa",
    "bien hoa": "bienhoa",
  };

  // Simple responses for common questions
  const COMMON_RESPONSES = {
    "aqi là gì": `<div class="aqi-explanation">
      <h4>Chỉ số chất lượng không khí (AQI) là gì?</h4>
      <p>AQI là chỉ số dùng để báo cáo chất lượng không khí hàng ngày. Nó cho bạn biết không khí sạch hay ô nhiễm như thế nào, và những tác động sức khỏe liên quan có thể gây ra.</p>
      
      <h4>Thang điểm AQI</h4>
      <div class="aqi-scale">
        <div class="aqi-scale-item">
          <span class="aqi-color aqi-good"></span>
          <div class="aqi-scale-details">
            <span class="aqi-scale-range">0-50</span>
            <span class="aqi-scale-level">Tốt</span>
          </div>
        </div>
        <div class="aqi-scale-item">
          <span class="aqi-color aqi-moderate"></span>
          <div class="aqi-scale-details">
            <span class="aqi-scale-range">51-100</span>
            <span class="aqi-scale-level">Trung bình</span>
          </div>
        </div>
        <div class="aqi-scale-item">
          <span class="aqi-color aqi-unhealthy" style="background-color: #FF9800;"></span>
          <div class="aqi-scale-details">
            <span class="aqi-scale-range">101-150</span>
            <span class="aqi-scale-level">Không lành mạnh cho người nhạy cảm</span>
          </div>
        </div>
        <div class="aqi-scale-item">
          <span class="aqi-color aqi-unhealthy"></span>
          <div class="aqi-scale-details">
            <span class="aqi-scale-range">151-200</span>
            <span class="aqi-scale-level">Không lành mạnh</span>
          </div>
        </div>
        <div class="aqi-scale-item">
          <span class="aqi-color aqi-hazardous"></span>
          <div class="aqi-scale-details">
            <span class="aqi-scale-range">201+</span>
            <span class="aqi-scale-level">Nguy hiểm</span>
          </div>
        </div>
      </div>
    </div>`,
    "hướng dẫn": `<strong>Hướng dẫn sử dụng IoT Dashboard:</strong><br>
    <ul>
      <li>Xem dữ liệu: Truy cập tab "Dữ liệu" để xem thông tin từ Azure Cosmos DB</li>
      <li>Thống kê: Truy cập tab "Thống kê" để xem biểu đồ và báo cáo</li>
      <li>Tạo báo cáo: Chọn loại báo cáo, khoảng thời gian và nhấn "Tạo báo cáo"</li>
      <li>Xuất báo cáo: Sử dụng nút PDF/Excel để xuất dữ liệu</li>
    </ul>
    <p>Bạn cần hỗ trợ về phần nào cụ thể?</p>`,
    "xin chào": "Xin chào! Tôi là trợ lý IoT. Tôi có thể giúp bạn tra cứu thông tin chất lượng không khí hoặc hướng dẫn sử dụng dashboard. Bạn cần hỗ trợ gì?",
    "help": "Tôi có thể giúp bạn tra cứu chất lượng không khí ở các thành phố hoặc hướng dẫn sử dụng dashboard. Hãy hỏi về chất lượng không khí tại một thành phố cụ thể hoặc gõ 'hướng dẫn' để được trợ giúp."
  };

  // Function to get response based on simple pattern matching (replacing Gemini)
  function getSimpleResponse(message) {
    message = message.toLowerCase();
    
    // Check for common phrases and provide responses
    for (const [key, response] of Object.entries(COMMON_RESPONSES)) {
      if (message.includes(key)) {
        return { text: response, isHTML: true };
      }
    }
    
    // Default response
    return { 
      text: `<p>Tôi có thể giúp bạn với:</p>
      <ul>
        <li>Tra cứu thông tin chất lượng không khí tại các thành phố</li>
        <li>Hiển thị danh sách các thành phố có dữ liệu</li>
        <li>Hướng dẫn sử dụng dashboard</li>
      </ul>
      <p>Thử hỏi "Chất lượng không khí ở Hà Nội" hoặc "Danh sách thành phố có dữ liệu".</p>`, 
      isHTML: true 
    };
  }

  // Chèn chatbot vào DOM nếu chưa có
  function insertChatbotHTML() {
    // Check if chatbot container already exists
    if (document.querySelector('.chatbot-container')) {
      // Just make sure we have the launcher button if using existing container
      if (!document.querySelector('.chatbot-launcher')) {
        const launcherHTML = `
          <button class="chatbot-launcher" id="chatbotLauncher">
            <i class="fas fa-comments"></i>
          </button>
        `;
        document.body.insertAdjacentHTML("beforeend", launcherHTML);
      }
      
      // Set references for existing elements
      initChatbotElements();
      setupEventListeners();
      return;
    }
    
    // Otherwise create a complete new chatbot interface
    const chatbotHTML = `
      <div class="chatbot-container" id="chatbotContainer">
        <div class="chatbot-header">
          <h3><i class="fas fa-robot"></i> Trợ lý IoT</h3>
          <button class="chatbot-toggle" id="chatbotToggle">
            <i class="fas fa-minus"></i>
          </button>
        </div>
        <div class="chatbot-body">
          <div class="chatbot-messages" id="chatbotMessages">
            <div class="message bot-message">
              <div class="message-content">
                Xin chào! Tôi là trợ lý IoT. Bạn có thể hỏi tôi về chất lượng không khí ở bất kỳ địa điểm nào hoặc cách sử dụng dashboard.
              </div>
              <div class="message-time">Bây giờ</div>
            </div>
          </div>
          <div class="chatbot-suggestions">
            <button class="suggestion-btn" data-query="Chất lượng không khí ở Hà Nội?">Chất lượng không khí ở Hà Nội?</button>
            <button class="suggestion-btn" data-query="Thông tin AQI tại TPHCM">Thông tin AQI tại TPHCM</button>
            <button class="suggestion-btn" data-query="Danh sách thành phố có dữ liệu">Danh sách thành phố có dữ liệu</button>
          </div>
        </div>
        <div class="chatbot-input">
          <input type="text" id="chatbotInput" placeholder="Nhập câu hỏi của bạn...">
          <button id="sendMessage">
            <i class="fas fa-paper-plane"></i>
          </button>
        </div>
      </div>

      <button class="chatbot-launcher" id="chatbotLauncher">
        <i class="fas fa-comments"></i>
      </button>
    `;

    document.body.insertAdjacentHTML("beforeend", chatbotHTML);

    // Tái khởi tạo references sau khi chèn HTML
    initChatbotElements();
    setupEventListeners();
  }

  // Khởi tạo lại tham chiếu đến các elements sau khi thêm HTML
  function initChatbotElements() {
    chatbotLauncher = document.getElementById("chatbotLauncher");
    chatbotContainer = document.getElementById("chatbotContainer");
    chatbotToggle = document.getElementById("chatbotToggle");
    chatbotMessages = document.getElementById("chatbotMessages");
    chatbotInput = document.getElementById("chatbotInput");
    sendButton = document.getElementById("sendMessage");
    suggestionBtns = document.querySelectorAll(".suggestion-btn");
  }

  // Thiết lập các event listeners
  function setupEventListeners() {
    if (chatbotLauncher) {
      chatbotLauncher.addEventListener("click", toggleChatbot);
    }

    if (chatbotToggle) {
      chatbotToggle.addEventListener("click", minimizeChatbot);
    }

    if (sendButton) {
      sendButton.addEventListener("click", sendMessage);
    }

    if (chatbotInput) {
      chatbotInput.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
          sendMessage();
        }
      });
    }

    suggestionBtns.forEach((btn) => {
      btn.addEventListener("click", function () {
        const query = this.getAttribute("data-query");
        if (query) {
          chatbotInput.value = query;
          sendMessage();
        }
      });
    });
  }

  // Hiện/ẩn chatbot
  function toggleChatbot() {
    if (chatbotContainer) {
      chatbotContainer.classList.toggle("active");

      // Thay đổi icon dựa trên trạng thái
      if (chatbotContainer.classList.contains("active")) {
        chatbotLauncher.innerHTML = '<i class="fas fa-times"></i>';
      } else {
        chatbotLauncher.innerHTML = '<i class="fas fa-comments"></i>';
      }
    }
  }

  // Thu nhỏ chatbot
  function minimizeChatbot() {
    if (chatbotContainer) {
      chatbotContainer.classList.remove("active");
      chatbotLauncher.innerHTML = '<i class="fas fa-comments"></i>';
    }
  }

  // Gửi tin nhắn
  function sendMessage() {
    if (!chatbotInput || chatbotInput.value.trim() === "") return;

    const userMessage = chatbotInput.value.trim();
    addMessage(userMessage, "user");
    chatbotInput.value = "";

    // Hiển thị trạng thái "đang nhập..."
    showTypingIndicator();

    // Phân tích tin nhắn và trả lời
    processUserMessage(userMessage);
  }

  // Hiển thị tin nhắn trong chatbot
  function addMessage(message, sender, isHTML = false) {
    if (!chatbotMessages) return;

    const messageDiv = document.createElement("div");
    messageDiv.className = `message ${sender}-message`;

    const contentDiv = document.createElement("div");
    contentDiv.className = "message-content";

    if (isHTML) {
      contentDiv.innerHTML = message;
    } else {
      contentDiv.textContent = message;
    }

    const timeDiv = document.createElement("div");
    timeDiv.className = "message-time";
    timeDiv.textContent = getCurrentTime();

    messageDiv.appendChild(contentDiv);
    messageDiv.appendChild(timeDiv);

    chatbotMessages.appendChild(messageDiv);

    // Cuộn xuống tin nhắn mới nhất
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
  }

  // Hiển thị trạng thái "đang nhập..."
  function showTypingIndicator() {
    const typingDiv = document.createElement("div");
    typingDiv.className = "message bot-message typing-indicator";
    typingDiv.innerHTML = `
      <div class="message-content">
        <div class="typing-animation">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    `;

    chatbotMessages.appendChild(typingDiv);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;

    return typingDiv;
  }

  // Xóa trạng thái "đang nhập..."
  function removeTypingIndicator() {
    const typingIndicator = chatbotMessages.querySelector(".typing-indicator");
    if (typingIndicator) {
      typingIndicator.remove();
    }
  }

  // Hiển thị danh sách thành phố có dữ liệu
  function showSupportedCities() {
    const html = `
      <div class="city-list">
        <h4>Các thành phố có dữ liệu AQI:</h4>
        <div class="city-grid">
          ${SUPPORTED_CITIES.map(
            (city) =>
              `<button class="city-btn" data-city="${city.searchTerm}">${city.name}</button>`
          ).join("")}
        </div>
        <p class="city-note">Chọn một thành phố để xem thông tin AQI.</p>
      </div>
    `;

    addMessage(html, "bot", true);

    // Thêm event listeners cho các nút thành phố
    setTimeout(() => {
      const cityButtons = document.querySelectorAll(".city-btn");
      cityButtons.forEach((btn) => {
        btn.addEventListener("click", function () {
          const city = this.getAttribute("data-city");
          if (city) {
            const cityName = this.textContent;
            addMessage(`Chất lượng không khí ở ${cityName}?`, "user");
            showTypingIndicator();
            fetchAQIData(city);
          }
        });
      });
    }, 100);
  }

  // Phân tích tin nhắn của người dùng
  function processUserMessage(message) {
    const lowerMessage = message.toLowerCase();

    // Set a timeout to simulate "thinking"
    setTimeout(() => {
      removeTypingIndicator();
      
      // Kiểm tra nếu người dùng yêu cầu danh sách thành phố
      if (
        lowerMessage.includes("danh sách") ||
        lowerMessage.includes("list") ||
        lowerMessage.includes("thành phố") ||
        lowerMessage.includes("địa điểm") ||
        (lowerMessage.includes("dữ liệu") && lowerMessage.includes("có"))
      ) {
        showSupportedCities();
        return;
      }

      // Tìm thông tin AQI theo địa điểm
      if (
        lowerMessage.includes("chất lượng không khí") ||
        lowerMessage.includes("aqi") ||
        lowerMessage.includes("ô nhiễm") ||
        lowerMessage.includes("không khí")
      ) {
        // Tìm tên địa điểm trong tin nhắn
        let location = extractLocation(lowerMessage);

        if (location) {
          fetchAQIData(location);
        } else {
          // Không tìm thấy địa điểm, hỏi người dùng
          const responseHTML = `
            <p>Bạn muốn xem thông tin chất lượng không khí ở đâu?</p>
            <p>Bạn có thể hỏi về một trong các thành phố sau:</p>
            <div class="quick-cities">
              ${SUPPORTED_CITIES.slice(0, 5)
                .map(
                  (city) =>
                    `<button class="city-quick-btn" data-city="${city.searchTerm}">${city.name}</button>`
                )
                .join("")}
              <button class="city-quick-btn show-all-btn">Xem tất cả</button>
            </div>
          `;
          addMessage(responseHTML, "bot", true);

          // Thêm event listeners cho các nút thành phố
          setTimeout(() => {
            const quickButtons = document.querySelectorAll(".city-quick-btn");
            quickButtons.forEach((btn) => {
              btn.addEventListener("click", function () {
                if (this.classList.contains("show-all-btn")) {
                  showSupportedCities();
                } else {
                  const city = this.getAttribute("data-city");
                  if (city) {
                    const cityName = this.textContent;
                    addMessage(`Chất lượng không khí ở ${cityName}?`, "user");
                    showTypingIndicator();
                    fetchAQIData(city);
                  }
                }
              });
            });
          }, 100);
        }
      } else {
        // Use the simple response function instead of Gemini
        const response = getSimpleResponse(message);
        addMessage(response.text, "bot", response.isHTML);
      }
    }, 1000);
  }

  // Trích xuất tên địa điểm từ tin nhắn
  function extractLocation(message) {
    // Danh sách các từ khóa để tìm kiếm địa điểm
    const locationKeywords = ["ở", "tại", "của", "khu vực"];

    // Kiểm tra xem có match với từ khóa thành phố đã biết không
    for (const [keyword, searchTerm] of Object.entries(CITY_KEYWORDS)) {
      if (message.includes(keyword)) {
        return searchTerm;
      }
    }

    // Nếu không tìm thấy thành phố cụ thể, thử tìm theo cấu trúc "ở X" hoặc "tại X"
    for (const keyword of locationKeywords) {
      const index = message.indexOf(keyword + " ");
      if (index !== -1) {
        // Lấy phần văn bản sau từ khóa
        const remainingText = message.substring(index + keyword.length + 1);
        // Lấy từ đầu tiên hoặc cụm từ có nghĩa
        const locationText = remainingText.split(/[,.?!;:]|\s+/)[0];

        if (locationText && locationText.length > 2) {
          // Địa điểm phải có ít nhất 3 ký tự
          // Kiểm tra xem từ này có trong danh sách thành phố đã biết không
          for (const city of SUPPORTED_CITIES) {
            if (
              city.name.toLowerCase().includes(locationText) ||
              city.searchTerm.includes(locationText)
            ) {
              return city.searchTerm;
            }
          }
          // Nếu không tìm thấy, trả về chuỗi nguyên bản để thử API
          return locationText;
        }
      }
    }

    return null;
  }

  // Lấy dữ liệu AQI từ API
  function fetchAQIData(location) {
    const endpoint = `${AQI_API_URL}${encodeURIComponent(
      location
    )}/?token=${AQI_API_TOKEN}`;

    fetch(endpoint)
      .then((response) => response.json())
      .then((data) => {
        removeTypingIndicator();

        if (data.status === "ok") {
          displayAQIResults(data, location);
        } else {
          const notFoundHTML = `
            <p>Tôi không tìm thấy thông tin chất lượng không khí cho "${location}".</p>
            <p>Bạn có thể xem danh sách các thành phố có dữ liệu bằng cách hỏi "Danh sách thành phố có dữ liệu".</p>
          `;
          addMessage(notFoundHTML, "bot", true);
        }
      })
      .catch((error) => {
        console.error("Lỗi khi lấy dữ liệu AQI:", error);
        removeTypingIndicator();
        addMessage(
          "Đã xảy ra lỗi khi lấy dữ liệu chất lượng không khí. Vui lòng thử lại sau.",
          "bot"
        );
      });
  }

  // Fetch air quality data for "here"
  function fetchAirQualityData() {
    return fetch(AQI_API_URL_HERE)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        // Process the air quality data
        return data;
      })
      .catch((error) => {
        console.error("Error fetching air quality data:", error);
      });
  }

  // Hiển thị kết quả AQI
  function displayAQIResults(data, searchLocation) {
    const aqi = data.data.aqi;
    const station = data.data.city.name;
    const time = data.data.time.s;

    // Xác định mức độ AQI
    let level, colorClass, healthImplications, cautionaryStatement;
    if (aqi <= 50) {
      level = "Tốt";
      colorClass = "aqi-good";
      healthImplications =
        "Chất lượng không khí được coi là đạt tiêu chuẩn, và ô nhiễm không khí gây ra ít hoặc không có rủi ro.";
      cautionaryStatement = "Không cần các biện pháp phòng ngừa.";
    } else if (aqi <= 100) {
      level = "Trung bình";
      colorClass = "aqi-moderate";
      healthImplications =
        "Chất lượng không khí chấp nhận được; tuy nhiên, một số chất gây ô nhiễm có thể gây ra tác động sức khỏe đối với số ít người nhạy cảm.";
      cautionaryStatement =
        "Những người nhạy cảm nên hạn chế hoạt động ngoài trời kéo dài.";
    } else if (aqi <= 150) {
      level = "Không lành mạnh cho người nhạy cảm";
      colorClass = "aqi-unhealthy";
      healthImplications =
        "Những nhóm người nhạy cảm có thể bị ảnh hưởng sức khỏe. Người dân vẫn có thể tham gia các hoạt động ngoài trời.";
      cautionaryStatement =
        "Người già, trẻ em và người có bệnh hô hấp nên hạn chế các hoạt động ngoài trời.";
    } else if (aqi <= 200) {
      level = "Không lành mạnh";
      colorClass = "aqi-unhealthy";
      healthImplications =
        "Mọi người có thể bắt đầu cảm thấy ảnh hưởng đến sức khỏe; nhóm người nhạy cảm có thể bị ảnh hưởng nghiêm trọng hơn.";
      cautionaryStatement =
        "Hạn chế các hoạt động ngoài trời. Người nhạy cảm nên ở trong nhà.";
    } else {
      level = "Nguy hiểm";
      colorClass = "aqi-hazardous";
      healthImplications =
        "Cảnh báo sức khỏe: mọi người có thể bị ảnh hưởng sức khỏe nghiêm trọng.";
      cautionaryStatement =
        "Tránh hoạt động ngoài trời. Nên ở trong nhà và đóng cửa.";
    }

    // Tạo HTML cho kết quả
    const html = `
      <div class="aqi-result">
        <span class="location">${station}</span>
        <div class="aqi-level">
          <span class="aqi-value">${aqi}</span>
          <span class="aqi-description ${colorClass}">${level}</span>
        </div>
        <div class="aqi-interpretation">
          <div class="health-implications">
            <strong>Ảnh hưởng sức khỏe:</strong> ${healthImplications}
          </div>
          <div class="cautionary-statement">
            <strong>Khuyến cáo:</strong> ${cautionaryStatement}
          </div>
        </div>
        <div class="aqi-details">
          <div><strong>Thời gian:</strong> ${formatDate(time)}</div>
          ${
            data.data.iaqi.pm25
              ? `<div><strong>PM2.5:</strong> ${data.data.iaqi.pm25.v}</div>`
              : ""
          }
          ${
            data.data.iaqi.pm10
              ? `<div><strong>PM10:</strong> ${data.data.iaqi.pm10.v}</div>`
              : ""
          }
          ${
            data.data.iaqi.o3
              ? `<div><strong>Ozone (O3):</strong> ${data.data.iaqi.o3.v}</div>`
              : ""
          }
          ${
            data.data.iaqi.no2
              ? `<div><strong>Nitrogen Dioxide (NO2):</strong> ${data.data.iaqi.no2.v}</div>`
              : ""
          }
          ${
            data.data.iaqi.co
              ? `<div><strong>Carbon Monoxide (CO):</strong> ${data.data.iaqi.co.v}</div>`
              : ""
          }
          ${
            data.data.iaqi.so2
              ? `<div><strong>Sulfur Dioxide (SO2):</strong> ${data.data.iaqi.so2.v}</div>`
              : ""
          }
        </div>
      </div>
      <div class="follow-up-questions">
        <p>Bạn có thể:</p>
        <button class="follow-up-btn" data-query="Danh sách thành phố có dữ liệu">Xem thành phố khác</button>
        <button class="follow-up-btn" data-query="AQI có nghĩa là gì?">AQI là gì?</button>
      </div>
    `;

    addMessage(html, "bot", true);

    // Thêm event listeners cho các nút theo dõi
    setTimeout(() => {
      const followUpBtns = document.querySelectorAll(".follow-up-btn");
      followUpBtns.forEach((btn) => {
        btn.addEventListener("click", function () {
          const query = this.getAttribute("data-query");
          if (query) {
            addMessage(query, "user");
            showTypingIndicator();

            if (query === "Danh sách thành phố có dữ liệu") {
              setTimeout(() => {
                removeTypingIndicator();
                showSupportedCities();
              }, 1000);
            } else if (query === "AQI có nghĩa là gì?") {
              setTimeout(() => {
                removeTypingIndicator();
                const aqiExplanation = COMMON_RESPONSES["aqi là gì"];
                addMessage(aqiExplanation, "bot", true);
              }, 1000);
            } else {
              processUserMessage(query);
            }
          }
        });
      });
    }, 100);
  }

  // Format date for display
  function formatDate(dateString) {
    try {
      const date = new Date(dateString);
      return date.toLocaleString("vi-VN", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
      });
    } catch (e) {
      return dateString;
    }
  }

  // Get current time for messages
  function getCurrentTime() {
    const now = new Date();
    return now.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  // Thêm CSS cho danh sách thành phố
  function addCitiesListStyles() {
    if (!document.getElementById("chatbot-cities-styles")) {
      const styles = document.createElement("style");
      styles.id = "chatbot-cities-styles";
      styles.textContent = `
        .city-list {
          width: 100%;
        }
        
        .city-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
          margin: 10px 0;
        }
        
        .city-btn {
          background-color: #e3f2fd;
          border: 1px solid #81d4fa;
          border-radius: 4px;
          padding: 8px;
          font-size: 13px;
          color: #0288d1;
          cursor: pointer;
          transition: all 0.2s;
          text-align: left;
        }
        
        .city-btn:hover {
          background-color: #b3e5fc;
        }
        
        .city-note {
          font-size: 12px;
          color: #666;
          margin-top: 10px;
        }
        
        .quick-cities {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 10px;
        }
        
        .city-quick-btn {
          background-color: #e3f2fd;
          border: 1px solid #81d4fa;
          border-radius: 15px;
          padding: 6px 12px;
          font-size: 12px;
          color: #0288d1;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .city-quick-btn:hover {
          background-color: #b3e5fc;
        }
        
        .show-all-btn {
          background-color: #f5f5f5;
          border: 1px solid #ddd;
          color: #555;
        }
        
        .follow-up-questions {
          margin-top: 15px;
        }
        
        .follow-up-btn {
          background-color: #e8f5e9;
          border: 1px solid #a5d6a7;
          border-radius: 15px;
          padding: 6px 12px;
          margin: 5px 5px 5px 0;
          font-size: 12px;
          color: #388e3c;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .follow-up-btn:hover {
          background-color: #c8e6c9;
        }
        
        .aqi-explanation {
          margin-top: 10px;
        }
        
        .aqi-scale {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-top: 10px;
        }
        
        .aqi-scale-item {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .aqi-color {
          width: 20px;
          height: 20px;
          border-radius: 4px;
        }
        
        .aqi-scale-details {
          display: flex;
          flex-direction: column;
        }
        
        .aqi-scale-range {
          font-weight: bold;
          font-size: 14px;
        }
        
        .aqi-scale-level {
          font-size: 12px;
          color: #555;
        }
        
        .aqi-interpretation {
          background-color: #f8f9fa;
          border-radius: 4px;
          padding: 10px;
          margin: 10px 0;
          font-size: 13px;
        }
        
        .health-implications, .cautionary-statement {
          margin-bottom: 8px;
        }
      `;
      document.head.appendChild(styles);
    }
  }

  // Initialize chatbot
  insertChatbotHTML();
  addCitiesListStyles();
});