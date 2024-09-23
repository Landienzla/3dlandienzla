"use client";
import Lottie from "lottie-react";
import printingAnimation from "./animation.json";
import { Box, Button, Typography } from "@mui/material";
import { motion } from "framer-motion";
import STLViewer from "./stl";

const Animation = ({
  dictionary,
}: {
  dictionary: {
    [key: string]: string;
  };
}) => {
  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        position: "relative",
      }}
    >
      {/* Lottie Animation Column */}
      <Box sx={{ width: "40%", display: "flex", justifyContent: "center" }}>
        <motion.div
          initial={{
            x: -200,
            opacity: 0,
          }}
          animate={{
            x: 0,
            opacity: 1,
          }}
          transition={{
            duration: 1,
          }}
        >
          <STLViewer />
          {/* <Lottie animationData={printingAnimation} loop={true} /> */}
        </motion.div>
      </Box>

      {/* Text Column */}
      <Box
        sx={{
          width: "60%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <motion.div
          initial={{
            x: 200,
            opacity: 0,
          }}
          animate={{
            x: 0,
            opacity: 1,
          }}
          transition={{
            duration: 1,
          }}
        >
          <Typography variant="h1">{dictionary.hero_title}</Typography>
          <Typography variant="body1">{dictionary.hero_description}</Typography>
          <Button variant="contained" href="/upload">
            {dictionary.hero_button}
          </Button>
        </motion.div>
      </Box>
    </Box>
  );
};

export default Animation;
