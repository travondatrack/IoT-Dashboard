// Add this function to your data.js file
function showNotification(message, type = "info") {
  console.log(`${type.toUpperCase()}: ${message}`);
  // Implement actual notification display logic here
}

// Azure Cosmos DB functionality
document.addEventListener("DOMContentLoaded", function () {
  // Cosmos DB Elements
  const cosmosConnectBtn = document.getElementById("cosmosConnectBtn");
  const cosmosConnectionStatus = document.getElementById(
    "cosmosConnectionStatus"
  );
  const cosmosOperations = document.querySelector(".cosmos-operations");
  const cosmosContainerSelect = document.getElementById(
    "cosmosContainerSelect"
  );
  const cosmosQueryInput = document.getElementById("cosmosQueryInput");
  const executeQueryBtn = document.getElementById("executeQueryBtn");
  const queryResults = document.getElementById("queryResults");

  // Server API configuration
  const apiConfig = {
    baseUrl: "https://iot-dashboard-1-qzoi.onrender.com", // Your Node.js server address
    endpoints: {
      containers: "/containers",
      query: "/query",
    },
  };

  // Function to save state to localStorage
  function saveState(key, value) {
    localStorage.setItem(`cosmosDb_${key}`, JSON.stringify(value));
  }

  // Function to load state from localStorage
  function loadState(key) {
    const value = localStorage.getItem(`cosmosDb_${key}`);
    return value ? JSON.parse(value) : null;
  }

  // Function to restore connection UI
  function restoreConnectionUI(isConnected) {
    if (isConnected) {
      cosmosConnectionStatus.innerHTML =
        '<i class="fas fa-check-circle"></i> Connected';
      cosmosConnectionStatus.className = "connected";
      cosmosOperations.style.display = "block";
    } else {
      cosmosConnectionStatus.innerHTML = "Disconnected";
      cosmosConnectionStatus.className = "";
      cosmosOperations.style.display = "none";
    }
  }

  // Function to restore containers dropdown
  function restoreContainersDropdown(containers) {
    if (!containers || !Array.isArray(containers)) return;

    cosmosContainerSelect.innerHTML =
      '<option value="">Select a container</option>';
    containers.forEach((container) => {
      const option = document.createElement("option");
      option.value = container.id;
      option.textContent = container.id;
      cosmosContainerSelect.appendChild(option);
    });

    // Restore selected container
    const selectedContainer = loadState("selectedContainer");
    if (selectedContainer) {
      cosmosContainerSelect.value = selectedContainer;
    }
  }

  // Function to restore query results
  function restoreQueryResults() {
    const results = loadState("queryResults");
    const queryError = loadState("queryError");

    if (queryError) {
      queryResults.innerHTML = `
        <div class="query-error">
          <i class="fas fa-exclamation-triangle"></i>
          <p>Error executing query: ${queryError}</p>
        </div>
      `;
    } else if (results) {
      if (results.length === 0) {
        queryResults.innerHTML = `
          <div class="empty-results">
            <i class="fas fa-info-circle"></i>
            <p>Query returned no results</p>
          </div>
        `;
      } else {
        queryResults.innerHTML = `
          <div class="results-count">${results.length} results found</div>
          <pre class="results-json">${JSON.stringify(results, null, 2)}</pre>
        `;
      }
    }
  }

  if (cosmosConnectBtn) {
    // Initialize with default query or restore saved query
    const savedQuery = loadState("queryInput");
    cosmosQueryInput.value = savedQuery || "SELECT * FROM c LIMIT 10";

    // Check if there was a previous connection and restore state
    const isConnected = loadState("isConnected");
    if (isConnected) {
      const containers = loadState("containers");
      restoreConnectionUI(true);
      restoreContainersDropdown(containers);
      restoreQueryResults();
    }

    // Save query input when it changes
    cosmosQueryInput.addEventListener("input", function () {
      saveState("queryInput", cosmosQueryInput.value);
    });

    // Save selected container when it changes
    cosmosContainerSelect.addEventListener("change", function () {
      saveState("selectedContainer", cosmosContainerSelect.value);
    });

    cosmosConnectBtn.addEventListener("click", async function () {
      try {
        // Connect to Cosmos DB via our backend
        cosmosConnectionStatus.innerHTML =
          '<i class="fas fa-spinner fa-spin"></i> Connecting...';
        cosmosConnectionStatus.className = "connecting";

        // Fetch container list from backend
        const response = await fetch(
          apiConfig.baseUrl + apiConfig.endpoints.containers
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch containers");
        }

        const containers = await response.json();

        // Save containers to localStorage
        saveState("containers", containers);
        saveState("isConnected", true);

        // Update container dropdown
        cosmosContainerSelect.innerHTML =
          '<option value="">Select a container</option>';
        containers.forEach((container) => {
          const option = document.createElement("option");
          option.value = container.id;
          option.textContent = container.id;
          cosmosContainerSelect.appendChild(option);
        });

        // Update UI
        cosmosConnectionStatus.innerHTML =
          '<i class="fas fa-check-circle"></i> Connected';
        cosmosConnectionStatus.className = "connected";
        cosmosOperations.style.display = "block";

        showNotification(
          "Connected to Azure Cosmos DB successfully",
          "success"
        );
      } catch (error) {
        console.error("Cosmos DB connection error:", error);
        cosmosConnectionStatus.innerHTML =
          '<i class="fas fa-times-circle"></i> Connection Failed';
        cosmosConnectionStatus.className = "error";

        // Save connection state
        saveState("isConnected", false);

        showNotification(
          `Failed to connect to Cosmos DB: ${error.message}`,
          "error"
        );
      }
    });

    executeQueryBtn.addEventListener("click", async function () {
      const containerId = cosmosContainerSelect.value;
      const query = cosmosQueryInput.value.trim();

      if (!containerId) {
        showNotification("Please select a container", "error");
        return;
      }

      if (!query) {
        showNotification("Please enter a query", "error");
        return;
      }

      try {
        // Save current query and clear any previous errors
        saveState("queryInput", query);
        saveState("queryError", null);

        // Show loading indicator
        queryResults.innerHTML =
          '<div class="loading-results"><i class="fas fa-spinner fa-spin"></i> Executing query...</div>';

        // Execute query via backend
        const response = await fetch(
          apiConfig.baseUrl + apiConfig.endpoints.query,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              containerId,
              query,
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Query execution failed");
        }

        const resources = await response.json();

        // Save query results with timestamp and container info
        const queryData = {
          timestamp: new Date().toISOString(),
          container: containerId,
          query: query,
          results: resources,
        };

        // Save current query results
        saveState("queryResults", queryData);

        // Save to history (keep last 10 queries)
        let queryHistory = loadState("queryHistory") || [];
        queryHistory.unshift(queryData);
        queryHistory = queryHistory.slice(0, 10); // Keep only last 10 queries
        saveState("queryHistory", queryHistory);

        // Display results
        if (resources.length === 0) {
          queryResults.innerHTML = `
            <div class="empty-results">
              <i class="fas fa-info-circle"></i>
              <p>Query returned no results</p>
            </div>
          `;
        } else {
          // Create a formatted results display
          queryResults.innerHTML = `
            <div class="results-count">${resources.length} results found</div>
            <pre class="results-json">${JSON.stringify(
              resources,
              null,
              2
            )}</pre>
          `;
        }
      } catch (error) {
        console.error("Query execution error:", error);
        queryResults.innerHTML = `
          <div class="query-error">
            <i class="fas fa-exclamation-triangle"></i>
            <p>Error executing query: ${error.message}</p>
          </div>
        `;

        // Save error state
        saveState("queryError", error.message);
        saveState("queryResults", null);

        showNotification(`Query error: ${error.message}`, "error");
      }
    });

    // Add disconnect button
    const disconnectBtn = document.createElement("button");
    disconnectBtn.id = "cosmosDisconnectBtn";
    disconnectBtn.className = "primary-btn";
    disconnectBtn.innerHTML = '<i class="fas fa-unlink"></i> Disconnect';
    disconnectBtn.style.marginLeft = "10px";
    disconnectBtn.style.backgroundColor = "#ef4444";

    // Add disconnect button after connect button
    cosmosConnectBtn.parentNode.appendChild(disconnectBtn);

    // Disconnect button event listener
    disconnectBtn.addEventListener("click", function () {
      // Clear all saved state
      saveState("isConnected", false);
      saveState("containers", null);
      saveState("selectedContainer", null);
      saveState("queryResults", null);
      saveState("queryError", null);

      // Reset UI
      cosmosConnectionStatus.innerHTML = "Disconnected";
      cosmosConnectionStatus.className = "";
      cosmosOperations.style.display = "none";
      cosmosContainerSelect.innerHTML =
        '<option value="">Select a container</option>';
      queryResults.innerHTML = `
        <div class="empty-results">
          <i class="fas fa-database"></i>
          <p>No results to display</p>
        </div>
      `;

      showNotification("Disconnected from Azure Cosmos DB", "info");
    });
  }
});
