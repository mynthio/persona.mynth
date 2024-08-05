export async function POST(request: Request) {
  const crypto = require("crypto");

  const rawBody = await request.text();

  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
  const hmac = crypto.createHmac("sha256", secret);
  const digest = Buffer.from(hmac.update(rawBody).digest("hex"), "utf8");
  const signature = Buffer.from(
    request.headers.get("X-Signature") || "",
    "utf8"
  );

  if (!crypto.timingSafeEqual(digest, signature)) {
    throw new Error("Invalid signature.");
  }

  const data = JSON.parse(rawBody);

  const eventName = data["meta"]["event_name"];
  const obj = data["data"]["attributes"];
  const objId = data["data"]["id"];

  let eventData;

  switch (eventName) {
    case "order_created":
      eventData = {
        channel: process.env.LOGSNAG_CHANNEL,
        event: "New order",
        description: `${obj["first_order_item"]["product_name"]} (${obj["first_order_item"]["variant_name"]})\n${obj["subtotal_formatted"]} (\+${obj["tax_formatted"]} tax)\nOrder #${obj["order_number"]} • ${obj["user_email"]} • ${obj["user_name"]}\n[View order](https://app.lemonsqueezy.com/orders/${obj["identifier"]})`,
        icon: "💳",
        notify: true,
        tags: {
          email: obj["user_email"],
          "customer-id": obj["customer_id"],
        },
        parser: "markdown",
      };

      break;

    default:
      break;
  }

  return new Response("OK");
}
