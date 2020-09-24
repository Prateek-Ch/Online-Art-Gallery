var $form = $('#checkout-form');

$form.submit(function(event){
  $form.find('button').prop('disabled',true);
  Stripe.card.createToken({
       number: $('#cc-number').val(),
       cvc: $('#card-cvv').val(),
       exp_month: $('#card-expiry-month').val(),
       exp_year: $('#card-expiry-year').val(),
       name: $('#cc-name').val()
   }, stripeResponseHandler);
   return false;
})

function stripeResponseHandler(status, response) {
    if (response.error) { // Problem!

    $form.find('button').prop('disabled', false); // Re-enable submission

    } else { // Token was created!

        // Get the token ID:
        var token = response.id;

        // Insert the token into the form so it gets submitted to the server:
        $form.append($('<input type="hidden" name="stripeToken" />').val(token));

        // Submit the form:
        $form.get(0).submit();

    }
}
