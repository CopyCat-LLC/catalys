type GenerateOrganizationInviteParams = {
  acceptUrl: string
  organizationName: string
  inviterName: string
}

export default function generateOrganizationInviteEmail({
  acceptUrl,
  organizationName,
  inviterName,
}: GenerateOrganizationInviteParams) {
  const subject = `You're invited to join ${organizationName} on Catalys`

  const html = /* html */ `
    <table style="width:100%;max-width:600px;margin:0 auto;font-family:Arial,sans-serif;background-color:#0D0D0D;color:#F9FAFB;padding:32px;border-radius:12px;border:1px solid rgba(255,255,255,0.08);">
      <tr>
        <td style="text-align:center;">
          <h1 style="font-size:24px;margin-bottom:16px;">Join ${organizationName}</h1>
          <p style="font-size:16px;line-height:24px;margin-bottom:24px;color:#D1D5DB;">
            ${inviterName} invited you to collaborate on Catalys. Click the button below to accept the invitation and finish setting up your account.
          </p>
          <a
            href="${acceptUrl}"
            style="display:inline-block;padding:14px 28px;background:linear-gradient(135deg,#6366F1,#8B5CF6);color:#FFFFFF;text-decoration:none;border-radius:999px;font-weight:600;"
            target="_blank"
            rel="noopener noreferrer"
          >
            Accept Invitation
          </a>
          <p style="font-size:14px;line-height:21px;margin-top:24px;color:#9CA3AF;">
            If the button doesn't work, copy and paste this URL into your browser:<br/>
            <a href="${acceptUrl}" style="color:#A78BFA;text-decoration:none;" target="_blank" rel="noopener noreferrer">${acceptUrl}</a>
          </p>
        </td>
      </tr>
      <tr>
        <td style="font-size:12px;color:#6B7280;text-align:center;padding-top:32px;">
          This invitation was sent from Catalys. If you weren’t expecting it, you can ignore this email.
        </td>
      </tr>
    </table>
  `

  const text = `
${inviterName} invited you to join ${organizationName} on Catalys.

Accept your invitation:
${acceptUrl}

If you weren’t expecting this invitation, you can ignore this email.
`.trim()

  return {
    subject,
    html,
    text,
  }
}

