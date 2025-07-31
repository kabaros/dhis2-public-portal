import React from "react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { renderWithProviders } from "../../../tests/test-utils";
import { ModuleList } from "../../shared/components/ModulesPage/components/ModuleList";
import { CustomDataProvider, Provider } from "@dhis2/app-runtime";
import { ModulesProvider } from "../../shared/components/ModulesPage/providers/ModulesProvider";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

const fakeNavigate = vi.fn();

vi.mock("@tanstack/react-router", async (importOriginal) => {
	return {
		...(await importOriginal()),
		useNavigate: () => fakeNavigate,
	};
});
const ModulesWithProvider = () => {
	return (
		<Provider
			// baseUrl="http://dhis2-tests.org"
			apiVersion="41"
			config={{
				baseUrl: "https://hisptz.dhis2.org",
				apiVersion: 33,
			}}
		>
			<ModulesProvider>
				<ModuleList />
			</ModulesProvider>
		</Provider>
	);
};

describe("Modules", () => {
	let server;
	beforeEach(() => {
		const handlers = [
			http.get("https://hisptz.dhis2.org/api/33/dataStore/hisptz-public-portal-modules?fields=.", () => {
				return HttpResponse.json(modules);
			}),
		];
		server = setupServer(...handlers);
		server.listen();
	});
	afterEach(() => {
		server.resetHandlers();
	});
	it("should show the list of modules", async () => {
		const user = userEvent.setup();
		const { renderResult: screen, router } = await renderWithProviders(
			ModulesWithProvider,
			{
				pathPattern: "/modules",
				initialEntry: "/",
				queryClient: new QueryClient(),
			},
		);
		router.history.push("modules");
		await screen.findByText("test visualisation");
		expect(screen.getByText("Home")).toBeDefined();
		expect(screen.getByText("test visualisation")).toBeDefined();
		await user.click(screen.getByTestId("btn-goto-home"));
		expect(fakeNavigate.mock.calls[0][0].params.moduleId).toEqual("home");
	});
});

const modules = {
	pager: { page: 1, pageSize: 50 },
	entries: [
		{
			key: "home",
			value: {
				id: "home",
				type: "SECTION",
				label: "Home",
				config: {
					sections: [
						{
							id: "welcome-note",
							item: {
								item: {
									id: "welcome-note",
									content:
										'\n<h1><strong style="font-size: 24pt;">Welcome to DHIS2 FlexiPortal!</strong></h1>\n\n<p>Thank you for using the DHIS2 FlexiPortal! This platform is designed to transform how DHIS2 data is publicly shared, accessed, and understood.</p>\n\n<p><br></p>\n<p><strong style="font-size: 18pt;">About the Application</strong></p>\n<p>The DHIS2 FlexiPortal brings together up-to-date, visualized, and aggregated health data from DHIS2 systems and enhances it with essential resources, including:</p>\n\n\n<ul>\n    <li><strong><br></strong></li>\n</ul>\n<ul style="list-style-type: circle;">\n    <li><strong>Data Visualizations</strong>: Interactive charts, maps, and dashboards</li>\n</ul>\n<ul>\n    <li><strong>Key Indicators</strong>: Important health metrics at a glance</li>\n    <li><strong>Document Library</strong>: Strategic reports, guidelines, and knowledge resources</li>\n    <li><strong>News Section or Blogs</strong>: Latest updates and announcements</li>\n    <li><strong>FAQ Section</strong>: Answers to common questions</li>\n    <li><strong>Feedback System</strong>: A way for users to provide input</li>\n</ul>\n\n\n\n\n\n\n\n<p><br></p>\n<h2><span style="font-size: 18pt;"><strong>Getting Started</strong></span></h2>\n<p><br></p>\n<p>To configure your Public Portal:</p>\n\n<ol>\n    <li><strong>Access the Manager App</strong>: Log in to your DHIS2 instance and open the Portal Manager application</li>\n    <li><strong>Configure Appearance</strong>: Customize the look and feel of your portal</li>\n    <li><strong>Set Up Modules</strong>: Add and configure the modules you want to display</li>\n    <li><strong>Manage Content</strong>: Add and update content for your portal</li>\n</ol>\n<p><br></p>\n\n<p>For more detailed instructions, please refer to the documentation or contact your system administrator.</p>\n<p><br></p>\n\n<p><em>Enjoy using the DHIS2 FlexiPortal!</em></p>\n',
								},
								type: "RICH_TEXT",
							},
							type: "SINGLE_ITEM",
							title: "Welcome to DHIS2 FlexiPortal",
							sortOrder: 0,
						},
					],
				},
				sectionDisplay: "Vertical",
			},
		},
		{
			key: "test",
			value: {
				id: "test-visualisation",
				type: "VISUALIZATION",
				label: "test visualisation",
				config: {
					grouped: false,
					layouts: { lg: [], md: [], sm: [], xs: [] },
				},
			},
		},
	],
};
