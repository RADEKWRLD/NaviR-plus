import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Heading,
  Button,
  Hr,
  Link,
  Preview,
  Tailwind,
} from '@react-email/components';

interface WelcomeEmailProps {
  userName: string;
  loginUrl?: string;
}

export function WelcomeEmail({
  userName,
  loginUrl = 'https://navir.icu/auth',
}: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Welcome to NaviR - Your Minimalist Bookmark Navigator</Preview>
      <Tailwind>
        <Body className="bg-gray-100 font-sans">
          <Container className="mx-auto py-8 px-4 max-w-xl">
            {/* Main Card */}
            <Section className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              {/* Header */}
              <Section className="bg-[#FF6B35] px-8 py-6">
                <Heading className="text-white text-3xl font-bold m-0 tracking-wider">
                  NAVIR
                </Heading>
              </Section>

              {/* Content */}
              <Section className="px-8 py-8">
                <Heading className="text-2xl font-bold text-black m-0 mb-4">
                  Welcome aboard, {userName}!
                </Heading>

                {/* Letter from Developer */}
                <Text className="text-gray-700 text-base leading-relaxed m-0 mb-4">
                  Hi {userName},
                </Text>

                <Text className="text-gray-700 text-base leading-relaxed m-0 mb-4">
                  Thank you for joining NaviR! I&apos;m thrilled to have you here.
                </Text>

                <Text className="text-gray-700 text-base leading-relaxed m-0 mb-4">
                  NaviR was born out of my own frustration with cluttered browser bookmarks.
                  I wanted something simple, beautiful, and actually useful. I hope it helps
                  you stay organized and find what you need quickly.
                </Text>

                <Text className="text-gray-700 text-base leading-relaxed m-0 mb-4">
                  This project is a labor of love, and I&apos;m constantly working to make it better.
                  If you have any feedback, suggestions, or just want to say hi, feel free to
                  reach out to me at{' '}
                  <Link href="mailto:a1691357101@gmail.com" className="text-[#FF6B35] underline">
                    a1691357101@gmail.com
                  </Link>
                </Text>

                <Text className="text-gray-700 text-base leading-relaxed m-0 mb-6">
                  Happy bookmarking!
                </Text>

                <Text className="text-gray-600 text-sm italic m-0 mb-6">
                  — The Developer of NaviR
                </Text>

                <Hr className="border-gray-200 my-6" />

                {/* CTA Button */}
                <Section className="text-center">
                  <Button
                    href={loginUrl}
                    className="bg-orange-500 text-white font-bold text-base px-8 py-4 border-4 border-black no-underline inline-block"
                  >
                    GET STARTED
                  </Button>
                </Section>
              </Section>

              {/* Footer */}
              <Section className="bg-gray-100 px-8 py-6 border-t-4 border-black">
                <Text className="text-gray-500 text-xs m-0 text-center">
                  You received this email because you signed up for NaviR.
                </Text>
                <Text className="text-gray-500 text-xs m-0 mt-2 text-center">
                  &copy; {new Date().getFullYear()} NaviR. All rights reserved.
                </Text>
              </Section>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

export default WelcomeEmail;
