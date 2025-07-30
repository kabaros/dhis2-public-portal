import React from "react";
import { render, screen } from "@testing-library/react";
import { it, expect } from "vitest";
import { InitialConfigurationSetup } from "./InitialConfigurationSetup";

it('should render the initial configuration setup screen', () => {
    render(<InitialConfigurationSetup />)
    expect(screen.getByText('Welcome to DHIS2 FlexiPortal Manager!')).not.toBeNull()
})