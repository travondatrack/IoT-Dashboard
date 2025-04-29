document.addEventListener('DOMContentLoaded', function() {
    // Load sidebar component
    const sidebarContainer = document.getElementById('sidebar-container');
    if (sidebarContainer) {
        fetch('../components/sidebar.html')
            .then(response => response.text())
            .then(data => {
                sidebarContainer.innerHTML = data;
                
                // Đánh dấu active cho menu item hiện tại
                const currentPage = window.location.pathname.split('/').pop() || 'index.html';
                const navItems = document.querySelectorAll('.nav-item');
                
                // Set active class based on current page
                navItems.forEach(item => {
                    if (item.getAttribute('href') === currentPage) {
                        item.classList.add('active');
                    } else {
                        item.classList.remove('active');
                    }
                });
                
                // Add click event listeners
                navItems.forEach(item => {
                    item.addEventListener('click', function() {
                        navItems.forEach(nav => nav.classList.remove('active'));
                        this.classList.add('active');
                    });
                });
            })
            .catch(error => console.error('Error loading sidebar:', error));
    }
});