const PolicyModel = require("../models/policy");

// get all insurance policies for the authenticated user
const getInsurancePolicies = async (req, res) => {
  try {
    const userId = req.user.id;
    const policies = await PolicyModel.find({ user: userId });
    console.log(userId, policies);
    if (!policies || policies.length === 0) {
      return res.status(404).json({ message: "No policies found" });
    }
    return res.status(200).json({ insurancePolicies: policies });
  } catch (error) {
    console.error("Error fetching policies:", error);
    return res.status(500).json({ message: "Server error while fetching policies" });
  }
};

// add a new insurance policy to the authenticated user's profile
const addInsurancePolicy = async (req, res) => {
  try {
    const userId = req.user.id;


    const newPolicy = new PolicyModel({
      ...req.body,
      user: userId
    });

    await newPolicy.save();

    return res.status(200).json({ message: "Insurance Policy added successfully" });
  } catch (error) {
    console.error("Error adding policy:", error);
    return res.status(500).json({ message: "Server error while adding policy" });
  }
};

// get a specific insurance policy by its ID for the authenticated user
const getInsurancePolicyById = async (req, res) => {
  try {
    const userId = req.user.id;
    const policyId = req.params.policyId;

    const policy = await PolicyModel.findOne({ _id: policyId, user: userId });
    if (!policy) {
      return res.status(404).json({ message: "Policy not found" });
    }

    return res.status(200).json(policy);
  } catch (error) {
    console.error("Error fetching policy by ID:", error);
    return res.status(500).json({ message: "Server error while fetching policy" });
  }
};

// delete an insurance policy by its ID for the authenticated user
const deleteInsurancePolicy = async (req, res) => {
  try {
    const userId = req.user.id;
    const policyId = req.params.policyId;

    const deletedPolicy = await PolicyModel.findOneAndDelete({ _id: policyId, user: userId });
    if (!deletedPolicy) {
      return res.status(404).json({ message: "Policy not found" });
    }

    return res.status(200).json({ message: "Insurance policy deleted successfully" });
  } catch (error) {
    console.error("Error deleting policy:", error);
    return res.status(500).json({ message: "Server error while deleting policy" });
  }
};

module.exports = {
  getInsurancePolicies,
  addInsurancePolicy,
  getInsurancePolicyById,
  deleteInsurancePolicy
};