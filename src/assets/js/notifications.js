document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const filterButtons = document.querySelectorAll('.filter-btn');
    const notificationItems = document.querySelectorAll('.notification-item');
    const markReadButtons = document.querySelectorAll('.mark-read');
    const deleteButtons = document.querySelectorAll('.delete-notification');
    const prevPageBtn = document.querySelector('.pagination-btn:first-child');
    const nextPageBtn = document.querySelector('.pagination-btn:last-child');
    const paginationInfo = document.querySelector('.pagination-info');
    
    // Variables for pagination
    let currentPage = 1;
    const itemsPerPage = 5;
    let totalPages = Math.ceil(notificationItems.length / itemsPerPage);
    
    // Initialize page
    updatePaginationInfo();
    showNotificationsForCurrentPage();
    
    // Filter notifications
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get filter type
            const filterType = this.textContent.toLowerCase();
            
            // Filter notifications
            filterNotifications(filterType);
            
            // Reset pagination
            currentPage = 1;
            updatePaginationInfo();
            showNotificationsForCurrentPage();
        });
    });
    
    // Mark notification as read
    markReadButtons.forEach(button => {
        button.addEventListener('click', function() {
            const notificationItem = this.closest('.notification-item');
            notificationItem.style.opacity = '0.6';
            notificationItem.style.borderLeftColor = '#999';
        });
    });
    
    // Delete notification
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const notificationItem = this.closest('.notification-item');
            notificationItem.style.height = '0';
            notificationItem.style.opacity = '0';
            notificationItem.style.padding = '0';
            notificationItem.style.margin = '0';
            notificationItem.style.overflow = 'hidden';
            
            // Remove from DOM after animation
            setTimeout(() => {
                notificationItem.remove();
                // Update pagination
                totalPages = Math.ceil(document.querySelectorAll('.notification-item:not([style*="display: none"])').length / itemsPerPage);
                if (currentPage > totalPages) {
                    currentPage = totalPages || 1;
                }
                updatePaginationInfo();
                showNotificationsForCurrentPage();
            }, 300);
        });
    });
    
    // Pagination controls
    prevPageBtn.addEventListener('click', function() {
        if (currentPage > 1) {
            currentPage--;
            updatePaginationInfo();
            showNotificationsForCurrentPage();
        }
    });
    
    nextPageBtn.addEventListener('click', function() {
        if (currentPage < totalPages) {
            currentPage++;
            updatePaginationInfo();
            showNotificationsForCurrentPage();
        }
    });
    
    // Functions
    function filterNotifications(type) {
        const visibleItems = document.querySelectorAll('.notification-item');
        
        visibleItems.forEach(item => {
            if (type === 'tất cả') {
                item.style.display = 'flex';
            } else if (type === 'cảnh báo' && item.classList.contains('alert')) {
                item.style.display = 'flex';
            } else if (type === 'hệ thống' && item.classList.contains('system')) {
                item.style.display = 'flex';
            } else if (type === 'thiết bị' && item.classList.contains('device')) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
        
        // Update total pages based on visible items
        totalPages = Math.ceil(document.querySelectorAll('.notification-item:not([style*="display: none"])').length / itemsPerPage);
    }
    
    function updatePaginationInfo() {
        paginationInfo.textContent = `Trang ${currentPage}/${totalPages || 1}`;
    }
    
    function showNotificationsForCurrentPage() {
        const visibleItems = document.querySelectorAll('.notification-item:not([style*="display: none"])');
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        
        visibleItems.forEach((item, index) => {
            if (index >= startIndex && index < endIndex) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    }
    
    // Add notification date/time formatting
    document.querySelectorAll('.notification-time').forEach(timeElement => {
        // This could be enhanced with a proper timestamp conversion
        // For now we'll just keep the existing text
    });
});