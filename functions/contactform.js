export async function onRequest(context) {
  const formData = await context.request.formData();
  const name = formData.get("name");
  const email = formData.get("email");
  const message = formData.get("message");

  const data = {
    personalizations: [
      {
        to: [{ email: 'omegasol11@gmail.com' }],
      },
      {
        from: {
          email: email
        }
      },
      {
        replyTo: {
          email: email
        }
      }
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
        "Authorization": `Bearer ${context.env.sendgridkey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data)
    });
    if (res.ok) {
      console.log("Successfully sent email: ", name, email, message);
      return new Response("Success");
    } else {
      console.log("Error sending email: ", name, email, message, res.status + " " + res.statusText);
      console.log('res', await res.json())
      return new Response("Error", { status: 500 });
    }
  } catch (e) {
    console.log("Error sending email: ", name, email, message, e);
    return new Response("Error", { status: 500 });
  }
}