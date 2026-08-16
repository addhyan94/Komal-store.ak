// mailService-server.js file

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

async function sendOrderMail(order) {

    const products = (order.items || [])
        .map(item =>
            `${item.name} | Qty: ${item.qty} | ₹${item.price}`
        )
        .join("\n");

    const message = `
🛒 NEW ORDER
Order ID : ${order.id}
Customer :
${order.user.name}
${order.user.phone}
${order.user.address}
-----------------------
${products}
-----------------------
Total : ₹${order.total}
`;
    await transporter.sendMail({
        from: `"Komal Store" <${process.env.EMAIL_USER}>`,
        to: process.env.SHOP_EMAIL,
        subject: `New Order #${order.id}`,
        text: message
    });
}

module.exports = {
    sendOrderMail
};