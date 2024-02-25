export async function onRequest(context) {
  const formData = await context.request.formData();
  const name = formData.get("name");
  const email = formData.get("email");
  const message = formData.get("message");

  const alertsRoleTagCode = '<@&858752339761168384>';
  const DISCORD_MESSAGE_MAX_LENGTH = 2000;

  // TODO send email
  try {
    const sentMessage = `Received a contact form message from ${name}, email: ${email}: ${message}`;

    const res = await fetch(context.env.DISCORD_HOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        queryParams: { wait: true },
        content: `${alertsRoleTagCode}, ${sentMessage.substring(
          0,
          DISCORD_MESSAGE_MAX_LENGTH - `${alertsRoleTagCode}, ...`.length - 10
        )}...`

      }
    });
    if (res.ok) {
      console.log("Successfully sent discord msg: ", name, email, message);
      return new Response("Success");
    } else {
      console.log("Error sending discord msg: ", name, email, message, res.status + " " + res.statusText);
      console.log('res', await res.json())
      return new Response("Error", { status: 500 });
    }
  } catch (e) {
    console.log("Error sending discord msg: ", name, email, message, e);
    return new Response("Error", { status: 500 });
  }
}