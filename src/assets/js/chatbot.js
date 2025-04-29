document.addEventListener("DOMContentLoaded", function () {
  const chatbotContainer = document.getElementById("chatbot-container");
  const chatMessages = document.getElementById("chat-messages");
  const userInput = document.getElementById("user-input");
  const sendButton = document.getElementById("send-button");
  const chatToggle = document.getElementById("chat-toggle");
  const chatClose = document.getElementById("chat-close");
  // Add image upload button
  const imageUploadButton = document.createElement("button");
  imageUploadButton.id = "image-upload-button";
  imageUploadButton.innerHTML = '<i class="fas fa-image"></i>';
  imageUploadButton.title = "Upload image";
  const imageInput = document.createElement("input");
  imageInput.type = "file";
  imageInput.accept = "image/*";
  imageInput.style.display = "none";
  imageInput.id = "image-input";
  userInput.parentNode.insertBefore(imageUploadButton, sendButton);
  userInput.parentNode.appendChild(imageInput);

  let currentImageUrl = null;

  // Replace this with a more secure approach
  const openRouterApiKey =
    "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";

  // Kết nối với chatbot server
  const chatbotServerUrl = "http://localhost:3000/api";

  // Hiển thị/ẩn chatbot
  if (chatToggle) {
    chatToggle.addEventListener("click", function () {
      if (chatbotContainer.classList.contains("hidden")) {
        chatbotContainer.classList.remove("hidden");
      } else {
        chatbotContainer.classList.add("hidden");
      }
    });
  }

  // Close chatbot when clicking the X button
  if (chatClose) {
    chatClose.addEventListener("click", function () {
      chatbotContainer.classList.add("hidden");
    });
  }

  // Handle image uploads
  imageUploadButton.addEventListener("click", function () {
    imageInput.click();
  });

  imageInput.addEventListener("change", function (e) {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onload = function (event) {
        currentImageUrl = event.target.result;
        // Display image preview in chat
        addMessage(
          "user",
          `<img src="${currentImageUrl}" alt="Uploaded image" style="max-width: 200px; max-height: 200px;">`
        );
      };

      reader.readAsDataURL(file);
    }
  });

  // Xử lý khi người dùng gửi tin nhắn
  function handleUserMessage() {
    const message = userInput.value.trim();
    if (message || currentImageUrl) {
      // Hiển thị tin nhắn người dùng (if text message exists)
      if (message) {
        addMessage("user", message);
      }

      userInput.value = "";

      // If message starts with "/gpt", use AIML API instead
      if (message.startsWith("/gpt")) {
        const actualMessage = message.substring(4).trim();
        processWithAIMLAPI(actualMessage);
        return;
      }

      // If message starts with "/qwen", use OpenRouter with Qwen model
      if (message.startsWith("/qwen")) {
        const actualMessage = message.substring(6).trim();
        processWithOpenRouter(actualMessage);
        return;
      }

      // If message starts with "/gemini", use Gemini model
      if (message.startsWith("/gemini")) {
        const actualMessage = message.substring(8).trim();
        processWithGemini(actualMessage);
        return;
      }

      // If message is "/help", show help message
      if (message === "/help") {
        const helpMessage = `
          **Available Commands:**
          
          **/gpt** [message] - Process with GPT-4o model
          **/qwen** [message] - Process with Qwen model
          **/gemini** [message] - Process with Google's Gemini model
          **/help** - Show this help message
          
          You can also upload an image to have it analyzed.
        `;
        addMessage("bot", helpMessage);
        return;
      }

      // If we have an image, use OpenRouter API
      if (currentImageUrl) {
        processImageWithAI(
          message || "What is in this image?",
          currentImageUrl
        );
        currentImageUrl = null; // Reset after sending
      } else {
        // Handle regular chatbot messages
        fetch(`${chatbotServerUrl}/message`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: localStorage.getItem("userId") || "anonymous",
            message: message,
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            // Handle multiple responses
            if (Array.isArray(data.responses)) {
              // Display multiple responses with delay between them
              displayMultipleResponses(data.responses);
            } else if (data.response) {
              // Handle the original single response format
              addMessage("bot", data.response);
            } else {
              addMessage("bot", "Không có phản hồi từ hệ thống.");
            }
          })
          .catch((error) => {
            console.error("Error:", error);
            addMessage(
              "bot",
              "Xin lỗi, có lỗi xảy ra khi kết nối với chatbot."
            );
          });
      }
    }
  }

  // Function to process images with OpenRouter API
  function processImageWithAI(message, imageUrl) {
    addMessage("bot", "Analyzing image...");

    fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openRouterApiKey}`,
        "HTTP-Referer": window.location.origin,
        "X-Title": "IoT Dashboard Assistant",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "qwen/qwen2.5-vl-32b-instruct:free",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: message,
              },
              {
                type: "image_url",
                image_url: {
                  url: imageUrl,
                },
              },
            ],
          },
        ],
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.choices && data.choices[0] && data.choices[0].message) {
          const responseContent = data.choices[0].message.content;
          addMessage("bot", responseContent);
        } else {
          addMessage("bot", "Sorry, I couldn't analyze the image properly.");
        }
      })
      .catch((error) => {
        console.error("Error analyzing image:", error);
        addMessage("bot", "Sorry, there was an error analyzing the image.");
      });
  }

  // Function to process messages with AIML API (GPT-4o)
  function processWithAIMLAPI(message) {
    addMessage("bot", "Processing with GPT-4o...");

    fetch("https://api.aimlapi.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: "Bearer YOUR_AIMLAPI_KEY",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: message,
          },
        ],
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.choices && data.choices[0] && data.choices[0].message) {
          const responseContent = data.choices[0].message.content;
          addMessage("bot", responseContent);
        } else {
          addMessage("bot", "Sorry, I couldn't process your request properly.");
        }
      })
      .catch((error) => {
        console.error("Error using AIML API:", error);
        addMessage("bot", "Sorry, there was an error processing your request.");
      });
  }

  // Function to process text messages with OpenRouter using OpenAI client format
  function processWithOpenRouter(message) {
    addMessage("bot", "Processing with Qwen model...");

    // Create request data in OpenAI format
    const requestData = {
      model: "qwen/qwq-32b",
      messages: [
        {
          role: "user",
          content: message,
        },
      ],
    };

    // Send request to OpenRouter
    fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openRouterApiKey}`,
        "HTTP-Referer": window.location.origin,
        "X-Title": "IoT Dashboard Assistant",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.choices && data.choices[0] && data.choices[0].message) {
          const responseContent = data.choices[0].message.content;
          addMessage("bot", responseContent);
        } else {
          addMessage("bot", "Sorry, I couldn't process your request properly.");
        }
      })
      .catch((error) => {
        console.error("Error using OpenRouter API:", error);
        addMessage("bot", "Sorry, there was an error processing your request.");
      });
  }

  // Function to process messages with Google's Gemini model
  function processWithGemini(message) {
    addMessage("bot", "Processing with Gemini...");

    // Since @google/genai is a Node.js package, we need to use a REST API approach
    fetch("http://localhost:3000/api/gemini", {
      // You'll need to create this endpoint on your server
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: message,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.response) {
          addMessage("bot", data.response);
        } else {
          addMessage(
            "bot",
            "Sorry, I couldn't process your request with Gemini."
          );
        }
      })
      .catch((error) => {
        console.error("Error using Gemini API:", error);
        addMessage(
          "bot",
          "Sorry, there was an error processing your request with Gemini."
        );
      });
  }

  // Function to display multiple responses with delay
  function displayMultipleResponses(responses) {
    let delay = 0;
    const delayIncrement = 800; // Milliseconds between responses

    responses.forEach((response, index) => {
      setTimeout(() => {
        addMessage("bot", response);
      }, delay);
      delay += delayIncrement + response.length * 10; // Longer messages get more delay
    });
  }

  // Thêm tin nhắn vào cửa sổ chat
  function addMessage(sender, content) {
    const messageElement = document.createElement("div");
    messageElement.className = `chat-message ${sender}-message`;
    messageElement.innerHTML = `
        <span class="message-content">${formatMessage(content)}</span>
        <span class="message-time">${new Date().toLocaleTimeString()}</span>
      `;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // Format message with markdown-like syntax
  function formatMessage(message) {
    // Handle bold text with **text**
    message = message.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

    // Handle italic text with _text_
    message = message.replace(/_(.*?)_/g, "<em>$1</em>");

    // Handle links with [text](url)
    message = message.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" target="_blank">$1</a>'
    );

    // Preserve line breaks
    message = message.replace(/\n/g, "<br>");

    return message;
  }

  // Gửi tin nhắn khi click nút gửi
  if (sendButton) {
    sendButton.addEventListener("click", handleUserMessage);
  }

  // Gửi tin nhắn khi nhấn Enter
  if (userInput) {
    userInput.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        handleUserMessage();
      }
    });
  }

  // Tin nhắn chào mừng ban đầu
  setTimeout(() => {
    addMessage(
      "bot",
      "Xin chào! Tôi là trợ lý IoT của bạn. Tôi có thể giúp gì cho bạn hôm nay?"
    );
  }, 500);
});

// On your Node.js server
const { GoogleGenAI } = require("@google/genai");

// Setup the API (securely get this from environment variables)
const genAI = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENAI_API_KEY });

app.post("/api/gemini", async (req, res) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(req.body.message);
    res.json({ response: result.response.text() });
  } catch (error) {
    console.error("Gemini API error:", error);
    res.status(500).json({ error: "Failed to process with Gemini" });
  }
});
