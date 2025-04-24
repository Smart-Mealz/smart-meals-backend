import { cartModel } from "../models/cart.js";
import { DeliveryModel } from "../models/delivery.js";
import { sendEmail } from "../utils/mailing.js";
import config from "../utils/config.js";

export const submitOrder = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      country,
      streetAddress,
      phone,
      email,
      region,
    } = req.body;

    const userId = req.auth.id;

    const cart = await cartModel.findOne({ userId });
    if (!cart || !Array.isArray(cart.items) || cart.items.length === 0) {
      return res
        .status(404)
        .json({ message: "Cart not found or no items in cart" });
    }

    const regions = [
      { name: "Greater Accra", fee: 5 },
      { name: "Volta", fee: 8 },
      { name: "Oti", fee: 10 },
      { name: "Northern", fee: 12 },
      { name: "North East", fee: 9 },
      { name: "Savannah", fee: 7 },
      { name: "Upper West", fee: 6 },
      { name: "Upper East", fee: 6 },
      { name: "Brong Ahafo", fee: 8 },
      { name: "Bono East", fee: 7 },
      { name: "Ahafo", fee: 9 },
      { name: "Central", fee: 8 },
      { name: "Eastern", fee: 9 },
      { name: "Western", fee: 10 },
      { name: "Western North", fee: 11 },
    ];

    const selectedRegion = regions.find((r) => r.name === region);
    if (!selectedRegion) {
      return res.status(400).json({ message: "Invalid region" });
    }

    const cartSubtotal = cart.items.reduce(
      (sum, item) => sum + (item.total || 0),
      0
    );
    const finalTotal = cartSubtotal + selectedRegion.fee;

    const delivery = new DeliveryModel({
      userId,
      firstName,
      lastName,
      country,
      streetAddress,
      phone,
      email,
      region,
      deliveryFee: selectedRegion.fee,
      cartSubtotal,
      finalTotal,
    });

    await delivery.save();

    // Create item list for email
    const itemList = cart.items
      .map((item) => {
        return `<tr><td>${item.mealkit.name}</td><td>${item.quantity}</td><td>$${item.total}</td></tr>`;
      })
      .join("");

    await sendEmail({
      from: config.SMPT_EMAIL,
      to: email,
      subject: "Order Confirmation - Your Order Has Been Received",
      html: `
        <html>
          <head>
            <style>
              .email-container {
                font-family: Arial, sans-serif;
                color: #333;
                background-color: #f4f4f4;
                padding: 20px;
                border-radius: 10px;
                width: 100%;
              }
              .email-header {
                background-color: #009688;
                color: white;
                padding: 10px;
                text-align: center;
                border-radius: 5px;
              }
              .order-details {
                margin-top: 20px;
                padding: 10px;
                background-color: white;
                border-radius: 5px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
              }
              .order-details h3 {
                margin-top: 0;
              }
              .order-details table {
                width: 100%;
                margin-top: 10px;
                border-collapse: collapse;
              }
              .order-details table, th, td {
                border: 1px solid #ddd;
              }
              .order-details th, td {
                padding: 8px;
                text-align: left;
              }
              .footer {
                margin-top: 20px;
                text-align: center;
                font-size: 12px;
                color: #777;
              }
            </style>
          </head>
          <body>
            <div class="email-container">
              <div class="email-header">
                <h2>Order Confirmation</h2>
              </div>
              <p>Dear ${firstName} ${lastName},</p>
              <p>Thank you for your order! We have received your order and it is currently being processed. We will notify you once it is ready for delivery.</p>
              
              <div class="order-details">
                <h3>Order Details:</h3>
                <table>
                  <tr>
                    <th>Address</th>
                    <td>${streetAddress}, ${country}</td>
                  </tr>
                  <tr>
                    <th>Region</th>
                    <td>${region}</td>
                  </tr>
                  <tr>
                    <th>Cart Subtotal</th>
                    <td>$${cartSubtotal}</td>
                  </tr>
                  <tr>
                    <th>Delivery Fee</th>
                    <td>$${selectedRegion.fee}</td>
                  </tr>
                  <tr>
                    <th>Final Total</th>
                    <td>$${finalTotal}</td>
                  </tr>
                </table>

                <h3>Items Ordered:</h3>
                <table>
                  <thead>
                    <tr>
                      <th>Item Name</th>
                      <th>Quantity</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${itemList}
                  </tbody>
                </table>
              </div>

              <div class="footer">
                <p>We will update you once your order is ready for delivery.</p>
                <p>Thank you for shopping with us!</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    res.status(200).json({
      message: "Order placed successfully",
      finalTotal,
      orderDetails: delivery,
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
