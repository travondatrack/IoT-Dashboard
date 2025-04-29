// Authentication functionality
document.addEventListener("DOMContentLoaded", function () {
  // Check if the user is already logged in
  const isLoggedIn = localStorage.getItem("isLoggedIn");

  // If on login page and already logged in, redirect to dashboard
  if (
    window.location.pathname.includes("login.html") &&
    isLoggedIn === "true"
  ) {
    window.location.href = "src/pages/index.html"; // Sửa đường dẫn
    return;
  }

  // If on dashboard and not logged in, redirect to login
  if (
    !window.location.pathname.includes("login.html") &&
    isLoggedIn !== "true"
  ) {
    window.location.href = "../../login.html"; // Sửa đường dẫn
    return;
  }

  // Handle login form submission
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;
      const remember = document.getElementById("remember").checked;
      const errorElement = document.getElementById("loginError");

      // Simple authentication (replace with real authentication in production)
      if (username === "admin" && password === "admin123") {
        // Store login state
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("username", username);
        localStorage.setItem("userId", username);

        // If remember me is checked, set a longer expiration
        if (remember) {
          const expirationDate = new Date();
          expirationDate.setDate(expirationDate.getDate() + 30);
          localStorage.setItem("loginExpiration", expirationDate.toString());
        }

        // Redirect to dashboard
        window.location.href = "src/pages/index.html"; // Sửa đường dẫn
      } else {
        errorElement.textContent = "Tên đăng nhập hoặc mật khẩu không đúng";

        // Shake animation for error
        loginForm.classList.add("shake");
        setTimeout(() => {
          loginForm.classList.remove("shake");
        }, 500);
      }
    });
  }

  // Simplified user dropdown - only logout
  const userElement = document.querySelector(".user");
  if (userElement) {
    // Update username in the header
    const username = localStorage.getItem("username") || "Admin";
    const usernameSpan = userElement.querySelector("span");
    if (usernameSpan) {
      usernameSpan.textContent = username;
    }

    // Handle logout functionality
    const logoutOption = document.querySelector(".dropdown-item");
    if (logoutOption) {
      logoutOption.addEventListener("click", function (e) {
        e.preventDefault();
        if (confirm("Bạn có muốn đăng xuất không?")) {
          localStorage.removeItem("isLoggedIn");
          localStorage.removeItem("username");
          localStorage.removeItem("loginExpiration");
          window.location.href = "../../login.html"; // Sửa đường dẫn
        }
      });
    }
  }

  // Chart initialization and other existing code
  const sensorChart = document.getElementById("sensorChart");
  if (sensorChart) {
    const ctx = sensorChart.getContext("2d");

    // Sample data for the chart
    const chart = new Chart(ctx, {
      type: "line",
      data: {
        labels: ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00"],
        datasets: [
          {
            label: "Nhiệt độ (°C)",
            data: [24, 23, 26, 28, 27, 25],
            borderColor: "#4361ee",
            backgroundColor: "rgba(67, 97, 238, 0.1)",
            tension: 0.3,
            fill: true,
          },
          {
            label: "Độ ẩm (%)",
            data: [70, 72, 68, 65, 67, 69],
            borderColor: "#4cc9f0",
            backgroundColor: "rgba(76, 201, 240, 0.1)",
            tension: 0.3,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animations: {
          tension: {
            duration: 1000,
            easing: "linear",
          },
        },
        plugins: {
          legend: {
            position: "top",
          },
        },
        scales: {
          y: {
            beginAtZero: false,
            grid: {
              drawBorder: false,
              color: "rgba(0, 0, 0, 0.05)",
            },
          },
          x: {
            grid: {
              display: false,
            },
          },
        },
      },
    });
  }

  // Navigation items click effect
  const navItems = document.querySelectorAll(".nav-item");
  if (navItems.length > 0) {
    navItems.forEach((item) => {
      item.addEventListener("click", function () {
        navItems.forEach((i) => i.classList.remove("active"));
        this.classList.add("active");
      });
    });
  }

  // Search input animation
  const searchInput = document.querySelector(".search input");
  if (searchInput) {
    searchInput.addEventListener("focus", function () {
      this.style.width = "350px";
      this.style.boxShadow = "0 0 8px rgba(67, 97, 238, 0.3)";
    });

    searchInput.addEventListener("blur", function () {
      this.style.width = "300px";
      this.style.boxShadow = "none";
    });
  }

  // Particles.js Configuration
  if (document.getElementById("particles-js")) {
    particlesJS("particles-js", {
      particles: {
        number: {
          value: 80,
          density: { enable: true, value_area: 800 },
        },
        color: { value: "#4361ee" },
        shape: {
          type: "circle",
          stroke: { width: 0, color: "#000000" },
          polygon: { nb_sides: 5 },
        },
        opacity: {
          value: 0.5,
          random: false,
          anim: { enable: false, speed: 1, opacity_min: 0.1, sync: false },
        },
        size: {
          value: 3,
          random: true,
          anim: { enable: false, speed: 40, size_min: 0.1, sync: false },
        },
        line_linked: {
          enable: true,
          distance: 150,
          color: "#4361ee",
          opacity: 0.4,
          width: 1,
        },
        move: {
          enable: true,
          speed: 3,
          direction: "none",
          random: false,
          straight: false,
          out_mode: "out",
          bounce: false,
          attract: { enable: false, rotateX: 600, rotateY: 1200 },
        },
      },
      interactivity: {
        detect_on: "canvas",
        events: {
          onhover: { enable: true, mode: "grab" },
          onclick: { enable: true, mode: "push" },
          resize: true,
        },
        modes: {
          grab: { distance: 140, line_linked: { opacity: 1 } },
          bubble: {
            distance: 400,
            size: 40,
            duration: 2,
            opacity: 8,
            speed: 3,
          },
          repulse: { distance: 200, duration: 0.4 },
          push: { particles_nb: 4 },
          remove: { particles_nb: 2 },
        },
      },
      retina_detect: true,
    });
  }
});

// Real-time Clock
document.addEventListener("DOMContentLoaded", function () {
  const clockElement = document.getElementById("clock");
  const dateElement = document.getElementById("date");

  function updateClock() {
    const now = new Date();

    // Format time: HH:MM:SS
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    const timeString = `${hours}:${minutes}:${seconds}`;

    // Format date: DD/MM/YYYY
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = now.getFullYear();
    const dateString = `${day}/${month}/${year}`;

    // Update elements if they exist
    if (clockElement) clockElement.textContent = timeString;
    if (dateElement) dateElement.textContent = dateString;
  }

  // Update immediately and then every second
  updateClock();
  setInterval(updateClock, 1000);
});

// Add shake animation to style.css
document.head.insertAdjacentHTML(
  "beforeend",
  `
<style>
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
    
    .shake {
        animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
    }
</style>
`
);
document.addEventListener("DOMContentLoaded", function () {
  const navItems = document.querySelectorAll(".nav-item");

  // Remove active class from all items and add to clicked item
  navItems.forEach((item) => {
    item.addEventListener("click", function () {
      navItems.forEach((nav) => nav.classList.remove("active"));
      this.classList.add("active");
    });

    // Set active class based on current page
    if (item.getAttribute("href") === location.pathname.split("/").pop()) {
      navItems.forEach((nav) => nav.classList.remove("active"));
      item.classList.add("active");
    }
  });
});

// Add fadeOut animation if it doesn't exist
document.head.insertAdjacentHTML(
  "beforeend",
  `
<style>
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
</style>
`
);

// Camera functionality
document.addEventListener("DOMContentLoaded", function () {
  // Get camera elements
  const connectButton = document.getElementById("connectCamera");
  const captureButton = document.getElementById("captureImage");
  const recordButton = document.getElementById("recordVideo");
  const cameraSelect = document.getElementById("cameraSelect");
  const cameraStatus = document.getElementById("cameraStatus");
  const refreshButton = document.getElementById("refreshCamera");
  const cameraPlaceholder = document.querySelector(".camera-placeholder");

  // Video stream variables
  let stream = null;
  let mediaRecorder = null;
  let recordedChunks = [];
  let isRecording = false;

  // Create video container
  const videoContainer = document.createElement("div");
  videoContainer.className = "camera-video-container";

  // Create video element
  const videoElement = document.createElement("video");
  videoElement.style.width = "100%";
  videoElement.style.height = "100%";
  videoElement.style.display = "none";
  videoElement.autoplay = true;

  // Add video to container
  videoContainer.appendChild(videoElement);

  // Add container to feed
  const cameraFeed = document.querySelector(".camera-feed");
  cameraFeed.insertBefore(videoContainer, cameraPlaceholder);

  // Connect to camera
  connectButton.addEventListener("click", async function () {
    try {
      if (stream) {
        // If already connected, disconnect
        stopCamera();
        return;
      }

      const constraints = {
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      };

      stream = await navigator.mediaDevices.getUserMedia(constraints);
      videoElement.srcObject = stream;
      videoElement.style.display = "block";
      cameraPlaceholder.style.display = "none";

      // Update UI
      connectButton.innerHTML = '<i class="fas fa-times"></i> Disconnect';
      cameraStatus.textContent = "Connected";
      cameraStatus.classList.remove("offline");
      cameraStatus.classList.add("online");
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert(
        "Failed to access camera. Please make sure camera permissions are enabled."
      );
    }
  });

  // Stop camera function
  function stopCamera() {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      stream = null;
      videoElement.srcObject = null;
      videoElement.style.display = "none";
      cameraPlaceholder.style.display = "flex";

      // Update UI
      connectButton.innerHTML = '<i class="fas fa-plug"></i> Connect';
      cameraStatus.textContent = "Disconnected";
      cameraStatus.classList.remove("online");
      cameraStatus.classList.add("offline");

      // Stop recording if active
      if (isRecording) {
        stopRecording();
      }
    }
  }

  // Capture image
  captureButton.addEventListener("click", function () {
    if (!stream) {
      alert("Please connect to a camera first");
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;

    const context = canvas.getContext("2d");
    context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

    // Save image
    const image = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = image;
    link.download = `camera-capture-${new Date().getTime()}.png`;
    link.click();

    // Show visual feedback
    const flashEffect = document.createElement("div");
    flashEffect.style.position = "absolute";
    flashEffect.style.top = "0";
    flashEffect.style.left = "0";
    flashEffect.style.width = "100%";
    flashEffect.style.height = "100%";
    flashEffect.style.backgroundColor = "white";
    flashEffect.style.opacity = "0.7";
    flashEffect.style.pointerEvents = "none";
    cameraFeed.appendChild(flashEffect);

    setTimeout(() => {
      cameraFeed.removeChild(flashEffect);
    }, 200);
  });

  // Record video
  recordButton.addEventListener("click", function () {
    if (!stream) {
      alert("Please connect to a camera first");
      return;
    }

    if (!isRecording) {
      startRecording();
    } else {
      stopRecording();
    }
  });

  // Start recording function
  function startRecording() {
    recordedChunks = [];
    const options = { mimeType: "video/webm; codecs=vp9" };

    try {
      mediaRecorder = new MediaRecorder(stream, options);
    } catch (e) {
      console.error("MediaRecorder error:", e);
      alert("Recording failed to start. Please try a different browser.");
      return;
    }

    mediaRecorder.ondataavailable = function (event) {
      if (event.data.size > 0) {
        recordedChunks.push(event.data);
      }
    };

    mediaRecorder.start();
    isRecording = true;
    recordButton.innerHTML = '<i class="fas fa-stop"></i> Stop';
    recordButton.style.backgroundColor = "#ef4444";

    // Add recording indicator
    const indicator = document.createElement("div");
    indicator.id = "recordingIndicator";
    indicator.style.position = "absolute";
    indicator.style.top = "10px";
    indicator.style.right = "10px";
    indicator.style.width = "15px";
    indicator.style.height = "15px";
    indicator.style.backgroundColor = "#ef4444";
    indicator.style.borderRadius = "50%";
    indicator.style.animation = "blink 1s infinite";
    cameraFeed.appendChild(indicator);

    // Add blinking animation
    const style = document.createElement("style");
    style.textContent = `
      @keyframes blink {
        0% { opacity: 1; }
        50% { opacity: 0.3; }
        100% { opacity: 1; }
      }
    `;
    document.head.appendChild(style);
  }

  // Stop recording function
  function stopRecording() {
    mediaRecorder.stop();
    isRecording = false;
    recordButton.innerHTML = '<i class="fas fa-record-vinyl"></i> Record';
    recordButton.style.backgroundColor = "";

    // Remove recording indicator
    const indicator = document.getElementById("recordingIndicator");
    if (indicator) {
      cameraFeed.removeChild(indicator);
    }

    // Save recorded video
    mediaRecorder.onstop = function () {
      const blob = new Blob(recordedChunks, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `camera-recording-${new Date().getTime()}.webm`;
      link.click();

      // Clean up
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 100);
    };
  }

  // Refresh camera
  refreshButton.addEventListener("click", function () {
    if (stream) {
      stopCamera();
      setTimeout(() => {
        connectButton.click();
      }, 500);
    } else {
      connectButton.click();
    }

    // Add rotation animation
    refreshButton.style.transition = "transform 1s ease";
    refreshButton.style.transform = "rotate(360deg)";
    setTimeout(() => {
      refreshButton.style.transform = "";
    }, 1000);
  });

  // Handle camera selection change
  cameraSelect.addEventListener("change", function () {
    if (stream) {
      stopCamera();
      setTimeout(() => {
        connectButton.click();
      }, 500);
    }
  });

  // Clean up on page unload
  window.addEventListener("beforeunload", function () {
    if (stream) {
      stopCamera();
    }
  });
});
