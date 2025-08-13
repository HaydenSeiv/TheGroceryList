import { Container, Stack } from "@chakra-ui/react";
import Navbar from "../components/Navbar";
import { Toaster } from "react-hot-toast";
import React from "react";
import CreateAisleForm from "../components/CreateAisleForm";
import { useParams } from "react-router-dom";
import LayoutOrderList from "../components/LayoutOrderList";



export default function LayoutCreation() {
    const { layoutId } = useParams();
    return (
        <Stack h="100vh">
          <Navbar />
          <Toaster position="bottom-right" />
          <Container>
            <CreateAisleForm layoutId={layoutId || ""} />
            <LayoutOrderList layoutId={layoutId || ""} />
          </Container>
        </Stack>
      );
}