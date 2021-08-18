import * as React from "react";
import { Box } from "@chakra-ui/react";

type HomePageProps = {
    children: React.ReactNode
};

const HomePage = ({children}: HomePageProps) => {
  return (
    <Box bgColor="#191B1F">
      {children}
    </Box>
  );
};

export default HomePage