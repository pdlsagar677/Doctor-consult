const express = require("express");
const { authenticate, requireRole } = require("../middleware/auth");
const { body } = require("express-validator");
const validate = require("../middleware/validate");
const Appointment = require("../modal/Appointment");
const crypto = require("crypto");

const router = express.Router();

// Create eSewa payment request
router.post(
  "/create-order",
  authenticate,
  requireRole("patient"),
  [
    body("appointmentId")
      .isMongoId()
      .withMessage("Valid appointment ID is required"),
  ],
  validate,
  async (req, res) => {
    try {
      const { appointmentId } = req.body;

      // Find appointment
      const appointment = await Appointment.findById(appointmentId)
        .populate("doctorId", "name specialization")
        .populate("patientId", "name email phone");

      if (!appointment) {
        return res.notFound("Appointment not found");
      }
      if (appointment.patientId._id.toString() !== req.auth.id) {
        return res.forbidden("Access denied");
      }

      if (appointment.paymentStatus === "Paid") {
        return res.badRequest("Payment already completed");
      }

      // eSewa payment parameters
      const transaction_uuid = `ESEWA_${appointmentId}_${Date.now()}`;
      const total_amount = appointment.totalAmount.toString();
      const product_code = "EPAYTEST";
      
      // Get URLs from environment variables
      const frontendUrl = process.env.FRONTEND_URL ;
      const successUrl = `${frontendUrl}/payment-status?status=success&transactionId=${transaction_uuid}&appointmentId=${appointmentId}&amount=${total_amount}`;
      const failureUrl = `${frontendUrl}/payment-status?status=failed&appointmentId=${appointmentId}`;

      console.log("🌐 Frontend URL:", frontendUrl);
      console.log("✅ Success URL:", successUrl);
      console.log("❌ Failure URL:", failureUrl);
      
      // Signature generation
      const message = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`;
      console.log("🔐 Signature Message:", message);
      
      const signature = crypto.createHmac('sha256', process.env.ESEWA_SECRET_KEY)
        .update(message)
        .digest('base64');

      console.log("📝 Generated Signature:", signature);

      // Payment data
      const paymentData = {
        amount: total_amount,
        tax_amount: "0",
        total_amount: total_amount,
        transaction_uuid: transaction_uuid,
        product_code: product_code,
        product_service_charge: "0",
        product_delivery_charge: "0",
        success_url: successUrl,
        failure_url: failureUrl,
        signed_field_names: "total_amount,transaction_uuid,product_code",
        signature: signature,
        merchant_id: process.env.ESEWA_MERCHANT_ID || "EPAYTEST"
      };

      console.log("💰 Final eSewa Payment Data:", paymentData);

      // Save transaction ID to appointment
      appointment.esewaTransactionId = transaction_uuid;
      await appointment.save();

      // Use environment variable for eSewa URL
      const esewaPaymentUrl = process.env.ESEWA_BASE_URL ? 
        `${process.env.ESEWA_BASE_URL}/api/epay/main/v2/form` : 
        "https://rc-epay.esewa.com.np/api/epay/main/v2/form";

      console.log("🚀 eSewa Payment URL:", esewaPaymentUrl);

      res.ok(
        {
          paymentData: paymentData,
          paymentUrl: esewaPaymentUrl,
          amount: total_amount,
          transactionId: transaction_uuid,
          appointmentId: appointmentId
        },
        "eSewa payment order created successfully"
      );
    } catch (error) {
      console.error("eSewa order creation error:", error);
      res.serverError("Failed to create payment order", [error.message]);
    }
  }
);

// Verify eSewa payment
router.post(
  "/verify-payment",
  authenticate,
  requireRole("patient"),
  [
    body("appointmentId")
      .isMongoId()
      .withMessage("Valid appointment ID is required"),
    body("transaction_code")
      .isString()
      .withMessage("Transaction code required"),
    body("status")
      .isString()
      .withMessage("Payment status required"),
  ],
  validate,
  async (req, res) => {
    try {
      const {
        appointmentId,
        transaction_code,
        status
      } = req.body;

      console.log("🔍 Verifying payment for appointment:", appointmentId);

      // Find appointment
      const appointment = await Appointment.findById(appointmentId)
        .populate("doctorId", "name specialization")
        .populate("patientId", "name email phone");

      if (!appointment) {
        return res.notFound("Appointment not found");
      }
      if (appointment.patientId._id.toString() !== req.auth.id) {
        return res.forbidden("Access denied");
      }

      // Verify payment status
      if (status === 'COMPLETE') {
        console.log("✅ Payment marked as COMPLETE");
        
        appointment.paymentStatus = "Paid";
        appointment.paymentMethod = "eSewa";
        appointment.esewaPaymentId = transaction_code;
        appointment.paymentDate = new Date();

        await appointment.save();

        await appointment.populate(
          "doctorId",
          "name specialization fees hospitalInfo profileImage"
        );
        await appointment.populate("patientId", "name email phone profileImage");

        console.log("🎉 Payment verified successfully for appointment:", appointmentId);

        res.ok(
          appointment,
          "Payment verified and appointment confirmed successfully"
        );
      } else {
        console.log("❌ Payment status not COMPLETE:", status);
        return res.badRequest("Payment verification failed - status not complete");
      }
    } catch (error) {
      console.error("eSewa verification error:", error);
      res.serverError("Failed to verify payment", [error.message]);
    }
  }
);

// eSewa payment success callback
router.post(
  "/success-callback",
  async (req, res) => {
    try {
      console.log("🔄 eSewa Callback Received (POST):", req.body);
      
      const {
        transaction_uuid,
        transaction_code,
        status,
        total_amount,
        signature
      } = req.body;

      // Get frontend URL from environment
      const frontendUrl = process.env.FRONTEND_URL;

      // Verify signature
      const message = `transaction_code=${transaction_code},status=${status},total_amount=${total_amount},transaction_uuid=${transaction_uuid}`;
      const expectedSignature = crypto.createHmac('sha256', process.env.ESEWA_SECRET_KEY)
        .update(message)
        .digest('base64');

      console.log("🔐 Callback Signature Verification:", {
        received: signature,
        expected: expectedSignature,
        message: message
      });

      if (signature !== expectedSignature) {
        console.log("❌ Invalid signature");
        return res.status(400).send('Invalid signature');
      }

      if (status === 'COMPLETE') {
        const appointment = await Appointment.findOne({ 
          esewaTransactionId: transaction_uuid 
        });

        if (appointment) {
          appointment.paymentStatus = "Paid";
          appointment.paymentMethod = "eSewa";
          appointment.esewaPaymentId = transaction_code;
          appointment.paymentDate = new Date();
          await appointment.save();
          console.log("✅ Appointment payment updated:", appointment._id);
        }

        // Redirect to payment status page with success parameters
        const successUrl = `${frontendUrl}/payment-status?status=success&transactionId=${transaction_code}&amount=${total_amount}`;
        console.log("🔀 Redirecting to success page:", successUrl);
        res.redirect(successUrl);
      } else {
        const failureUrl = `${frontendUrl}/payment-status?status=failed`;
        console.log("🔀 Redirecting to failure page:", failureUrl);
        res.redirect(failureUrl);
      }
    } catch (error) {
      console.error("eSewa callback error:", error);
      const frontendUrl = process.env.FRONTEND_URL ;
      res.redirect(`${frontendUrl}/payment-status?status=failed`);
    }
  }
);

// eSewa payment failure callback
router.post(
  "/failure-callback",
  async (req, res) => {
    try {
      console.log("🔄 eSewa Failure Callback Received:", req.body);
      
      const frontendUrl = process.env.FRONTEND_URL ;
      const failureUrl = `${frontendUrl}/payment-status?status=failed`;
      
      console.log("🔀 Redirecting to failure page:", failureUrl);
      res.redirect(failureUrl);
    } catch (error) {
      console.error("eSewa failure callback error:", error);
      const frontendUrl = process.env.FRONTEND_URL ;
      res.redirect(`${frontendUrl}/payment-status?status=failed`);
    }
  }
);

// Test endpoint to verify configuration
router.get("/test-config", (req, res) => {
  const config = {
    esewa_merchant_id: process.env.ESEWA_MERCHANT_ID || "Not set",
    esewa_secret_key: process.env.ESEWA_SECRET_KEY ? "Set (hidden)" : "Not set",
    esewa_base_url: process.env.ESEWA_BASE_URL || "Not set",
    frontend_url: process.env.FRONTEND_URL || "Not set",
    environment: process.env.NODE_ENV || "development"
  };
  
  console.log("🔧 Payment Configuration:", config);
  
  res.ok(config, "Payment configuration check");
});

// Test endpoint
router.get("/test", (req, res) => {
  res.ok({ 
    message: "Payment route is working!",
    timestamp: new Date().toISOString(),
    frontend_url: process.env.FRONTEND_URL || "Not set"
  }, "Test successful");
});

module.exports = router;