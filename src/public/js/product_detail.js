
function addProduct(idProduct,cartId) {
    // JavaScript code here
    axios.post(`http://localhost:8080/api/carts/${cartId}/product/${idProduct}`)
      .then(response => {
        window.location.href = `/carts/${cartId}`;
      })
      .catch(error => {
        // Handle errors
        alert(error.response.data.error)
        console.error(error.response.data.error);
      });
  }
function checkScriptLoad() {
    console.log('Script loaded successfully.');
    // Perform additional validation or actions
  }