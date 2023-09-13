const form = document.getElementById('registerForm');

form.addEventListener('submit', async e => {
    e.preventDefault();

    const data = new FormData(form);

    // Get the image file input element
    const imageInput = document.querySelector('input[type="file"][name="avatar"]');
    
    // Check if an image was selected
    if (imageInput.files.length > 0) {
        // Append the image file to the FormData object
        data.append('avatar', imageInput.files[0]);
    }

    try {
        const response = await fetch('/api/session/register', {
            method: 'POST',
            body: data
        });

        if (response.status === 200) {
            window.location.replace('/');
        } else {
            console.error('Error uploading data:', response.status);
        }
    } catch (error) {
        console.error('Error:', error);
    }
});
