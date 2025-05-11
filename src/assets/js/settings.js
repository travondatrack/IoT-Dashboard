document.addEventListener("DOMContentLoaded", function () {
  // Theme selection functionality
  const darkThemeOption = document.getElementById("dark-theme");
  const lightThemeOption = document.getElementById("light-theme");
  const autoDarkModeToggle = document.getElementById("auto-dark-mode");

  // Fix the theme options if they exist
  if (darkThemeOption && lightThemeOption) {
    // Set up event listeners for theme options
    darkThemeOption.addEventListener("click", function () {
      selectTheme("dark");
    });

    lightThemeOption.addEventListener("click", function () {
      selectTheme("light");
    });
  }

  // Set up automatic dark mode based on system preference
  if (autoDarkModeToggle) {
    autoDarkModeToggle.addEventListener("change", function () {
      if (this.checked) {
        // Enable automatic theme switching
        localStorage.setItem("autoThemeMode", "true");
        // Check current system preference and apply theme
        checkSystemThemePreference();
      } else {
        // Disable automatic theme switching
        localStorage.setItem("autoThemeMode", "false");
        // Apply user's manual preference instead
        const savedTheme = localStorage.getItem("preferredTheme") || "dark";
        applyTheme(savedTheme);
        updateActiveThemeButton(savedTheme);
      }
    });

    // Initialize auto dark mode toggle from localStorage
    const autoMode = localStorage.getItem("autoThemeMode") === "true";
    autoDarkModeToggle.checked = autoMode;

    // If auto mode is enabled, apply system preference
    if (autoMode) {
      checkSystemThemePreference();
    }
  }

  // Load saved theme preference if auto mode is not enabled
  if (localStorage.getItem("autoThemeMode") !== "true") {
    const savedTheme = localStorage.getItem("preferredTheme") || "dark";
    applyTheme(savedTheme);
    updateActiveThemeButton(savedTheme);
  }

  // Get form elements
  const settingsForm = document.querySelector(".settings-form");
  const usernameInput = document.getElementById("username");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const confirmPasswordInput = document.getElementById("confirm-password");
  const saveButton = document.querySelector(".save-btn");

  // Get notification toggles
  const notificationToggles = document.querySelectorAll(
    '.toggle-item input[type="checkbox"]'
  );

  // Load saved settings
  loadUserSettings();

  // Add event listener to save button
  if (saveButton) {
    saveButton.addEventListener("click", function (e) {
      e.preventDefault();
      saveUserSettings();
    });
  }

  // Add event listeners to notification toggles
  notificationToggles.forEach((toggle) => {
    toggle.addEventListener("change", function () {
      // Get the notification type from the toggle's parent text
      const notificationType =
        this.parentElement.parentElement.querySelector("span").textContent;
      const isEnabled = this.checked;

      // Save notification settings to localStorage
      const notificationSettings = JSON.parse(
        localStorage.getItem("notificationSettings") || "{}"
      );
      notificationSettings[notificationType] = isEnabled;
      localStorage.setItem(
        "notificationSettings",
        JSON.stringify(notificationSettings)
      );

      // Show feedback message
      showFeedback(
        `Thông báo ${notificationType} đã ${isEnabled ? "bật" : "tắt"}`
      );
    });
  });

  // Add session timeout section to settings page
  addSessionTimeoutSection();
});

// Helper Functions
function selectTheme(themeName) {
  // Get the auto dark mode toggle
  const autoDarkModeToggle = document.getElementById("auto-dark-mode");

  // Disable auto dark mode when manually selecting a theme
  if (autoDarkModeToggle) {
    autoDarkModeToggle.checked = false;
    localStorage.setItem("autoThemeMode", "false");
  }

  // Apply theme
  applyTheme(themeName);

  // Update the active button
  updateActiveThemeButton(themeName);

  // Save preference to localStorage
  localStorage.setItem("preferredTheme", themeName);
}

function applyTheme(themeName) {
  const body = document.body;

  // Remove existing theme classes
  body.classList.remove("theme-dark", "theme-light");

  // Add selected theme class
  body.classList.add(`theme-${themeName}`);

  // Update the appearance based on theme
  switch (themeName) {
    case "light":
      document.documentElement.style.setProperty("--main-bg-color", "#f5f7fa");
      document.documentElement.style.setProperty("--text-color", "#333");
      document.documentElement.style.setProperty("--card-bg", "#fff");
      break;
    case "dark":
    default:
      document.documentElement.style.setProperty("--main-bg-color", "#1e2845");
      document.documentElement.style.setProperty("--text-color", "#fff");
      document.documentElement.style.setProperty("--card-bg", "#2c3e50");
      break;
  }

  console.log(`Theme switched to: ${themeName}`);
}

function updateActiveThemeButton(themeName) {
  // Update the active class on theme buttons
  const darkThemeOption = document.getElementById("dark-theme");
  const lightThemeOption = document.getElementById("light-theme");

  if (darkThemeOption && lightThemeOption) {
    darkThemeOption.classList.remove("active");
    lightThemeOption.classList.remove("active");

    if (themeName === "dark") {
      darkThemeOption.classList.add("active");
    } else if (themeName === "light") {
      lightThemeOption.classList.add("active");
    }
  }
}

function checkSystemThemePreference() {
  // Check if the user's system is set to dark mode
  if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    applyTheme("dark");
    updateActiveThemeButton("dark");
  } else {
    applyTheme("light");
    updateActiveThemeButton("light");
  }

  // Listen for changes in system theme preference
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (event) => {
      if (localStorage.getItem("autoThemeMode") === "true") {
        const newTheme = event.matches ? "dark" : "light";
        applyTheme(newTheme);
        updateActiveThemeButton(newTheme);
      }
    });
}

/**
 * Loads user settings from localStorage
 */
function loadUserSettings() {
  // Load user profile data
  const username = localStorage.getItem("username");
  const email = localStorage.getItem("email") || "admin@example.com";

  if (username && document.getElementById("username")) {
    document.getElementById("username").value = username;
  }

  if (email && document.getElementById("email")) {
    document.getElementById("email").value = email;
  }

  // Load notification settings
  const notificationSettings = JSON.parse(
    localStorage.getItem("notificationSettings") || "{}"
  );
  const toggles = document.querySelectorAll(".toggle-item");

  toggles.forEach((toggle) => {
    const notificationType = toggle.querySelector("span").textContent;
    const checkbox = toggle.querySelector('input[type="checkbox"]');

    // Set the checkbox state based on saved settings or default to checked for important notifications
    if (notificationSettings.hasOwnProperty(notificationType)) {
      checkbox.checked = notificationSettings[notificationType];
    }
  });

  // Load session timeout settings
  const sessionTimeout = localStorage.getItem("sessionTimeout") || "10";
  if (document.getElementById("session-timeout")) {
    document.getElementById("session-timeout").value = sessionTimeout;
  }
}

/**
 * Saves user settings to localStorage
 */
function saveUserSettings() {
  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirm-password").value;

  // Validate inputs
  if (!username) {
    showFeedback("Tên người dùng không được để trống", "error");
    return;
  }

  if (!email) {
    showFeedback("Email không được để trống", "error");
    return;
  }

  // Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showFeedback("Định dạng email không hợp lệ", "error");
    return;
  }

  // Password validation
  if (password) {
    if (password.length < 6) {
      showFeedback("Mật khẩu phải có ít nhất 6 ký tự", "error");
      return;
    }

    if (password !== confirmPassword) {
      showFeedback("Mật khẩu xác nhận không khớp", "error");
      return;
    }

    // In a real app, you would hash the password before storing it
    localStorage.setItem("passwordHash", password);
  }

  // Save user data
  localStorage.setItem("username", username);
  localStorage.setItem("email", email);

  // Update displayed username in header
  const usernameDisplay = document.querySelector(".user span");
  if (usernameDisplay) {
    usernameDisplay.textContent = username;
  }

  // Save session timeout if it exists
  const sessionTimeoutInput = document.getElementById("session-timeout");
  if (sessionTimeoutInput) {
    const timeoutValue = sessionTimeoutInput.value;

    if (timeoutValue && !isNaN(timeoutValue) && timeoutValue > 0) {
      localStorage.setItem("sessionTimeout", timeoutValue);

      // Update the actual timeout in the script.js
      window.updateSessionTimeout(timeoutValue);

      showFeedback("Đã cập nhật thời gian hết phiên");
    }
  }

  showFeedback("Đã lưu cài đặt thành công");
}

/**
 * Displays feedback message to user
 * @param {string} message - Message to display
 * @param {string} type - Type of message (success or error)
 */
function showFeedback(message, type = "success") {
  // Check if a feedback element already exists and remove it
  const existingFeedback = document.querySelector(".settings-feedback");
  if (existingFeedback) {
    existingFeedback.remove();
  }

  // Create feedback element
  const feedback = document.createElement("div");
  feedback.className = `settings-feedback ${type}`;
  feedback.innerHTML = `
        <i class="fas fa-${
          type === "success" ? "check-circle" : "exclamation-circle"
        }"></i>
        <span>${message}</span>
    `;

  // Add to page
  const settingsContainer = document.querySelector(".settings-container");
  settingsContainer.appendChild(feedback);

  // Auto hide after 3 seconds
  setTimeout(() => {
    feedback.classList.add("fade-out");
    setTimeout(() => {
      feedback.remove();
    }, 500);
  }, 3000);
}

/**
 * Adds session timeout configuration section to settings
 */
function addSessionTimeoutSection() {
  // Create session timeout section
  const sessionSection = document.createElement("div");
  sessionSection.className = "settings-section";
  sessionSection.innerHTML = `
        <h2>Cài đặt phiên làm việc</h2>
        <div class="settings-form">
            <div class="form-group">
                <label for="session-timeout">Thời gian tự động đăng xuất (phút)</label>
                <input type="number" id="session-timeout" min="1" max="60" value="10" />
                <small>Hệ thống sẽ tự động đăng xuất sau thời gian không hoạt động</small>
            </div>
            <div class="toggle-group">
                <div class="toggle-item">
                    <span>Hiện cảnh báo trước khi hết phiên</span>
                    <label class="switch">
                        <input type="checkbox" id="show-timeout-warning" checked />
                        <span class="slider round"></span>
                    </label>
                </div>
            </div>
            <button class="save-btn timeout-save-btn">Lưu thay đổi</button>
        </div>
    `;

  // Add to page before the last script tag
  const settingsContainer = document.querySelector(".settings-container");
  settingsContainer.appendChild(sessionSection);

  // Load saved timeout value
  const savedTimeout = localStorage.getItem("sessionTimeout") || "10";
  document.getElementById("session-timeout").value = savedTimeout;

  // Show warning toggle
  const showWarning = localStorage.getItem("showTimeoutWarning") !== "false";
  document.getElementById("show-timeout-warning").checked = showWarning;

  // Add event listener to the new save button
  const timeoutSaveBtn = document.querySelector(".timeout-save-btn");
  timeoutSaveBtn.addEventListener("click", function (e) {
    e.preventDefault();

    const timeoutValue = document.getElementById("session-timeout").value;
    const showWarning = document.getElementById("show-timeout-warning").checked;

    if (!timeoutValue || isNaN(timeoutValue) || timeoutValue < 1) {
      showFeedback("Vui lòng nhập thời gian hợp lệ (ít nhất 1 phút)", "error");
      return;
    }

    // Save settings
    localStorage.setItem("sessionTimeout", timeoutValue);
    localStorage.setItem("showTimeoutWarning", showWarning);

    // Define a global function to update the timeout in script.js
    window.updateSessionTimeout = function (minutes) {
      // This function will be used by script.js to update the timeout
      const inactivityTime = function () {
        let time;
        const logoutTime = minutes * 60 * 1000;

        function resetTimer() {
          clearTimeout(time);
          time = setTimeout(logout, logoutTime);
        }

        function logout() {
          alert(
            `Bạn đã không hoạt động trong ${minutes} phút. Hệ thống sẽ tự động đăng xuất để bảo vệ.`
          );
          window.location.href = "/login.html";
        }

        window.onload = resetTimer;
        document.onmousemove = resetTimer;
        document.onkeypress = resetTimer;
        document.onmousedown = resetTimer;
        document.ontouchstart = resetTimer;
        document.onclick = resetTimer;
        document.onscroll = resetTimer;

        resetTimer();
      };

      inactivityTime();
    };

    showFeedback("Đã lưu cài đặt phiên làm việc");
  });

  // Add CSS for the new section
  const style = document.createElement("style");
  style.textContent = `
        .settings-feedback {
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 12px 20px;
            border-radius: 5px;
            color: white;
            display: flex;
            align-items: center;
            gap: 10px;
            animation: slide-in 0.3s ease-out forwards;
            z-index: 1000;
        }
        
        .settings-feedback.success {
            background-color: #4CAF50;
        }
        
        .settings-feedback.error {
            background-color: #f44336;
        }
        
        .settings-feedback i {
            font-size: 18px;
        }
        
        .fade-out {
            animation: fade-out 0.5s ease-out forwards;
        }
        
        @keyframes slide-in {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes fade-out {
            from { opacity: 1; }
            to { opacity: 0; }
        }
        
        .settings-form small {
            display: block;
            color: #aaa;
            margin-top: 5px;
            font-size: 12px;
        }
        
        .timeout-save-btn {
            margin-top: 20px;
        }
    `;
  document.head.appendChild(style);
}
