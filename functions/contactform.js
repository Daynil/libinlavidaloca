export async function onRequest(context) {
  console.log('ctx', context)
  const formData = new URLSearchParams(context.request.body);
  const name = formData.get("name");
  const email = formData.get("email");
  const message = formData.get("message");

  const data = {
    personalizations: [
      {
        to: [{ email: 'omegasol11@gmail.com' }],
        replayTo: {
          email: email
        }
      },
    ],
    subject: 'libinlavidaloca - Contact Form Message',
    content: [
      {
        type: 'text/html',
        value: `Received a contact form message from ${name}, email: ${email}:<br><br>${message}`
      }
    ],
  };

  // TODO send email
  try {
    const res = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + context.env.sendgridkey,
        "Content-Type": "Content-Type: application/json",
      },
      body: JSON.stringify(data)
    });
    console.log('res', res)
    console.log("Successfully sent email: ", name, email, message);
    return new Response("Success");
  } catch (e) {
    console.log("Error sending email: ", name, email, message, e);
    return new Response("Error", { status: 500 });
  }
}