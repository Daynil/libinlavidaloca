export function onRequest(context) {
  const formData = new URLSearchParams(context.body);
  const name = formData.get("name");
  const email = formData.get("email");
  const message = formData.get("message");
  // TODO send email
  console.log("Sent email: ", name, email, message);
  return new Response("Success");
}