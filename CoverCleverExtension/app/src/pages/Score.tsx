import React, { useState, useEffect } from "react";
import { Navbar } from "../components/Navbar";
import { Button, Typography, CircularProgress, Box } from "@mui/material";
import "../styles/Score.css";

const Score: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<string>("");

  useEffect(() => {
    const listener = (message: any) => {
      if (message.action === "scrapingComplete") {
        setIsLoading(false);
        setStatus("Data collection completed!");
        console.log("Scraped data:", message.data);
      }
    };

    chrome.runtime.onMessage.addListener(listener);
    return () => {
      chrome.runtime.onMessage.removeListener(listener);
    };
  }, []);

  const startScraping = async () => {
    setIsLoading(true);
    setStatus("Starting scraping process...");

    try {
      const data = await new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({ action: "start" }, (response) => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
            return;
          }

          if (!response || response.status === "error") {
            reject(new Error(response?.message || "Failed to start scraping"));
            return;
          }

          resolve(response);
        });
      });

      setStatus("Scraping initiated, waiting for data...");
      console.log("Scraping started successfully", data);
    } catch (error) {
      console.error("Scraping error:", error);
      setStatus(
        `Error during scraping: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  return (
    <div className="score-container">
      <Navbar />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "2rem",
        }}
      >
        <Typography variant="h5" sx={{ mb: 3 }}>
          Insurance Plan Analysis
        </Typography>

        <Button
          variant="contained"
          color="primary"
          onClick={startScraping}
          disabled={isLoading}
          sx={{ mb: 2 }}
        >
          {isLoading ? <CircularProgress size={24} /> : "Start Analysis"}
        </Button>

        {status && (
          <Typography
            color={status.includes("Error") ? "error" : "textPrimary"}
            sx={{ mt: 2 }}
          >
            {status}
          </Typography>
        )}
      </Box>
    </div>
  );
};

export default Score;
