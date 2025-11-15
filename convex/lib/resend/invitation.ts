import { Resend } from "resend"
import generateOrganizationInviteEmail from "./emails/organizationInvite"

type SendOrganizationInviteParams = {
  acceptUrl: string
  organizationName: string
  inviterName: string
  to: string
}

const resendApiKey = process.env.RESEND_API_KEY
const resendFromEmail = process.env.RESEND_AUTH_EMAIL

if (!resendApiKey) {
  console.warn(
    "[Resend] RESEND_API_KEY is not set. Organization invite emails will not be sent."
  )
}

if (!resendFromEmail) {
  console.warn(
    "[Resend] RESEND_AUTH_EMAIL is not set. Organization invite emails will not be sent."
  )
}

const resendClient = resendApiKey ? new Resend(resendApiKey) : null

export async function sendOrganizationInviteEmail({
  acceptUrl,
  organizationName,
  inviterName,
  to,
}: SendOrganizationInviteParams) {
  if (!resendClient || !resendFromEmail) {
    return
  }

  const { subject, html, text } = generateOrganizationInviteEmail({
    acceptUrl,
    organizationName,
    inviterName,
  })

  await resendClient.emails.send({
    from: resendFromEmail,
    to,
    subject,
    html,
    text,
  })
}

