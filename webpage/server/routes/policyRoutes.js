const express = require("express");
const router = express.Router();
const cors = require("cors");
const { authenticateUser } = require("../controllers/userController");

const { 
  getInsurancePolicies,      // GET /insurance-policies
  addInsurancePolicy,        // POST /insurance-policies
  getInsurancePolicyById,    // GET /insurance-policy/:policyId
  deleteInsurancePolicy      // DELETE /insurance-policy/:policyId
} = require("../controllers/policyController");

router.use(
  cors({
    credentials: true,
    origin: "https://cover-clever.vercel.app",
    exposedHeaders: ['Authorization']
  })
);


router.get("/insurance-policies", authenticateUser, getInsurancePolicies);
router.post("/insurance-policies", authenticateUser, addInsurancePolicy);
router.get("/insurance-policy/:policyId", authenticateUser, getInsurancePolicyById);
router.delete("/insurance-policy/:policyId", authenticateUser, deleteInsurancePolicy);

module.exports = router;