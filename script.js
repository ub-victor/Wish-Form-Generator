document.addEventListener('DOMContentLoaded', function() {
    // Show/hide other wish textarea based on radio selection
    const autreRadio = document.getElementById('autre');
    const otherWishContainer = document.getElementById('otherWishContainer');
    const wishRadios = document.querySelectorAll('input[name="souhait"]');
    
    wishRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'autre') {
                otherWishContainer.style.display = 'block';
                // Add animation
                otherWishContainer.style.animation = 'fadeIn 0.5s ease';
            } else {
                otherWishContainer.style.display = 'none';
            }
        });
    });
    
    // Form submission handling
    const wishForm = document.getElementById('wishForm');
    const confirmationModal = document.getElementById('confirmationModal');
    const closeModal = document.querySelector('.close-modal');
    
    wishForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Simple form validation
        const nom = document.getElementById('nom').value;
        const prenom = document.getElementById('prenom').value;
        const email = document.getElementById('email').value;
        const souhait = document.querySelector('input[name="souhait"]:checked');
        
        if (!nom || !prenom || !email || !souhait) {
            alert('Please fill in all required fields!');
            return;
        }
        
        // Show loading state
        const submitBtn = document.querySelector('.btn-submit');
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        submitBtn.disabled = true;
        
        // Simulate processing delay
        setTimeout(() => {
            // Submit form via AJAX
            const formData = new FormData(wishForm);
            
            fetch('traitement.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.text())
            .then(data => {
                console.log('Success:', data);
                // Show confirmation modal
                confirmationModal.style.display = 'flex';
                // Reset form
                wishForm.reset();
                otherWishContainer.style.display = 'none';
            })
            .catch(error => {
                console.error('Error:', error);
                alert('There was an error submitting your wish. Please try again.');
            })
            .finally(() => {
                submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Make My Wish!';
                submitBtn.disabled = false;
            });
        }, 1500);
    });
    
    // Close modal
    closeModal.addEventListener('click', function() {
        confirmationModal.style.display = 'none';
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === confirmationModal) {
            confirmationModal.style.display = 'none';
        }
    });
    
    // Add some interactive effects
    const formGroups = document.querySelectorAll('.form-group');
    formGroups.forEach(group => {
        const input = group.querySelector('input, textarea');
        const label = group.querySelector('label');
        
        if (input) {
            // Add focus effect
            input.addEventListener('focus', function() {
                label.style.color = 'var(--primary-color)';
                label.style.fontWeight = '600';
            });
            
            input.addEventListener('blur', function() {
                if (!this.value) {
                    label.style.color = '';
                    label.style.fontWeight = '';
                }
            });
            
            // Add floating label effect if input has value on page load
            if (input.value) {
                label.style.color = 'var(--primary-color)';
                label.style.fontWeight = '600';
            }
        }
    });
    
    // Add animation to radio buttons when selected
    const radioGroups = document.querySelectorAll('.radio-group');
    radioGroups.forEach(group => {
        group.addEventListener('click', function() {
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = '';
            }, 200);
        });
    });
});