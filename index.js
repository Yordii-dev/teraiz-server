import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/contact", async (req, res) => {
  res.status(200).json({ ok: true, message: "work v1" });
});

app.post("/api/contact", async (req, res) => {
  const { name, email, message } = req.body;
  console.log("body: ", req.body);

  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: true,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  try {
    let r = await transporter.sendMail({
      from: `"Teraiz.com" <${process.env.MAIL_USER}>`,
      to: process.env.MAIL_ADDRESS,
      subject: "Nuevo mensaje de lead",
      html: `
        <h2>Nuevo mensaje</h2>
        <p><strong>Nombre:</strong> ${name ?? "Sin nombre"}</p>
        <p><strong>Correo:</strong> ${email}</p>
        <p><strong>Mensaje:</strong></p>
        <p>${message}</p>
      `,
    });

    res.status(200).json({ ok: true, message: "Correo enviado", r });
  } catch (error) {
    console.error("Error al enviar correo:", error);
    res.status(500).json({ ok: false, message: "Error al enviar correo" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));
