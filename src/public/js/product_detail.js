const cartId = document.getElementById('cartId');
function addProduct(idProduct) {
    // JavaScript code here
    axios.post(`http://localhost:8080/api/carts/${cartId.value}/product/${idProduct}`)
      .then(response => {
        window.location.href = `/carts/${cartId.value}`;
      })
      .catch(error => {
        // Handle errors
        console.error(error);
      });
  }
function checkScriptLoad() {
    console.log('Script loaded successfully.');
    // Perform additional validation or actions
  }