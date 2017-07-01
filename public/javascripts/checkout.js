Stripe.setPublishableKey('pk_test_DgMnsU7Fc3X8frECqje5LfN7');

var $form = $('#checkout-form');

$form.submit(function (event) {
    $form.find('button').prop('disabled', true);
              var reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
         if(!reg.test($('#name').val())) {
        $("#charge-error").html("");
        $("#charge-error").prepend("<p class='alert alert-danger'>Email is not valid!</p>");
         $form.find('button').prop('disabled', false);
         }
         else{
    Stripe.card.createToken({
        number: $('#card-number').val(),
        cvc: $('#card-cvc').val(),
        exp_month: $('#card-expiry-month').val(),
        exp_year: $('#card-expiry-year').val(),
        name: $('#card-name').val()
    }, stripeResponseHandler)};
    return false;
});

function stripeResponseHandler(status, response) {
    if (response.error) { // Problem!

        // Show the errors on the form
        $("#charge-error").html("");
        $('#charge-error').append("<p class='alert alert-danger'> "+response.error.message +" </p>");
        $form.find('button').prop('disabled', false); // Re-enable submission

    } else { // Token was created!

        // Get the token ID:
        var token = response.id;

        // Insert the token into the form so it gets submitted to the server:
        $("#charge-error").hide();
        $form.append($('<input type="hidden" name="stripeToken" />').val(token));
        $(".formContainer").prepend("<p class='alert alert-success'>H αγορά σας ολοκληθώκε επιτυχώς! θα ανακατευθυνθείτε στην αρχικη σελιδα </p>")
        $(function() {
          setTimeout(function() {
          $form.get(0).submit();
          }, 5000);
        });
    }
}