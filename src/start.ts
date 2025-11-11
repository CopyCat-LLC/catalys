import { createMiddleware, createStart } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";

export const loggingMiddleware = createMiddleware().server(async ({ next }) => {
	getRequest();

	return next();
});

export const startInstance = createStart(() => {
	return {
		requestMiddleware: [loggingMiddleware],
	};
});
