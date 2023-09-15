function purchaseCart(cartId) {
    // JavaScript code here
    axios.post(`http://localhost:8080/api/carts/${cartId}/purchase`)
      .then(response => {
        window.location.href = `/`;
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