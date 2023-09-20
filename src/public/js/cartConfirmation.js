function purchaseCart(cartId) {
    // JavaScript code here
    axios.post(`/api/carts/${cartId}/purchase`)
      .then(response => {
        window.location.href = `/products`;
        alert("Successful purchase! Please review your email with the confirmation!")
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

  function removeFromCart(cartId, productId) {
    console.log(JSON.stringify(cartId))
    console.log(JSON.stringify(productId))
    // JavaScript code here
    axios.delete(`/api/carts/${cartId}/product/${productId}`)
      .then(response => {
        location.reload()
      })
      /*.catch(error => {
        // Handle errors
        alert(error.response.data.error)
        console.error(error.response.data.error);
      });*/
  }