const medicalConditions = [
  // Chronic Diseases & Long-Term Conditions
  "Diabetes (Type 1 & Type 2)",
  "High Blood Pressure (Hypertension)",
  "High Cholesterol",
  "Heart Disease",
  "Asthma",
  "Arthritis (Osteoarthritis, Rheumatoid Arthritis)",
  "Osteoporosis",

  // Acute & Short-Term Conditions
  "Flu & Common Cold",
  "Strep Throat & Tonsillitis",
  "Ear Infections",
  "Urinary Tract Infections (UTIs)",
  "Pneumonia & Bronchitis",

  // Mental Health Conditions
  "Depression & Anxiety",
  "Bipolar Disorder & Schizophrenia",
  "Substance Abuse Treatment",

  // Neurological Disorders
  "Migraines",
  "Epilepsy",
  "Stroke Recovery",

  // Digestive & Gastrointestinal Conditions
  "Acid Reflux (GERD)",
  "Irritable Bowel Syndrome (IBS)",
  "Gallbladder Issues",
  "Liver & Kidney Diseases",

  // Skin Conditions
  "Eczema & Psoriasis",
  "Severe Acne",
  "Skin Cancer",

  // Injuries & Emergency Care
  "Broken Bones & Fractures",
  "Concussions & Head Injuries",
  "Burns & Wound Care",

  // Reproductive & Maternity Care
  "Pregnancy & Childbirth",
  "Birth Control & Family Planning",
  "Infertility Treatment",

  // Cancer Treatments
  "Chemotherapy & Radiation Therapy",
  "Surgeries for Tumor Removal",

  "None"
];

const medicalServices = [
  "Ambulance Services",
  "Cardiac Rehabilitation",
  "Chiropractor Services",
  "Dialysis Services",
  "Durable Medical Equipment",
  "Early Intervention Services",
  "Emergency Medical Outpatient Services",
  "Family Planning",
  "Home Health Care",
  "Hospice Services",
  "Infertility Services",
  "Inpatient Care",
  "Labs, X-Rays and Other Tests",
  "Maternity Services",
  "Medical Care Outpatient Visits",
  "Medical Formulas",
  "Mental Health Treatment",
  "Oxygen and Respiratory Therapy",
  "Podiatry Care",
  "Prescription Drugs",
  "Preventive Dental Care for Children",
  "Prosthetic Devices",
  "Radiation Therapy and Chemotherapy",
  "Routine Adult Physical Exams",
  "Routine Gynecological (GYN) Exams",
  "Routine Hearing Exams and Tests",
  "Routine Pediatric Care",
  "Routine Vision Care",
  "Second Opinions",
  "Short-Term Rehabilitation Therapy",
  "Speech, Hearing and Language Disorder Treatment",
  "Substance Use Treatment",
  "Surgery as an Outpatient",
  "TMJ Disorder Treatment",
  "Well Newborn Care",
  "None"
];

const questions = [
  { id: "age", text: "What is your age?", type: "number", required: true },
  { id: "income", text: "What is your annual income?", type: "number", required: true },
  {
    id: "coverage",
    text: "How much do you want to spend on health insurance?",
    type: "number",
    required: true,
  },
  {
    id: "conditions",
    text: "Select all medical conditions that apply:",
    type: "checkbox",
    options: medicalConditions,
    required: true,
  },
  {
    id: "services",
    text: "Select all medical services that apply:",
    type: "checkbox",
    options: medicalServices,
    required: true,
  },
  {
    id: "other",
    text: "Use this space to tell us about any other factors that may affect your health insurance needs.",
    type: "text",
    required: true,
  },
];

export default questions;
