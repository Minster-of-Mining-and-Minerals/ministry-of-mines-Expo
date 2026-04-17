let currentFilterType = null;

function toggleResourceFilter(type, element) {
    const children = document.querySelectorAll('.child');
    const tags = document.querySelectorAll('.region-status .res-tag');

    // If clicking the same type, clear the filter
    if (currentFilterType === type) {
        currentFilterType = null;
        
        // Reset all visuals
        children.forEach(child => child.classList.remove('d-none'));
        tags.forEach(tag => tag.style.opacity = '1');
    } else {
        currentFilterType = type;
        
        // Filter elements
        children.forEach(child => {
            if (child.getAttribute('data-type') === type) {
                child.classList.remove('d-none');
            } else {
                child.classList.add('d-none');
            }
        });
        
        // Highlight active tag
        tags.forEach(tag => {
            if (tag.innerText.trim() === type.trim()) {
                tag.style.opacity = '1';
            } else {
                tag.style.opacity = '0.5';
            }
        });
    }
}
