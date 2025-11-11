import { Resend } from "@convex-dev/resend";
import { components } from "../../_generated/api";
import type { ActionCtx } from "../../_generated/server";

export const resendHandler = new Resend(components.resend, {
  testMode: false,
  apiKey: process.env.RESEND_API_KEY as string,
});

export const sendEmail = async (
  ctx: ActionCtx,
  {
    to,
    subject,
    html,
    text,
  }: {
    to: string;
    subject: string;
    html: string;
    text?: string;
  }
) => {
  await resendHandler.sendEmail(ctx, {
    from: process.env.RESEND_AUTH_EMAIL as string,
    to,
    subject,
    html,
    text,
  });
};