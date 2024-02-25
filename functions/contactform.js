export function onRequest(context) {
  const formData = new URLSearchParams(context.request.body);
  const name = formData.get("name");
  const email = formData.get("email");
  const message = formData.get("message");

  // TODO send email
  fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: {
      "Authorization": "Bearer " + context.env.sendgridkey,
      "Content-Type": "Content-Type: application/json",
    },
    body: new URLSearchParams(formData).toString()
  })
    .then(() => {
      console.log("Successfully sent email: ", name, email, message);
      return new Response("Success");
    })
    .catch((error) => {
      console.log("Error sending email: ", name, email, message, error);
      return new Response("Error", { status: 500 });
    });
}