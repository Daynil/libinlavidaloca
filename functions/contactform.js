export async function onRequest(context) {
    const formData = await context.request.formData();
    const name = formData.get("name");
    const email = formData.get("email");
    const message = formData.get("message");

    const alertsRoleTagCode = '<@&858752339761168384>';
    const DISCORD_MESSAGE_MAX_LENGTH = 2000;

    try {
        const sentMessage = `[libinlavidaloca] Received a contact form message from ${name}, email: ${email}: ${message}`;
        const totalMessageLength = `${alertsRoleTagCode}, ${sentMessage}...`.length - 10

        const discordMessages = [];

        let piecesNeeded = Math.ceil(totalMessageLength / DISCORD_MESSAGE_MAX_LENGTH);
        // Just in case...
        if (piecesNeeded > 10) {
            piecesNeeded = 10;
        }
        for (let i = 0; i < piecesNeeded; i++) {
            const startIdx = i * (DISCORD_MESSAGE_MAX_LENGTH - 30);
            const endIdx = (i + 1) * (DISCORD_MESSAGE_MAX_LENGTH - 30);
            discordMessages.push(sentMessage.substring(startIdx, endIdx));
        }

        console.log("discord messages", discordMessages)

        let errors = 0;
        for await (const msg of discordMessages) {
            console.log("individual msg", msg)
            const res = await fetch(`${context.env.DISCORD_HOOK_URL}?wait=true`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    content: `${alertsRoleTagCode} ${msg}`
                })
            });

            if (!res.ok) {
                errors += 1;
            }
        }

        if (errors == 0) {
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