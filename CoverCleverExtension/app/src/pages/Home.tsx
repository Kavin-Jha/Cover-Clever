import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";
import { Navbar } from '../components/Navbar';

interface InsurancePolicy {
  policyId: string;
  score: number;
  comments: string;
}

// Simplified dummy data
const dummyPolicies: InsurancePolicy[] = [
  {
    policyId: "BCBS-2024-001",
    score: 85,
    comments: "Good fit for young professionals. Low deductible but higher monthly premium."
  },
  {
    policyId: "BCBS-2024-002",
    score: 72,
    comments: "Budget-friendly option with higher deductibles. Good for healthy individuals."
  },
  {
    policyId: "BCBS-2024-003",
    score: 95,
    comments: "Premium plan with comprehensive coverage. Ideal for families or those needing frequent care."
  }
];

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [insurancePolicies] = useState<InsurancePolicy[]>(dummyPolicies);

  // Check for authentication on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      // Redirect to login if no token found
      navigate('/login');
      return;
    }

    // Optional: Verify token validity with backend
    // const verifyToken = async () => {
    //   try {
    //     const response = await fetch('your-api-endpoint/verify-token', {
    //       headers: {
    //         'Authorization': `Bearer ${token}`
    //       }
    //     });
        
    //     if (!response.ok) {
    //       // Token is invalid
    //       localStorage.removeItem('token');
    //       navigate('/login');
    //     }
    //   } catch (error) {
    //     console.error('Token verification failed:', error);
    //     localStorage.removeItem('token');
    //     navigate('/login');
    //   }
    // };

    // verifyToken();
  }, [navigate]);

  const handlePolicyClick = (policyId: string) => {
    // Handle click event - you can navigate to a detail page or show a modal
    console.log(`Clicked policy: ${policyId}`);
  };

  const renderPolicyRows = () => {
    return insurancePolicies.map((policy) => (
      <div 
        className="policy-row" 
        key={policy.policyId}
        onClick={() => handlePolicyClick(policy.policyId)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handlePolicyClick(policy.policyId);
          }
        }}
      >
        <div className="policy-header">
          <h3>Policy ID: {policy.policyId}</h3>
          <div className={`policy-score score-${policy.score >= 90 ? 'high' : policy.score >= 70 ? 'medium' : 'low'}`}>
            Score: {policy.score}
          </div>
        </div>
        
        <div className="policy-details">
          <div className="comments">
            <h4>Analysis</h4>
            <p>{policy.comments}</p>
          </div>
        </div>
      </div>
    ));
  };

  return (
    <div className="home-container">
      <Navbar />
      <h1 className="page-title">Scored Insurance Plans</h1>
      
      <div className="policies-container">
        {renderPolicyRows()}
      </div>
    </div>
  );
};

export default Home;








/**
 * Home Component
 *
 * This component displays real-time cryptocurrency data fetched from the CoinGecko API.
 * It includes internationalization (i18n) support for multiple languages (English, Spanish, French).
 * The data includes the name, price, and 1-hour price change percentage of the top 10 cryptocurrencies by market cap.
 *
 * Features:
 * - Fetches insurance policy data from scraped data stored in database.
 * - Displays a summary of the fit of the policy to the user and a score
 */



// import React, { useState, useEffect } from "react";
// import "../styles/Home.css"; // Styling for the component

// // API endpoint for fetching insurance policy data
// const API_URL = "https://api.coingecko.com/api/v3/coins/markets";

// const Home: React.FC = () => {
//   // i18n hook for translation and language switching

//   // State variables
//   const [insuranceData, setInsuranceData] = useState<any[]>([]); // Stores cryptocurrency data

//   /**
//    * Fetches cryptocurrency data from the database on component mount.
//    */
//   useEffect(() => {
//     const fetchCryptoData = async () => {
//       try {
//         setLoading(true); // Start loading
//         const response = await fetch(
//           `${API_URL}?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&price_change_percentage=1h`
//         );
//         if (!response.ok) {
//           throw new Error("Failed to fetch cryptocurrency data");
//         }
//         const data = await response.json();
//         setCryptoData(data); // Update state with fetched data
//         setLoading(false); // Stop loading
//       } catch (error: any) {
//         console.error("Error fetching data:", error.message);
//         setError(error.message); // Set error message
//         setLoading(false); // Stop loading
//       }
//     };

//     fetchCryptoData();
//   }, []);

//   /**
//    * Renders the rows for the cryptocurrency table.
//    */
//   const renderCryptoRows = () => {
//     return cryptoData.map((crypto, index) => (
//       <div className="table-row" key={crypto.id}>
//         <span>
//           {index + 1}.&nbsp;{crypto.name} {/* Cryptocurrency name */}
//         </span>
//         <span>${crypto.current_price.toLocaleString()}</span> {/* Current price */}
//         <span></span>
//         <span
//           className={
//             crypto.price_change_percentage_1h_in_currency >= 0 ? "green" : "red"
//           }
//         >
//           {crypto.price_change_percentage_1h_in_currency
//             ? `${crypto.price_change_percentage_1h_in_currency.toFixed(2)}%`
//             : "N/A"} {/* 1-hour price change */}
//         </span>
//       </div>
//     ));
//   };

//   return (
//     <div className="home-container">
//       {/* Language Selector */}
//       <select
//         onChange={(e) => i18n.changeLanguage(e.target.value)} // Switch language
//         className="language-select"
//       >
//         <option value="en">English</option>
//         <option value="es">Español</option>
//         <option value="fr">Français</option>
//       </select>

//       {/* Today's Prices Section */}
//       <div className="today-prices">
//         <h1>{t("todayPrices")}</h1> {/* Translated title */}
//         <p>
//           {t("globalMarketCap")} <span className="bold">{t("marketCapValue")}</span>,{" "}
//           {t("increase")} {/* Example translation with dynamic text */}
//         </p>
//         <a href="/" className="read-more">
//           {t("readMore")} {/* Translated link */}
//         </a>
//       </div>

//       {/* Cryptocurrency Table */}
//       <div className="crypto-table">
//         {/* Table Header */}
//         <div className="table-header">
//           <span>{t("table.name")}</span> {/* Name column */}
//           <span>{t("table.price")}</span> {/* Price column */}
//           <span></span>
//           <span>{t("table.change1h")}</span> {/* 1-hour change column */}
//         </div>
//         {/* Table Content */}
//         {loading ? (
//           <div>{t("loading")}</div> // Loading state
//         ) : error ? (
//           <div>{t("error")}</div> // Error state
//         ) : (
//           renderCryptoRows() // Render cryptocurrency rows
//         )}
//       </div>
//     </div>
//   );
// };

// export default Home;