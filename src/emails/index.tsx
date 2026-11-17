import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import type { IEmailContainerProps } from "./interface";

const FONT_STACK =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
const SERIF_STACK = 'Georgia, "Times New Roman", serif';

export function EmailContainer({
  name,
  email,
  subject,
  message,
}: IEmailContainerProps) {
  return (
    <Html lang="en">
      <Head />
      <Preview>{`${subject} from ${name} (${email})`}</Preview>
      <Body
        style={{
          backgroundColor: "#e2dbc9",
          color: "#052f21",
          fontFamily: FONT_STACK,
          margin: 0,
          padding: "32px 16px",
        }}
      >
        <Container
          style={{
            backgroundColor: "#ebe6d8",
            border: "1px solid rgba(5, 47, 33, 0.16)",
            borderRadius: "16px",
            margin: "0 auto",
            maxWidth: "600px",
            padding: "36px 32px",
          }}
        >
          {/* Header Kicker & Inquiry Topic */}
          <Section>
            <Text
              style={{
                color: "#315143",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.18em",
                margin: "0 0 8px 0",
                textTransform: "uppercase",
              }}
            >
              PORTFOLIO INQUIRY
            </Text>
            <Heading
              as="h1"
              style={{
                color: "#052f21",
                fontFamily: SERIF_STACK,
                fontSize: "28px",
                fontWeight: 700,
                lineHeight: 1.2,
                margin: "0 0 24px 0",
              }}
            >
              {subject}
            </Heading>
          </Section>

          <Hr
            style={{
              borderColor: "rgba(5, 47, 33, 0.14)",
              margin: "0 0 20px 0",
            }}
          />

          {/* Sender Metadata */}
          <Section style={{ marginBottom: "24px" }}>
            <Text
              style={{
                color: "#315143",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.16em",
                margin: "0 0 4px 0",
                textTransform: "uppercase",
              }}
            >
              FROM
            </Text>
            <Text
              style={{
                color: "#052f21",
                fontSize: "16px",
                fontWeight: 600,
                lineHeight: 1.4,
                margin: "0 0 14px 0",
              }}
            >
              {name}
            </Text>

            <Text
              style={{
                color: "#315143",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.16em",
                margin: "0 0 4px 0",
                textTransform: "uppercase",
              }}
            >
              REPLY TO
            </Text>
            <Text
              style={{
                fontSize: "15px",
                lineHeight: 1.4,
                margin: 0,
              }}
            >
              <Link
                href={`mailto:${email}`}
                style={{
                  color: "#052f21",
                  fontWeight: 600,
                  textDecoration: "underline",
                }}
              >
                {email}
              </Link>
            </Text>
          </Section>

          {/* Message Body */}
          <Section>
            <Text
              style={{
                color: "#315143",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.16em",
                margin: "0 0 8px 0",
                textTransform: "uppercase",
              }}
            >
              MESSAGE
            </Text>
            <Section
              style={{
                backgroundColor: "#e2dbc9",
                border: "1px solid rgba(5, 47, 33, 0.12)",
                borderRadius: "12px",
                padding: "20px 22px",
              }}
            >
              <Text
                style={{
                  color: "#052f21",
                  fontSize: "15px",
                  lineHeight: 1.65,
                  margin: 0,
                  whiteSpace: "pre-wrap",
                }}
              >
                {message}
              </Text>
            </Section>
          </Section>

          <Hr
            style={{
              borderColor: "rgba(5, 47, 33, 0.14)",
              margin: "28px 0 16px 0",
            }}
          />

          {/* Footer Note */}
          <Section>
            <Text
              style={{
                color: "#315143",
                fontSize: "12px",
                lineHeight: 1.5,
                margin: 0,
              }}
            >
              Sent from your portfolio contact form. Hit <strong>Reply</strong>{" "}
              in your email client to respond directly to {name}.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default EmailContainer;
