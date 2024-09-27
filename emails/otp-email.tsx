import { CodeInline, Container, Html, Text } from "@react-email/components";
import { sendEmail } from "./send-email";

export default function OTPEmail({ code }: { code: string }) {
  return (
    <Html>
      <Container className="bg-gray-400">
        <Text>
          The One-Time Password (OTP) to login to the admin panel of your
          website is {code}.
        </Text>
      </Container>
    </Html>
  );
}

export async function sendOTPEmail(to: string, code: string) {
  await sendEmail(to, "One Time Password", <OTPEmail code={code} />);
}
