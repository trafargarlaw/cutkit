import type { SendVerificationRequestParams } from "next-auth/providers/email";

import { env } from "@/env";
import { Resend } from "resend";
import CutKitLinkEmail from "@/components/email-verification-template";

const resend = new Resend(env.RESEND_API_KEY);

export const sendVerificationRequest = async (
  params: SendVerificationRequestParams,
) => {
  try {
    await resend.emails.send({
      from: "Cutkit <contact@houdaifa.me>",
      to: params.identifier,
      subject: "Sign in to CutKit",
      react: CutKitLinkEmail({
        magicLink: params.url,
      }),
    });
  } catch (error) {
    console.log({ error });
  }
};
